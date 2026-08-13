import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function StickyCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t md:hidden z-50">
      <button onClick={onClick} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 animate-bounce">
        <ShoppingCart className="w-5 h-5" />
        <span>অর্ডার করতে ক্লিক করুন</span>
      </button>
    </div>
  );
}
