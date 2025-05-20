/**
 * @file ImageGallery.tsx
 * @description Responsive image gallery component with modal lightbox functionality
 */

import React, { useState } from 'react';

/**
 * Media object structure for venue images
 */
interface VenueMedia {
  /** URL of the image */
  url: string;
  /** Alternative text for the image (optional) */
  alt?: string;
}

/**
 * Props for the ImageGallery component
 */
interface ImageGalleryProps {
  /** Array of images to display in the gallery */
  images: VenueMedia[];
  /** Name of the venue, used for alt text when not provided */
  name: string;
}

/**
 * Component that displays a responsive image gallery with lightbox functionality
 * Shows a main image with thumbnails and allows full-screen viewing
 * 
 * @param {ImageGalleryProps} props - Component props
 * @returns {JSX.Element} Rendered image gallery
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  /**
   * Default placeholder image to use when no images are available
   * or when an image fails to load
   */
  const placeholderImage = {
    url: 'https://placehold.co/800x600?text=No+Image+Available',
    alt: `${name} placeholder image`
  };
  
  // Check if there are any images available
  const hasImages = images && images.length > 0;
  
  // Create an array of images or use placeholder
  const galleryImages = hasImages ? images : [placeholderImage];
  
  /**
   * Handles click on an image to open the modal lightbox
   * 
   * @param {number} index - Index of the clicked image
   */
  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setShowModal(true);
  };
  
  /**
   * Navigate to the previous image in the lightbox
   */
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };
  
  /**
   * Navigate to the next image in the lightbox
   */
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  /**
   * Close the modal lightbox
   */
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
              role="button"
              aria-label={`View all ${galleryImages.length} photos`}
              tabIndex={0}
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={handleModalClose}
              className="text-white hover:text-gray-300"
              aria-label="Close gallery"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center relative">
            <button
              onClick={handlePrevious}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              aria-label="Previous image"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                <button 
                  key={index} 
                  className={`flex-shrink-0 h-16 w-24 overflow-hidden rounded cursor-pointer ${
                  index === activeIndex ? 'border-2 border-white' : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                  disabled={index === activeIndex}
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
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;