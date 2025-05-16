// src/components/venue/ImageGallery.tsx
import React, { useState } from 'react';

// Define the VenueMedia interface here if it's not exported
interface VenueMedia {
  url: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: VenueMedia[];
  name: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  // Use a placeholder if no images are available
  const hasImages = images && images.length > 0;
  const placeholderImage = {
    url: 'https://placehold.co/800x600?text=No+Image+Available',
    alt: `${name} placeholder image`
  };
  
  // Create an array of images or use placeholder
  const galleryImages = hasImages ? images : [placeholderImage];
  
  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setShowModal(true);
  };
  
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      {/* Main Image - Fixed height container */}
      <div className="relative h-96 mb-2 overflow-hidden rounded-lg shadow-md">
        <img
          src={galleryImages[0].url}
          alt={galleryImages[0].alt || name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => handleImageClick(0)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage.url;
          }}
        />
      </div>
      
      {/* Thumbnail Grid */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`relative h-24 overflow-hidden rounded ${index === 0 ? 'border-2 border-[#0081A7]' : ''}`}
            >
              <img
                src={image.url}
                alt={image.alt || `${name} image ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(index)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImage.url;
                }}
              />
            </div>
          ))}
          
          {/* Show "View all photos" button if there are more than 4 images */}
          {galleryImages.length > 4 && (
            <div 
              className="relative h-24 bg-gray-200 flex items-center justify-center rounded cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <span className="text-gray-600 font-medium">
                +{galleryImages.length - 4} more
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Full-screen Modal Gallery */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleModalClose}
              className="text-white hover:text-gray-300"
              aria-label="Close gallery"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center relative">
            <button
              onClick={handlePrevious}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="max-h-full max-w-full overflow-hidden flex items-center justify-center">
              <img
                src={galleryImages[activeIndex].url}
                alt={galleryImages[activeIndex].alt || `${name} image ${activeIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImage.url;
                }}
              />
            </div>
            
            <button
              onClick={handleNext}
              className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <p className="text-white">
              {activeIndex + 1} / {galleryImages.length}
            </p>
          </div>
          
          {/* Thumbnail Row for Modal */}
          {galleryImages.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 h-16 w-24 overflow-hidden rounded cursor-pointer ${
                    index === activeIndex ? 'border-2 border-white' : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `${name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = placeholderImage.url;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;