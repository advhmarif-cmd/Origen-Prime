import { randomUUID } from 'node:crypto';
import supabase from './db-client.js';
import { requireAdmin } from './_auth.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_ORIGIN || 'https://origen-prime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function fromCatalog(row) {
  const metadata = row.landing_metadata && typeof row.landing_metadata === 'object' ? row.landing_metadata : {};
  return {
    id: row.id,
    source: row.source,
    origin_product_id: row.origin_product_id,
    slug: row.slug,
    title: row.name,
    subtitle: metadata.subtitle || row.description || '',
    regular_price: Number(row.retail_price || 0),
    sale_price: Number(row.sale_price ?? row.retail_price ?? 0),
    discount_percentage: Number(metadata.discount_percentage || 0),
    description: row.description || '',
    features: Array.isArray(metadata.features) ? metadata.features : [],
    images: Array.isArray(row.images) ? row.images : (row.image_url ? [row.image_url] : []),
    video_url: row.video_url || '',
    delivery_charge_inside: Number(metadata.delivery_charge_inside || 0),
    delivery_charge_outside: Number(metadata.delivery_charge_outside || 0),
    stock_status: row.stock_status || 'In Stock',
    reviews: Array.isArray(metadata.reviews) ? metadata.reviews : [],
    phone_number: metadata.phone_number || '',
    category: row.category || '',
    logo_url: metadata.logo_url || '',
    navbar_badges: Array.isArray(metadata.navbar_badges) ? metadata.navbar_badges : [],
    trust_badges: Array.isArray(metadata.trust_badges) ? metadata.trust_badges : [],
    promo_tagline: metadata.promo_tagline || '',
    satisfaction_record: metadata.satisfaction_record || '',
    satisfaction_subtext: metadata.satisfaction_subtext || '',
    success_count_text: metadata.success_count_text || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_active: row.is_active,
  };
}

function toCatalog(product, existing = {}) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const landing_metadata = {
    subtitle: product.subtitle || '',
    discount_percentage: Number(product.discount_percentage || 0),
    features: Array.isArray(product.features) ? product.features : [],
    delivery_charge_inside: Number(product.delivery_charge_inside || 0),
    delivery_charge_outside: Number(product.delivery_charge_outside || 0),
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    phone_number: product.phone_number || '',
    logo_url: product.logo_url || '',
    navbar_badges: Array.isArray(product.navbar_badges) ? product.navbar_badges : [],
    trust_badges: Array.isArray(product.trust_badges) ? product.trust_badges : [],
    promo_tagline: product.promo_tagline || '',
    satisfaction_record: product.satisfaction_record || '',
    satisfaction_subtext: product.satisfaction_subtext || '',
    success_count_text: product.success_count_text || '',
  };

  return {
    ...(existing.id ? { id: existing.id } : {}),
    source: 'origen',
    ...(existing.origin_product_id ? { origin_product_id: existing.origin_product_id } : { origin_product_id: randomUUID() }),
    owner_id: null,
    slug: String(product.slug || '').trim(),
    name: String(product.title || '').trim(),
    description: String(product.description || product.subtitle || '').trim(),
    retail_price: Number(product.regular_price || product.sale_price || 0),
    sale_price: Number(product.sale_price || product.regular_price || 0),
    image_url: images[0] || '',
    images,
    video_url: product.video_url || null,
    category: product.category || '',
    stock_status: product.stock_status || 'In Stock',
    is_active: product.is_active !== false,
    approval_status: 'approved',
    landing_metadata,
    updated_at: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id, slug, all } = req.query;
      let query = supabase.from('catalog_products').select('*').eq('source', 'origen');
      const includeAll = all === 'true';
      if (includeAll && !requireAdmin(req, res)) return;
      if (!includeAll) query = query.eq('is_active', true);
      if (id) query = query.eq('id', id).single();
      else if (slug) query = query.eq('slug', slug).single();
      else query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(Array.isArray(data) ? data.map(fromCatalog) : fromCatalog(data));
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const productData = req.body || {};
      if (!productData.slug || !productData.title) return res.status(400).json({ error: 'Product slug and title are required' });
      const { data, error } = await supabase.from('catalog_products').insert(toCatalog(productData)).select('*').single();
      if (error) throw error;
      return res.status(201).json(fromCatalog(data));
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Product ID is required' });
      const { data: existing, error: existingError } = await supabase.from('catalog_products').select('*').eq('id', id).eq('source', 'origen').single();
      if (existingError) throw existingError;
      const { data, error } = await supabase.from('catalog_products').update(toCatalog(updates, existing)).eq('id', id).eq('source', 'origen').select('*').single();
      if (error) throw error;
      return res.status(200).json(fromCatalog(data));
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Product ID is required' });
      const { error } = await supabase.from('catalog_products').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', id).eq('source', 'origen');
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: 'Unable to process product request' });
  }
}
