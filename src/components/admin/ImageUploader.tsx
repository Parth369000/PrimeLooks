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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Upload failed with status ${res.status}`);
      }

      if (data.urls && data.urls.length > 0) {
        if (multiple) {
          setUploadedUrls(prev => [...prev, ...data.urls]);
        } else {
          setUploadedUrls(data.urls);
        }
        setPendingFiles([]);
      } else {
        throw new Error('No URLs returned from upload');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      console.error('Upload failed:', message);
      setUploadError(message);
      // Keep pending files so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Show local previews immediately
    const localPreviews: string[] = [];
    for (const file of fileArray) {
      localPreviews.push(URL.createObjectURL(file));
    }

    if (multiple) {
      setPreviews(prev => [...prev, ...localPreviews]);
      setPendingFiles(prev => [...prev, ...fileArray]);
    } else {
      setPreviews(localPreviews);
      setPendingFiles(fileArray);
    }

    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = '';

    // Upload to Cloudinary
    await uploadFiles(fileArray);
  };

  const retryUpload = async () => {
    if (pendingFiles.length > 0) {
      await uploadFiles(pendingFiles);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  const isReady = uploadedUrls.length > 0 && !isUploading;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Hidden inputs to pass URLs to form */}
      {uploadedUrls.map((url, i) => (
        <input key={i} type="hidden" name={name} value={url} />
      ))}

      {/* Upload Status Banner */}
      {isUploading && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Uploading to cloud storage...</span>
        </div>
      )}

      {/* Error Banner */}
      {uploadError && (
        <div className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={retryUpload}
            className="px-2 py-1 text-xs font-medium bg-red-100 hover:bg-red-200 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success Indicator */}
      {isReady && !uploadError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{uploadedUrls.length} image{uploadedUrls.length > 1 ? 's' : ''} ready</span>
        </div>
      )}

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
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {multiple ? 'Add Gallery Images' : 'Upload Thumbnail'}
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
