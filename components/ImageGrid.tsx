
import React from 'react';
import type { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {images.map((image, index) => (
          <div key={index} className="bg-black/30 rounded-lg overflow-hidden shadow-lg border border-gray-700 group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                    src={image.imageUrl} 
                    alt={image.prompt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
            </div>
            <div className="p-4 bg-gray-900">
              <p className="text-sm text-gray-400 font-mono leading-relaxed">{image.prompt}</p>
            </div>
          </div>
        ))}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ImageGrid;
