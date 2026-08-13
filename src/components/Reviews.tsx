import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '../lib/types';

interface ReviewsProps {
  reviews: Review[];
  satisfactionRecord?: string;
  satisfactionSubtext?: string;
  successCountText?: string;
}

export default function Reviews({ 
  reviews, 
  satisfactionRecord, 
  satisfactionSubtext, 
  successCountText 
}: ReviewsProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-black text-center text-gray-900 mb-8 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
          গ্রাহকদের মূল্যবান মতামত (রিভিউ)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed italic mb-4 font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-gray-200/60">
                <img
                  src={rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=random`}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-red-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs md:text-sm text-gray-900 truncate">{rev.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold truncate">{rev.location} • {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto text-center sm:text-left gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-black text-sm md:text-base text-gray-900">
                {satisfactionRecord || '৯৯.২% কাস্টমার সন্তুষ্টির রেকর্ড!'}
              </span>
              <span className="block text-[11px] text-gray-500 font-bold">
                {satisfactionSubtext || 'আমরা সবসময় সেরা কোয়ালিটির আসল পণ্য সরবরাহ করি।'}
              </span>
            </div>
          </div>
          <div className="text-green-700 font-black text-xs md:text-sm bg-green-100/80 px-3 py-1.5 rounded-lg border border-green-200">
            {successCountText || '১০,০০০+ সফল ডেলিভারি'}
          </div>
        </div>
      </div>
    </section>
  );
}
