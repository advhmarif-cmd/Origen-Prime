import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('orders').select('*');
      
      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        customer_name,
        customer_phone,
        customer_address,
        delivery_zone,
        delivery_charge,
        product_id,
        product_title,
        quantity,
        total_amount
      } = req.body;

      if (!customer_name || !customer_phone || !customer_address || !delivery_zone) {
        return res.status(400).json({ error: 'Missing required checkout fields' });
      }

      // Generate a random 6-digit Order ID
      const orderId = Math.floor(100000 + Math.random() * 900000);

      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_name,
          customer_phone,
          customer_address,
          delivery_zone,
          delivery_charge: parseInt(delivery_charge) || 0,
          product_id: product_id || null,
          product_title: product_title || 'Default Product',
          quantity: parseInt(quantity) || 1,
          total_amount: parseInt(total_amount) || 0,
          status: 'Pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Order ID and status are required' });

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Order ID is required' });

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Orders API error:', err);
    res.status(500).json({ error: err.message });
  }
}
