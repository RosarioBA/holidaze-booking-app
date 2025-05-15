// src/components/layout/Layout.tsx - Update to remove spacing between main and footer
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHomePage ? 'px-0 py-0' : 'container mx-auto px-0'} py-0 mb-0`}> {/* Added mb-0 */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;