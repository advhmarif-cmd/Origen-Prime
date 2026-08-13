import React from 'react';
import { Phone, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  phone: string;
  badges?: string[];
  onOrderClick: () => void;
}

export default function Navbar({ phone, badges, onOrderClick }: NavbarProps) {
  const { totalItems } = useCart();
  
  const defaultBadges = ['১০০% ক্যাশ অন ডেলিভারি', '৩ দিনের রিটার্ন পলিসি'];
  const displayBadges = badges && badges.length > 0 ? badges : defaultBadges;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo Section */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-10 w-10 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100">
            <img 
              src={logo} 
              alt="Origen Prime Logo" 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                // If logo fails to load, show a fallback text logo
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-gray-900 uppercase tracking-tighter leading-none">
              ORIGEN<span className="text-red-600">PRIME</span>
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Premium Quality</span>
          </div>
        </Link>

        {/* Dynamic Badges (Desktop) */}
        <div className="hidden lg:flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
          {displayBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {badge}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <a href={`tel:${phone}`} className="hidden sm:flex items-center space-x-1.5 bg-gray-100 px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition">
            <Phone className="w-3.5 h-3.5 text-red-600" />
            <span>{phone}</span>
          </a>
          
          {/* Cart Icon */}
          <Link to="/" className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={onOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 text-xs shadow-lg shadow-green-100 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </header>
  );
}
