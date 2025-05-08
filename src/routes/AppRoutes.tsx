// src/routes/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VenuesPage from '../pages/venue/VenuesPage';
import VenueDetailPage from '../pages/venue/VenueDetailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import MyTripsPage from '../pages/dashboard/MyTripsPage';
import BookingDetailPage from '../pages/booking/BookingDetailPage';
import SavedVenuesPage from '../pages/dashboard/SavedVenuesPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage'; // Import the ProfilePage
import NotFoundPage from '../pages/NotFoundPage';
import VenueManagerDashboard from '../pages/venue-manager/VenueManagerDashboard';
import CreateVenuePage from '../pages/venue-manager/CreateVenuePage';
// Import these when you create them
// import EditVenuePage from '../pages/venue-manager/EditVenuePage';
// import VenueBookingsPage from '../pages/venue-manager/VenueBookingsPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Conditional layout component
const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // For debugging: log authentication state on route changes
  useEffect(() => {
    console.log('Route changed, authenticated:', isAuthenticated);
  }, [location.pathname, isAuthenticated]);
  
  // If user is logged in, redirect from home page to dashboard
  const HomePageComponent = () => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return (
      <Layout>
        <HomePage />
      </Layout>
    );
  };
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePageComponent />} />
      <Route path="/venues" element={
        <ConditionalLayout>
          <VenuesPage />
        </ConditionalLayout>
      } />
      <Route path="/venues/:id" element={
        <ConditionalLayout>
          <VenueDetailPage />
        </ConditionalLayout>
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> :
        <Layout>
          <LoginPage />
        </Layout>
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> :
        <Layout>
          <RegisterPage />
        </Layout>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <DashboardPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-trips" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <MyTripsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/bookings/:id" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <BookingDetailPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/saved" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <SavedVenuesPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <SettingsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      {/* Add Profile Route */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ProfilePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

   
      {/* Venue Manager Routes */}
      <Route path="/venue-manager/dashboard" element={
      <ProtectedRoute>
        <AuthenticatedLayout>
          <VenueManagerDashboard />
        </AuthenticatedLayout>
      </ProtectedRoute>
    } />
      <Route path="/venue-manager/create" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <CreateVenuePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Temporarily comment these out until you create the components */}
      {/* 
      <Route path="/venue-manager/edit/:id" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <EditVenuePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path="/venue-manager/bookings/:id" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <VenueBookingsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      */}
            
            {/* 404 route */}
            <Route path="*" element={
              <ConditionalLayout>
                <NotFoundPage />
              </ConditionalLayout>
            } />
          </Routes>
        );
      };

export default AppRoutes;