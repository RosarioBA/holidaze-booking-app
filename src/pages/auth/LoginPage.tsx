/**
 * @file LoginPage.tsx
 * @description Authentication page for user login
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// API constants
const API_KEY = '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf';
const API_BASE_URL = 'https://v2.api.noroff.dev';

/**
 * Interface for location state passed from other pages
 */
interface LocationState {
  /** Success message to display (usually from register page) */
  message?: string;
  /** Type of account that was registered */
  accountType?: 'customer' | 'venueManager';
  /** Original location user was trying to access */
  from?: {
    pathname: string;
  };
}

/**
 * Login page component that handles user authentication
 * Provides login form and redirects to appropriate dashboard based on user role
 * 
 * @returns {JSX.Element} Login page component
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Get message from location state (if redirected from register)
  const state = location.state as LocationState;
  const successMessage = state?.message || '';
  
  /**
   * Handles form submission and user authentication
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
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
      
      // Step 1: Authenticate user with credentials
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      // Handle API errors
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
      
      // Step 2: Fetch the complete user profile to get venueManager status
      const profileResponse = await fetch(`${API_BASE_URL}/holidaze/profiles/${loginProfile.name}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': API_KEY
        }
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const profileData = await profileResponse.json();
      const completeProfile = profileData.data;
      
      // Create the user profile object with all data
      const userProfile = {
        name: completeProfile.name,
        email: completeProfile.email,
        avatar: completeProfile.avatar,
        venueManager: completeProfile.venueManager === true,
        bio: completeProfile.bio
      };
      
      // Login successful - update auth context
      login(token, userProfile);
      
      // Redirect based on role
      if (completeProfile.venueManager === true) {
        navigate('/venue-manager/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
      
    } catch (error: any) {
      setApiError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-2 text-xs uppercase tracking-wide text-gray-600 font-averia">HOLIDAZE</div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold font-averia">HOLIDAZE</h1>
            <h2 className="text-sm font-bold font-averia">BOOK YOUR ESCAPE</h2>
          </div>
          
          <h3 className="text-lg font-semibold mb-1 font-averia">Welcome Back</h3>
          <p className="text-xs text-gray-500 mb-6">Sign in to continue your journey with Holidaze</p>
            
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm" role="alert">
              {successMessage}
            </div>
          )}
          
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm" role="alert">
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
                autoComplete="email"
                placeholder="your.email@stud.noroff.no"
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
                autoComplete="current-password"
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