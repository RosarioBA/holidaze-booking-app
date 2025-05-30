// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component that displays a 404 error message
 * when the requested page is not found.
 * 
 * @returns {JSX.Element} Rendered component
 */

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4 font-averia">404</h1>
      <h2 className="text-2xl font-semibold mb-6 font-averia">Page Not Found</h2>
      <p className="text-gray-600 mb-8 font-light">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 tracking-wide">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;