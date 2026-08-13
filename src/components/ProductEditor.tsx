import React from 'react';
import { Product, Review, TrustBadge } from '../lib/types';
import { X, Check, List, Trash2, Plus, MessageSquare, Truck, Phone, Megaphone, Star, Calendar, MapPin, Camera, Tag, Image as ImageIcon } from 'lucide-react';

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
    category: product.category || 'Dates',
    logo_url: product.logo_url || ''
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
          {/* Column 1 */}
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
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} placeholder="e.g. Dates, Honey" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Brand Logo (URL)</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-blue-600" value={editingProduct.logo_url} onChange={e => setEditingProduct({...editingProduct, logo_url: e.target.value})} placeholder="https://link-to-logo.png" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Product Title</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Promo Tagline</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.promo_tagline} onChange={e => setEditingProduct({...editingProduct, promo_tagline: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Pricing & Logistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Regular Price" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.regular_price} onChange={e => setEditingProduct({...editingProduct, regular_price: Number(e.target.value)})} />
                <input type="number" placeholder="Sale Price" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.sale_price} onChange={e => setEditingProduct({...editingProduct, sale_price: Number(e.target.value)})} />
                <input type="number" placeholder="Inside Dhaka" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.delivery_charge_inside} onChange={e => setEditingProduct({...editingProduct, delivery_charge_inside: Number(e.target.value)})} />
                <input type="number" placeholder="Outside Dhaka" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.delivery_charge_outside} onChange={e => setEditingProduct({...editingProduct, delivery_charge_outside: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center"><ImageIcon className="w-4 h-4 mr-2"/> Images & Video</h3>
              <div className="space-y-3">
                {(editingProduct.images || []).map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-[10px]" value={img} onChange={e => handleArrayChange('images', idx, e.target.value)} />
                    <button onClick={() => removeArrayItem('images', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('images')} className="text-[10px] font-black text-blue-600 underline">+ Add Image URL</button>
                <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-[10px] mt-2" placeholder="YouTube Video URL" value={editingProduct.video_url} onChange={e => setEditingProduct({...editingProduct, video_url: e.target.value})} />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Key Features</h3>
              <div className="space-y-2">
                {(editingProduct.features || []).map((feat, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-xs font-bold" value={feat} onChange={e => handleArrayChange('features', idx, e.target.value)} />
                    <button onClick={() => removeArrayItem('features', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('features')} className="text-[10px] font-black text-blue-600 underline">+ Add Feature</button>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Satisfaction & Trust</h3>
              <div className="space-y-3">
                <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" placeholder="Satisfaction Record (e.g. 99%)" value={editingProduct.satisfaction_record} onChange={e => setEditingProduct({...editingProduct, satisfaction_record: e.target.value})} />
                <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" placeholder="Success Count (e.g. 10,000+)" value={editingProduct.success_count_text} onChange={e => setEditingProduct({...editingProduct, success_count_text: e.target.value})} />
                
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Trust Badges</p>
                  {(editingProduct.trust_badges || []).map((badge, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 mb-2 space-y-1">
                      <div className="flex justify-between">
                         <select className="text-[10px] font-black" value={badge.icon} onChange={e => handleTrustBadgeChange(idx, 'icon', e.target.value)}>
                            <option value="Truck">Truck</option>
                            <option value="ShieldCheck">Shield</option>
                            <option value="RotateCcw">Return</option>
                            <option value="CheckCircle2">Check</option>
                         </select>
                         <button onClick={() => removeTrustBadge(idx)} className="text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <input className="w-full border-b border-gray-100 text-[10px] font-black" value={badge.title} onChange={e => handleTrustBadgeChange(idx, 'title', e.target.value)} placeholder="Title" />
                      <input className="w-full text-[9px] font-bold text-gray-400" value={badge.subtitle} onChange={e => handleTrustBadgeChange(idx, 'subtitle', e.target.value)} placeholder="Subtitle" />
                    </div>
                  ))}
                  <button onClick={addTrustBadge} className="text-[10px] font-black text-blue-600 underline">+ Add Trust Badge</button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Navbar Badges</h3>
               {(editingProduct.navbar_badges || []).map((badge, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-xs font-bold" value={badge} onChange={e => handleArrayChange('navbar_badges', idx, e.target.value)} />
                    <button onClick={() => removeArrayItem('navbar_badges', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('navbar_badges')} className="text-[10px] font-black text-blue-600 underline">+ Add Navbar Badge</button>
            </div>
          </div>
        </div>

        {/* Review Management */}
        <div className="mt-8 bg-gray-900 p-8 rounded-3xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-white flex items-center"><MessageSquare className="w-6 h-6 mr-3 text-blue-400" /> গ্রাহক রিভিউ ম্যানেজমেন্ট</h3>
            <button onClick={addReview} className="bg-blue-600 text-white text-[10px] font-black px-6 py-3 rounded-2xl">+ নতুন রিভিউ</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(editingProduct.reviews || []).map((rev, idx) => (
              <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-gray-800 relative space-y-3">
                <button onClick={() => removeReview(idx)} className="absolute top-2 right-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full bg-gray-800 border-none rounded-lg text-white text-xs font-bold p-2" value={rev.name} onChange={e => handleReviewChange(idx, 'name', e.target.value)} placeholder="Name" />
                  <input className="w-full bg-gray-800 border-none rounded-lg text-white text-xs font-bold p-2" value={rev.location} onChange={e => handleReviewChange(idx, 'location', e.target.value)} placeholder="Location" />
                </div>
                <input className="w-full bg-gray-800 border-none rounded-lg text-white text-[10px] p-2" value={rev.avatar} onChange={e => handleReviewChange(idx, 'avatar', e.target.value)} placeholder="Avatar URL" />
                <textarea className="w-full bg-gray-800 border-none rounded-lg text-gray-300 text-xs p-2 h-20" value={rev.comment} onChange={e => handleReviewChange(idx, 'comment', e.target.value)} placeholder="Comment" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex justify-end gap-4 sticky bottom-0 bg-white/95 py-4 z-20">
          <button onClick={onCancel} className="px-8 py-3 border-2 rounded-2xl font-black text-gray-500">বাতিল</button>
          <button onClick={() => onSave(editingProduct)} disabled={loading} className="px-12 py-3 bg-red-600 text-white rounded-2xl font-black shadow-xl active:scale-95 flex items-center">
            <Check className="w-6 h-6 mr-2" /> {loading ? 'সেভ হচ্ছে...' : 'সব সেভ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
