import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import NotFoundPage from '../pages/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
        <Layout>
          <LoginPage />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout>
          <RegisterPage />
        </Layout>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/my-trips" element={
        <ProtectedRoute>
          <MyTripsPage />
        </ProtectedRoute>
      } />
      <Route path="/bookings/:id" element={
        <ProtectedRoute>
          <BookingDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/saved" element={
        <ProtectedRoute>
          <SavedVenuesPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
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