import supabase from './db-client.js';
import { requireAdmin } from './_auth.js';

const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_ORIGIN || 'https://origen-prime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function normalizeItems(body) {
  if (Array.isArray(body?.items)) return body.items;
  if (body?.product_id) return [{ product_id: body.product_id, quantity: body.quantity }];
  return [];
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      const items = normalizeItems(body).map(item => ({
        product_id: item?.product_id,
        quantity: Number(item?.quantity),
      }));

      if (!items.length || items.some(item => !item.product_id || !Number.isInteger(item.quantity))) {
        return res.status(400).json({ error: 'Cart items are required' });
      }
      if (!body.customer_name || !body.customer_phone || !body.customer_address || !body.delivery_zone) {
        return res.status(400).json({ error: 'Missing required checkout fields' });
      }

      const { data, error } = await supabase.rpc('create_orders_from_cart', {
        p_items: items,
        p_customer_name: String(body.customer_name).trim(),
        p_customer_phone: String(body.customer_phone).trim(),
        p_customer_address: String(body.customer_address).trim(),
        p_delivery_zone: body.delivery_zone,
      });
      if (error) throw error;

      const orders = Array.isArray(data) ? data : data ? [data] : [];
      if (!orders.length) throw new Error('Checkout did not create an order');
      return res.status(201).json({ orders, order_group_id: orders[0].order_group_id });
    }

    if (!requireAdmin(req, res)) return;

    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'All') query = query.eq('status', status.toLowerCase());
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
      if (!id || !ALLOWED_STATUSES.has(normalizedStatus)) {
        return res.status(400).json({ error: 'Valid order ID and status are required' });
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status: normalizedStatus })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Order ID is required' });
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Orders API error:', err);
    return res.status(500).json({ error: 'Unable to process order request' });
  }
}
