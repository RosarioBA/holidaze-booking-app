// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      {/* Add more routes as needed */}
      <Route path="*" element={
        <Layout>
          <NotFoundPage />
        </Layout>
      } />
    </Routes>
  );
};

export default AppRoutes;