import React from 'react';
import { CheckCircle2, ShieldCheck, Truck, RotateCcw, HeartHandshake } from 'lucide-react';

interface FeaturesProps {
  description?: string;
  features?: string[];
}

export default function Features({ description, features }: FeaturesProps) {
  const defaultFeatures = [
    '১০০% প্রিমিয়াম ও অরিজিনাল প্রোডাক্টের নিশ্চয়তা।',
    'সারা বাংলাদেশে ৩ থেকে ৫ দিনের মধ্যে দ্রুততম হোম ডেলিভারি।',
    'ডেলিভারি ম্যানের সামনে পণ্য চেক করে রিসিভ করার সুযোগ।',
    'যেকোনো ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে ৩ দিনের ফ্রি এক্সচেঞ্জ গ্যারান্টি।',
    'অত্যন্ত টেকসই এবং দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ।'
  ];

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Description */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
              <HeartHandshake className="w-5 h-5 text-red-600 mr-2" />
              কেন আমাদের থেকে পণ্যটি নিবেন?
            </h3>
            {description ? (
              <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            ) : (
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                আমাদের এই স্মার্ট ওয়াচটি অত্যন্ত প্রিমিয়াম কোয়ালিটি এবং স্টাইলিশ ডিজাইনের। আপনি এটি ক্যাজুয়াল বা ফরমাল যেকোনো পোশাকের সাথে অনায়াসে পরতে পারবেন। এর ফুল টাচ স্ক্রিন ডিসপ্লে অত্যন্ত স্মুথ এবং ব্রাইট। স্পোর্টস ট্র্যাকিং, হার্ট রেট মনিটর এবং ব্লুটুথ কলিং সহ প্রয়োজনীয় সব স্মার্ট ফিচার রয়েছে এতে। আজই অর্ডার করুন এবং উপভোগ করুন ধামাকা ডিসকাউন্ট!
              </p>
            )}
          </div>

          {/* Core Bullet Points */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
              প্রোডাক্টের বিশেষ সুবিধাসমূহ:
            </h3>
            <ul className="space-y-3">
              {displayFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm md:text-base text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Core Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs text-center flex flex-col items-center">
            <Truck className="w-8 h-8 text-red-600 mb-2 animate-bounce" />
            <span className="font-extrabold text-sm text-gray-900">সারা দেশে ডেলিভারি</span>
            <span className="text-[10px] text-gray-500 mt-1">৩-৫ কর্মদিবস</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs text-center flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-extrabold text-sm text-gray-900">ক্যাশ অন ডেলিভারি</span>
            <span className="text-[10px] text-gray-500 mt-1">হাতে পেয়ে টাকা দিন</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs text-center flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-amber-500 mb-2" />
            <span className="font-extrabold text-sm text-gray-900">সহজ রিটার্ন গ্যারান্টি</span>
            <span className="text-[10px] text-gray-500 mt-1">৩ দিনের পলিসি</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs text-center flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-blue-600 mb-2" />
            <span className="font-extrabold text-sm text-gray-900">১০০% আসল পণ্য</span>
            <span className="text-[10px] text-gray-500 mt-1">সেরা মান নিশ্চিত</span>
          </div>
        </div>
      </div>
    </section>
  );
}
