import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  RefreshCw,
  Lock,
  Eye,
  Settings,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('orders');

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    regular_price: 2490,
    sale_price: 1290,
    discount_percentage: 48,
    description: '',
    features: '',
    images: '',
    video_url: '',
    delivery_charge_inside: 60,
    delivery_charge_outside: 120,
    stock_status: 'In Stock',
    is_active: true
  });
  const [editingProductId, setEditingProductId] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled'>('All');

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'admin_session_token_123456') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders();
      fetchStats();
    }
  }, [isAuthenticated, orderFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'লগইন ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setLoginError('সার্ভারে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedProduct = {
      ...newProduct,
      features: typeof newProduct.features === 'string' ? newProduct.features.split('\n').filter(f => f.trim() !== '') : [],
      images: typeof newProduct.images === 'string' ? newProduct.images.split(',').map(img => img.trim()).filter(img => img !== '') : [],
      regular_price: Number(newProduct.regular_price),
      sale_price: Number(newProduct.sale_price),
      discount_percentage: Math.round(((Number(newProduct.regular_price) - Number(newProduct.sale_price)) / Number(newProduct.regular_price)) * 100),
      delivery_charge_inside: Number(newProduct.delivery_charge_inside),
      delivery_charge_outside: Number(newProduct.delivery_charge_outside)
    };

    try {
      let res;
      if (editingProductId) {
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProductId, ...formattedProduct })
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedProduct)
        });
      }

      if (res.ok) {
        setNewProduct({
          title: '',
          subtitle: '',
          regular_price: 2490,
          sale_price: 1290,
          discount_percentage: 48,
          description: '',
          features: '',
          images: '',
          video_url: '',
          delivery_charge_inside: 60,
          delivery_charge_outside: 120,
          stock_status: 'In Stock',
          is_active: true
        });
        setEditingProductId(null);
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setNewProduct({
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      regular_price: prod.regular_price || 0,
      sale_price: prod.sale_price || 0,
      discount_percentage: prod.discount_percentage || 0,
      description: prod.description || '',
      features: Array.isArray(prod.features) ? prod.features.join('\n') : '',
      images: Array.isArray(prod.images) ? prod.images.join(', ') : '',
      video_url: prod.video_url || '',
      delivery_charge_inside: prod.delivery_charge_inside || 60,
      delivery_charge_outside: prod.delivery_charge_outside || 120,
      stock_status: prod.stock_status || 'In Stock',
      is_active: !!prod.is_active
    });
  };

  const handleDeleteProduct = async (id: any) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductActive = async (id: any, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus })
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${orderFilter}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: any, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id: any) => {
    if (!confirm('আপনি কি অর্ডারটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-gray-900">এডমিন লগইন প্যানেল</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">প্যানেলে প্রবেশ করতে পাসওয়ার্ডটি প্রদান করুন।</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">এডমিন পাসওয়ার্ড:</label>
              <input
                type="password"
                placeholder="Password (Default: admin123)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl shadow-md transition"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-950 text-white shrink-0 flex flex-col justify-between">
        <div className="p-5">
          <div className="flex items-center space-x-2.5 mb-8">
            <img
              src="/images/logo.png"
              alt="ORIGEN PRIME Logo"
              className="h-9 w-9 object-cover rounded-lg border border-gray-800"
            />
            <div>
              <span className="font-black text-sm tracking-tight block uppercase">ORIGEN <span className="text-red-500">PRIME</span></span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest -mt-1">এডমিন ড্যাশবোর্ড</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'orders' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার তালিকা ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'products' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>পণ্য ম্যানেজমেন্ট</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'stats' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>সেলস অ্যানালিটিক্স</span>
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">
              {activeTab === 'orders' && 'অর্ডার তালিকা'}
              {activeTab === 'products' && 'পণ্য ম্যানেজমেন্ট'}
              {activeTab === 'stats' && 'সেলস অ্যানালিটিক্স'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">আপনার স্টোরের ডেটা রিয়েল-টাইমে পর্যবেক্ষণ করুন।</p>
          </div>
          <button
            onClick={() => {
              fetchProducts();
              fetchOrders();
              fetchStats();
            }}
            className="bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded-xl text-gray-600 shadow-2xs transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Pending', 'Confirmed', 'Shipped', 'Cancelled'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      orderFilter === filter
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'All' && 'সব অর্ডার'}
                    {filter === 'Pending' && 'পেন্ডিং'}
                    {filter === 'Confirmed' && 'কনফার্মড'}
                    {filter === 'Shipped' && 'ডেলিভার্ড'}
                    {filter === 'Cancelled' && 'বাতিল'}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500">সর্বমোট: {orders.length}টি অর্ডার পাওয়া গেছে</span>
            </div>

            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-500 font-bold">
                কোনো অর্ডার পাওয়া যায়নি!
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-4">অর্ডার আইডি</th>
                        <th className="px-5 py-4">গ্রাহকের নাম ও মোবাইল</th>
                        <th className="px-5 py-4">ঠিকানা</th>
                        <th className="px-5 py-4">পণ্য ও পরিমাণ</th>
                        <th className="px-5 py-4">সর্বমোট বিল</th>
                        <th className="px-5 py-4">স্ট্যাটাস</th>
                        <th className="px-5 py-4 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-5 py-4 font-mono font-bold text-gray-900">#{order.id}</td>
                          <td className="px-5 py-4">
                            <span className="block font-bold text-gray-900">{order.customer_name}</span>
                            <span className="block text-gray-500 mt-0.5">{order.customer_phone}</span>
                          </td>
                          <td className="px-5 py-4 max-w-[180px] truncate">{order.customer_address}</td>
                          <td className="px-5 py-4">
                            <span className="block font-bold text-gray-900 truncate max-w-[150px]">{order.product_title}</span>
                            <span className="block text-gray-400 mt-0.5">পরিমাণ: {order.quantity}টি</span>
                          </td>
                          <td className="px-5 py-4 font-black text-gray-900">৳{order.total_amount?.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black ${
                              order.status === 'Pending' && 'bg-amber-100 text-amber-800'
                            } ${
                              order.status === 'Confirmed' && 'bg-blue-100 text-blue-800'
                            } ${
                              order.status === 'Shipped' && 'bg-green-100 text-green-800'
                            } ${
                              order.status === 'Cancelled' && 'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {order.status === 'Pending' && (
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Check className="w-4 h-4" /></button>
                              )}
                              {order.status === 'Confirmed' && (
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')} className="p-1.5 bg-green-50 text-green-600 rounded-lg"><Check className="w-4 h-4" /></button>
                              )}
                              <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 bg-gray-50 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4 lg:col-span-1">
              <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                <Plus className="w-4 h-4 text-red-600 mr-1.5" />
                {editingProductId ? 'পণ্য সংশোধন করুন' : 'নতুন পণ্য আপলোড করুন'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1">পণ্যের নাম (Title):</label>
                  <input type="text" required value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block mb-1">সাবটাইটেল:</label>
                  <input type="text" value={newProduct.subtitle} onChange={e => setNewProduct({ ...newProduct, subtitle: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Regular Price:</label>
                    <input type="number" value={newProduct.regular_price} onChange={e => setNewProduct({ ...newProduct, regular_price: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block mb-1">Sale Price:</label>
                    <input type="number" required value={newProduct.sale_price} onChange={e => setNewProduct({ ...newProduct, sale_price: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Description:</label>
                  <textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block mb-1">Features (প্রতি লাইনে একটি):</label>
                  <textarea rows={2} value={newProduct.features} onChange={e => setNewProduct({ ...newProduct, features: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block mb-1">Images (Comma separated URLs):</label>
                  <input type="text" value={newProduct.images} onChange={e => setNewProduct({ ...newProduct, images: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block mb-1">Video URL:</label>
                  <input type="text" value={newProduct.video_url} onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex items-center space-x-2 py-1">
                  <input type="checkbox" id="is_active" checked={newProduct.is_active} onChange={e => setNewProduct({ ...newProduct, is_active: e.target.checked })} />
                  <label htmlFor="is_active">সক্রিয় করুন</label>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-black py-2.5 rounded-lg">
                  {editingProductId ? 'আপডেট করুন' : 'আপলোড করুন'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              {productsLoading ? (
                <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto" /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs">
                      <h4 className="font-extrabold text-sm line-clamp-1">{prod.title}</h4>
                      <p className="text-red-600 font-black mt-1">৳{prod.sale_price?.toLocaleString()}</p>
                      <div className="mt-4 flex justify-between">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                          {prod.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditProduct(prod)} className="p-1 text-gray-600"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(prod.id)} className="p-1 text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-2xs">
              <span className="text-xs text-gray-400 font-bold uppercase">Revenue</span>
              <span className="block text-xl font-black">৳{stats.summary.totalRevenue?.toLocaleString()}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-2xs">
              <span className="text-xs text-gray-400 font-bold uppercase">Orders</span>
              <span className="block text-xl font-black">{stats.summary.totalOrders}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
