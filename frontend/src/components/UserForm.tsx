import { useState } from 'react';
import api from '../config/api';

interface UserFormProps {
  onSuccess: () => void;
}

export const UserForm = ({ onSuccess }: UserFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keycloakId, setKeycloakId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação simples no frontend
    if (!name || !email || !keycloakId) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users', { name, email, keycloakId });
      setName('');
      setEmail('');
      setKeycloakId('');
      onSuccess();
      alert('Usuário criado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
      <h3>Novo Usuário</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Keycloak ID (UUID)"
          value={keycloakId}
          onChange={(e) => setKeycloakId(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  );
};
