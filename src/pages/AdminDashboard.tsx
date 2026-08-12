import { supabase } from "../lib/supabase";
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
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats' | 'settings'>('orders');
  const [settings, setSettings] = useState({
    showReviews: true,
    showVideo: true,
    pixelId: '',
    themeColor: '#dc2626'
  });

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
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

  const handleFileUpload = async (file: File, folder: string) => {
    try {
      setProductsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setProductsLoading(false);
    }
  };

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
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', 'admin_session_token_123456');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setProductsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (orderFilter !== 'All') {
      query = query.eq('status', orderFilter);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setOrdersLoading(false);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    const { data, error } = await supabase.from('orders').select('status');
    if (error) console.error('Error fetching stats:', error);
    else {
      const statsMap = data?.reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {}) || {};
      setStats(statsMap);
    }
    setStatsLoading(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductsLoading(true);
    try {
      if (editingProductId) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', editingProductId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
      }
      setNewProduct({
        title: '', subtitle: '', regular_price: 2490, sale_price: 1290,
        discount_percentage: 48, description: '', features: '',
        images: '', video_url: '', delivery_charge_inside: 60,
        delivery_charge_outside: 120, stock_status: 'In Stock', is_active: true
      });
      setEditingProductId(null);
      await fetchProducts();
    } catch (error: any) {
      alert('Error saving product: ' + error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({ ...product });
  };

  const handleDeleteProduct = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert('Error deleting product');
      else await fetchProducts();
    }
  };

  const updateOrderStatus = async (id: any, status: any) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) alert('Error updating order status');
    else await fetchOrders();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-red-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Control Center</h1>
            <p className="text-gray-500">Manage your products, orders, and landing page</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="flex space-x-4 border-b mb-6">
          <button onClick={() => setActiveTab('orders')} className={`py-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-red-600 text-red-600 font-semibold' : 'text-gray-500'}`}>Orders</button>
          <button onClick={() => setActiveTab('products')} className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-red-600 text-red-600 font-semibold' : 'text-gray-500'}`}>Products</button>
          <button onClick={() => setActiveTab('stats')} className={`py-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-red-600 text-red-600 font-semibold' : 'text-gray-500'}`}>Stats</button>
          <button onClick={() => setActiveTab('settings')} className={`py-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-red-600 text-red-600 font-semibold' : 'text-gray-500'}`}>Settings</button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Recent Orders
              </h2>
              <div className="flex gap-2">
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Cancelled'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${orderFilter === filter ? 'bg-red-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            {ordersLoading ? (
              <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">Order #{order.id.slice(0,8)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                        }`}>{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer_name} • {order.customer_phone}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center py-12 text-gray-500">No orders found.</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" /> {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Product Title</label>
                  <input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                  <input type="text" value={newProduct.subtitle} onChange={(e) => setNewProduct({...newProduct, subtitle: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Regular Price</label>
                    <input type="number" value={newProduct.regular_price} onChange={(e) => setNewProduct({...newProduct, regular_price: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Sale Price</label>
                    <input type="number" value={newProduct.sale_price} onChange={(e) => setNewProduct({...newProduct, sale_price: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Discount %</label>
                  <input type="number" value={newProduct.discount_percentage} onChange={(e) => setNewProduct({...newProduct, discount_percentage: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Features (comma separated)</label>
                  <input type="text" value={newProduct.features} onChange={(e) => setNewProduct({...newProduct, features: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Images (comma separated URLs)</label>
                  <div className="flex gap-2">
                    <input type="text" value={newProduct.images} onChange={(e) => setNewProduct({...newProduct, images: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                    <input type="file" multiple onChange={async (e) => {
                      if (e.target.files) {
                        const urls = await Promise.all([...e.target.files].map(file => handleFileUpload(file, 'products')));
                        setNewProduct({...newProduct, images: urls.filter(Boolean).join(',')});
                      }
                    }} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 text-xs font-medium">Upload</label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Video URL</label>
                  <input type="text" value={newProduct.video_url} onChange={(e) => setNewProduct({...newProduct, video_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Stock Status</label>
                  <select value={newProduct.stock_status} onChange={(e) => setNewProduct({...newProduct, stock_status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={newProduct.is_active} onChange={(e) => setNewProduct({...newProduct, is_active: e.target.checked})} id="is_active" className="w-4 h-4 text-red-600" />
                  <label htmlFor="is_active" className="text-xs font-medium text-gray-500">Active Product</label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={productsLoading} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300">
                    {productsLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : (editingProductId ? 'Update Product' : 'Save Product')}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={() => {
                      setEditingProductId(null);
                      setNewProduct({
                        title: '', subtitle: '', regular_price: 2490, sale_price: 1290,
                        discount_percentage: 48, description: '', features: '',
                        images: '', video_url: '', delivery_charge_inside: 60,
                        delivery_charge_outside: 120, stock_status: 'In Stock', is_active: true
                      });
                    }} className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" /> Product Inventory
              </h2>
              {productsLoading ? (
                <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4">
                      <img src={product.images?.split(',')[0] || '/images/dates-1.jpg'} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800">{product.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.subtitle}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => handleEditProduct(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center py-12 text-gray-500 col-span-2">No products found.</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" /> Business Overview
            </h2>
            {statsLoading ? (
              <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats || {}).map(([status, count]) => (
                  <div key={status} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500 text-sm font-medium uppercase mb-2">{status} Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
                {(!stats || Object.keys(stats).length === 0) && <p className="text-center col-span-3 py-12 text-gray-500">No stats available.</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" /> Page Customization
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">Show Customer Reviews</p>
                  <p className="text-xs text-gray-500">Enable/Disable reviews section on landing page</p>
                </div>
                <input type="checkbox" checked={settings.showReviews} onChange={(e) => setSettings({...settings, showReviews: e.target.checked})} className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">Show Product Video</p>
                  <p className="text-xs text-gray-500">Enable/Disable product video section</p>
                </div>
                <input type="checkbox" checked={settings.showVideo} onChange={(e) => setSettings({...settings, showVideo: e.target.checked})} className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                <input type="text" value={settings.pixelId} onChange={(e) => setSettings({...settings, pixelId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter Pixel ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Theme Color</label>
                <div className="flex gap-3">
                  <input type="color" value={settings.themeColor} onChange={(e) => setSettings({...settings, themeColor: e.target.value})} className="w-12 h-12 rounded cursor-pointer" />
                  <input type="text" value={settings.themeColor} onChange={(e) => setSettings({...settings, themeColor: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <button onClick={() => alert('Settings saved successfully!')} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
