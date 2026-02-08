import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import keycloak from '../config/keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | undefined;
  roles: string[];
  login: () => void;
  logout: () => void;
  userProfile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'check-sso', checkLoginIframe: false }) // check-sso verifica se já tem sessão sem forçar login
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          setRoles(keycloak.realmAccess?.roles || []);
          keycloak.loadUserProfile().then((profile) => setUserProfile(profile));
        }
      })
      .catch((err) => console.error('Falha ao inicializar Keycloak', err));
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, roles, login, logout, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
