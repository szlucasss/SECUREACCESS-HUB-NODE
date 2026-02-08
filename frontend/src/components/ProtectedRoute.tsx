import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, roles: userRoles, login } = useAuth();

  if (!isAuthenticated) {
    login();
    return null;
  }

  if (roles && !roles.some((role) => userRoles.includes(role))) {
    return <div>Acesso Negado: Você não tem permissão para acessar esta página.</div>;
  }

  return <>{children}</>;
};
