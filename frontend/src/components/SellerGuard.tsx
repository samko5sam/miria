import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SellerGuard: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === 'buyer') {
    return <Navigate to="/become-creator" replace />;
  }

  if (user.role === 'seller' || user.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default SellerGuard;
