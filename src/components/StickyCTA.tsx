import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface StickyCTAProps {
  salePrice: number;
  productTitle: string;
  onOrderClick: () => void;
}

export default function StickyCTA({ salePrice, productTitle, onOrderClick }: StickyCTAProps) {
  const isDates = productTitle?.includes('আজওয়া') || productTitle?.includes('খেজুর') || productTitle?.includes('Dates');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden py-3 px-4 flex items-center justify-between">
      <div className="text-left">
        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">অফার মূল্য:</span>
        <span className="block font-black text-red-600 text-lg">
          {isDates ? '৳১,৫৯০ - ৳৩,৬৯০' : `৳${salePrice.toLocaleString()}`}
        </span>
      </div>

      <button
        onClick={onOrderClick}
        className="bg-green-600 hover:bg-green-700 text-white font-black text-sm px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-1.5 border-b-2 border-green-800 transform active:scale-95 animate-pulse"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>অর্ডার করুন</span>
      </button>
    </div>
  );
}
