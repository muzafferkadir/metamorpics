'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import Image from 'next/image';

// Types for dynamic imports
interface ImageCompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker?: boolean;
  maxIteration?: number;
  exifOrientation?: number;
  fileType?: string;
  initialQuality?: number;
  alwaysKeepResolution?: boolean;
}

type ImageCompressionType = (file: File, options: ImageCompressionOptions) => Promise<File>;

interface FormatOption {
  value: string;
  label: string;
}

interface FormatCategories {
  [key: string]: FormatOption[];
}

interface HeicToOptions {
  blob: Blob;
  type: string;
  quality?: number;
}

type HeicToType = (options: HeicToOptions) => Promise<Blob>;
type IsHeicType = (file: File) => Promise<boolean>;

// Client-side only imports
let imageCompression: ImageCompressionType | null = null;
let heicTo: HeicToType | null = null;
let isHeic: IsHeicType | null = null;

if (typeof window !== 'undefined') {
  import('browser-image-compression').then(module => {
    imageCompression = module.default;
  });
  import('heic-to').then(module => {
    heicTo = module.heicTo;
    isHeic = module.isHeic;
  });
}

const STANDARD_FORMATS: FormatCategories = {
  'Yaygın Formatlar': [
    { value: 'image/jpeg', label: 'JPEG/JPG - En yaygın fotoğraf formatı' },
    { value: 'image/png', label: 'PNG - Kayıpsız sıkıştırma' },
    { value: 'image/gif', label: 'GIF - Animasyon desteği' },
  ],
  'Modern Web Formatları': [
    { value: 'image/webp', label: 'WebP - Modern web için optimize' },
    { value: 'image/avif', label: 'AVIF - AV1 tabanlı yeni nesil format' },
  ],
  'Temel Formatlar': [
    { value: 'image/bmp', label: 'BMP - Windows Bitmap' },
    { value: 'image/tiff', label: 'TIFF - Yüksek kaliteli baskı' },
  ]
};

const HEIC_FORMATS: FormatCategories = {
  'HEIC Dönüşüm Formatları': [
    { value: 'image/jpeg', label: 'JPEG/JPG - En yaygın fotoğraf formatı' },
    { value: 'image/png', label: 'PNG - Kayıpsız sıkıştırma' },
  ]
};

export default function Home() {
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState('image/jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isHeicFile, setIsHeicFile] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = () => {
    if (convertedBlob) {
      const extension = targetFormat.split('/')[1];
      const fileName = originalFileName 
        ? `${originalFileName.split('.')[0]}.${extension}`
        : `converted-image.${extension}`;
      saveAs(convertedBlob, fileName);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);
    setPreviewUrl(null);
    setConvertedBlob(null);

    try {
      if (isHeicFile && heicTo) {
        const blob = await heicTo({
          blob: selectedFile,
          type: targetFormat,
          quality: quality / 100
        });

        setConvertedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      } else if (imageCompression) {
        // Görüntüyü sıkıştır
        const compressedFile = await imageCompression(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Canvas'a çiz ve hedef formata dönüştür
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                setConvertedBlob(blob);
                setPreviewUrl(URL.createObjectURL(blob));
              }
              setIsConverting(false);
            },
            targetFormat,
            quality / 100
          );
        };

        img.src = URL.createObjectURL(compressedFile);
        return;
      }
    } catch (error) {
      console.error('Dönüştürme hatası:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    try {
      if (!isHeic) {
        throw new Error('HEIC kontrol fonksiyonu yüklenemedi');
      }

      const fileIsHeic = await isHeic(file);
      setIsHeicFile(fileIsHeic);
      setTargetFormat(fileIsHeic ? 'image/jpeg' : targetFormat);
      
      setOriginalFileName(file.name);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setConvertedBlob(null);
    } catch (error) {
      console.error('Dosya kontrolü sırasında hata:', error);
    }
  }, [targetFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.jpg', '.jpeg', '.png', '.gif',
        '.webp', '.avif', '.heic',
        '.bmp', '.tiff'
      ]
    },
    maxFiles: 1
  });

  const formats = isHeicFile ? HEIC_FORMATS : STANDARD_FORMATS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {isClient ? (
        <main className="container mx-auto px-4 py-16 max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Metamorpics
          </h1>
          <p className="text-center text-gray-400 mb-12">Fotoğraflarınızı kolayca farklı formatlara dönüştürün</p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-gray-600 hover:border-blue-400 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-300 text-lg">
                {isDragActive
                  ? "Bırakın..."
                  : "Dönüştürmek istediğiniz fotoğrafı sürükleyin veya seçin"}
              </p>
            </div>

            {previewUrl && (
              <div className="mt-6 rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                <div className="relative w-full h-[400px]">
                  <Image 
                    src={previewUrl} 
                    alt="Önizleme" 
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">Hedef Format:</label>
                <select 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                >
                  {Object.entries(formats).map(([category, formatOptions]) => (
                    <optgroup key={category} label={category}>
                      {formatOptions.map(format => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Kalite: {quality}%</label>
                  <span className="text-sm text-blue-400 font-medium">{quality}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !selectedFile || isConverting
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90'
                  }`}
                  disabled={!selectedFile || isConverting}
                  onClick={handleConvert}
                >
                  {isConverting ? 'Dönüştürülüyor...' : 'Dönüştür'}
                </button>

                {convertedBlob && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-200"
                  >
                    İndir
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
}
