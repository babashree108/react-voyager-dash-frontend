import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
