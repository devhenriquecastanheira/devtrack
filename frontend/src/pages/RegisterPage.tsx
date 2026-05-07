import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { register } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      navigate('/login');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setErrorMessage(
        getApiErrorMessage(error, 'Não foi possível criar a conta.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card shadow-sm auth-card">
        <div className="card-body">
          <h1 className="h3 mb-2">Criar conta</h1>
          <p className="text-muted">
            Cadastre-se para começar a organizar seus estudos.
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
                placeholder="Ex: henrique"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <input
                className="form-control"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@email.com"
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
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-muted mt-3 mb-0">
            Já tem conta?{' '}
            <Link to="/login">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}