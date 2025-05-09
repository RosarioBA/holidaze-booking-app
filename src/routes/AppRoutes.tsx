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

// Role-based Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVenueManager: boolean;
}

const ProtectedRoute = ({ children, requireVenueManager }: ProtectedRouteProps) => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const location = useLocation();
  
  // Add extra debugging
  console.log('ProtectedRoute - Path:', location.pathname);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - isVenueManager:', isVenueManager);
  console.log('ProtectedRoute - requireVenueManager:', requireVenueManager);
  
  // First check if user is authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has appropriate role for this route
  const hasCorrectRole = requireVenueManager === isVenueManager;
  
  if (!hasCorrectRole) {
    console.log('ProtectedRoute - Incorrect role for this route');
    // Redirect to the appropriate dashboard
    return <Navigate to={isVenueManager ? "/venue-manager/dashboard" : "/customer/dashboard"} replace />;
  }
  
  // User has appropriate permissions
  return <>{children}</>;
};
// Component for general authenticated routes (accessible by both roles)
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Component that chooses the correct layout based on which section of the site they're in
const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const location = useLocation();
  
  // For venue manager routes
  if (location.pathname.startsWith('/venue-manager') && isAuthenticated) {
    return <VenueManagerLayout>{children}</VenueManagerLayout>;
  }
  
  // For customer routes
  if (location.pathname.startsWith('/customer') && isAuthenticated) {
    return <CustomerLayout>{children}</CustomerLayout>;
  }
  
  // For public pages, use the standard layout
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed:', location.pathname);
    console.log('User authenticated:', isAuthenticated);
    console.log('User is venue manager:', isVenueManager);
  }, [location.pathname, isAuthenticated, isVenueManager]);
  
  // Redirect based on user type
  const DashboardRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (isVenueManager) {
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
      
      {/* Use ConditionalLayout for Venues pages */}
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
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout>
            <CustomerDashboardPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/customer/trips" element={
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout>
            <CustomerTripsPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/customer/saved" element={
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout>
            <CustomerSavedPage />
          </CustomerLayout>
        </ProtectedRoute>
      } />
      
      {/* Shared authenticated routes - available to any authenticated user */}
      <Route path="/bookings/:id" element={
        <AuthenticatedRoute>
          <ConditionalLayout>
            <BookingDetailPage />
          </ConditionalLayout>
        </AuthenticatedRoute>
      } />
      
      <Route path="/settings" element={
        <AuthenticatedRoute>
          <ConditionalLayout>
            <SettingsPage />
          </ConditionalLayout>
        </AuthenticatedRoute>
      } />
      
      <Route path="/profile" element={
        <AuthenticatedRoute>
          <ConditionalLayout>
            <ProfilePage />
          </ConditionalLayout>
        </AuthenticatedRoute>
      } />
      
      {/* Venue Manager Routes */}
      <Route path="/venue-manager/dashboard" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout>
            <VenueManagerDashboardPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/create" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout>
            <CreateVenuePage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      {/* These routes need to be added once you create the components */}
      {/* 
      <Route path="/venue-manager/venues" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout>
            <VenueManagerVenuesPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/bookings" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout>
            <VenueManagerBookingsPage />
          </VenueManagerLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/venue-manager/edit/:id" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout>
            <EditVenuePage />
          </VenueManagerLayout>
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