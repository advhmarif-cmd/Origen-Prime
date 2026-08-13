import React from 'react';
import { Product, Review, TrustBadge } from '../lib/types';
import { X, Check, List, Trash2, Plus, MessageSquare, Truck, Phone, Megaphone, Star, Calendar, MapPin, Camera, Tag } from 'lucide-react';

interface ProductEditorProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ProductEditor({ product, onSave, onCancel, loading }: ProductEditorProps) {
  const [editingProduct, setEditingProduct] = React.useState<Partial<Product>>({
    ...product,
    navbar_badges: product.navbar_badges || [],
    trust_badges: product.trust_badges || [],
    reviews: product.reviews || [],
    features: product.features || [],
    images: product.images || [],
    category: product.category || 'Dates'
  });

  const handleArrayChange = (field: 'features' | 'images' | 'navbar_badges', index: number, value: string) => {
    const newArray = [...(editingProduct[field] || [])];
    newArray[index] = value;
    setEditingProduct({ ...editingProduct, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'images' | 'navbar_badges') => {
    setEditingProduct({ ...editingProduct, [field]: [...(editingProduct[field] || []), ''] });
  };

  const removeArrayItem = (field: 'features' | 'images' | 'navbar_badges', index: number) => {
    const newArray = [...(editingProduct[field] || [])];
    newArray.splice(index, 1);
    setEditingProduct({ ...editingProduct, [field]: newArray });
  };

  const handleReviewChange = (index: number, field: keyof Review, value: string | number) => {
    const newReviews = [...(editingProduct.reviews || [])];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setEditingProduct({ ...editingProduct, reviews: newReviews });
  };

  const addReview = () => {
    const newReview: Review = { name: '', location: '', rating: 5, comment: '', date: '২ দিন আগে', avatar: '' };
    setEditingProduct({ ...editingProduct, reviews: [...(editingProduct.reviews || []), newReview] });
  };

  const removeReview = (index: number) => {
    const newReviews = [...(editingProduct.reviews || [])];
    newReviews.splice(index, 1);
    setEditingProduct({ ...editingProduct, reviews: newReviews });
  };

  const handleTrustBadgeChange = (index: number, field: keyof TrustBadge, value: string) => {
    const newBadges = [...(editingProduct.trust_badges || [])];
    newBadges[index] = { ...newBadges[index], [field]: value } as TrustBadge;
    setEditingProduct({ ...editingProduct, trust_badges: newBadges });
  };

  const addTrustBadge = () => {
    const newBadge: TrustBadge = { icon: 'CheckCircle2', title: '', subtitle: '' };
    setEditingProduct({ ...editingProduct, trust_badges: [...(editingProduct.trust_badges || []), newBadge] });
  };

  const removeTrustBadge = (index: number) => {
    const newBadges = [...(editingProduct.trust_badges || [])];
    newBadges.splice(index, 1);
    setEditingProduct({ ...editingProduct, trust_badges: newBadges });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 backdrop-blur-xs py-2 z-10 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 flex items-center uppercase tracking-tight">
            {editingProduct.id ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট তৈরি করুন'}
          </h2>
          <button onClick={onCancel} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"><X /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 1: Core Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center"><List className="w-4 h-4 mr-2"/> Basic Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Slug (URL)</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.slug} onChange={e => setEditingProduct({...editingProduct, slug: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Category</label>
                  <select className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                    <option value="Dates">খেজুর</option>
                    <option value="Honey">মধু</option>
                    <option value="Perfume">পারফিউম</option>
                    <option value="Health">হেলথ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Product Title</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Promo Tagline</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.promo_tagline} onChange={e => setEditingProduct({...editingProduct, promo_tagline: e.target.value})} placeholder="আজকের ধামাকা অফার!" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Pricing</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Regular Price" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.regular_price} onChange={e => setEditingProduct({...editingProduct, regular_price: Number(e.target.value)})} />
                <input type="number" placeholder="Sale Price" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.sale_price} onChange={e => setEditingProduct({...editingProduct, sale_price: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          {/* Section 2: Media & Badges */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Images & Video</h3>
              <div className="space-y-3">
                {(editingProduct.images || []).map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-[10px]" value={img} onChange={e => handleArrayChange('images', idx, e.target.value)} />
                    <button onClick={() => removeArrayItem('images', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('images')} className="text-[10px] font-black text-blue-600 underline">+ Add Image</button>
                <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-[10px] mt-2" placeholder="Video URL" value={editingProduct.video_url} onChange={e => setEditingProduct({...editingProduct, video_url: e.target.value})} />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Features</h3>
              {(editingProduct.features || []).map((feat, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-xs" value={feat} onChange={e => handleArrayChange('features', idx, e.target.value)} />
                  <button onClick={() => removeArrayItem('features', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addArrayItem('features')} className="text-[10px] font-black text-blue-600 underline">+ Add Feature</button>
            </div>
          </div>

          {/* Section 3: Trust & Reviews */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Trust Content</h3>
              <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold mb-3 text-xs" placeholder="Satisfaction Record" value={editingProduct.satisfaction_record} onChange={e => setEditingProduct({...editingProduct, satisfaction_record: e.target.value})} />
              <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" placeholder="Success Count" value={editingProduct.success_count_text} onChange={e => setEditingProduct({...editingProduct, success_count_text: e.target.value})} />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Description</h3>
              <textarea className="w-full border-2 border-gray-200 rounded-xl p-3 h-32 text-xs font-semibold" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Dynamic Reviews Management */}
        <div className="mt-8 bg-gray-900 p-6 rounded-3xl border border-gray-800">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-400"/> Reviews</h3>
              <button onClick={addReview} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">+ Add Review</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(editingProduct.reviews || []).map((rev, idx) => (
                <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-gray-800 relative space-y-2">
                  <button onClick={() => removeReview(idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  <input className="w-full bg-transparent border-b border-gray-800 text-white text-xs font-bold p-1 outline-none" value={rev.name} onChange={e => handleReviewChange(idx, 'name', e.target.value)} placeholder="Customer Name" />
                  <textarea className="w-full bg-transparent border-b border-gray-800 text-gray-400 text-[10px] p-1 outline-none h-12" value={rev.comment} onChange={e => handleReviewChange(idx, 'comment', e.target.value)} placeholder="Comment" />
                </div>
              ))}
           </div>
        </div>

        <div className="mt-10 pt-8 border-t flex justify-end gap-4 sticky bottom-0 bg-white/95 py-4">
          <button onClick={onCancel} className="px-8 py-3 border-2 rounded-2xl font-black text-gray-500">বাতিল</button>
          <button onClick={() => onSave(editingProduct)} disabled={loading} className="px-12 py-3 bg-red-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition">
            <Check className="w-6 h-6 mr-2" /> {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
