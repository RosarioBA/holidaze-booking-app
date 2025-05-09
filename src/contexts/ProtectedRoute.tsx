// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  requiredRole?: 'venueManager' | 'customer';
  redirectPath?: string;
};

const ProtectedRoute = ({ 
  requiredRole, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect
  if (requiredRole) {
    if (requiredRole === 'venueManager' && !user?.venueManager) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    
    if (requiredRole === 'customer' && user?.venueManager) {
      return <Navigate to="/venue-manager/dashboard" replace />;
    }
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;