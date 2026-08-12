import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Image as ImageIcon, Video } from 'lucide-react';

interface GalleryProps {
  images: string[];
  videoUrl?: string;
}

export default function Gallery({ images = [], videoUrl }: GalleryProps) {
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; url: string }>({
    type: 'image',
    url: images[0] || ''
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const fallbackImages = [
    '/images/ajwa-product-1.jpg',
    '/images/ajwa-product-2.jpg',
    '/images/ajwa-product-3.jpg'
  ];

  const galleryImages = images.length > 0 ? images : fallbackImages;
  const videoSource = videoUrl || '/videos/product-video.mp4';

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
      videoEl.play().catch(err => console.log('Video autoplay blocked:', err));
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-black text-center text-gray-900 mb-6 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-red-600 mr-2" />
          পণ্যটির আকর্ষণীয় ছবি ও ভিডিও গ্যালারি
        </h2>

        {/* Main Media Display Area */}
        <div className="relative aspect-video max-w-3xl mx-auto bg-gray-950 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          {activeMedia.type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                id="gallery-video"
                src={activeMedia.url}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onClick={(e) => togglePlay(e.currentTarget)}
              />
              {/* Play/Pause Overlay Button */}
              {!isPlaying && (
                <button
                  onClick={() => {
                    const el = document.getElementById('gallery-video') as HTMLVideoElement;
                    togglePlay(el);
                  }}
                  className="absolute inset-0 m-auto w-16 h-16 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              )}
              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center">
                <Video className="w-3.5 h-3.5 mr-1" />
                পণ্যটির ভিডিও
              </div>
            </div>
          ) : (
            <img
              src={activeMedia.url}
              alt="Active Product Thumbnail"
              className="w-full h-full object-cover transition duration-300"
            />
          )}
        </div>

        {/* Thumbnails Navigation Row */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-4">
          {/* Images Thumbnails */}
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleMediaChange('image', img)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition ${
                activeMedia.type === 'image' && activeMedia.url === img
                  ? 'border-red-600 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}

          {/* Video Thumbnail (if video exists) */}
          {videoSource && (
            <button
              onClick={() => handleMediaChange('video', videoSource)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-gray-950 flex flex-col items-center justify-center transition ${
                activeMedia.type === 'video'
                  ? 'border-red-600 scale-105 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Play className="w-5 h-5 text-red-600 fill-red-600" />
              <span className="text-[9px] font-black text-white uppercase tracking-wider mt-1">ভিডিও</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
