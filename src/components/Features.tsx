import React from 'react';
import { CheckCircle2, ShieldCheck, Truck, RotateCcw, HeartHandshake } from 'lucide-react';
import { TrustBadge } from '../lib/types';

interface FeaturesProps {
  description?: string;
  features?: string[];
  trustBadges?: TrustBadge[];
}

const IconMap = {
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HeartHandshake
};

export default function Features({ description, features, trustBadges }: FeaturesProps) {
  const displayFeatures = features || [];

  const defaultTrustBadges: TrustBadge[] = [
    { icon: 'Truck', title: 'সারা দেশে ডেলিভারি', subtitle: '১-২ কর্মদিবস' },
    { icon: 'ShieldCheck', title: 'ক্যাশ অন ডেলিভারি', subtitle: 'হাতে পেয়ে টাকা দিন' },
    { icon: 'RotateCcw', title: 'সহজ রিটার্ন গ্যারান্টি', subtitle: '৩ দিনের পলিসি' },
    { icon: 'CheckCircle2', title: '১০০% আসল পণ্য', subtitle: 'সেরা মান নিশ্চিত' }
  ];

  const displayTrustBadges = trustBadges && trustBadges.length > 0 ? trustBadges : defaultTrustBadges;

  return (
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Description */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
              <HeartHandshake className="w-5 h-5 text-red-600 mr-2" />
              কেন আমাদের থেকে নিবেন?
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
              {description || 'পণ্যের বিবরণ শীঘ্রই আসছে...'}
            </p>
          </div>

          {/* Core Bullet Points */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
              প্রোডাক্টের বিশেষ সুবিধাসমূহ:
            </h3>
            <ul className="space-y-3">
              {displayFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm md:text-base text-gray-700 font-bold bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
              {displayFeatures.length === 0 && (
                <li className="text-gray-400 italic text-sm">কোনো বৈশিষ্ট্য যুক্ত করা হয়নি।</li>
              )}
            </ul>
          </div>
        </div>

        {/* Core Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {displayTrustBadges.map((badge, idx) => {
            const IconComponent = IconMap[badge.icon] || CheckCircle2;
            return (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs text-center flex flex-col items-center">
                <IconComponent className={`w-8 h-8 ${badge.icon === 'Truck' ? 'text-red-600 animate-bounce' : 'text-green-600'} mb-2`} />
                <span className="font-extrabold text-sm text-gray-900 leading-tight">{badge.title}</span>
                <span className="text-[10px] text-gray-500 mt-1 font-bold">{badge.subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
