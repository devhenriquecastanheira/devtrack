import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { RegisterPage } from './pages/RegisterPage';
import { TrackDetailsPage } from './pages/TrackDetailsPage';
import { TracksPage } from './pages/TracksPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/tracks/:id" element={<TrackDetailsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>
    </Routes>
  );
}