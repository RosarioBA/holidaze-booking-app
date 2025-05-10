// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Add the API constants if they're not imported
const API_BASE_URL = '/api'; // or import from your api.ts file
const API_KEY = '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf'; // or import from your api.ts file

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
      
      // Use the direct API URL instead of the proxy
      const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf'
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
      
      // Get the access token and user data from login
      const token = data.data.accessToken;
      const loginProfile = data.data;
      
      console.log("Login successful, fetching complete profile...");
      
      // Step 2: Fetch the complete user profile to get venueManager status
      const profileResponse = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${loginProfile.name}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf'
        }
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const profileData = await profileResponse.json();
      const completeProfile = profileData.data;
      
      console.log("Complete profile data:", completeProfile);
      console.log("Venue Manager status:", completeProfile.venueManager);
      
      // Create the user profile object with all data
      const userProfile = {
        name: completeProfile.name,
        email: completeProfile.email,
        avatar: completeProfile.avatar,
        venueManager: completeProfile.venueManager === true,
        bio: completeProfile.bio
      };
      
      // Login successful
      login(token, userProfile);
      
      // Redirect based on role
      if (completeProfile.venueManager === true) {
        console.log("Redirecting to venue manager dashboard");
        navigate('/venue-manager/dashboard');
      } else {
        console.log("Redirecting to customer dashboard");
        navigate('/customer/dashboard');
      }
      
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