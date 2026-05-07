import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            DevTrack
          </NavLink>

          <div className="navbar-nav flex-row gap-2 gap-md-3">
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active fw-semibold' : ''}`
              }
              to="/"
            >
              Dashboard
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active fw-semibold' : ''}`
              }
              to="/tracks"
            >
              Trilhas
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active fw-semibold' : ''}`
              }
              to="/projects"
            >
              Projetos
            </NavLink>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user && (
              <span className="text-light small d-none d-md-inline">
                {user.username}
              </span>
            )}

            <button
              className="btn btn-sm btn-outline-light"
              type="button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="container page-container">
        <Outlet />
      </main>
    </div>
  );
}