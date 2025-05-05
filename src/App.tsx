// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  console.log('DEBUG: App component rendering');
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppRoutes />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;