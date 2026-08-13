import React from 'react';
import { Phone, CheckCircle, ShieldCheck, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  phone: string;
  onOrderClick: () => void;
}

export default function Navbar({ phone, onOrderClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo - Simplified Path */}
        <div className="flex items-center space-x-2.5">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-11 w-11 object-cover rounded-lg border border-gray-100 shadow-xs"
          />
          <div>
            <span className="font-black text-lg text-gray-950 tracking-tight block uppercase">
              ORIGEN<span className="text-red-600">PRIME</span>
            </span>
            <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest -mt-1">
              Premium Quality Products
            </span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1 text-xs md:text-sm shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </header>
  );
}
