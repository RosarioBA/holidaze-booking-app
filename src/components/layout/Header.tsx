// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, isVenueManager, user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Holidaze</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/venues" className="hover:text-blue-600">Venues</Link></li>
            
            {isAuthenticated ? (
              <>
                {isVenueManager && (
                  <li>
                    <Link to="/manage-venues" className="hover:text-blue-600">
                      Manage Venues
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/bookings" className="hover:text-blue-600">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-blue-600">
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="hover:text-blue-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
                <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;