import { Link, Outlet } from 'react-router';

export function Layout() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            DevTrack
          </Link>

          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Dashboard
            </Link>
            <Link className="nav-link" to="/tracks">
              Trilhas
            </Link>
            <Link className="nav-link" to="/projects">
              Projetos
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}