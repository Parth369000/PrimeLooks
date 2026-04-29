'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Reveal } from './Reveal';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeImages.length]);

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gray-950">
      {activeImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'z-10 opacity-70' : 'z-0 opacity-0'
          }`}
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
            className={`object-cover transition-transform duration-[10000ms] ease-out will-change-transform ${
              index === currentIndex ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.18),rgba(5,8,12,0.86)),radial-gradient(circle_at_16%_18%,rgba(245,158,11,0.24),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.12),transparent_24%)]" />
      <div className="luxury-shimmer pointer-events-none absolute inset-0 z-0 opacity-25" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-28 pb-24 text-left sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div>
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                Signature Watches For Everyday Presence
              </span>
            </Reveal>

            <Reveal delayMs={120}>
              <h1 className="mb-6 max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-2xl shadow-black/50 md:text-7xl">
                Luxury on <br />
                <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                  Your Wrist.
                </span>
              </h1>
            </Reveal>

            <Reveal delayMs={220}>
              <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-gray-200 drop-shadow-lg md:text-xl">
                Discover standout watches chosen to elevate daily style, gifting moments, and the
                confidence that comes with wearing something that looks considered.
              </p>
            </Reveal>

            <Reveal delayMs={320} className="w-full">
              <div className="flex w-full flex-col items-stretch justify-start gap-4 sm:w-auto sm:flex-row sm:items-center">
                <button
                  onClick={() => {
                    const section = document.getElementById('featured');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full rounded-full bg-amber-500 px-10 py-4 text-lg font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95 sm:w-auto"
                >
                  Explore Collection
                </button>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-10 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 active:scale-95 sm:w-auto"
                >
                  Watch The Film
                </button>
              </div>
            </Reveal>

            <Reveal delayMs={420} className="mt-10 w-full">
              <div className="grid max-w-2xl grid-cols-1 gap-3 text-white/75 sm:grid-cols-3">
                {[
                  ['Statement Picks', 'Pieces selected to add polish, confidence, and presence'],
                  ['Easy Discovery', 'A cleaner browsing flow that keeps attention on the watch'],
                  ['Personal Support', 'Fast WhatsApp confirmation when you are ready to order'],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="group rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl transition-all duration-300 hover:border-amber-300/30 hover:bg-black/26"
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200/95">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/68">{description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden text-xs uppercase tracking-[0.24em] text-white/45 md:block">
            Scroll to discover curated releases
          </div>
          <div className="flex flex-1 justify-center gap-3 md:justify-end">
            {activeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-2.5 rounded-full transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'w-12 bg-white/20'
                    : 'w-2.5 bg-white/35 hover:bg-white/70'
                }`}
                aria-label={`Go to background slide ${index + 1}`}
              >
                {index === currentIndex ? (
                  <span
                    key={currentIndex}
                    className="animate-slider-progress absolute inset-y-0 left-0 rounded-full bg-amber-400"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
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
