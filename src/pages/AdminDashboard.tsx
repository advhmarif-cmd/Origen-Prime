import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import ProductEditor from '../components/ProductEditor';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const saveProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    let error;
    
    // Ensure arrays are initialized if missing
    const dataToSave = {
      ...productData,
      updated_at: new Date().toISOString()
    };

    if (productData.id) {
      const { error: err } = await supabase.from('products').update(dataToSave).eq('id', productData.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('products').insert([dataToSave]);
      error = err;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setEditingProduct(null);
      fetchProducts();
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
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
            onChange={(e) => setPassword(password === 'admin123' ? e.target.value : e.target.value)} // dummy logic to use state
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
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Origen Dashboard</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Full Page Content Control</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchProducts} className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setEditingProduct({
                slug: '', title: '', subtitle: '', regular_price: 0, sale_price: 0,
                discount_percentage: 0, description: '', features: [], images: [],
                video_url: '', delivery_charge_inside: 60, delivery_charge_outside: 120,
                stock_status: 'In Stock', reviews: [], phone_number: '01700000000',
                navbar_badges: [], trust_badges: [], category: 'Dates'
              })}
              className="bg-green-600 text-white font-black px-6 py-3 rounded-xl flex items-center shadow-lg hover:bg-green-700 transition active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" /> নতুন পণ্য
            </button>
          </div>
        </div>

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
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xs">NO IMAGE</div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                  <button onClick={() => setEditingProduct(p)} className="p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:scale-110 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-white text-red-600 rounded-xl shadow-lg hover:scale-110 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">/{p.slug}</span>
                </div>
                <div className="absolute top-4 left-4">
                   <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase">{p.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-gray-900 line-clamp-1 text-lg leading-tight">{p.title}</h3>
                <p className="text-gray-400 text-[10px] font-bold mt-1 line-clamp-1 italic">{p.subtitle}</p>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Sale Price</span>
                    <span className="text-xl font-black text-red-600">৳{p.sale_price}</span>
                  </div>
                  <a href={`/${p.slug}`} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && !loading && (
             <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No products found. Start by adding one!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
