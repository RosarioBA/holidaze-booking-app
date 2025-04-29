// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VenuesPage from '../pages/venue/VenuesPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/venues" element={
        <Layout>
          <VenuesPage />
        </Layout>
      } />
      <Route path="/login" element={
        <Layout>
          <LoginPage />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout>
          <RegisterPage />
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