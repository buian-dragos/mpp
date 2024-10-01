import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <div>Unauthorized</div>
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
