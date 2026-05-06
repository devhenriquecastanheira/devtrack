import { NavLink, Outlet } from 'react-router';

export function Layout() {
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
        </div>
      </nav>

      <main className="container page-container">
        <Outlet />
      </main>
    </div>
  );
}