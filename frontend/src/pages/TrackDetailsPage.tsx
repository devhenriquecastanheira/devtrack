import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getTrackById } from '../api/tracks';
import {
  createTopic,
  deleteTopic,
  updateTopic,
} from '../api/topics';
import type { Topic, Track, TrackStatus } from '../types/track';

const statusLabels: Record<TrackStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

type TopicFormData = {
  title: string;
  description: string;
  completed: boolean;
  order: number;
};

const initialTopicFormData: TopicFormData = {
  title: '',
  description: '',
  completed: false,
  order: 1,
};

export function TrackDetailsPage() {
  const { id } = useParams();
  const trackId = Number(id);

  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState<number | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [topicFormData, setTopicFormData] = useState<TopicFormData>(
    initialTopicFormData,
  );
  const [isTopicFormVisible, setIsTopicFormVisible] = useState(false);

  async function loadTrack() {
    if (!id || Number.isNaN(trackId)) {
      setErrorMessage('Trilha não encontrada.');
      setIsLoading(false);
      return;
    }

    try {
      setErrorMessage('');
      const data = await getTrackById(trackId);
      setTrack(data);
    } catch (error) {
      console.error('Erro ao carregar trilha:', error);
      setErrorMessage('Não foi possível carregar os detalhes da trilha.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrack();
  }, [id]);

  function resetTopicForm() {
    setTopicFormData(initialTopicFormData);
    setEditingTopicId(null);
    setIsTopicFormVisible(false);
  }

  function handleCreateTopicClick() {
    setErrorMessage('');
    setEditingTopicId(null);
    setTopicFormData({
      ...initialTopicFormData,
      order: track ? track.topics.length + 1 : 1,
    });
    setIsTopicFormVisible((currentValue) => !currentValue);
  }

  function handleEditTopicClick(topic: Topic) {
    setErrorMessage('');
    setEditingTopicId(topic.id);
    setTopicFormData({
      title: topic.title,
      description: topic.description,
      completed: topic.completed,
      order: topic.order,
    });
    setIsTopicFormVisible(true);
  }

  function handleTopicChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = event.target;

    setTopicFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleTopicCompletedChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setTopicFormData((currentFormData) => ({
      ...currentFormData,
      completed: checked,
    }));
  }

  async function handleTopicSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!track) {
      setErrorMessage('Trilha não encontrada.');
      return;
    }

    if (!topicFormData.title.trim()) {
      setErrorMessage('Informe o título do tópico.');
      return;
    }

    try {
      setIsSavingTopic(true);
      setErrorMessage('');

      const payload = {
        track: track.id,
        title: topicFormData.title.trim(),
        description: topicFormData.description.trim(),
        completed: topicFormData.completed,
        order: topicFormData.order,
      };

      if (editingTopicId) {
        const updatedTopic = await updateTopic(editingTopicId, payload);

        setTrack((currentTrack) => {
          if (!currentTrack) {
            return currentTrack;
          }

          return {
            ...currentTrack,
            topics: currentTrack.topics
              .map((topic) =>
                topic.id === updatedTopic.id ? updatedTopic : topic,
              )
              .sort((a, b) => a.order - b.order),
          };
        });
      } else {
        const createdTopic = await createTopic(payload);

        setTrack((currentTrack) => {
          if (!currentTrack) {
            return currentTrack;
          }

          return {
            ...currentTrack,
            topics: [...currentTrack.topics, createdTopic].sort(
              (a, b) => a.order - b.order,
            ),
          };
        });
      }

      resetTopicForm();
    } catch (error) {
      console.error('Erro ao salvar tópico:', error);
      setErrorMessage('Não foi possível salvar o tópico.');
    } finally {
      setIsSavingTopic(false);
    }
  }

  async function handleToggleTopicCompleted(topic: Topic) {
    try {
      setErrorMessage('');

      const updatedTopic = await updateTopic(topic.id, {
        track: topic.track,
        title: topic.title,
        description: topic.description,
        completed: !topic.completed,
        order: topic.order,
      });

      setTrack((currentTrack) => {
        if (!currentTrack) {
          return currentTrack;
        }

        return {
          ...currentTrack,
          topics: currentTrack.topics.map((currentTopic) =>
            currentTopic.id === updatedTopic.id ? updatedTopic : currentTopic,
          ),
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      setErrorMessage('Não foi possível atualizar o tópico.');
    }
  }

  function handleDeleteTopicClick(topic: Topic) {
    setErrorMessage('');
    setTopicToDelete(topic);
  }

  async function handleConfirmDeleteTopic() {
    if (!topicToDelete) {
      return;
    }

    try {
      setDeletingTopicId(topicToDelete.id);
      setErrorMessage('');

      await deleteTopic(topicToDelete.id);

      setTrack((currentTrack) => {
        if (!currentTrack) {
          return currentTrack;
        }

        return {
          ...currentTrack,
          topics: currentTrack.topics.filter(
            (topic) => topic.id !== topicToDelete.id,
          ),
        };
      });

      if (editingTopicId === topicToDelete.id) {
        resetTopicForm();
      }

      setTopicToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir tópico:', error);
      setErrorMessage('Não foi possível excluir o tópico.');
    } finally {
      setDeletingTopicId(null);
    }
  }

  if (isLoading) {
    return <p>Carregando trilha...</p>;
  }

  if (errorMessage && !track) {
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

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

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

        <button
          className="btn btn-primary"
          type="button"
          onClick={handleCreateTopicClick}
        >
          {isTopicFormVisible && !editingTopicId ? 'Fechar' : 'Novo tópico'}
        </button>
      </div>

      {isTopicFormVisible && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingTopicId ? 'Editar tópico' : 'Novo tópico'}
            </h5>

            <form onSubmit={handleTopicSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="topic-title">
                  Título
                </label>
                <input
                  className="form-control"
                  id="topic-title"
                  name="title"
                  type="text"
                  value={topicFormData.title}
                  onChange={handleTopicChange}
                  placeholder="Ex: Models e Migrations"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="topic-description">
                  Descrição
                </label>
                <textarea
                  className="form-control"
                  id="topic-description"
                  name="description"
                  value={topicFormData.description}
                  onChange={handleTopicChange}
                  placeholder="Ex: Aprender como o Django cria tabelas."
                  rows={3}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="topic-order">
                    Ordem
                  </label>
                  <input
                    className="form-control"
                    id="topic-order"
                    name="order"
                    type="number"
                    min={0}
                    value={topicFormData.order}
                    onChange={handleTopicChange}
                  />
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      id="topic-completed"
                      type="checkbox"
                      checked={topicFormData.completed}
                      onChange={handleTopicCompletedChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="topic-completed"
                    >
                      Tópico concluído
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={isSavingTopic}
                >
                  {isSavingTopic
                    ? 'Salvando...'
                    : editingTopicId
                      ? 'Salvar alterações'
                      : 'Salvar tópico'}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={isSavingTopic}
                  onClick={resetTopicForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      onChange={() => handleToggleTopicCompleted(topic)}
                    />

                    <strong
                      className={
                        topic.completed ? 'text-decoration-line-through' : ''
                      }
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

                <div className="d-flex align-items-center gap-2">
                  <span className="badge text-bg-light">
                    Ordem {topic.order}
                  </span>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    onClick={() => handleEditTopicClick(topic)}
                    disabled={isSavingTopic || deletingTopicId === topic.id}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    onClick={() => handleDeleteTopicClick(topic)}
                    disabled={isSavingTopic || deletingTopicId === topic.id}
                  >
                    {deletingTopicId === topic.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topicToDelete && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Excluir tópico</h5>
                  <button
                    className="btn-close"
                    type="button"
                    aria-label="Fechar"
                    disabled={deletingTopicId === topicToDelete.id}
                    onClick={() => setTopicToDelete(null)}
                  />
                </div>

                <div className="modal-body">
                  <p className="mb-1">
                    Tem certeza que deseja excluir o tópico{' '}
                    <strong>{topicToDelete.title}</strong>?
                  </p>

                  <p className="text-muted mb-0">
                    Essa ação não poderá ser desfeita.
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    disabled={deletingTopicId === topicToDelete.id}
                    onClick={() => setTopicToDelete(null)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    disabled={deletingTopicId === topicToDelete.id}
                    onClick={handleConfirmDeleteTopic}
                  >
                    {deletingTopicId === topicToDelete.id
                      ? 'Excluindo...'
                      : 'Excluir tópico'}
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