import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  createTrack,
  deleteTrack,
  getTracks,
  updateTrack,
} from '../api/tracks';
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
  const [deletingTrackId, setDeletingTrackId] = useState<number | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
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

  function resetForm() {
    setFormData(initialFormData);
    setEditingTrackId(null);
    setIsFormVisible(false);
  }

  function handleCreateClick() {
    setErrorMessage('');
    setEditingTrackId(null);
    setFormData(initialFormData);
    setIsFormVisible((currentValue) => !currentValue);
  }

  function handleEditClick(track: Track) {
    setErrorMessage('');
    setEditingTrackId(track.id);
    setFormData({
      title: track.title,
      description: track.description,
      status: track.status,
    });
    setIsFormVisible(true);
  }

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

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      if (editingTrackId) {
        const updatedTrack = await updateTrack(editingTrackId, payload);

        setTracks((currentTracks) =>
          currentTracks.map((track) =>
            track.id === updatedTrack.id ? updatedTrack : track,
          ),
        );
      } else {
        const createdTrack = await createTrack(payload);

        setTracks((currentTracks) => [createdTrack, ...currentTracks]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      setErrorMessage('Não foi possível salvar a trilha.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeleteClick(track: Track) {
  setErrorMessage('');
  setTrackToDelete(track);
}

async function handleConfirmDelete() {
  if (!trackToDelete) {
    return;
  }

  try {
    setDeletingTrackId(trackToDelete.id);
    setErrorMessage('');

    await deleteTrack(trackToDelete.id);

    setTracks((currentTracks) =>
      currentTracks.filter(
        (currentTrack) => currentTrack.id !== trackToDelete.id,
      ),
    );

    if (editingTrackId === trackToDelete.id) {
      resetForm();
    }

    setTrackToDelete(null);
  } catch (error) {
    console.error('Erro ao excluir trilha:', error);
    setErrorMessage('Não foi possível excluir a trilha.');
  } finally {
    setDeletingTrackId(null);
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
          onClick={handleCreateClick}
        >
          {isFormVisible && !editingTrackId ? 'Fechar' : 'Nova trilha'}
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
            <h5 className="card-title mb-3">
              {editingTrackId ? 'Editar trilha' : 'Nova trilha'}
            </h5>

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
                  {isSaving
                    ? 'Salvando...'
                    : editingTrackId
                      ? 'Salvar alterações'
                      : 'Salvar trilha'}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={isSaving}
                  onClick={resetForm}
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
                  <th className="text-end">Ações</th>
                </tr>
              </thead>

              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id}>
                    <td>
                      <Link
                        className="fw-bold text-decoration-none"
                        to={`/tracks/${track.id}`}
                      >
                        {track.title}
                      </Link>
                      
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

                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          onClick={() => handleEditClick(track)}
                          disabled={isSaving || deletingTrackId === track.id}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => handleDeleteClick(track)}
                          disabled={isSaving || deletingTrackId === track.id}
                        >
                          {deletingTrackId === track.id
                            ? 'Excluindo...'
                            : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        {trackToDelete && (
          <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0 shadow">
                  <div className="modal-header">
                    <h5 className="modal-title">Excluir trilha</h5>
                    <button
                      className="btn-close"
                      type="button"
                      aria-label="Fechar"
                      disabled={deletingTrackId === trackToDelete.id}
                      onClick={() => setTrackToDelete(null)}
                    />
                  </div>

                  <div className="modal-body">
                    <p className="mb-1">
                      Tem certeza que deseja excluir a trilha{' '}
                      <strong>{trackToDelete.title}</strong>?
                    </p>

                    <p className="text-muted mb-0">
                      Essa ação também removerá os tópicos vinculados a ela.
                    </p>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      disabled={deletingTrackId === trackToDelete.id}
                      onClick={() => setTrackToDelete(null)}
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn btn-danger"
                      type="button"
                      disabled={deletingTrackId === trackToDelete.id}
                      onClick={handleConfirmDelete}
                    >
                      {deletingTrackId === trackToDelete.id
                        ? 'Excluindo...'
                        : 'Excluir trilha'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show" />
          </>
        )}
    </div>
  );
}