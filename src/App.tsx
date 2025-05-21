import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop'; // 👈 Import here
import './index.css';

function App() {
  console.log('DEBUG: App component rendering');

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <ScrollToTop /> {/* 👈 Add ScrollToTop inside Router */}
          <AppRoutes />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
