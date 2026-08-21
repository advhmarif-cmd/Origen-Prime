import React, { useState } from 'react';
import { Product } from '../lib/types';
import {
  AlertCircle,
  Check,
  Code,
  Edit2,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import ProductEditor from '../components/ProductEditor';

const DEFAULT_PRODUCT_TEMPLATE: Partial<Product> = {
  slug: '',
  title: 'মদিনার প্রিমিয়াম আজওয়া খেজুর',
  subtitle: 'সরাসরি মদিনা থেকে আমদানিকৃত সেরা মানের আজওয়া খেজুর',
  regular_price: 1200,
  sale_price: 950,
  discount_percentage: 20,
  description: 'আমাদের এই আজওয়া খেজুর সরাসরি মদিনা থেকে আমদানিকৃত। এটি সম্পূর্ণ প্রাকৃতিক এবং কোনো প্রকার প্রিজারভেটিভ ছাড়া। স্বাস্থ্যসম্মত এবং পুষ্টিগুণে ভরপুর এই খেজুর আপনার পরিবারের জন্য সেরা পছন্দ। কুরিয়ার ম্যানের সামনে চেক করে টাকা দেওয়ার সুবিধা পাবেন।',
  features: ['১০০% খাঁটি ও প্রিমিয়াম কোয়ালিটি।', 'সরাসরি মদিনা থেকে আমদানিকৃত।', 'স্বাস্থ্যসম্মত ও পরিষ্কার-পরিচ্ছন্ন প্যাকেজিং।', 'দ্রুত হোম ডেলিভারি সুবিধা।'],
  images: [],
  video_url: '',
  delivery_charge_inside: 60,
  delivery_charge_outside: 120,
  stock_status: 'In Stock',
  reviews: [],
  phone_number: '01700000000',
  category: 'Dates',
  navbar_badges: ['১০০% ক্যাশ অন ডেলিভারি', '৩ দিনের রিটার্ন পলিসি'],
  trust_badges: [
    { icon: 'Truck', title: 'সারা দেশে ডেলিভারি', subtitle: '১-২ কর্মদিবস' },
    { icon: 'ShieldCheck', title: 'ক্যাশ অন ডেলিভারি', subtitle: 'হাতে পেয়ে টাকা দিন' },
    { icon: 'RotateCcw', title: 'সহজ রিটার্ন গ্যারান্টি', subtitle: '৩ দিনের পলিসি' },
    { icon: 'CheckCircle2', title: '১০০% আসল পণ্য', subtitle: 'সেরা মান নিশ্চিত' },
  ],
  promo_tagline: 'আজকের ধামাকা অফার - বিশেষ ছাড়!',
  satisfaction_record: '৯৯.২% কাস্টমার সন্তুষ্টির রেকর্ড!',
  satisfaction_subtext: 'আমরা সবসময় সেরা কোয়ালিটির আসল পণ্য সরবরাহ করি।',
  success_count_text: '১০,০০০+ সফল ডেলিভারি',
  is_active: true,
};

type AdminOrder = {
  id: string;
  order_group_id?: string;
  customer_name?: string;
  customer_phone?: string;
  phone?: string;
  customer_address?: string;
  address?: string;
  product_title?: string;
  product_id?: string;
  quantity?: number;
  total_amount?: number;
  delivery_charge?: number;
  delivery_zone?: string;
  status?: string;
  created_at?: string;
};

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

function formatMoney(value: unknown) {
  return `৳${Number(value || 0).toLocaleString('en-BD')}`;
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orderFilter, setOrderFilter] = useState('All');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const fetchProducts = async () => {
    const response = await fetch('/api/products?all=true', { credentials: 'include' });
    if (response.status === 401) {
      setIsAuthenticated(false);
      throw new Error('Admin authentication required');
    }
    if (!response.ok) throw new Error('পণ্য লোড করা যায়নি');
    setProducts((await response.json()) || []);
  };

  const fetchOrders = async (status = orderFilter) => {
    const query = status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`/api/orders${query}`, { credentials: 'include' });
    if (response.status === 401) {
      setIsAuthenticated(false);
      throw new Error('Admin authentication required');
    }
    if (!response.ok) throw new Error('অর্ডার লোড করা যায়নি');
    setOrders((await response.json()) || []);
  };

  const refreshDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProducts(), fetchOrders()]);
    } catch (error) {
      if (error instanceof Error && error.message !== 'Admin authentication required') alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('ভুল পাসওয়ার্ড!');
      setIsAuthenticated(true);
      await refreshDashboard();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    const dataToSave = {
      ...productData,
      images: (productData.images || []).map(image => image.trim()).filter(Boolean),
      is_active: productData.is_active !== false,
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/products', {
        method: productData.id ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'পণ্য সেভ করা যায়নি');
      }
      setEditingProduct(null);
      await fetchProducts();
      return true;
    } catch (saveError) {
      alert(saveError instanceof Error ? saveError.message : 'পণ্য সেভ করা যায়নি');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleImportJson = async () => {
    try {
      const parsedData = JSON.parse(jsonText);
      const items = Array.isArray(parsedData) ? parsedData : [parsedData];
      let successCount = 0;
      for (const item of items) {
        const { id, created_at, updated_at, ...cleanItem } = item;
        if (await saveProduct(cleanItem)) successCount++;
      }
      alert(`${successCount} টি প্রোডাক্ট সফলভাবে সেভ করা হয়েছে!`);
      setShowJsonModal(false);
      setJsonText('');
    } catch (error) {
      console.error(error);
      alert('ভুল JSON ফরম্যাট! দয়া করে সঠিক কোড পেস্ট করুন।');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('আপনি কি এই পণ্যটি মুছে ফেলতে চান?')) return;
    const response = await fetch('/api/products', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('পণ্য মুছে ফেলা যায়নি');
    await fetchProducts();
  };

  const toggleProductActive = async (product: Product) => {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, is_active: product.is_active === false }),
      });
      if (!response.ok) throw new Error('পণ্যের প্রকাশনা status পরিবর্তন করা যায়নি');
      await fetchProducts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Status পরিবর্তন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (!response.ok) throw new Error('অর্ডারের status পরিবর্তন করা যায়নি');
      await fetchOrders();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Status পরিবর্তন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const triggerCatalogSync = async () => {
    setSyncState('loading');
    setSyncMessage('Paikari catalog sync শুরু হচ্ছে...');
    try {
      const response = await fetch('/api/catalog-sync', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Catalog sync ব্যর্থ হয়েছে');
      setSyncState('success');
      setSyncMessage(`${payload.synced || 0} টি shared product sync হয়েছে`);
    } catch (error) {
      setSyncState('error');
      setSyncMessage(error instanceof Error ? error.message : 'Catalog sync ব্যর্থ হয়েছে');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
          <h1 className="mb-6 text-2xl font-black italic tracking-tighter uppercase">ADMIN<span className="text-red-600">PANEL</span></h1>
          <input
            type="password"
            placeholder="পাসওয়ার্ড দিন"
            className="mb-4 w-full rounded-xl border-2 border-gray-100 p-3 font-bold outline-none focus:border-red-500"
            value={password}
            onChange={event => setPassword(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} disabled={loading} className="flex w-full items-center justify-center rounded-xl bg-red-600 py-4 font-black text-white shadow-lg transition active:scale-95 disabled:opacity-60">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} লগইন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Origen Dashboard</h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product master and order operations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={refreshDashboard} className="rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200" title="Refresh">
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={triggerCatalogSync} disabled={syncState === 'loading'} className="rounded-xl bg-purple-600 px-4 py-3 text-xs font-black text-white transition hover:bg-purple-700 disabled:opacity-60">
              {syncState === 'loading' ? 'Sync হচ্ছে...' : 'Paikari Sync'}
            </button>
            <button onClick={() => setShowJsonModal(true)} className="flex items-center rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white transition hover:bg-black">
              <Code className="mr-2 h-4 w-4" /> JSON ইম্পোর্ট
            </button>
            <button onClick={() => setEditingProduct({ ...DEFAULT_PRODUCT_TEMPLATE })} className="flex items-center rounded-xl bg-green-600 px-6 py-3 text-xs font-black text-white shadow-lg transition hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> নতুন পণ্য
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('products')} className={`rounded-xl px-5 py-3 text-sm font-black ${activeTab === 'products' ? 'bg-red-600 text-white' : 'bg-white text-gray-500'}`}>পণ্য ({products.length})</button>
            <button onClick={() => setActiveTab('orders')} className={`rounded-xl px-5 py-3 text-sm font-black ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'bg-white text-gray-500'}`}>অর্ডার ({orders.length})</button>
          </div>
          {syncMessage && <p className={`rounded-xl px-4 py-3 text-xs font-bold ${syncState === 'error' ? 'bg-red-50 text-red-700' : syncState === 'success' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>{syncMessage}</p>}
        </div>

        {showJsonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-gray-950 p-6 text-white">
                <div><h2 className="flex items-center text-lg font-black uppercase"><Code className="mr-3 h-6 w-6 text-blue-500" /> JSON Import</h2><p className="mt-1 text-[10px] font-bold uppercase text-gray-500">Product content import</p></div>
                <button onClick={() => setShowJsonModal(false)} className="p-2 text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-6 p-6 md:p-8">
                <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><p className="text-xs font-bold leading-relaxed text-amber-800">সঠিক JSON ব্যবহার করুন। এটি সরাসরি নতুন product হিসেবে সেভ হবে।</p></div>
                <textarea className="h-64 w-full resize-none rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 font-mono text-[10px] outline-none focus:border-blue-500" placeholder='{ "title": "পণ্য ১", "slug": "item-1" }' value={jsonText} onChange={event => setJsonText(event.target.value)} />
                <div className="flex justify-end gap-3"><button onClick={() => setShowJsonModal(false)} className="rounded-xl border-2 border-gray-100 px-8 py-3 text-xs font-black text-gray-400">বাতিল</button><button onClick={handleImportJson} disabled={!jsonText.trim() || loading} className="flex items-center rounded-xl bg-blue-600 px-10 py-3 text-xs font-black text-white disabled:opacity-60">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} ইম্পোর্ট শুরু করুন</button></div>
              </div>
            </div>
          </div>
        )}

        {editingProduct && <ProductEditor product={editingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} loading={loading} />}

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <div key={product.id} className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-xl ${product.is_active === false ? 'border-amber-200 opacity-75' : 'border-gray-100'}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.images?.[0] ? <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" onError={event => { event.currentTarget.style.display = 'none'; }} /> : <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase text-gray-300">No Image</div>}
                  <div className="absolute left-4 top-4"><span className={`rounded-md px-2 py-1 text-[8px] font-black uppercase tracking-tight text-white ${product.is_active === false ? 'bg-amber-600' : 'bg-green-600'}`}>{product.is_active === false ? 'Inactive' : 'Live'}</span></div>
                  <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100"><button onClick={() => setEditingProduct(product)} className="rounded-xl bg-white p-2.5 text-blue-600 shadow-lg"><Edit2 className="h-4 w-4" /></button><button onClick={() => deleteProduct(product.id)} className="rounded-xl bg-white p-2.5 text-red-600 shadow-lg"><Trash2 className="h-4 w-4" /></button></div>
                  <div className="absolute bottom-4 left-4"><span className="rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">/{product.slug}</span></div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-1 line-clamp-1 text-lg font-black leading-tight text-gray-900">{product.title}</h3>
                  <p className="mt-1 line-clamp-1 text-[10px] font-bold italic text-gray-400">{product.subtitle}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6"><div><span className="mb-1 block text-[10px] font-black uppercase tracking-tighter text-gray-400">Sale Price</span><span className="text-xl font-black text-red-600">{formatMoney(product.sale_price)}</span></div><div className="flex gap-2"><button onClick={() => toggleProductActive(product)} className={`rounded-xl px-3 py-2 text-[10px] font-black ${product.is_active === false ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{product.is_active === false ? 'Publish' : 'Hide'}</button><a href={`/${product.slug}`} target="_blank" rel="noreferrer" className="rounded-xl bg-gray-50 p-3 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"><ExternalLink className="h-5 w-5" /></a></div></div>
                </div>
              </div>
            ))}
            {products.length === 0 && !loading && <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white py-24 text-center"><AlertCircle className="mb-4 h-10 w-10 text-gray-200" /><p className="text-xs font-black uppercase tracking-widest text-gray-400">No products found</p></div>}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 md:flex-row md:items-center"><div><h2 className="text-lg font-black text-gray-900">Order operations</h2><p className="text-xs font-bold text-gray-400">Customer contact and delivery status</p></div><select value={orderFilter} onChange={async event => { const status = event.target.value; setOrderFilter(status); setLoading(true); try { await fetchOrders(status); } finally { setLoading(false); } }} className="rounded-xl border-2 border-gray-100 px-4 py-3 text-xs font-black"><option value="All">সব status</option>{ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}</select></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-400"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Product</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Delivery</th><th className="px-5 py-4">Created</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{orders.map(order => <tr key={order.id} className="align-top"><td className="px-5 py-4"><p className="font-black text-gray-900">{order.customer_name || '—'}</p><p className="mt-1 text-xs text-gray-500">{order.customer_phone || order.phone || '—'}</p><p className="mt-1 max-w-[220px] text-xs text-gray-400">{order.customer_address || order.address || '—'}</p></td><td className="px-5 py-4"><p className="max-w-[190px] font-bold text-gray-800">{order.product_title || order.product_id || '—'}</p><p className="mt-1 text-xs text-gray-400">Qty: {order.quantity || 1}</p></td><td className="px-5 py-4 font-black text-red-600">{formatMoney(order.total_amount)}</td><td className="px-5 py-4 text-xs font-bold text-gray-600">{order.delivery_zone || '—'}<br />{formatMoney(order.delivery_charge)}</td><td className="px-5 py-4 text-xs text-gray-500">{formatDate(order.created_at)}</td><td className="px-5 py-4"><select value={order.status || 'pending'} onChange={event => updateOrderStatus(order.id, event.target.value)} className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-black"><option value="pending">pending</option>{ORDER_STATUSES.filter(status => status !== 'pending').map(status => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table>{orders.length === 0 && <p className="p-16 text-center text-sm font-bold text-gray-400">এই filter-এ কোনো order পাওয়া যায়নি।</p>}</div>
          </div>
        )}
      </div>
    </div>
  );
}
