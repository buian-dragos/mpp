// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProductList from './components/ProductList';
import ProductChart from './components/ProductChart';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<PrivateRoute element={<ProductList />} />} />
            <Route path="/charts" element={<PrivateRoute element={<ProductChart />} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
