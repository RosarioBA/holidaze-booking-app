/**
 * @file Layout.tsx
 * @description Base layout component used for public pages
 */

import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Props for the Layout component
 */
interface LayoutProps {
  /** Child components to be rendered in the main content area */
  children: ReactNode;
}

/**
 * Base layout component that provides the standard header and footer
 * Used primarily for public pages and unauthenticated users
 * 
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} Rendered layout with children
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHomePage ? 'px-0 py-0' : 'px-0'} py-0 mb-0`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;