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

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    regular_price: 2490,
    sale_price: 1290,
    discount_percentage: 48,
    description: '',
    features: '', // Will be split by newline
    images: '', // Comma separated URLs
    video_url: '',
    delivery_charge_inside: 60,
    delivery_charge_outside: 120,
    stock_status: 'In Stock',
    is_active: true
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled'>('All');

  // Stats state
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Authentication check on mount
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

  // Auth Handler
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

  // Products CRUD
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedProduct = {
      ...newProduct,
      features: newProduct.features.split('\n').filter(f => f.trim() !== ''),
      images: newProduct.images.split(',').map(img => img.trim()).filter(img => img !== ''),
      regular_price: parseInt(newProduct.regular_price as any),
      sale_price: parseInt(newProduct.sale_price as any),
      discount_percentage: Math.round(((parseInt(newProduct.regular_price as any) - parseInt(newProduct.sale_price as any)) / parseInt(newProduct.regular_price as any)) * 100),
      delivery_charge_inside: parseInt(newProduct.delivery_charge_inside as any),
      delivery_charge_outside: parseInt(newProduct.delivery_charge_outside as any)
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
      title: prod.title,
      subtitle: prod.subtitle,
      regular_price: prod.regular_price,
      sale_price: prod.sale_price,
      discount_percentage: prod.discount_percentage,
      description: prod.description,
      features: Array.isArray(prod.features) ? prod.features.join('\n') : '',
      images: Array.isArray(prod.images) ? prod.images.join(', ') : '',
      video_url: prod.video_url || '',
      delivery_charge_inside: prod.delivery_charge_inside || 60,
      delivery_charge_outside: prod.delivery_charge_outside || 120,
      stock_status: prod.stock_status || 'In Stock',
      is_active: prod.is_active
    });
  };

  const handleDeleteProduct = async (id: number) => {
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

  const handleToggleProductActive = async (id: number, currentStatus: boolean) => {
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

  // Orders CRUD
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${orderFilter}`);
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
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

  const handleDeleteOrder = async (id: number) => {
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

  // Analytics Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Login Overlay Screen
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
      
      {/* Sidebar navigation */}
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

      {/* Main content body */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        
        {/* Header bar */}
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
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Tab content renderer */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Tab Header with Filter */}
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

            {/* Orders Table/List */}
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <span className="text-xs font-bold text-gray-500">লোড হচ্ছে...</span>
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
                          <td className="px-5 py-4 max-w-[180px] truncate" title={order.customer_address}>
                            {order.customer_address}
                          </td>
                          <td className="px-5 py-4">
                            <span className="block font-bold text-gray-900 truncate max-w-[150px]">{order.product_title}</span>
                            <span className="block text-gray-400 mt-0.5">পরিমাণ: {order.quantity}টি</span>
                          </td>
                          <td className="px-5 py-4 font-black text-gray-900">৳{order.total_amount.toLocaleString()}</td>
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
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')}
                                  className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                  title="Confirm Order"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {order.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                                  className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition"
                                  title="Deliver Order"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {order.status !== 'Cancelled' && order.status !== 'Shipped' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                  title="Cancel Order"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-lg transition"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
            
            {/* Product Upload/Edit Form */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4 lg:col-span-1">
              <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                <Plus className="w-4 h-4 text-red-600 mr-1.5" />
                {editingProductId ? 'পণ্য সংশোধন করুন' : 'নতুন পণ্য আপলোড করুন'}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1">পণ্যের নাম (Title):</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: T900 Ultra Smart Watch"
                    value={newProduct.title}
                    onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">সাবটাইটেল (Subtitle):</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ধামাকা ধামাকা অফার!"
                    value={newProduct.subtitle}
                    onChange={e => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">পূর্বের মূল্য (Regular Price):</label>
                    <input
                      type="number"
                      required
                      value={newProduct.regular_price}
                      onChange={e => setNewProduct({ ...newProduct, regular_price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">বর্তমান মূল্য (Sale Price):</label>
                    <input
                      type="number"
                      required
                      value={newProduct.sale_price}
                      onChange={e => setNewProduct({ ...newProduct, sale_price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">পণ্যের বিবরণ (Description):</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="পণ্যের বিস্তারিত বিবরণ এখানে লিখুন..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block mb-1">সুবিধাসমূহ (Features - প্রতি লাইনে একটি):</label>
                  <textarea
                    rows={3}
                    placeholder="সুবিধা ১&#10;সুবিধা ২&#10;সুবিধা ৩"
                    value={newProduct.features}
                    onChange={e => setNewProduct({ ...newProduct, features: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block mb-1">ছবির লিংকসমূহ (Comma-separated URLs):</label>
                  <input
                    type="text"
                    placeholder="/images/product-1.jpg, /images/product-2.jpg"
                    value={newProduct.images}
                    onChange={e => setNewProduct({ ...newProduct, images: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block mb-1">ভিডিও লিংক (Video URL):</label>
                  <input
                    type="text"
                    placeholder="/videos/product-video.mp4"
                    value={newProduct.video_url}
                    onChange={e => setNewProduct({ ...newProduct, video_url: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">ডেলিভারি চার্জ (ঢাকা):</label>
                    <input
                      type="number"
                      required
                      value={newProduct.delivery_charge_inside}
                      onChange={e => setNewProduct({ ...newProduct, delivery_charge_inside: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">ডেলিভারি চার্জ (ঢাকার বাইরে):</label>
                    <input
                      type="number"
                      required
                      value={newProduct.delivery_charge_outside}
                      onChange={e => setNewProduct({ ...newProduct, delivery_charge_outside: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newProduct.is_active}
                    onChange={e => setNewProduct({ ...newProduct, is_active: e.target.checked })}
                    className="text-red-600 focus:ring-red-500 rounded-sm w-4 h-4"
                  />
                  <label htmlFor="is_active" className="cursor-pointer">সরাসরি ল্যান্ডিং পেজে সক্রিয় করুন</label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-lg transition"
                  >
                    {editingProductId ? 'আপডেট করুন' : 'আপলোড করুন'}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
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
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-3 py-2.5 rounded-lg transition"
                    >
                      বাতিল
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products Listing */}
            <div className="lg:col-span-2 space-y-4">
              {productsLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 font-bold">
                  কোনো পণ্য আপলোড করা হয়নি।
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                      <div>
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-100">
                          <img
                            src={prod.images?.[0] || '/images/product-1.jpg'}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title & Price */}
                        <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1">{prod.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium line-clamp-2 mt-1">{prod.subtitle}</p>
                        
                        <div className="flex items-baseline space-x-2 mt-3">
                          <span className="text-base font-black text-red-600">৳{prod.sale_price.toLocaleString()}</span>
                          <span className="text-xs font-bold text-gray-400 line-through">৳{prod.regular_price.toLocaleString()}</span>
                          <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                            {prod.discount_percentage}% ছাড়
                          </span>
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleProductActive(prod.id, prod.is_active)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                            prod.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {prod.is_active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition text-xs font-bold"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : !stats ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 font-bold">
                কোনো ডেটা পাওয়া যায়নি।
              </div>
            ) : (
              <>
                {/* Stats Summary Widgets Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex items-center space-x-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট রাজস্ব (Revenue)</span>
                      <span className="block font-black text-lg md:text-xl text-gray-900 mt-0.5">৳{stats.summary.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex items-center space-x-4">
                    <div className="bg-amber-50 text-amber-600 p-3 rounded-xl shrink-0">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার (Orders)</span>
                      <span className="block font-black text-lg md:text-xl text-gray-900 mt-0.5">{stats.summary.totalOrders}টি</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex items-center space-x-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">পেন্ডিং অর্ডার</span>
                      <span className="block font-black text-lg md:text-xl text-gray-900 mt-0.5">{stats.summary.pendingOrders}টি</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex items-center space-x-4">
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl shrink-0">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">সফল ডেলিভারি</span>
                      <span className="block font-black text-lg md:text-xl text-gray-900 mt-0.5">{stats.summary.shippedOrders}টি</span>
                    </div>
                  </div>
                </div>

                {/* Pure CSS/SVG Sales Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs">
                  <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">বিগত ৭ দিনের সেলস চার্ট</h3>
                  
                  <div className="relative h-64 flex items-end justify-between space-x-4 pt-8">
                    {stats.chartData.map((day: any, idx: number) => {
                      const maxRevenue = Math.max(...stats.chartData.map((d: any) => d.revenue), 1000);
                      const heightPercent = (day.revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 bg-gray-950 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-10 text-center whitespace-nowrap">
                            <span className="block">রাজস্ব: ৳{day.revenue.toLocaleString()}</span>
                            <span className="block">অর্ডার: {day.orders}টি</span>
                          </div>

                          {/* Bar */}
                          <div
                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                            className="w-full bg-red-600 hover:bg-red-700 rounded-t-lg transition-all duration-300 relative shadow-inner"
                          >
                            <span className="absolute -top-6 left-0 right-0 text-center font-black text-[10px] text-gray-800">
                              ৳{day.revenue > 0 ? `${(day.revenue / 1000).toFixed(1)}k` : '0'}
                            </span>
                          </div>

                          {/* Label */}
                          <span className="text-[10px] font-bold text-gray-400 mt-3 truncate max-w-[50px]">
                            {new Date(day.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
