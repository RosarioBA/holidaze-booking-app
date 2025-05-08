// src/pages/auth/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LocationState {
  message?: string;
  accountType?: 'customer' | 'venueManager';
  from?: {
    pathname: string;
  };
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Get message from location state (if redirected from register)
  const state = location.state as LocationState;
  const successMessage = state?.message || '';
  const from = state?.from?.pathname || '/';
  const accountType = state?.accountType;
  
  // Check if there's registered venue manager info
  const [registeredAsVenueManager, setRegisteredAsVenueManager] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  
  useEffect(() => {
    // Check if the user registered as a venue manager
    const isVenueManager = localStorage.getItem('registered_as_venue_manager') === 'true';
    const name = localStorage.getItem('registered_venue_manager_name');
    
    if (isVenueManager && name) {
      console.log(`Found registered venue manager info for: ${name}`);
      setRegisteredAsVenueManager(true);
      setRegisteredName(name);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email domain
    if (!email.endsWith('@stud.noroff.no')) {
      setApiError('Email must be a valid stud.noroff.no address');
      return;
    }
    
    try {
      setIsLoading(true);
      setApiError('');
      
      const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => {
            if (typeof err === 'object' && err !== null) {
              return err.message || JSON.stringify(err);
            }
            return String(err);
          }).join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(data.message || "Login failed");
      }
      
      // Log full response for debugging
      console.log("Full login response data:", data.data);
      
      // Get the venue manager status from the API
      let venueManagerStatus = data.data.venueManager === true;
      
      // Check if this is the user who registered as a venue manager
      const isRegisteredUser = registeredAsVenueManager && 
                             registeredName === data.data.name;
      
      // If so, override the venue manager status
      if (isRegisteredUser && !venueManagerStatus) {
        console.log("User registered as venue manager but API didn't set it. Overriding locally.");
        venueManagerStatus = true;
        
        // Clear the registration flag since we've used it
        localStorage.removeItem('registered_as_venue_manager');
        localStorage.removeItem('registered_venue_manager_name');
      }
      
      console.log("Final venueManager status:", venueManagerStatus);
      
      // Login successful
      login(data.data.accessToken, {
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar,
        venueManager: venueManagerStatus // Use our potentially overridden value
      });
      
      // Redirect to home or previous page
      navigate(from);
    } catch (error: any) {
      console.error("Login error:", error);
      setApiError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-2 text-xs uppercase tracking-wide text-gray-600">HOLIDAZE</div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">HOLIDAZE</h1>
            <h2 className="text-sm font-bold">BOOK YOUR ESCAPE</h2>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">Welcome Back</h3>
          <p className="text-xs text-gray-500 mb-6">Sign in to continue your journey with Holidaze</p>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">
              {successMessage}
            </div>
          )}
          
          {registeredAsVenueManager && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
              You registered as a venue manager. You'll be able to create and manage venues after login.
            </div>
          )}
          
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;