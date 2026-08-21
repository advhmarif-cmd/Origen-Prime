import React, { useRef } from 'react';
import { Product, Review, TrustBadge } from '../lib/types';
import { supabase } from '../lib/supabase';
import { X, Check, List, Trash2, Plus, MessageSquare, Truck, Phone, Megaphone, Star, Calendar, MapPin, Camera, Tag, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

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
    logo_url: product.logo_url || '',
    is_active: product.is_active !== false,
  });

  const [uploading, setUploading] = React.useState<string | null>(null);
  const BUCKET_NAME = 'product-assets'; // Corrected bucket name from screenshot

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

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'gallery' | number) => {
    try {
      setUploading(typeof target === 'number' ? `review-${target}` : target);
      
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (target === 'logo') {
        setEditingProduct({ ...editingProduct, logo_url: publicUrl });
      } else if (target === 'gallery') {
        setEditingProduct({ ...editingProduct, images: [...(editingProduct.images || []), publicUrl] });
      } else if (typeof target === 'number') {
        const newReviews = [...(editingProduct.reviews || [])];
        newReviews[target] = { ...newReviews[target], avatar: publicUrl };
        setEditingProduct({ ...editingProduct, reviews: newReviews });
      }

    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(null);
    }
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-sans">
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
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 flex justify-between items-center">
                    Brand Logo (URL)
                    <span className="text-[8px] text-blue-600 font-bold uppercase tracking-tighter">Mobile: click icon to upload</span>
                  </label>
                  <div className="flex gap-2">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" value={editingProduct.logo_url} onChange={e => setEditingProduct({...editingProduct, logo_url: e.target.value})} />
                    <label className="cursor-pointer bg-white border-2 border-gray-200 p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-center min-w-[45px]">
                      {uploading === 'logo' ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Upload className="w-4 h-4 text-gray-400" />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, 'logo')} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Product Title</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
                </div>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-3">
                  <span>
                    <span className="block text-[10px] font-black uppercase text-gray-500">Public visibility</span>
                    <span className="text-xs font-bold text-gray-400">Landing page ও Paikari sync-এ দেখাবে</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active !== false}
                    onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="h-5 w-5 accent-green-600"
                  />
                </label>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Promo Tagline</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.promo_tagline} onChange={e => setEditingProduct({...editingProduct, promo_tagline: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Pricing</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Regular" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.regular_price} onChange={e => setEditingProduct({...editingProduct, regular_price: Number(e.target.value)})} />
                <input type="number" placeholder="Sale" className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.sale_price} onChange={e => setEditingProduct({...editingProduct, sale_price: Number(e.target.value)})} />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Delivery Settings</h3>
              <p className="mb-3 text-[10px] font-bold leading-relaxed text-gray-400">এই charge server-side checkout total-এ ব্যবহার হবে।</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-[10px] font-black text-gray-500">Inside ৳
                  <input type="number" min="0" className="mt-1 w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.delivery_charge_inside ?? 0} onChange={e => setEditingProduct({...editingProduct, delivery_charge_inside: Number(e.target.value)})} />
                </label>
                <label className="text-[10px] font-black text-gray-500">Outside ৳
                  <input type="number" min="0" className="mt-1 w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold" value={editingProduct.delivery_charge_outside ?? 0} onChange={e => setEditingProduct({...editingProduct, delivery_charge_outside: Number(e.target.value)})} />
                </label>
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
                
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer bg-white border-2 border-dashed border-gray-300 p-3 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 transition active:scale-95">
                    {uploading === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Upload className="w-4 h-4 text-blue-600" />}
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">গ্যালারিতে ছবি যোগ করুন</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, 'gallery')} />
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">YouTube Video URL</label>
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-[10px] font-mono" placeholder="https://www.youtube.com/watch?v=..." value={editingProduct.video_url} onChange={e => setEditingProduct({...editingProduct, video_url: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Key Features</h3>
              {(editingProduct.features || []).map((feat, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-xs font-bold" value={feat} onChange={e => handleArrayChange('features', idx, e.target.value)} />
                  <button onClick={() => removeArrayItem('features', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addArrayItem('features')} className="text-[10px] font-black text-blue-600 underline">+ Add Feature</button>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Trust Content</h3>
              <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold mb-3 text-xs" placeholder="Satisfaction Record" value={editingProduct.satisfaction_record} onChange={e => setEditingProduct({...editingProduct, satisfaction_record: e.target.value})} />
              <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" placeholder="Success Count" value={editingProduct.success_count_text} onChange={e => setEditingProduct({...editingProduct, success_count_text: e.target.value})} />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center">Navbar Info</h3>
               <div className="space-y-4">
                  <input className="w-full border-2 border-gray-200 rounded-xl p-2.5 font-bold text-xs" placeholder="Support Phone" value={editingProduct.phone_number} onChange={e => setEditingProduct({...editingProduct, phone_number: e.target.value})} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Navbar Badges</p>
                    {(editingProduct.navbar_badges || []).map((badge, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input className="flex-1 border-2 border-gray-200 rounded-xl p-2 text-xs font-bold" value={badge} onChange={e => handleArrayChange('navbar_badges', idx, e.target.value)} />
                        <button onClick={() => removeArrayItem('navbar_badges', idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('navbar_badges')} className="text-[10px] font-black text-blue-600 underline">+ Add Badge</button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-gray-900 p-8 rounded-3xl border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white flex items-center italic">Customer Reviews</h3>
            <button onClick={addReview} className="bg-blue-600 text-white text-[10px] font-black px-6 py-3 rounded-2xl">+ Add Review</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(editingProduct.reviews || []).map((rev, idx) => (
              <div key={idx} className="bg-black/40 p-6 rounded-2xl border border-gray-800 relative space-y-4">
                <button onClick={() => removeReview(idx)} className="absolute top-4 right-4 text-gray-500"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full bg-gray-800 border-none rounded-xl text-white text-xs font-bold p-3" value={rev.name} onChange={e => handleReviewChange(idx, 'name', e.target.value)} placeholder="Name" />
                  <input className="w-full bg-gray-800 border-none rounded-xl text-white text-xs font-bold p-3" value={rev.location} onChange={e => handleReviewChange(idx, 'location', e.target.value)} placeholder="Location" />
                </div>
                <div className="flex gap-3 items-center">
                  <input className="flex-1 bg-gray-800 border-none rounded-xl text-white text-[9px] p-3" value={rev.avatar} onChange={e => handleReviewChange(idx, 'avatar', e.target.value)} placeholder="Avatar URL" />
                  <label className="cursor-pointer bg-gray-800 p-3 rounded-xl hover:bg-gray-700 flex items-center justify-center min-w-[50px]">
                    {uploading === `review-${idx}` ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Camera className="w-4 h-4 text-gray-500" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, idx)} />
                  </label>
                </div>
                <textarea className="w-full bg-gray-800 border-none rounded-xl text-gray-300 text-sm p-3 h-24" value={rev.comment} onChange={e => handleReviewChange(idx, 'comment', e.target.value)} placeholder="Comment..." />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex justify-end gap-4 sticky bottom-0 bg-white/95 py-4 z-20">
          <button onClick={onCancel} className="px-8 py-3 border-2 rounded-2xl font-black text-gray-500">Cancel</button>
          <button onClick={() => onSave(editingProduct)} disabled={loading} className="px-12 py-3 bg-red-600 text-white rounded-2xl font-black shadow-xl active:scale-95 flex items-center">
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Check className="w-6 h-6 mr-2" />}
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
