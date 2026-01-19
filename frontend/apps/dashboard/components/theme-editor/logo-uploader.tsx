'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { Button } from '@pos-saas/ui';

interface LogoUploaderProps {
  logoUrl: string;
  onLogoChange: (url: string) => void;
}

export function LogoUploader({ logoUrl, onLogoChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(logoUrl || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);

      // TODO: Replace with actual upload endpoint
      // For now, create a local preview using FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onLogoChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // In production, upload to server:
      // const response = await fetch('/api/upload/logo', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // if (data.success) {
      //   onLogoChange(data.url);
      //   setPreview(data.url);
      // } else {
      //   setError(data.message);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload logo
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Logo Preview */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 min-h-[120px]">
            <img
              src={preview}
              alt="Logo preview"
              className="max-h-[100px] max-w-full object-contain"
            />
          </div>

          {/* Change Button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Change Logo'}
          </Button>

          {/* Clear Button */}
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="h-4 w-4 mr-2" />
            Remove Logo
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 Recommended: Square logo (1:1 aspect ratio) for best results
        </p>
      </div>
    </div>
  );
}
