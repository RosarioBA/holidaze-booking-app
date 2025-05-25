import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import './index.css';

function App() {

  // Use the import.meta.env.BASE_URL to get the base path from Vite
  const basePath = import.meta.env.BASE_URL;

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router basename={basePath}>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;