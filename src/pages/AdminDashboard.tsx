import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (data) setProducts(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Content Manager</h1>
      <div className="bg-white shadow rounded-lg p-6">
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Slug</th>
                <th className="py-2">Title</th>
                <th className="py-2">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{p.slug}</td>
                  <td className="py-2">{p.title}</td>
                  <td className="py-2">{p.sale_price}</td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
