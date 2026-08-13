import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function StickyCTA({ title }: { title: string }) {
  const whatsappNumber = "8801709929310";
  const message = encodeURIComponent(`আমি ORIGEN PRIME থেকে ${title} কিনতে চাই।`);
  
  return (
    <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t border-gray-200 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] text-white font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 text-sm active:scale-95 transition"
      >
        <MessageCircle className="w-5 h-5" />
        <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
      </a>
    </div>
  );
}
