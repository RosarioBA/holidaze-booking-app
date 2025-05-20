/**
 * @file RegisterPage.tsx
 * @description User registration page with account type selection (customer or venue manager)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Registration page component that allows users to create new Holidaze accounts
 * 
 * @returns {JSX.Element} Rendered component
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /**
   * Handles the account type selection
   * 
   * @param {'customer' | 'venueManager'} type - The account type selected by the user
   */
  const handleAccountTypeChange = (type: 'customer' | 'venueManager') => {
    if (type === 'customer') {
      setIsCustomer(true);
      setIsVenueManager(false);
    } else {
      setIsCustomer(false);
      setIsVenueManager(true);
    }
  };

  /**
   * Handles the form submission for user registration
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
    
    // Validate password length
    if (password.length < 8) {
      setApiError('Password must be at least 8 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      setApiError('');
      
      const registrationData = {
        name,
        email,
        password,
        venueManager: isVenueManager
      };
      
      const response = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
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
        
        throw new Error(data.message || "Registration failed");
      }
      
      // Successful registration - redirect to login with appropriate message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.',
          accountType: isVenueManager ? 'venueManager' : 'customer'
        } 
      });
      
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.");
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
        
        <h3 className="text-lg font-semibold mb-4 font-averia">Create an Account</h3>
        <p className="text-xs text-gray-500 mb-6">Join Holidaze to discover venues across Norway</p>
          
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
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
                placeholder="your.email@stud.noroff.no"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`border rounded py-2 px-3 text-sm ${
                    isCustomer
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleAccountTypeChange('customer')}
                >
                  <span className="font-medium">Customer</span>
                  <p className="text-xs text-gray-500 mt-1">Book amazing venues</p>
                </button>
                
                <button
                  type="button"
                  className={`border rounded py-2 px-3 text-sm ${
                    isVenueManager
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleAccountTypeChange('venueManager')}
                >
                  <span className="font-medium">Venue Manager</span>
                  <p className="text-xs text-gray-500 mt-1">List & manage properties</p>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create An Account'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            Have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;