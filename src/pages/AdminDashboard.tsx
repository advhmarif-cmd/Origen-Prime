import React, { useState } from 'react';
import { Product } from '../lib/types';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, Code, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import ProductEditor from '../components/ProductEditor';

// 1. Realistic Bengali sample product data template
const DEFAULT_PRODUCT_TEMPLATE: Partial<Product> = {
  slug: '',
  title: 'মদিনার প্রিমিয়াম আজওয়া খেজুর',
  subtitle: 'সরাসরি মদিনা থেকে আমদানিকৃত সেরা মানের আজওয়া খেজুর',
  regular_price: 1200,
  sale_price: 950,
  discount_percentage: 20,
  description: 'আমাদের এই আজওয়া খেজুর সরাসরি মদিনা থেকে আমদানিকৃত। এটি সম্পূর্ণ প্রাকৃতিক এবং কোনো প্রকার প্রিজারভেটিভ ছাড়া। স্বাস্থ্যসম্মত এবং পুষ্টিগুণে ভরপুর এই খেজুর আপনার পরিবারের জন্য সেরা পছন্দ। কুরিয়ার ম্যানের সামনে চেক করে টাকা দেওয়ার সুবিধা পাবেন।',
  features: [
    '১০০% খাঁটি ও প্রিমিয়াম কোয়ালিটি।',
    'সরাসরি মদিনা থেকে আমদানিকৃত।',
    'স্বাস্থ্যসম্মত ও পরিষ্কার-পরিচ্ছন্ন প্যাকেজিং।',
    'দ্রুত হোম ডেলিভারি সুবিধা।'
  ],
  images: ['https://via.placeholder.com/800x800?text=Upload+Your+Product+Image'],
  video_url: '',
  delivery_charge_inside: 60,
  delivery_charge_outside: 120,
  stock_status: 'In Stock',
  reviews: [
    {
      name: 'মোঃ আরিফুর রহমান',
      location: 'মিরপুর, ঢাকা',
      rating: 5,
      comment: 'খেজুরগুলো অনেক ফ্রেশ এবং সুস্বাদু ছিল। মদিনার আসল স্বাদ পেয়েছি। ধন্যবাদ!',
      date: '২ দিন আগে',
      avatar: ''
    }
  ],
  phone_number: '01700000000',
  category: 'Dates',
  navbar_badges: ['১০০% ক্যাশ অন ডেলিভারি', '৩ দিনের রিটার্ন পলিসি'],
  trust_badges: [
    { icon: 'Truck', title: 'সারা দেশে ডেলিভারি', subtitle: '১-২ কর্মদিবস' },
    { icon: 'ShieldCheck', title: 'ক্যাশ অন ডেলিভারি', subtitle: 'হাতে পেয়ে টাকা দিন' },
    { icon: 'RotateCcw', title: 'সহজ রিটার্ন গ্যারান্টি', subtitle: '৩ দিনের পলিসি' },
    { icon: 'CheckCircle2', title: '১০০% আসল পণ্য', subtitle: 'সেরা মান নিশ্চিত' }
  ],
  promo_tagline: 'আজকের ধামাকা অফার - বিশেষ ছাড়!',
  satisfaction_record: '৯৯.২% কাস্টমার সন্তুষ্টির রেকর্ড!',
  satisfaction_subtext: 'আমরা সবসময় সেরা কোয়ালিটির আসল পণ্য সরবরাহ করি।',
  success_count_text: '১০,০০০+ সফল ডেলিভারি'
};

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Added states for JSON import modal
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');

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
      await fetchProducts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?all=true', { credentials: 'include' });
      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error('Admin authentication required');
      }
      if (!response.ok) throw new Error('পণ্য লোড করা যায়নি');
      const data = await response.json();
      setProducts((data || []) as Product[]);
    } catch (error) {
      console.error('Product load error:', error);
      if (error instanceof Error && error.message !== 'Admin authentication required') alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    
    const dataToSave = {
      ...productData,
      updated_at: new Date().toISOString()
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
      console.error('Save error:', saveError);
      alert(saveError instanceof Error ? saveError.message : 'পণ্য সেভ করা যায়নি');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. handleImportJson() parses and saves JSON data directly to DB
  const handleImportJson = async () => {
    try {
      const parsedData = JSON.parse(jsonText);
      const items = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      let successCount = 0;
      for (const item of items) {
        // Alignment & Safety: Removing internal IDs to ensure fresh insertion if not present
        const { id, created_at, updated_at, ...cleanItem } = item;
        const success = await saveProduct(cleanItem);
        if (success) successCount++;
      }

      alert(`${successCount} টি প্রোডাক্ট সফলভাবে সেভ করা হয়েছে!`);
      setShowJsonModal(false);
      setJsonText('');
    } catch (err) {
      alert('ভুল JSON ফরম্যাট! দয়া করে সঠিক কোড পেস্ট করুন।');
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত?')) {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('পণ্য মুছে ফেলা যায়নি');
      await fetchProducts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md text-center">
          <h1 className="text-2xl font-black mb-6 italic tracking-tighter uppercase">ADMIN<span className="text-red-600">PANEL</span></h1>
          <input 
            type="password" 
            placeholder="পাসওয়ার্ড দিন" 
            className="w-full border-2 border-gray-100 rounded-xl p-3 mb-4 focus:border-red-500 outline-none font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition">লগইন</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Origen Dashboard</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Universal Content Control</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={fetchProducts} className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition" title="Refresh">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* 2. Added JSON ইম্পোর্ট Button */}
            <button 
              onClick={() => setShowJsonModal(true)}
              className="bg-gray-900 text-white font-black px-5 py-3 rounded-xl flex items-center shadow-lg hover:bg-black transition active:scale-95 text-xs"
            >
              <Code className="w-4 h-4 mr-2" /> JSON ইম্পোর্ট
            </button>

            {/* 1. New Product Button now uses DEFAULT_PRODUCT_TEMPLATE */}
            <button 
              onClick={() => setEditingProduct({ ...DEFAULT_PRODUCT_TEMPLATE })}
              className="bg-green-600 text-white font-black px-6 py-3 rounded-xl flex items-center shadow-lg hover:bg-green-700 transition active:scale-95 text-xs"
            >
              <Plus className="w-4 h-4 mr-2" /> নতুন পণ্য
            </button>
          </div>
        </div>

        {/* 2. JSON Import Modal */}
        {showJsonModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-200">
              <div className="bg-gray-950 p-6 flex justify-between items-center text-white">
                <div>
                  <h2 className="text-lg font-black flex items-center tracking-tight uppercase">
                    <Code className="w-6 h-6 mr-3 text-blue-500" /> JSON Import
                  </h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">AI জেনারেটেড কোড এখানে পেস্ট করুন</p>
                </div>
                <button onClick={() => setShowJsonModal(false)} className="p-2 text-gray-400 hover:text-white transition"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-800 leading-relaxed text-left">
                    সতর্কতা: সঠিক JSON ফরম্যাট ব্যবহার করুন। এটি সরাসরি ডাটাবেসে নতুন পণ্য হিসেবে জমা হবে।
                  </p>
                </div>
                
                <textarea 
                  className="w-full h-64 border-2 border-gray-100 rounded-2xl p-4 font-mono text-[10px] bg-gray-50 focus:border-blue-500 outline-none transition resize-none shadow-inner"
                  placeholder='{ "title": "পণ্য ১", "slug": "item-1", ... }'
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                />

                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setShowJsonModal(false)} className="px-8 py-3 border-2 border-gray-100 rounded-xl font-black text-gray-400 text-xs hover:bg-gray-50 transition">বাতিল</button>
                  <button 
                    onClick={handleImportJson}
                    disabled={!jsonText.trim() || loading}
                    className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 transition active:scale-95 flex items-center text-xs"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} 
                    ইম্পোর্ট শুরু করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingProduct && (
          <ProductEditor 
            product={editingProduct} 
            onSave={saveProduct} 
            onCancel={() => setEditingProduct(null)} 
            loading={loading}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition hover:shadow-xl">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover transition group-hover:scale-110 duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xs uppercase">No Image</div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                  <button onClick={() => setEditingProduct(p)} className="p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:scale-110 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:scale-110 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">/{p.slug}</span>
                </div>
                <div className="absolute top-4 left-4">
                   <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter leading-none">{p.category}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-gray-900 line-clamp-1 text-lg leading-tight mb-1">{p.title}</h3>
                <p className="text-gray-400 text-[10px] font-bold mt-1 line-clamp-1 italic">{p.subtitle}</p>
                <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Sale Price</span>
                    <span className="text-xl font-black text-red-600">৳{p.sale_price.toLocaleString()}</span>
                  </div>
                  <a href={`/${p.slug}`} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && !loading && (
             <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No products found. Start by adding one!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
