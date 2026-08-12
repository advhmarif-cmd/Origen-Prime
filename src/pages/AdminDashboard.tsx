import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductEditor from '../components/ProductEditor';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input type="password" placeholder="Password" className="border p-2 mb-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => password === 'admin123' && setIsAuthenticated(true)} className="bg-blue-600 text-white px-6 py-2 rounded">Login</button>
    </div>
  );

  if (editingProduct) return <ProductEditor product={editingProduct} onSave={() => {setEditingProduct(null); fetchProducts();}} onCancel={() => setEditingProduct(null)} />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Content Manager</h1>
      <table className="w-full border-collapse">
        <thead><tr className="border-b"><th className="text-left p-2">Slug</th><th className="text-left p-2">Title</th><th className="text-left p-2">Price</th><th className="text-left p-2">Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.slug}</td>
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.sale_price}</td>
              <td className="p-2">
                <button onClick={() => setEditingProduct(p)} className="text-blue-600 underline mr-2">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
