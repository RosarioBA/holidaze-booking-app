// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Holidaze</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/venues" className="hover:text-blue-600">Venues</Link></li>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;