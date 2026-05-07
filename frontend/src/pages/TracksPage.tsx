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
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { formatDate } from '../utils/formatDate';
import { useDebounce } from '../hooks/useDebounce';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { PaginationControls } from '../components/PaginationControls';

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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTracks, setTotalTracks] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const debouncedSearch = useDebounce(search);

  async function loadTracks() {
    try {
      setErrorMessage('');

      const data = await getTracks({
        search: debouncedSearch.trim() || undefined,
        status: statusFilter || undefined,
        ordering,
        page: currentPage,
      });

      setTracks(data.results);
      setTotalTracks(data.count);
      setHasNextPage(!!data.next);
      setHasPreviousPage(!!data.previous);
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error);
      setErrorMessage(
        getApiErrorMessage(error, 'Não foi possível carregar as trilhas.'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTracks();
  }, [debouncedSearch, statusFilter, ordering, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, ordering]);

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

  function handleClearFilters() {
    setSearch('');
    setStatusFilter('');
    setOrdering('-created_at');
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
        await updateTrack(editingTrackId, payload);
      } else {
        await createTrack(payload);
        setCurrentPage(1);
      }

      await loadTracks();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      setErrorMessage(
        getApiErrorMessage(error, 'Não foi possível salvar a trilha.'),
      );
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

    await loadTracks();

    if (editingTrackId === trackToDelete.id) {
      resetForm();
    }

    setTrackToDelete(null);
  } catch (error) {
    console.error('Erro ao excluir trilha:', error);
    setErrorMessage(
      getApiErrorMessage(error, 'Não foi possível excluir a trilha.'),
    );
  } finally {
    setDeletingTrackId(null);
  }
}

  if (isLoading) {
    return <p>Carregando trilhas...</p>;
  }

  const hasActiveFilters = !!search || !!statusFilter || ordering !== '-created_at';

  return (
    <div>
      <PageHeader
        title="Trilhas"
        description="Acompanhe suas trilhas de estudo e seus tópicos."
        action={
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleCreateClick}
          >
            {isFormVisible && !editingTrackId ? 'Fechar' : 'Nova trilha'}
          </button>
        }
      />

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label" htmlFor="search">
                Buscar
              </label>
              <input
                className="form-control"
                id="search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título ou descrição"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="status-filter">
                Status
              </label>
              <select
                className="form-select"
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">Todos</option>
                <option value="not_started">Não iniciada</option>
                <option value="in_progress">Em andamento</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label" htmlFor="ordering">
                Ordenar por
              </label>
              <select
                className="form-select"
                id="ordering"
                value={ordering}
                onChange={(event) => setOrdering(event.target.value)}
              >
                <option value="-created_at">Mais recentes</option>
                <option value="created_at">Mais antigas</option>
                <option value="title">Título A-Z</option>
                <option value="-title">Título Z-A</option>
                <option value="status">Status A-Z</option>
              </select>
            </div>

            <div className="col-md-1 d-grid">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleClearFilters}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
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
          {hasActiveFilters
            ? 'Nenhuma trilha encontrada com os filtros atuais.'
            : 'Nenhuma trilha cadastrada ainda. Crie sua primeira trilha de estudo para começar.'}
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
                      {formatDate(track.created_at)}
                    </td>

                    <td className="text-end">
                      <div className="table-actions d-flex justify-content-end gap-2">
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

          <PaginationControls
            currentPage={currentPage}
            totalItems={totalTracks}
            pageSize={6}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={setCurrentPage}
          />

        </div>
      )}
        {trackToDelete && (
          <ConfirmModal
            title="Excluir trilha"
            message={`Tem certeza que deseja excluir a trilha "${trackToDelete.title}"?`}
            description="Essa ação também removerá os tópicos vinculados a ela."
            confirmLabel="Excluir trilha"
            isLoading={deletingTrackId === trackToDelete.id}
            onCancel={() => setTrackToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
    </div>
  );
}