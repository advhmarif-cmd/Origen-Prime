import React from 'react';
import { CheckCircle, Printer, ShoppingBag, X } from 'lucide-react';

interface SuccessModalProps {
  order: any;
  onClose: () => void;
}

export default function SuccessModal({ order, onClose }: SuccessModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header section */}
        <div className="bg-green-600 text-white text-center py-6 px-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/10 text-white border-2 border-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black">আপনার অর্ডারটি সফল হয়েছে!</h2>
          <p className="text-xs md:text-sm font-medium text-green-100 mt-1">
            অর্ডারটি নিশ্চিত করতে আমাদের প্রতিনিধি শীঘ্রই আপনাকে কল করবেন।
          </p>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-5 print:p-0">
          
          {/* Logo & Company Name */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <img
                src="/images/logo.png"
                alt="ORIGEN PRIME"
                className="h-9 w-9 object-cover rounded-lg border border-gray-100"
              />
              <div>
                <span className="block font-black text-sm text-gray-900 uppercase">ORIGEN <span className="text-red-600">PRIME</span></span>
                <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider -mt-0.5">Premium Quality Products</span>
              </div>
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-md">ক্যাশ অন ডেলিভারি</span>
          </div>
          
          {/* Order Meta */}
          <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-gray-700">
            <div>
              <span className="block text-gray-400">অর্ডার নাম্বার</span>
              <span className="text-sm text-gray-900 font-mono">#{order.id}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-400">অর্ডারের তারিখ</span>
              <span className="text-sm text-gray-900">
                {new Date(order.created_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">ডেলিভারি বিবরণ:</h3>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-xs font-bold text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400">নাম:</span>
                <span className="text-gray-900">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">মোবাইল:</span>
                <span className="text-gray-900">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ঠিকানা:</span>
                <span className="text-gray-900 text-right max-w-[200px] truncate">{order.customer_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">পেমেন্ট পদ্ধতি:</span>
                <span className="text-green-600">ক্যাশ অন ডেলিভারি (COD)</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">অর্ডার সারাংশ:</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex justify-between text-[11px] font-black text-gray-500 border-b border-gray-100">
                <span>আইটেম</span>
                <span>মোট</span>
              </div>
              <div className="px-4 py-3 space-y-2.5 text-xs font-bold text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-extrabold">
                    {order.product_title} <span className="text-gray-400">x {order.quantity}</span>
                  </span>
                  <span>৳{((order.total_amount - order.delivery_charge)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ডেলিভারি চার্জ:</span>
                  <span>৳{order.delivery_charge}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2.5 text-sm font-black text-gray-950">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-red-600">৳{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>রসিদ প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition text-sm flex items-center justify-center space-x-1.5 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কেনাকাটা চালিয়ে যান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
