import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserForm } from './components/UserForm';
import { useState, useEffect } from 'react';
import api from './config/api';

const Home = () => {
  const { isAuthenticated, login, logout, userProfile, roles } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>SecureAccess Hub - Frontend</h1>
      {isAuthenticated ? (
        <div>
          <p>Bem-vindo, <strong>{userProfile?.username}</strong>!</p>
          <p>Roles: {roles.join(', ')}</p>
          <button onClick={logout}>Sair</button>
          <br /><br />
          <nav>
            <Link to="/users">Listar Usuários (Todos)</Link> |{' '}
            <Link to="/admin">Área Admin (Só Admin)</Link>
          </nav>
        </div>
      ) : (
        <button onClick={login}>Entrar com Keycloak</button>
      )}
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { roles } = useAuth();
  const isAdmin = roles.includes('ADMIN');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then((res) => setUsers(res.data.data || []))
      .catch((err) => setError('Erro ao carregar usuários: ' + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && users.length === 0) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista de Usuários</h2>
      
      {isAdmin && <UserForm onSuccess={fetchUsers} />}

      <ul>
        {users.map((u: any) => (
          <li key={u.id}>{u.name} ({u.email})</li>
        ))}
      </ul>
      <Link to="/">Voltar</Link>
    </div>
  );
};

const AdminPage = () => (
  <div style={{ padding: '20px' }}>
    <h2>Área Administrativa</h2>
    <p>Se você está vendo isso, você é um ADMIN!</p>
    <Link to="/">Voltar</Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
