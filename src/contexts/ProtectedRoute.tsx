/**
 * @file ProtectedRoute.tsx
 * @description Route wrapper that redirects unauthenticated or unauthorized users
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Valid user roles that can be required for route access
 */
type UserRole = 'venueManager' | 'customer';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** The role required to access this route (optional) */
  requiredRole?: UserRole;
  /** Where to redirect if access is denied (defaults to /login) */
  redirectPath?: string;
}

/**
 * Component that protects routes by checking authentication and authorization
 * Routes wrapped with this component will only be accessible to users
 * who are authenticated and have the required role (if specified)
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} Either the protected routes or a redirect
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole, 
  redirectPath = '/login' 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Authentication check - if user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Authorization check - if a specific role is required but user doesn't have it
  if (requiredRole) {
    // If venue manager role is required but user is not a venue manager
    if (requiredRole === 'venueManager' && !user?.venueManager) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    
    // If customer role is required but user is a venue manager
    if (requiredRole === 'customer' && user?.venueManager) {
      return <Navigate to="/venue-manager/dashboard" replace />;
    }
  }

  // User is authenticated and authorized, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;