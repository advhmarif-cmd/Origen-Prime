import supabase from './db-client.js';
import { requireAdmin } from './_auth.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_ORIGIN || 'https://origen-prime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id, slug, all } = req.query;
      let query = supabase.from('products').select('*');
      const includeAll = all === 'true';
      if (includeAll && !requireAdmin(req, res)) return;

      if (id) {
        query = query.eq('id', id).eq('is_active', true).single();
      } else if (slug) {
        query = query.eq('slug', slug).eq('is_active', true).single();
      } else {
        query = query.eq('is_active', true).order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST') {
      const productData = req.body || {};
      if (!productData.slug || !productData.title) {
        return res.status(400).json({ error: 'Product slug and title are required' });
      }


      const { data, error } = await supabase
        .from('products')
        .insert({ ...productData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Product ID is required' });


      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Product ID is required' });

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: 'Unable to process product request' });
  }
}
