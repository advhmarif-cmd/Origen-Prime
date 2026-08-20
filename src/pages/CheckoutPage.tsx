import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Phone, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('inside');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<{ id: string; order_group_id?: string } | null>(null);

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('আপনার কার্ট খালি আছে।');
      return;
    }
    if (name.trim().length < 2) {
      setError('দয়া করে আপনার নাম লিখুন।');
      return;
    }
    if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phone.replace(/\s+/g, ''))) {
      setError('দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন।');
      return;
    }
    if (address.trim().length < 8) {
      setError('দয়া করে আপনার সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          delivery_zone: zone,
          items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'অর্ডার সাবমিট করা যায়নি।');

      const firstOrder = Array.isArray(data.orders) ? data.orders[0] : data;
      if (!firstOrder?.id) throw new Error('অর্ডার কনফার্মেশন পাওয়া যায়নি।');
      setConfirmation({ id: firstOrder.id, order_group_id: data.order_group_id });
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'অর্ডার সাবমিট করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <section className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900">অর্ডার সফলভাবে গ্রহণ করা হয়েছে</h1>
          <p className="text-gray-600 mt-3">আমাদের প্রতিনিধি শিগগিরই আপনার সাথে যোগাযোগ করবেন।</p>
          <p className="font-bold text-gray-900 mt-5">অর্ডার আইডি: {confirmation.order_group_id || confirmation.id}</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-7 bg-gray-900 text-white px-6 py-3 rounded-xl font-black">
            <ArrowLeft className="w-4 h-4" /> আরও পণ্য দেখুন
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 font-bold mb-6">
          <ArrowLeft className="w-4 h-4" /> কেনাকাটায় ফিরে যান
        </Link>
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <section className="bg-white rounded-3xl shadow-sm p-6">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-red-600" /> আপনার কার্ট</h1>
            {cart.length === 0 ? (
              <p className="text-gray-500 mt-6">কার্ট বর্তমানে খালি আছে।</p>
            ) : (
              <div className="mt-6 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                    <img src={item.images?.[0]} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">৳{item.sale_price.toLocaleString()} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form onSubmit={submitOrder} className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-black text-gray-900">ডেলিভারি তথ্য</h2>
            {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm font-bold">{error}</div>}
            <label className="block"><span className="flex items-center gap-2 text-sm font-black mb-1"><User className="w-4 h-4 text-red-600" /> নাম</span><input value={name} onChange={event => setName(event.target.value)} className="w-full border rounded-xl px-4 py-3" required /></label>
            <label className="block"><span className="flex items-center gap-2 text-sm font-black mb-1"><Phone className="w-4 h-4 text-red-600" /> মোবাইল</span><input value={phone} onChange={event => setPhone(event.target.value)} className="w-full border rounded-xl px-4 py-3" required /></label>
            <label className="block"><span className="flex items-center gap-2 text-sm font-black mb-1"><MapPin className="w-4 h-4 text-red-600" /> ঠিকানা</span><textarea value={address} onChange={event => setAddress(event.target.value)} className="w-full border rounded-xl px-4 py-3" rows={3} required /></label>
            <label className="block text-sm font-black">ডেলিভারি এলাকা<select value={zone} onChange={event => setZone(event.target.value)} className="w-full border rounded-xl px-4 py-3 mt-1"><option value="inside">ঢাকার ভিতরে</option><option value="outside">ঢাকার বাইরে</option></select></label>
            <button type="submit" disabled={loading || cart.length === 0} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-4 rounded-xl">{loading ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
