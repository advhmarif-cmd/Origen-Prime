import React, { useState, useEffect } from 'react';
import { ShoppingCart, Flame, ShieldAlert, Award, Star, Play, Volume2, VolumeX, Video } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  regularPrice: number | string;
  salePrice: number | string;
  discountPercentage: number | string;
  stockStatus: string;
  images: string[];
  videoUrl?: string;
  onOrderClick: () => void;
}

export default function Hero({
  title, subtitle, regularPrice, salePrice, discountPercentage, stockStatus, images = [], videoUrl, onOrderClick
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; url: string }>({
    type: 'image',
    url: images[0] || '/images/logo.png'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (images.length > 0) setActiveMedia({ type: 'image', url: images[0] });
  }, [images]);

  return (
    <section className="bg-white pt-6 pb-12 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <div className="text-2xl font-bold text-red-600 mb-6">
          ৳{salePrice} <span className="text-gray-400 line-through text-lg">৳{regularPrice}</span>
        </div>
        <button onClick={onOrderClick} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold">
          অর্ডার করুন
        </button>
      </div>
    </section>
  );
}
