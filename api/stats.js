import supabase from './db-client.js';
import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_ORIGIN || 'https://origen-prime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(req, res)) return;

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id,status,total_amount,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const safeOrders = orders || [];
    const totalOrders = safeOrders.length;
    const pendingOrders = safeOrders.filter(order => order.status === 'pending').length;
    const confirmedOrders = safeOrders.filter(order => ['confirmed', 'processing'].includes(order.status)).length;
    const shippedOrders = safeOrders.filter(order => ['shipped', 'delivered'].includes(order.status)).length;
    const cancelledOrders = safeOrders.filter(order => ['cancelled', 'rejected'].includes(order.status)).length;
    const totalRevenue = safeOrders
      .filter(order => !['cancelled', 'rejected'].includes(order.status))
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    const today = new Date();
    const chartData = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const day = date.toISOString().split('T')[0];
      const dayOrders = safeOrders.filter(order => String(order.created_at).startsWith(day));
      return {
        date: day,
        orders: dayOrders.length,
        revenue: dayOrders
          .filter(order => !['cancelled', 'rejected'].includes(order.status))
          .reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
      };
    });

    return res.status(200).json({
      summary: { totalOrders, pendingOrders, confirmedOrders, shippedOrders, cancelledOrders, totalRevenue },
      chartData,
    });
  } catch (err) {
    console.error('Stats API error:', err);
    return res.status(500).json({ error: 'Unable to load statistics' });
  }
}
