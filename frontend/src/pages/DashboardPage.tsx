import { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { DashboardSummary } from '../types/dashboard';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const response = await api.get<DashboardSummary>('/dashboard/summary/');
        setSummary(response.data);
      } finally {
        setIsLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (isLoading) {
    return <p>Carregando dashboard...</p>;
  }

  if (!summary) {
    return <p>Não foi possível carregar os dados do dashboard.</p>;
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Trilhas</h5>
              <p className="display-6">{summary.tracks_count}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Tópicos</h5>
              <p className="display-6">{summary.topics_count}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Projetos</h5>
              <p className="display-6">{summary.projects_count}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Progresso dos tópicos</h5>

          <p className="mb-2">
            {summary.completed_topics_count} concluídos de {summary.topics_count}
          </p>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${summary.topics_progress_percentage}%` }}
              aria-valuenow={summary.topics_progress_percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {summary.topics_progress_percentage}%
            </div>
          </div>

          <p className="text-muted mt-2 mb-0">
            {summary.pending_topics_count} tópicos pendentes
          </p>
        </div>
      </div>
    </div>
  );
}