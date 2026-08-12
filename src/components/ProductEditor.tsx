import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';

export default function ProductEditor({ product, onSave, onCancel }: { product: Product, onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(product);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('products').update(formData).eq('id', product.id);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow border">
      <h2 className="text-xl font-bold mb-4">Edit Product: {product.title}</h2>
      <input className="border p-2 w-full mb-2" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      <input className="border p-2 w-full mb-2" placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
      <input type="number" className="border p-2 w-full mb-2" placeholder="Sale Price" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: Number(e.target.value)})} />
      <textarea className="border p-2 w-full mb-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}
