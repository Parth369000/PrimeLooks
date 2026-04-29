'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const DEFAULT_BACKGROUNDS = [
  '/images/immersive-watch-bg.png',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2000&auto=format&fit=crop',
];

interface HeroVideoSliderProps {
  images?: string[];
}

export function HeroVideoSlider({ images = [] }: HeroVideoSliderProps) {
  const activeImages = images.length > 0 ? images : DEFAULT_BACKGROUNDS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Auto-slide every 5 seconds for a smoother luxury feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeImages.length]);

  return (
    <section className="relative w-full h-screen min-h-[100svh] overflow-hidden bg-gray-950 flex flex-col items-center justify-center">
      <style>{`
        /* Replaced volatile keyframes with stable native Tailwind transition states for flawless cross-fading */
      `}</style>

      {/* Full Screen Background Slider */}
      {activeImages.map((src, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-60 z-10' : 'opacity-0 z-0'}`}
        >
          <Image
            src={src}
            alt={`Luxury Watch Cinematic Background ${index + 1}`}
            fill
            sizes="100vw"
            quality={90}
            priority={index === 0}
            unoptimized={src.startsWith('http')}
            style={{ objectPosition: 'center center' }}
            className={`object-cover transition-transform duration-[10000ms] ease-out will-change-transform ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30 z-0 pointer-events-none" />

      {/* Overlay Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center text-left flex-1 pt-20">
        
        {/* Left Aligned Text Content */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 rounded-full border border-amber-500/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          The Watch Showcase
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-2xl shadow-black/50">
          Luxury on <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
            Your Wrist.
          </span>
        </h1>
        
        <p className="text-xl text-gray-200 max-w-2xl mb-10 drop-shadow-lg font-light leading-relaxed">
          Discover a curated collection of breathtaking timepieces. Meticulously crafted for the modern visionary and classic collector alike.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-start items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => {
              const section = document.getElementById('featured');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-amber-500 text-black font-semibold text-lg hover:bg-amber-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
          >
            Explore Collection
          </button>
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 text-white font-semibold text-lg hover:bg-white/10 active:scale-95 transition-all border border-white/20 backdrop-blur-md hover:border-white/40 shadow-lg"
          >
            Watch The Film
          </button>
        </div>
      </div>

      {/* Bottom Slider Controls */}
      <div className="relative z-20 pb-12 flex justify-center items-center gap-3 w-full">
        {activeImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-700 ease-in-out rounded-full h-2.5 ${
              index === currentIndex 
                ? 'w-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to background slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Cinematic Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg transition-all duration-500" onClick={() => setIsVideoOpen(false)}>
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer z-[110]"
          >
            <span className="sr-only">Close Video</span>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video px-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <video 
              className="w-full h-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black border border-white/10 object-cover"
              controls
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
