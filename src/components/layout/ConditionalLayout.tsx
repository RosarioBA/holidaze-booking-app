/**
 * @file ConditionalLayout.tsx
 * @description Component that conditionally renders either authenticated or public layout based on user auth status
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from './Layout';
import AuthenticatedLayout from './AuthenticatedLayout';

/**
 * Props for the ConditionalLayout component
 */
interface ConditionalLayoutProps {
  /** Child components to be rendered within the selected layout */
  children: ReactNode;
}

/**
 * A layout component that switches between authenticated and public layouts
 * based on the user's authentication status
 * 
 * @param {ConditionalLayoutProps} props - Component props
 * @returns {JSX.Element} Either AuthenticatedLayout or Layout with children
 */
const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }
  
  return <Layout>{children}</Layout>;
};

export default ConditionalLayout;