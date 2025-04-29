// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay with Holidaze</h1>
        <p className="text-xl mb-6">Discover amazing venues for your next vacation</p>
        <Link 
          to="/venues" 
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Browse Venues
        </Link>
      </section>
      
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Venues</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This will be populated with actual venues from the API later */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg">Venue Name</h3>
              <p className="text-gray-600">Location</p>
              <p className="font-semibold mt-2">$XX per night</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg">Venue Name</h3>
              <p className="text-gray-600">Location</p>
              <p className="font-semibold mt-2">$XX per night</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg">Venue Name</h3>
              <p className="text-gray-600">Location</p>
              <p className="font-semibold mt-2">$XX per night</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;