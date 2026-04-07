'use client';

import React, { useState, useRef } from 'react';

interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  discount?: number;
}

export const ProductImageGallery = ({ images, productName, discount = 0 }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images.find(img => img.isPrimary) || images[0]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate position relative to the element
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      {/* Main Image with Zoom Wrapper */}
      <div 
        ref={containerRef}
        className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative cursor-zoom-in border border-gray-100 shadow-sm transition-shadow hover:shadow-md"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={activeImage.url} 
          alt={productName} 
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isZooming ? 'md:scale-[2.5]' : 'scale-100'}`}
          style={isZooming ? {
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          } : undefined}
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 animate-pulse">
              {discount}% OFF
            </div>
          </div>
        )}
        
        {/* Interactive indicator for Zoom */}
        <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          HOVER TO ZOOM
        </div>

        {/* Mobile Page Indicator */}
        <div className="absolute bottom-4 right-4 md:hidden bg-black/40 backdrop-blur-md rounded-full px-3 py-1 text-[11px] font-medium text-white">
          {images.indexOf(activeImage) + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Selection */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img)}
              onMouseEnter={() => setActiveImage(img)} // Premium touch: switch on hover too
              className={`aspect-square rounded-xl overflow-hidden bg-white border-2 p-1 transition-all group ${
                activeImage.id === img.id 
                ? 'border-brand-600 shadow-lg ring-4 ring-brand-600/10' 
                : 'border-transparent hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img 
                  src={img.url} 
                  alt="Product view" 
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${activeImage.id === img.id ? 'opacity-100 scale-105' : 'opacity-60 group-hover:opacity-100'}`} 
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
