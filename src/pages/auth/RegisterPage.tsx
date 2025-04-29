// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';
import { useForm } from '../../hooks/useForm';
import { RegisterData } from '../../types/user';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { values, errors, handleChange, handleSubmit, setValues } = useForm<RegisterData>({
    name: '',
    email: '',
    password: '',
    avatar: '',
    venueManager: false,
  });
  
  const handleCheckboxChange = () => {
    setValues({
      ...values,
      venueManager: !values.venueManager,
    });
  };
  
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      await register(values);
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.' 
        } 
      });
    } catch (error) {
      console.error('Registration failed:', error);
      setApiError('Registration failed. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your Name"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your.email@stud.noroff.no"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-gray-700 font-medium mb-2">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            id="avatar"
            name="avatar"
            value={values.avatar}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="venueManager"
            name="venueManager"
            checked={values.venueManager}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="venueManager" className="text-gray-700">
            Register as a Venue Manager
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;