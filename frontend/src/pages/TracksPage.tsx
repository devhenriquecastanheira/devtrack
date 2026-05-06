import { useEffect, useState } from 'react';
import { getTracks } from '../api/tracks';
import type { Track } from '../types/track';

const statusLabels: Record<Track['status'], string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

export function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await getTracks();
        setTracks(data);
      } catch (error) {
        console.error('Erro ao carregar trilhas:', error);
        setErrorMessage('Não foi possível carregar as trilhas.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTracks();
  }, []);

  if (isLoading) {
    return <p>Carregando trilhas...</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Trilhas</h1>
          <p className="text-muted mb-0">
            Acompanhe suas trilhas de estudo e seus tópicos.
          </p>
        </div>

        <button className="btn btn-primary" type="button">
          Nova trilha
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {!errorMessage && tracks.length === 0 && (
        <div className="alert alert-info" role="alert">
          Nenhuma trilha cadastrada ainda.
        </div>
      )}

      {!errorMessage && tracks.length > 0 && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Tópicos</th>
                  <th>Criada em</th>
                </tr>
              </thead>

              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id}>
                    <td>
                      <strong>{track.title}</strong>
                      {track.description && (
                        <div className="text-muted small">
                          {track.description}
                        </div>
                      )}
                    </td>

                    <td>{statusLabels[track.status]}</td>

                    <td>{track.topics.length}</td>

                    <td>
                      {new Intl.DateTimeFormat('pt-BR').format(
                        new Date(track.created_at),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}