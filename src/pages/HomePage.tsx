// src/pages/HomePage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDates, setSearchDates] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log('Searching for:', { searchLocation, searchDates });
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gray-600 text-white py-10 rounded-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Find your perfect stay in Norway
          </h1>
          
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md">
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-1">
                  Where do you want to go?
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Search locations or properties..."
                  className="w-full p-2 border border-gray-300 rounded"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              
              <div className="flex-1">
                <label htmlFor="dates" className="block text-gray-700 text-sm font-medium mb-1">
                  When is your trip?
                </label>
                <input
                  type="text"
                  id="dates"
                  placeholder="Add dates"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={searchDates}
                  onChange={(e) => setSearchDates(e.target.value)}
                />
              </div>
              
              <div className="self-end">
                <button 
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded font-medium hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      
      {/* Featured Properties Section */}
      <section className="bg-yellow-50 py-10 px-4 rounded-lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Mountain View Cabin</h3>
                <p className="text-gray-600">Oslo, Norway</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold">$120 / night</p>
                  <Link 
                    to="/venues/1" 
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Property Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Modern City Loft</h3>
                <p className="text-gray-600">Bergen, Norway</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold">$95 / night</p>
                  <Link 
                    to="/venues/2" 
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Property Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Seaside Retreat</h3>
                <p className="text-gray-600">Stavanger, Norway</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold">$150 / night</p>
                  <Link 
                    to="/venues/3" 
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Book With Holidaze Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Book With Holidaze</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Trusted Properties</h3>
              <p className="text-gray-600">All our listings are verified for quality and comfort.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">We offer competitive prices with no hidden fees.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Customer Support</h3>
              <p className="text-gray-600">24/7 support for all your booking needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-10 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Own a Property? Become a Host Today!</h2>
          <p className="mb-6">List your property on Holidaze and start earning income.</p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Register as a Venue Manager
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;