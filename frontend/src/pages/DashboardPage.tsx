import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getDashboardSummary } from '../api/dashboard';
import { getProjects } from '../api/projects';
import { getTracks } from '../api/tracks';
import { PageHeader } from '../components/PageHeader';
import type { DashboardSummary } from '../types/dashboard';
import type { Project } from '../types/project';
import type { Track, TrackStatus } from '../types/track';
import { formatDate } from '../utils/formatDate';

const trackStatusLabels: Record<TrackStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

const projectStatusLabels: Record<Project['status'], string> = {
  planning: 'Planejamento',
  in_progress: 'Em desenvolvimento',
  paused: 'Pausado',
  completed: 'Concluído',
};

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setErrorMessage('');

        const [summaryData, tracksData, projectsData] = await Promise.all([
          getDashboardSummary(),
          getTracks(),
          getProjects(),
        ]);

        setSummary(summaryData);
        setTracks(tracksData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setErrorMessage('Não foi possível carregar os dados do dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <p>Carregando dashboard...</p>;
  }

  if (errorMessage || !summary) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Visão geral das suas trilhas, tópicos e projetos."
        />

        <div className="alert alert-danger" role="alert">
          {errorMessage || 'Não foi possível carregar o dashboard.'}
        </div>
      </div>
    );
  }

  const latestTracks = tracks.slice(0, 3);

  const inProgressProjects = projects
    .filter((project) => project.status === 'in_progress')
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas trilhas, tópicos e projetos."
        action={
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to="/tracks">
              Ver trilhas
            </Link>

            <Link className="btn btn-primary" to="/projects">
              Ver projetos
            </Link>
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Trilhas</p>
              <h2 className="display-6 mb-0">{summary.tracks_count}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Tópicos</p>
              <h2 className="display-6 mb-0">{summary.topics_count}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Tópicos concluídos</p>
              <h2 className="display-6 mb-0">
                {summary.completed_topics_count}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Projetos</p>
              <h2 className="display-6 mb-0">{summary.projects_count}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title mb-1">Progresso geral</h5>
                  <p className="text-muted mb-0">
                    Acompanhamento dos tópicos concluídos.
                  </p>
                </div>

                <span className="badge text-bg-primary">
                  {summary.topics_progress_percentage}%
                </span>
              </div>

              <div className="progress mb-3" style={{ height: 24 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${summary.topics_progress_percentage}%`,
                  }}
                  aria-valuenow={summary.topics_progress_percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {summary.topics_progress_percentage}%
                </div>
              </div>

              <div className="row text-center">
                <div className="col">
                  <strong>{summary.completed_topics_count}</strong>
                  <div className="text-muted small">Concluídos</div>
                </div>

                <div className="col">
                  <strong>{summary.pending_topics_count}</strong>
                  <div className="text-muted small">Pendentes</div>
                </div>

                <div className="col">
                  <strong>{summary.topics_count}</strong>
                  <div className="text-muted small">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Atalhos rápidos</h5>

              <div className="d-grid gap-2">
                <Link className="btn btn-outline-primary" to="/tracks">
                  Gerenciar trilhas
                </Link>

                <Link className="btn btn-outline-primary" to="/projects">
                  Gerenciar projetos
                </Link>

                {latestTracks[0] && (
                  <Link
                    className="btn btn-outline-secondary"
                    to={`/tracks/${latestTracks[0].id}`}
                  >
                    Continuar última trilha
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Últimas trilhas</h5>

                <Link className="small" to="/tracks">
                  Ver todas
                </Link>
              </div>

              {latestTracks.length === 0 && (
                <div className="alert alert-info mb-0" role="alert">
                  Nenhuma trilha cadastrada ainda.
                </div>
              )}

              {latestTracks.length > 0 && (
                <div className="list-group list-group-flush">
                  {latestTracks.map((track) => (
                    <Link
                      className="list-group-item list-group-item-action px-0"
                      key={track.id}
                      to={`/tracks/${track.id}`}
                    >
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <strong>{track.title}</strong>

                          {track.description && (
                            <div className="text-muted small">
                              {track.description}
                            </div>
                          )}
                        </div>

                        <span className="badge text-bg-secondary align-self-start">
                          {trackStatusLabels[track.status]}
                        </span>
                      </div>

                      <div className="text-muted small mt-1">
                        Criada em {formatDate(track.created_at)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Projetos em andamento</h5>

                <Link className="small" to="/projects">
                  Ver todos
                </Link>
              </div>

              {inProgressProjects.length === 0 && (
                <div className="alert alert-info mb-0" role="alert">
                  Nenhum projeto em andamento no momento.
                </div>
              )}

              {inProgressProjects.length > 0 && (
                <div className="list-group list-group-flush">
                  {inProgressProjects.map((project) => (
                    <div
                      className="list-group-item px-0"
                      key={project.id}
                    >
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <strong>{project.title}</strong>

                          {project.description && (
                            <div className="text-muted small">
                              {project.description}
                            </div>
                          )}
                        </div>

                        <span className="badge text-bg-secondary align-self-start">
                          {projectStatusLabels[project.status]}
                        </span>
                      </div>

                      {project.technologies && (
                        <div className="text-muted small mt-1">
                          {project.technologies}
                        </div>
                      )}

                      <div className="d-flex gap-3 small mt-2">
                        {project.repository_url && (
                          <a
                            href={project.repository_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Repositório
                          </a>
                        )}

                        {project.deploy_url && (
                          <a
                            href={project.deploy_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Deploy
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}