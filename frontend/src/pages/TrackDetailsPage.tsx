import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getTrackById } from '../api/tracks';
import type { Track, TrackStatus } from '../types/track';

const statusLabels: Record<TrackStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

export function TrackDetailsPage() {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadTrack() {
      if (!id) {
        setErrorMessage('Trilha não encontrada.');
        setIsLoading(false);
        return;
      }

      try {
        setErrorMessage('');
        const data = await getTrackById(Number(id));
        setTrack(data);
      } catch (error) {
        console.error('Erro ao carregar trilha:', error);
        setErrorMessage('Não foi possível carregar os detalhes da trilha.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTrack();
  }, [id]);

  if (isLoading) {
    return <p>Carregando trilha...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>

        <Link className="btn btn-outline-secondary" to="/tracks">
          Voltar para trilhas
        </Link>
      </div>
    );
  }

  if (!track) {
    return (
      <div>
        <div className="alert alert-warning" role="alert">
          Trilha não encontrada.
        </div>

        <Link className="btn btn-outline-secondary" to="/tracks">
          Voltar para trilhas
        </Link>
      </div>
    );
  }

  const completedTopicsCount = track.topics.filter(
    (topic) => topic.completed,
  ).length;

  const progressPercentage =
    track.topics.length > 0
      ? Math.round((completedTopicsCount / track.topics.length) * 100)
      : 0;

  return (
    <div>
      <div className="mb-4">
        <Link className="btn btn-sm btn-outline-secondary mb-3" to="/tracks">
          Voltar
        </Link>

        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h1 className="mb-2">{track.title}</h1>

            <span className="badge text-bg-secondary">
              {statusLabels[track.status]}
            </span>
          </div>
        </div>

        {track.description && (
          <p className="text-muted mt-3 mb-0">{track.description}</p>
        )}
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Progresso da trilha</h5>

          <p className="mb-2">
            {completedTopicsCount} concluídos de {track.topics.length} tópicos
          </p>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progressPercentage}%
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 mb-1">Tópicos</h2>
          <p className="text-muted mb-0">
            Conteúdos associados a esta trilha de estudo.
          </p>
        </div>

        <button className="btn btn-primary" type="button" disabled>
          Novo tópico
        </button>
      </div>

      {track.topics.length === 0 && (
        <div className="alert alert-info" role="alert">
          Nenhum tópico cadastrado para esta trilha ainda.
        </div>
      )}

      {track.topics.length > 0 && (
        <div className="card shadow-sm">
          <div className="list-group list-group-flush">
            {track.topics.map((topic) => (
              <div
                className="list-group-item d-flex justify-content-between align-items-start gap-3"
                key={topic.id}
              >
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      checked={topic.completed}
                      readOnly
                    />

                    <strong
                      className={topic.completed ? 'text-decoration-line-through' : ''}
                    >
                      {topic.title}
                    </strong>
                  </div>

                  {topic.description && (
                    <p className="text-muted small mb-0 mt-1">
                      {topic.description}
                    </p>
                  )}
                </div>

                <span className="badge text-bg-light">
                  Ordem {topic.order}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}