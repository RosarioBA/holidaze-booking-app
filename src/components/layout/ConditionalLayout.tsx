import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from './Layout';
import AuthenticatedLayout from './AuthenticatedLayout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }
  
  return <Layout>{children}</Layout>;
};

export default ConditionalLayout;