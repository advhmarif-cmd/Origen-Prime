import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';

export default function ProductEditor({ product, onSave, onCancel }: { product: Product, onSave: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(product);

  const addFeature = () => setFormData({...formData, features: [...formData.features, '']});
  const updateFeature = (index: number, val: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = val;
    setFormData({...formData, features: newFeatures});
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('products').update(formData).eq('id', product.id);
    onSave();
  };

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow border space-y-4">
      <h2 className="text-xl font-bold">Edit: {formData.title}</h2>
      <input className="border p-2 w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" />
      <div className="space-y-2">
        <label className="block text-sm font-medium">Features</label>
        {formData.features.map((f, i) => (
          <input key={i} className="border p-2 w-full" value={f} onChange={e => updateFeature(i, e.target.value)} />
        ))}
        <button type="button" onClick={addFeature} className="text-sm text-blue-600 underline">+ Add Feature</button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Main Image URL</label>
        <input className="border p-2 w-full" value={formData.images[0] || ''} onChange={e => setFormData({...formData, images: [e.target.value]})} />
        {formData.images[0] && <img src={formData.images[0]} className="w-20 h-20 object-cover mt-2 rounded border" />}
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}
