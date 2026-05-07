import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-4">
        <p>Carregando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}