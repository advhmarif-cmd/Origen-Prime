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
  promoTagline?: string;
  onOrderClick: () => void;
}

export default function Hero({
  title, subtitle, regularPrice, salePrice, discountPercentage, stockStatus, images = [], videoUrl, promoTagline, onOrderClick
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  
  // Set first image from DB as default active media
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; url: string }>({
    type: 'image',
    url: images[0] || ''
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
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const handleMediaChange = (type: 'image' | 'video', url: string) => {
    setActiveMedia({ type, url });
    setIsPlaying(false);
  };

  const isYouTube = (url: string) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (isYouTube(url)) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&rel=0`;
      }
    }
    return url;
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
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center bg-red-100 text-red-700 text-xs md:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider animate-bounce">
            <Flame className="w-4 h-4 mr-1.5 fill-red-600 stroke-red-600 animate-pulse" />
            {promoTagline || 'আজকের ধামাকা অফার - বিশেষ ছাড়!'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full bg-gray-950 rounded-2xl overflow-hidden shadow-md border border-gray-100">
              {activeMedia.type === 'video' && activeMedia.url ? (
                <div className="relative w-full h-full">
                  {isYouTube(activeMedia.url) ? (
                    <iframe
                      src={getEmbedUrl(activeMedia.url)}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Product Video"
                    ></iframe>
                  ) : (
                    <>
                      <video
                        id="hero-video"
                        src={activeMedia.url}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={(e) => togglePlay(e.currentTarget)}
                      />
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
                    </>
                  )}
                </div>
              ) : (
                <img
                  src={activeMedia.url || 'https://via.placeholder.com/600x600?text=No+Image'}
                  alt={title}
                  className="w-full h-full object-cover transition duration-300"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMediaChange('image', img)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                    activeMedia.type === 'image' && activeMedia.url === img ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">{title}</h1>
            <p className="text-gray-600 text-sm md:text-base font-medium">{subtitle}</p>
            <div className="text-3xl font-black text-red-600">
              ৳{salePrice} <span className="text-gray-400 line-through text-lg ml-2">৳{regularPrice}</span>
            </div>
            <button
              onClick={onOrderClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-4 rounded-xl shadow-lg transition transform active:scale-95"
            >
              অর্ডার করতে এখানে ক্লিক করুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
