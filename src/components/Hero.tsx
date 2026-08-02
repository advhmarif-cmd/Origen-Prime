import React, { useState, useEffect } from 'react';
import { ShoppingCart, Flame, ShieldAlert, Award, Star, Play, Volume2, VolumeX, Video, Image as ImageIcon } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  stockStatus: string;
  images: string[];
  videoUrl?: string;
  onOrderClick: () => void;
}

export default function Hero({
  title,
  subtitle,
  regularPrice,
  salePrice,
  discountPercentage,
  stockStatus,
  images = [],
  videoUrl,
  onOrderClick
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  
  // Gallery Media States
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; url: string }>({
    type: 'image',
    url: images[0] || '/images/dates-1.jpg'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setActiveMedia({ type: 'image', url: images[0] });
    }
  }, [images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');
  const isDates = title.includes('আজওয়া') || title.includes('খেজুর') || title.includes('Dates');

  const handleMediaChange = (type: 'image' | 'video', url: string) => {
    setActiveMedia({ type, url });
    setIsPlaying(false);
  };

  const togglePlay = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play().catch(err => console.log('Video play blocked:', err));
      setIsPlaying(true);
    }
  };

  return (
    <section className="bg-gradient-to-b from-red-50/30 via-white to-white pt-6 pb-12 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Promotional Tag */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center bg-red-100 text-red-700 text-xs md:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider animate-bounce">
            <Flame className="w-4 h-4 mr-1.5 fill-red-600 stroke-red-600 animate-pulse" />
            আজকের ধামাকা অফার - বিশেষ ছাড়!
          </span>
        </div>

        {/* Unified 2-Column Landing Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Image/Video Interactive Gallery (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Media Viewer */}
            <div className="relative aspect-square w-full bg-gray-950 rounded-2xl overflow-hidden shadow-md border border-gray-100">
              {activeMedia.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    id="hero-video"
                    src={activeMedia.url}
                    className="w-full h-full object-cover"
                    loop
                    muted={isMuted}
                    playsInline
                    onClick={(e) => togglePlay(e.currentTarget)}
                  />
                  {/* Play Overlay Button */}
                  {!isPlaying && (
                    <button
                      onClick={() => {
                        const el = document.getElementById('hero-video') as HTMLVideoElement;
                        togglePlay(el);
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 bg-red-600/95 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110"
                    >
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </button>
                  )}
                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    পণ্যটির ভিডিও
                  </div>
                </div>
              ) : (
                <img
                  src={activeMedia.url}
                  alt="Origen Prime Product"
                  className="w-full h-full object-cover transition duration-300"
                />
              )}
            </div>

            {/* Thumbnails row */}
            <div className="flex flex-wrap gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMediaChange('image', img)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-14 rounded-xl overflow-hidden border-2 transition ${
                    activeMedia.type === 'image' && activeMedia.url === img
                      ? 'border-red-600 scale-105 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {videoUrl && (
                <button
                  onClick={() => handleMediaChange('video', videoUrl)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-14 rounded-xl overflow-hidden border-2 bg-gray-950 flex flex-col items-center justify-center transition ${
                    activeMedia.type === 'video'
                      ? 'border-red-600 scale-105 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Play className="w-4 h-4 text-red-600 fill-red-600" />
                  <span className="text-[8px] font-black text-white uppercase tracking-wider mt-0.5">ভিডিও</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Badges, Price, Timer & CTA (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5 lg:space-y-6">
            
            {/* Headings */}
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-2.5">
                {title}
              </h1>
              <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Rating and Stock Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-md font-bold">
                <div className="flex text-amber-500 mr-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>
                ৪.৯/৫ (১২৮+ রিভিউ)
              </div>

              <span className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-md font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-ping"></span>
                {stockStatus || 'In Stock'}
              </span>

              <span className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-md font-bold flex items-center">
                <ShieldAlert className="w-3 h-3 mr-1 text-red-600" />
                সীমিত স্টক
              </span>
            </div>

            {/* Pricing Box & Urgency Timer Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-100 shadow-xl rounded-2xl p-5 md:p-6">
              
              {/* Pricing Box */}
              <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left border-b sm:border-b-0 sm:border-r border-gray-100 pb-5 sm:pb-0 sm:pr-5 w-full">
                {isDates ? (
                  <div className="space-y-3 w-full">
                    <div className="bg-red-50/60 border border-red-100 p-2.5 rounded-xl flex items-center justify-between w-full">
                      <div>
                        <span className="block text-[10px] font-black text-gray-500">২ কেজি প্রিমিয়াম প্যাক:</span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xl font-black text-red-600">৳১,৫৯০</span>
                          <span className="text-[11px] font-bold text-gray-400 line-through">৳২,৪০০</span>
                        </div>
                      </div>
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        ৩৪% ছাড়
                      </span>
                    </div>
                    <div className="bg-green-50/60 border border-green-100 p-2.5 rounded-xl flex items-center justify-between w-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-bl-md uppercase">
                        সেরা ডিল
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-gray-500">৫ কেজি ফ্যামিলি প্যাক:</span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xl font-black text-green-700">৳৩,৬৯০</span>
                          <span className="text-[11px] font-bold text-gray-400 line-through">৳৬,০০০</span>
                        </div>
                      </div>
                      <span className="bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        ৩৯% ছাড়
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <span className="text-gray-500 text-xs font-semibold line-through">
                      পূর্বের মূল্য: ৳{regularPrice.toLocaleString()}
                    </span>
                    <div className="flex items-baseline justify-center sm:justify-start space-x-2 mt-1">
                      <span className="text-3xl md:text-4xl font-black text-red-600">
                        ৳{salePrice.toLocaleString()}
                      </span>
                      <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                        {discountPercentage}% ছাড়
                      </span>
                    </div>
                  </div>
                )}
                <p className="text-green-600 font-extrabold text-xs mt-3 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 shrink-0" />
                  আজ অর্ডার করলে পাচ্ছেন বিশেষ অফার!
                </p>
              </div>

              {/* Urgency Timer */}
              <div className="flex flex-col justify-center items-center text-center py-1">
                <span className="text-gray-700 text-[10px] md:text-xs font-black mb-2.5 flex items-center uppercase tracking-wider">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-ping"></span>
                  অফারটি শেষ হতে সময় বাকি আছে:
                </span>
                <div className="flex items-center space-x-2.5">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-950 text-white font-mono font-black text-xl md:text-2xl px-2.5 py-1.5 rounded-lg shadow-inner min-w-[42px]">
                      {formatTime(timeLeft.hours)}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">ঘণ্টা</span>
                  </div>
                  <span className="text-lg font-black text-gray-800 -mt-4">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-950 text-white font-mono font-black text-xl md:text-2xl px-2.5 py-1.5 rounded-lg shadow-inner min-w-[42px]">
                      {formatTime(timeLeft.minutes)}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">মিনিট</span>
                  </div>
                  <span className="text-lg font-black text-gray-800 -mt-4">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-red-600 text-white font-mono font-black text-xl md:text-2xl px-2.5 py-1.5 rounded-lg shadow-inner min-w-[42px] animate-pulse">
                      {formatTime(timeLeft.seconds)}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">সেকেন্ড</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="pt-2">
              <button
                onClick={onOrderClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-base md:text-lg px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center space-x-2.5 border-b-4 border-green-800 transform active:scale-95"
              >
                <ShoppingCart className="w-5.5 h-5.5 animate-bounce" />
                <span>অর্ডার করতে এখানে ক্লিক করুন</span>
              </button>
              <span className="block text-[10px] md:text-xs font-bold text-gray-500 mt-2 text-center">
                সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন)
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
