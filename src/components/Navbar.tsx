import { SITE_CONFIG } from "../lib/config";
import React, { useState } from 'react';
import { Phone, ShoppingCart, ShoppingBag, X, Trash2, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logo.png';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  phone: string;
  logoUrl?: string;
  badges?: string[];
  onOrderClick: () => void;
}

export default function Navbar({ phone, logoUrl, badges, onOrderClick }: NavbarProps) {
  const { cart, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const defaultBadges = ['১০০% ক্যাশ অন ডেলিভারি', '৩ দিনের রিটার্ন পলিসি'];
  const displayBadges = badges && badges.length > 0 ? badges : defaultBadges;

  const handleWhatsAppCheckout = () => {
    const itemsList = cart.map(item => `${item.title} (x${item.quantity}) - ৳${(item.sale_price * item.quantity).toLocaleString()}`).join('\n');
    const message = encodeURIComponent(`হ্যালো, আমি নিচের পণ্যগুলো অর্ডার করতে চাই:\n\n${itemsList}\n\nসর্বমোট মূল্য: ৳${totalPrice.toLocaleString()}\n\nআমার ডেলিভারি ডিটেইলস দিন...`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo Section */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-10 w-10 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100">
            <img 
              src={logoUrl || defaultLogo} 
              alt="Logo" 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = defaultLogo;
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
          
          {/* Cart Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={onOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 text-xs shadow-lg shadow-green-100 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">অর্ডার করুন</span>
          </button>
        </div>
      </div>

      {/* --- CART DRAWER OVERLAY --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-900">আপনার কার্ট</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalItems} টি পণ্য যোগ করা হয়েছে</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-50 p-6 rounded-full"><ShoppingBag className="w-12 h-12 text-gray-200" /></div>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">কার্ট বর্তমানে খালি আছে</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-red-600 font-black text-sm hover:underline">কেনাকাটা শুরু করুন</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 group">
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-xs line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{item.category}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-red-600 font-black text-sm">৳{item.sale_price.toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">সর্বমোট মূল্য</span>
                  <span className="text-2xl font-black text-gray-900">৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="bg-[#25D366] hover:bg-[#1fb355] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>WhatsApp</span>
                  </button>
                  <Link 
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <span>অর্ডার করুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <button onClick={clearCart} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition">কার্ট খালি করুন</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
