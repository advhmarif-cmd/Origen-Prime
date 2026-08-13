import React from 'react';
import { Phone, ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';

interface NavbarProps {
  phone: string;
  onOrderClick: () => void;
}

export default function Navbar({ phone, onOrderClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <img src={logo} alt="Logo" className="h-11 w-11 object-cover rounded-lg" />
          <span className="font-black text-lg text-gray-950 uppercase">ORIGEN<span className="text-red-600">PRIME</span></span>
        </div>
        <button onClick={onOrderClick} className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm">অর্ডার করুন</button>
      </div>
    </header>
  );
}
