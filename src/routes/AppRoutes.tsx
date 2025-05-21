import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import Layout from '../components/layout/Layout';
import CustomerLayout from '../components/layout/CostumerLayout';
import VenueManagerLayout from '../components/layout/VenueManagerLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VenuesPage from '../pages/venue/VenuesPage';
import VenueDetailPage from '../pages/venue/VenueDetailPage';
import ProfileViewPage from '../pages/profile/ProfileViewPage';
import NotFoundPage from '../pages/NotFoundPage';

// Shared Auth Pages
import BookingDetailPage from '../pages/booking/BookingDetailPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import CustomerTripsPage from '../pages/customer/CustomerTripsPage';
import CustomerSavedPage from '../pages/customer/CustomerSavedPage';

// Venue Manager Pages
import VenueManagerDashboardPage from '../pages/venue-manager/VenueManagerDashboardPage';
import CreateVenuePage from '../pages/venue-manager/CreateVenuePage';
import VenueManagerVenuesPage from '../pages/venue-manager/VenueManagerVenuesPage';
import VenueManagerBookingsPage from '../pages/venue-manager/VenueManagerBookingsPage';
import EditVenuePage from '../pages/venue-manager/EditVenuePage';

// ---------------------------
// Protected Routes
// ---------------------------
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVenueManager: boolean;
}

const ProtectedRoute = ({ children, requireVenueManager }: ProtectedRouteProps) => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasCorrectRole = requireVenueManager === isVenueManager;
  if (!hasCorrectRole) {
    return <Navigate to={isVenueManager ? "/venue-manager/dashboard" : "/customer/dashboard"} replace />;
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ---------------------------
// Conditional Layout
// ---------------------------
const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isVenueManager } = useAuth();

  if (isAuthenticated) {
    return isVenueManager ? (
      <VenueManagerLayout>{children}</VenueManagerLayout>
    ) : (
      <CustomerLayout>{children}</CustomerLayout>
    );
  }

  return <Layout>{children}</Layout>;
};

// ---------------------------
// Main App Routes
// ---------------------------
const AppRoutes = () => {
  const { isAuthenticated, isVenueManager } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Route changed:', location.pathname);
    console.log('User authenticated:', isAuthenticated);
    console.log('User is venue manager:', isVenueManager);
  }, [location.pathname, isAuthenticated, isVenueManager]);

  const DashboardRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Navigate to={isVenueManager ? "/venue-manager/dashboard" : "/customer/dashboard"} replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <DashboardRedirect /> : <Layout><HomePage /></Layout>} />
      <Route path="/venues" element={<ConditionalLayout><VenuesPage /></ConditionalLayout>} />
      <Route path="/venues/:id" element={<ConditionalLayout><VenueDetailPage /></ConditionalLayout>} />
      <Route path="/profiles/:name" element={<ConditionalLayout><ProfileViewPage /></ConditionalLayout>} />
      <Route path="/login" element={isAuthenticated ? <DashboardRedirect /> : <Layout><LoginPage /></Layout>} />
      <Route path="/register" element={isAuthenticated ? <DashboardRedirect /> : <Layout><RegisterPage /></Layout>} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/my-trips" element={<Navigate to="/customer/trips" replace />} />
      <Route path="/saved" element={<Navigate to="/customer/saved" replace />} />

      {/* Customer Routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout><CustomerDashboardPage /></CustomerLayout>
        </ProtectedRoute>
      } />
      <Route path="/customer/trips" element={
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout><CustomerTripsPage /></CustomerLayout>
        </ProtectedRoute>
      } />
      <Route path="/customer/saved" element={
        <ProtectedRoute requireVenueManager={false}>
          <CustomerLayout><CustomerSavedPage /></CustomerLayout>
        </ProtectedRoute>
      } />

      {/* Shared Auth Routes */}
      <Route path="/bookings/:id" element={
        <AuthenticatedRoute>
          <ConditionalLayout><BookingDetailPage /></ConditionalLayout>
        </AuthenticatedRoute>
      } />
      <Route path="/settings" element={
        <AuthenticatedRoute>
          <ConditionalLayout><SettingsPage /></ConditionalLayout>
        </AuthenticatedRoute>
      } />
      <Route path="/profile" element={
        <AuthenticatedRoute>
          <ConditionalLayout><ProfilePage /></ConditionalLayout>
        </AuthenticatedRoute>
      } />

      {/* Venue Manager Routes */}
      <Route path="/venue-manager/dashboard" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout><VenueManagerDashboardPage /></VenueManagerLayout>
        </ProtectedRoute>
      } />
      <Route path="/venue-manager/create" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout><CreateVenuePage /></VenueManagerLayout>
        </ProtectedRoute>
      } />
      <Route path="/venue-manager/venues" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout><VenueManagerVenuesPage /></VenueManagerLayout>
        </ProtectedRoute>
      } />
      <Route path="/venue-manager/bookings" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout><VenueManagerBookingsPage /></VenueManagerLayout>
        </ProtectedRoute>
      } />
      <Route path="/venue-manager/edit/:id" element={
        <ProtectedRoute requireVenueManager={true}>
          <VenueManagerLayout><EditVenuePage /></VenueManagerLayout>
        </ProtectedRoute>
      } />

      {/* Fallback 404 */}
      <Route path="*" element={<ConditionalLayout><NotFoundPage /></ConditionalLayout>} />
    </Routes>
  );
};

export default AppRoutes;
