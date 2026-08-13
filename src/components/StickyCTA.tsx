
import React from 'react';
import { MessageCircle, ShoppingCart } from 'lucide-react';

interface StickyCTAProps {
  productTitle: string;
  salePrice: number;
  whatsappNumber?: string;
  onOrderClick: () => void;
}

export default function StickyCTA({ 
  productTitle, 
  salePrice, 
  whatsappNumber = "8801709929310", 
  onOrderClick 
}: StickyCTAProps) {
  const message = encodeURIComponent(`হ্যালো, আমি এই পণ্যটি অর্ডার করতে চাই: ${productTitle}\nমূল্য: ৳${salePrice.toLocaleString()}`);
  
  return (
    <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t border-gray-200 md:hidden z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex gap-3">
      {/* WhatsApp Button */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#25D366] text-white font-black py-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition transform active:scale-95 shadow-lg shadow-green-200"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>হোয়াটসঅ্যাপে অর্ডার</span>
      </a>

      {/* Order Now Button */}
      <button 
        onClick={onOrderClick}
        className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl flex items-center justify-center space-x-2 text-xs transition transform active:scale-95 shadow-lg shadow-red-200"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>অর্ডার করুন</span>
      </button>
    </div>
  );
}
