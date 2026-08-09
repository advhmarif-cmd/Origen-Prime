import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';

export default function Reviews() {
  const reviewsList = [
    {
      name: 'মোঃ আরিফুর রহমান',
      location: 'মিরপুর, ঢাকা',
      rating: 5,
      comment: 'সত্যি অসাধারণ। হুবহু ছবির মতোই প্রিমিয়াম কোয়ালিটি। ধন্যবাদ সেলারকে!',
      date: '২ দিন আগে',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'সাদিয়া আক্তার',
      location: 'চকবাজার, চট্টগ্রাম',
      rating: 5,
      comment: 'অর্ডার করার ১ দিনের মধ্যে ডেলিভারি পেয়েছি। ডেলিভারি ম্যানের সামনে খুলে দেখে নিয়েছি। খুবই সন্তুষ্ট!',
      date: '৫ দিন আগে',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'রাসেল আহমেদ',
      location: 'উপশহর, সিলেট',
      rating: 5,
      comment: 'এই বাজেটে এর চেয়ে ভালো আজওয়া খেজুর আর হতে পারে না। কম সময় লাগে। রিকমেন্ডেড!',
      date: '১ সপ্তাহ আগে',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-black text-center text-gray-900 mb-8 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
          গ্রাহকদের মূল্যবান মতামত (রিভিউ)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-2xs">
              <div>
                {/* Rating Stars */}
                <div className="flex text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>
                {/* Comment */}
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center space-x-3 pt-3 border-t border-gray-200/60">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-red-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs md:text-sm text-gray-900 truncate">{rev.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium truncate">{rev.location} • {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Review Analytics Badge */}
        <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto text-center sm:text-left gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-black text-sm md:text-base text-gray-900">৯৯.২% কাস্টমার সন্তুষ্টির রেকর্ড!</span>
              <span className="block text-[11px] text-gray-500 font-medium">আমরা সবসময় সেরা কোয়ালিটির আসল পণ্য সরবরাহ করি।</span>
            </div>
          </div>
          <div className="text-green-700 font-black text-xs md:text-sm bg-green-100/80 px-3 py-1.5 rounded-lg border border-green-200">
            ১০,০০০+ সফল ডেলিভারি
          </div>
        </div>
      </div>
    </section>
  );
}
