// src/routes/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import CustomerLayout from '../components/layout/CostumerLayout';
import VenueManagerLayout from '../components/layout/VenueManagerLayout';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VenuesPage from '../pages/venue/VenuesPage';
import VenueDetailPage from '../pages/venue/VenueDetailPage';
import BookingDetailPage from '../pages/booking/BookingDetailPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import CustomerTripsPage from '../pages/customer/CustomerTripsPage';
import CustomerSavedPage from '../pages/customer/CustomerSavedPage';

// Venue Manager Pages
import VenueManagerDashboardPage from '../pages/venue-manager/VenueManagerDashboardPage';
import CreateVenuePage from '../pages/venue-manager/CreateVenuePage';
// Import these when you create them
// import VenueManagerVenuesPage from '../pages/venue-manager/VenueManagerVenuesPage';
// import VenueManagerBookingsPage from '../pages/venue-manager/VenueManagerBookingsPage';
// import EditVenuePage from '../pages/venue-manager/EditVenuePage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed, authenticated:', isAuthenticated);
    console.log('User is venue manager:', user?.venueManager);
  }, [location.pathname, isAuthenticated, user]);
  
  // Redirect based on user type
  const DashboardRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (user?.venueManager) {
      return <Navigate to="/venue-manager/dashboard" replace />;
    }
    
    return <Navigate to="/customer/dashboard" replace />;
  };
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated ? <DashboardRedirect /> : 
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      <Route path="/venues" element={
        <Layout>
          <VenuesPage />
        </Layout>
      } />
      
      <Route path="/venues/:id" element={
        <Layout>
          <VenueDetailPage />
        </Layout>
      } />
      
      <Route path="/login" element={
        isAuthenticated ? <DashboardRedirect /> :
        <Layout>
          <LoginPage />
        </Layout>
      } />
      
      <Route path="/register" element={
        isAuthenticated ? <DashboardRedirect /> :
        <Layout>
          <RegisterPage />
        </Layout>
      } />
      
      {/* Dashboard redirect route */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Legacy path redirects */}
      <Route path="/my-trips" element={<Navigate to="/customer/trips" replace />} />
      <Route path="/saved" element={<Navigate to="/customer/saved" replace />} />
      
      {/* Customer routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute>
          <CustomerLayout>
            <CustomerDashboardPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/customer/trips" element={
        <ProtectedRoute>
          <CustomerLayout>
            <CustomerTripsPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/customer/saved" element={
        <ProtectedRoute>
          <CustomerLayout>
            <CustomerSavedPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      {/* Shared authenticated routes */}
      <Route path="/bookings/:id" element={
        <ProtectedRoute>
          <CustomerLayout>
            <BookingDetailPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <CustomerLayout>
            <SettingsPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <CustomerLayout>
            <ProfilePage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      {/* Venue Manager Routes */}
      <Route path="/venue-manager/dashboard" element={
        <ProtectedRoute>
          <VenueManagerLayout>
            <VenueManagerDashboardPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/create" element={
        <ProtectedRoute>
          <VenueManagerLayout>
            <CreateVenuePage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      {/* These routes need to be added once you create the components */}
      {/* 
      <Route path="/venue-manager/venues" element={
        <ProtectedRoute>
          <VenueManagerLayout>
            <VenueManagerVenuesPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/bookings" element={
        <ProtectedRoute>
          <VenueManagerLayout>
            <VenueManagerBookingsPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/edit/:id" element={
        <ProtectedRoute>
          <VenueManagerLayout>
            <EditVenuePage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      */}
      
      {/* 404 route */}
      <Route path="*" element={
        <Layout>
          <NotFoundPage />
        </Layout>
      } />
    </Routes>
  );
};

export default AppRoutes;