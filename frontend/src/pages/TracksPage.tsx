import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { createTrack, getTracks } from '../api/tracks';
import type { Track, TrackStatus } from '../types/track';

const statusLabels: Record<TrackStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

type TrackFormData = {
  title: string;
  description: string;
  status: TrackStatus;
};

const initialFormData: TrackFormData = {
  title: '',
  description: '',
  status: 'not_started',
};

export function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<TrackFormData>(initialFormData);
  const [isFormVisible, setIsFormVisible] = useState(false);

  async function loadTracks() {
    try {
      setErrorMessage('');
      const data = await getTracks();
      setTracks(data);
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error);
      setErrorMessage('Não foi possível carregar as trilhas.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTracks();
  }, []);

  function handleChange(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setErrorMessage('Informe o título da trilha.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const createdTrack = await createTrack({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });

      setTracks((currentTracks) => [createdTrack, ...currentTracks]);
      setFormData(initialFormData);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Erro ao criar trilha:', error);
      setErrorMessage('Não foi possível criar a trilha.');
    } finally {
      setIsSaving(false);
    }
  }

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

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setIsFormVisible((currentValue) => !currentValue)}
        >
          {isFormVisible ? 'Fechar' : 'Nova trilha'}
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {isFormVisible && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Nova trilha</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="title">
                  Título
                </label>
                <input
                  className="form-control"
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Django Backend"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="description">
                  Descrição
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Aprender Django, DRF, PostgreSQL e Docker."
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="not_started">Não iniciada</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar trilha'}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    setFormData(initialFormData);
                    setIsFormVisible(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
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