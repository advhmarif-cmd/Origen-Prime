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

  const handleFileUpload = async (file: File, folder: string) => {
    try {
      setProductsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images') // Assuming 'images' bucket
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('orders');

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
    setUploadError('');
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
      const url = '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';
      const body = editingProductId ? { id: editingProductId, ...formattedProduct } : formattedProduct;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে।');
      }

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
      alert('সফলভাবে আপলোড হয়েছে!');
    } catch (err: any) {
      setUploadError(err.message);
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
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl">{loginError}</div>}
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-3 rounded-xl" required />
            <button type="submit" className="w-full bg-red-600 text-white font-black py-3 rounded-xl">লগইন করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-950 text-white p-5">
        <div className="font-black text-xl mb-8 uppercase">ORIGEN <span className="text-red-500">PRIME</span></div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full text-left p-3 rounded-xl font-bold ${activeTab === 'orders' ? 'bg-red-600' : ''}`}>অর্ডার তালিকা</button>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left p-3 rounded-xl font-bold ${activeTab === 'products' ? 'bg-red-600' : ''}`}>পণ্য ম্যানেজমেন্ট</button>
          <button onClick={() => setActiveTab('stats')} className={`w-full text-left p-3 rounded-xl font-bold ${activeTab === 'stats' ? 'bg-red-600' : ''}`}>সেলস অ্যানালিটিক্স</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-1">
              <h3 className="font-black mb-4">পণ্য আপলোড</h3>
              {uploadError && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold mb-4">{uploadError}</div>}
              <form onSubmit={handleProductSubmit} className="space-y-3">
                <input type="text" placeholder="Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full border p-2 rounded-lg text-sm" required />
                <input type="text" placeholder="Subtitle" value={newProduct.subtitle} onChange={e => setNewProduct({...newProduct, subtitle: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Regular Price" value={newProduct.regular_price} onChange={e => setNewProduct({...newProduct, regular_price: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-sm" />
                  <input type="number" placeholder="Sale Price" value={newProduct.sale_price} onChange={e => setNewProduct({...newProduct, sale_price: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-sm" required />
                </div>
                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={3} />
                <textarea placeholder="Features (Per line one)" value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={2} />
                <input type="text" placeholder="Images (Comma separated)" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                <input type="text" placeholder="Video URL" value={newProduct.video_url} onChange={e => setNewProduct({...newProduct, video_url: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                <button type="submit" className="w-full bg-red-600 text-white font-black py-2 rounded-lg">আপলোড করুন</button>
              </form>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-sm truncate">{prod.title}</h4>
                  <div className="flex justify-between mt-4">
                    <button onClick={() => handleEditProduct(prod)} className="text-xs bg-gray-100 px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
