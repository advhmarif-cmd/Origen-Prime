import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // Group sales by day (last 7 days)
    const salesByDay = {};
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(day => {
      salesByDay[day] = { count: 0, revenue: 0 };
    });

    orders.forEach(order => {
      if (!order.created_at) return;
      const day = order.created_at.split('T')[0];
      if (salesByDay[day] !== undefined) {
        salesByDay[day].count += 1;
        if (order.status !== 'Cancelled') {
          salesByDay[day].revenue += order.total_amount || 0;
        }
      }
    });

    const chartData = Object.keys(salesByDay).map(day => ({
      date: day,
      orders: salesByDay[day].count,
      revenue: salesByDay[day].revenue
    }));

    return res.status(200).json({
      summary: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        cancelledOrders,
        totalRevenue
      },
      chartData
    });
  } catch (err) {
    console.error('Stats API error:', err);
    res.status(500).json({ error: err.message });
  }
}
