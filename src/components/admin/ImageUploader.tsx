'use client';

import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  name: string;
  multiple?: boolean;
  existingImages?: { id: number; url: string; isPrimary: boolean }[];
}

export const ImageUploader = ({ label, name, multiple = false, existingImages = [] }: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>(existingImages.map(img => img.url));
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages.map(img => img.url));
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show local previews immediately
    const localPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      localPreviews.push(URL.createObjectURL(files[i]));
    }

    if (multiple) {
      setPreviews(prev => [...prev, ...localPreviews]);
    } else {
      setPreviews(localPreviews);
    }

    // Upload to server
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.urls) {
        if (multiple) {
          setUploadedUrls(prev => [...prev, ...data.urls]);
        } else {
          setUploadedUrls(data.urls);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Hidden inputs to pass URLs to form */}
      {uploadedUrls.map((url, i) => (
        <input key={i} type="hidden" name={name} value={url} />
      ))}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className={`grid ${multiple ? 'grid-cols-3' : 'grid-cols-1'} gap-3 mb-2`}>
          {previews.map((preview, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ×
              </button>
              {!multiple && (
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">Thumbnail</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 text-sm text-gray-500 hover:text-brand-600 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {multiple ? 'Add Gallery Images' : 'Upload Thumbnail'}
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
