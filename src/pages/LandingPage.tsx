// src/pages/LandingPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';

const LandingPage: React.FC = () => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        if (isVenueManager) {
          navigate('/venue-manager/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isVenueManager, navigate]);

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 text-gray-700 text-lg font-medium">
        Redirecting to your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold font-averia">HOLIDAZE</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link 
                to="/customer/dashboard" 
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="bg-white rounded-lg shadow-lg overflow-hidden my-8">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 font-averia">Welcome to Holidaze</h2>
              <p className="text-gray-600 mb-6 font-light">
                Book your perfect holiday venue or list your property to earn extra income.
              </p>
              <div className="space-y-4">
                <Link 
                  to="/venues" 
                  className="block text-center w-full py-3 px-6 bg-[#0081A7] text-white rounded-lg hover:bg-[#13262F] transition font-medium tracking-wide"
                >
                  Explore Venues
                </Link>
                {isAuthenticated && isVenueManager && (
                  <Link 
                    to="/venue-manager/dashboard" 
                    className="block text-center w-full py-3 px-6 bg-[#8F754F] text-white rounded-lg hover:bg-[#8F754F]/80 transition"
                  >
                    Venue Manager Dashboard
                  </Link>
                )}
                {!isAuthenticated && (
                  <Link 
                    to="/register" 
                    className="block text-center w-full py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Register Now
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1170&q=80" 
                alt="Luxury holiday accommodation in the mountains" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x400?text=Holidaze';
                }}
              />
            </div>
          </div>
        </section>

        {/* Dashboard Options */}
        {isAuthenticated && (
          <section className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-center font-averia">Choose Your Dashboard</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Dashboard */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="h-40 bg-blue-100 flex items-center justify-center">
                  <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-2 font-averia">Customer Dashboard</h4>
                  <p className="text-gray-600 mb-4 font-light">Browse venues, book your stays, and manage your trips.</p>
                  <Link 
                    to="/customer/dashboard" 
                    className="block text-center w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go to Customer Dashboard
                  </Link>
                </div>
              </div>

              {/* Venue Manager */}
              {isVenueManager ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <div className="h-40 bg-amber-100 flex items-center justify-center">
                    <svg className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-2 font-averia">Venue Manager Dashboard</h4>
                    <p className="text-gray-600 mb-4">Manage your venues, view bookings, and track revenue.</p>
                    <Link 
                      to="/venue-manager/dashboard" 
                      className="block text-center w-full py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                    >
                      Go to Venue Manager
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-2 font-averia">Venue Manager</h4>
                    <p className="text-gray-600 mb-4">Want to list your property? Enable venue manager mode in settings.</p>
                    <Link 
                      to="/settings" 
                      className="block text-center w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Go to Settings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Venues */}
        <section className="my-12">
          <h3 className="text-xl font-semibold mb-6">Featured Venues</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={`https://source.unsplash.com/random/300x200?cabin,${item}`} 
                    alt={`Featured venue ${item} in Oslo`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/300x200?text=Venue';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2 font-averia">Beautiful Venue {item}</h4>
                  <p className="text-gray-600 text-sm mb-2">Oslo, Norway</p>
                  <p className="font-medium">1200 kr/night</p>
                  <Link 
                    to={`/venues/${item}`} 
                    className="mt-3 text-[#0081A7] text-sm hover:underline block"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link 
              to="/venues" 
              className="inline-block py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              View All Venues →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
