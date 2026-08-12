import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === 'admin123') { // আপনার পছন্দের পাসওয়ার্ড
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
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
      <div className="flex flex-col items-center justify-center h-screen">
        <input 
          type="password" 
          placeholder="পাসওয়ার্ড দিন" 
          className="border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded">লগইন</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <button onClick={fetchProducts} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">রিফ্রেশ</button>
      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-500">Slug: {p.slug}</p>
            </div>
            <button 
              onClick={() => deleteProduct(p.id)} 
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ডিলিট
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
