import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Informe usuário e senha.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await login({
        username: username.trim(),
        password,
      });

      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage(
        getApiErrorMessage(error, 'Usuário ou senha inválidos.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card shadow-sm auth-card">
        <div className="card-body">
          <h1 className="h3 mb-2">Entrar no DevTrack</h1>
          <p className="text-muted">
            Acesse suas trilhas, tópicos e projetos.
          </p>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Usuário
              </label>
              <input
                className="form-control"
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Seu usuário"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <input
                className="form-control"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-muted mt-3 mb-0">
            Ainda não tem conta?{' '}
            <Link to="/register">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}