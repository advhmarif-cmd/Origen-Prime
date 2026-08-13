import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AllProducts from './pages/AllProducts';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main page now shows all products */}
        <Route path="/" element={<AllProducts />} />
        
        {/* Specific product landing page */}
        <Route path="/:slug" element={<LandingPage />} />
        
        {/* Admin control panel */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
