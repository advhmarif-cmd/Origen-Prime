import React, { useState } from 'react';
import { ShoppingCart, User, Phone, MapPin, Truck, ShieldCheck, HelpCircle } from 'lucide-react';

interface OrderFormProps {
  productId: string;
  productTitle: string;
  salePrice: number;
  deliveryInside: number;
  deliveryOutside: number;
  onOrderSuccess: (orderData: any) => void;
}

export default function OrderForm({
  productId,
  productTitle,
  salePrice,
  deliveryInside,
  deliveryOutside,
  onOrderSuccess
}: OrderFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('inside'); // 'inside' or 'outside'
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryCharge = zone === 'inside' ? deliveryInside : deliveryOutside;
  const productTotal = salePrice * quantity;
  const grandTotal = productTotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('দয়া করে আপনার নাম লিখুন।');
      return;
    }
    if (!phone.trim()) {
      setError('দয়া করে আপনার মোবাইল নাম্বার লিখুন।');
      return;
    }
    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setError('দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!address.trim()) {
      setError('দয়া করে আপনার সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          delivery_zone: zone,
          items: [{ product_id: productId, quantity }],
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'অর্ডার সাবমিট করা যায়নি।');
      }

      const confirmedOrder = Array.isArray(data.orders) ? data.orders[0] : data;
      if (!confirmedOrder?.id) {
        throw new Error('অর্ডার কনফার্মেশন পাওয়া যায়নি।');
      }
      onOrderSuccess(confirmedOrder);

      setName('');
      setPhone('');
      setAddress('');
      setQuantity(1);
    } catch (err: any) {
      console.error(err);
      setError('অর্ডার সাবমিট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order-form-section" className="py-12 bg-red-50/30 border-b border-gray-100 scroll-mt-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white border-2 border-red-500/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-600 text-white text-center py-4 px-4">
            <h2 className="text-xl md:text-2xl font-black flex items-center justify-center gap-2">
              <ShoppingCart className="w-6 h-6 animate-bounce" />
              অর্ডার করতে নিচের ফর্মটি পূরণ করুন
            </h2>
            <p className="text-xs md:text-sm font-medium mt-1 text-red-100">
              সঠিক তথ্য দিয়ে ফর্মটি পূরণ করলে আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm font-bold px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-black text-gray-800 mb-1.5 flex items-center">
                <User className="w-4 h-4 text-red-600 mr-1.5" />
                আপনার নাম <span className="text-red-600 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: মোঃ আরিফ"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-800 mb-1.5 flex items-center">
                <Phone className="w-4 h-4 text-red-600 mr-1.5" />
                মোবাইল নাম্বার <span className="text-red-600 ml-1">*</span>
              </label>
              <input
                type="tel"
                placeholder="যেমন: 017XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-800 mb-1.5 flex items-center">
                <MapPin className="w-4 h-4 text-red-600 mr-1.5" />
                সম্পূর্ণ ঠিকানা <span className="text-red-600 ml-1">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: গ্রাম, ডাকঘর, থানা, জেলা"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-800 mb-2 flex items-center">
                <Truck className="w-4 h-4 text-red-600 mr-1.5" />
                ডেলিভারি এলাকা নির্বাচন করুন <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition ${
                  zone === 'inside'
                    ? 'border-green-600 bg-green-50/40 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery_zone"
                      value="inside"
                      checked={zone === 'inside'}
                      onChange={() => setZone('inside')}
                      className="text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="block font-black text-sm">ঢাকার ভিতরে</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm">৳{deliveryInside}</span>
                </label>

                <label className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition ${
                  zone === 'outside'
                    ? 'border-green-600 bg-green-50/40 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery_zone"
                      value="outside"
                      checked={zone === 'outside'}
                      onChange={() => setZone('outside')}
                      className="text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <div className="text-left">
                      <span className="block font-black text-sm">ঢাকার বাইরে</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm">৳{deliveryOutside}</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
              <span className="text-sm font-black text-gray-800">পরিমাণ:</span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="w-10 h-10 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 rounded-lg font-black text-lg flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="font-mono font-black text-lg text-gray-900 w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-black text-lg flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>পণ্য মূল্য:</span>
                <span>৳{(salePrice * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-950 border-t border-gray-200 pt-2">
                <span>সর্বমোট বিল:</span>
                <span className="text-red-600 text-base">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-75 text-white font-black text-lg md:text-xl py-4 rounded-xl shadow-lg border-b-4 border-green-800 hover:shadow-xl transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <span>{loading ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
