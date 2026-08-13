import React from 'react';
import { MessageCircle, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/types';

interface StickyCTAProps {
  product: Product;
  onOrderClick: () => void;
}

export default function StickyCTA({ product, onOrderClick }: StickyCTAProps) {
  const { addToCart } = useCart();
  const whatsappNumber = product.phone_number || "8801709929310";
  const message = encodeURIComponent(`হ্যালো, আমি এই পণ্যটি অর্ডার করতে চাই: ${product.title}\nমূল্য: ৳${product.sale_price.toLocaleString()}`);
  
  return (
    <div className="fixed bottom-0 left-0 w-full p-3 bg-white/95 backdrop-blur-md border-t border-gray-100 md:hidden z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.1)] flex gap-2">
      {/* WhatsApp */}
      <a 
        href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-[0.6] bg-[#25D366] text-white py-3 rounded-2xl flex items-center justify-center transition transform active:scale-95 shadow-lg shadow-green-100"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
      </a>

      {/* Add to Cart */}
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 bg-gray-900 text-white font-black py-3 rounded-2xl flex items-center justify-center space-x-2 text-[10px] uppercase tracking-wider transition transform active:scale-95 shadow-lg shadow-gray-200"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>কার্ট</span>
      </button>

      {/* Direct Order */}
      <button 
        onClick={onOrderClick}
        className="flex-[1.5] bg-red-600 text-white font-black py-3 rounded-2xl flex items-center justify-center space-x-2 text-xs uppercase tracking-widest transition transform active:scale-95 shadow-lg shadow-red-200 animate-pulse"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>অর্ডার করুন</span>
      </button>
    </div>
  );
}
