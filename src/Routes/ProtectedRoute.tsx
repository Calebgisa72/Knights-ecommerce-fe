import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { DecodedToken } from '../pages/Authentication/Login';
import { useJwt } from 'react-jwt';
import NotAllowed from './NotAllowed';

interface ProtectedRouteProps {
  requiredRole?: string;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);
  const location = useLocation();

  if (!userToken) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiredRole && decodedToken?.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <NotAllowed />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
