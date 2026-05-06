import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../api/projects';
import type { Project, ProjectStatus } from '../types/project';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { formatDate } from '../utils/formatDate';

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planejamento',
  in_progress: 'Em desenvolvimento',
  paused: 'Pausado',
  completed: 'Concluído',
};

type ProjectFormData = {
  title: string;
  description: string;
  repository_url: string;
  deploy_url: string;
  technologies: string;
  status: ProjectStatus;
};

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  repository_url: '',
  deploy_url: '',
  technologies: '',
  status: 'planning',
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [isFormVisible, setIsFormVisible] = useState(false);

  async function loadProjects() {
    try {
      setErrorMessage('');
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setErrorMessage('Não foi possível carregar os projetos.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setFormData(initialFormData);
    setEditingProjectId(null);
    setIsFormVisible(false);
  }

  function handleCreateClick() {
    setErrorMessage('');
    setEditingProjectId(null);
    setFormData(initialFormData);
    setIsFormVisible((currentValue) => !currentValue);
  }

  function handleEditClick(project: Project) {
    setErrorMessage('');
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      repository_url: project.repository_url,
      deploy_url: project.deploy_url,
      technologies: project.technologies,
      status: project.status,
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
      setErrorMessage('Informe o título do projeto.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        repository_url: formData.repository_url.trim(),
        deploy_url: formData.deploy_url.trim(),
        technologies: formData.technologies.trim(),
        status: formData.status,
      };

      if (editingProjectId) {
        const updatedProject = await updateProject(editingProjectId, payload);

        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        );
      } else {
        const createdProject = await createProject(payload);

        setProjects((currentProjects) => [createdProject, ...currentProjects]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      setErrorMessage('Não foi possível salvar o projeto.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeleteClick(project: Project) {
    setErrorMessage('');
    setProjectToDelete(project);
  }

  async function handleConfirmDelete() {
    if (!projectToDelete) {
      return;
    }

    try {
      setDeletingProjectId(projectToDelete.id);
      setErrorMessage('');

      await deleteProject(projectToDelete.id);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (currentProject) => currentProject.id !== projectToDelete.id,
        ),
      );

      if (editingProjectId === projectToDelete.id) {
        resetForm();
      }

      setProjectToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      setErrorMessage('Não foi possível excluir o projeto.');
    } finally {
      setDeletingProjectId(null);
    }
  }

  if (isLoading) {
    return <p>Carregando projetos...</p>;
  }

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Gerencie os projetos do seu portfólio."
        action={
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleCreateClick}
          >
            {isFormVisible && !editingProjectId ? 'Fechar' : 'Novo projeto'}
          </button>
        }
      />

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {isFormVisible && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingProjectId ? 'Editar projeto' : 'Novo projeto'}
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
                  placeholder="Ex: DevTrack"
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
                  placeholder="Ex: Plataforma para organizar estudos e projetos."
                  rows={3}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="repository_url">
                    URL do repositório
                  </label>
                  <input
                    className="form-control"
                    id="repository_url"
                    name="repository_url"
                    type="url"
                    value={formData.repository_url}
                    onChange={handleChange}
                    placeholder="https://github.com/usuario/repositorio"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="deploy_url">
                    URL do deploy
                  </label>
                  <input
                    className="form-control"
                    id="deploy_url"
                    name="deploy_url"
                    type="url"
                    value={formData.deploy_url}
                    onChange={handleChange}
                    placeholder="https://meu-projeto.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="technologies">
                  Tecnologias
                </label>
                <input
                  className="form-control"
                  id="technologies"
                  name="technologies"
                  type="text"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="Django, React, PostgreSQL, Docker"
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
                  <option value="planning">Planejamento</option>
                  <option value="in_progress">Em desenvolvimento</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Concluído</option>
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
                    : editingProjectId
                      ? 'Salvar alterações'
                      : 'Salvar projeto'}
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

      {!errorMessage && projects.length === 0 && (
        <div className="alert alert-info" role="alert">
          Nenhum projeto cadastrado ainda.
        </div>
      )}

      {!errorMessage && projects.length > 0 && (
        <div className="row g-3">
          {projects.map((project) => (
            <div className="col-md-6" key={project.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <h5 className="card-title mb-1">{project.title}</h5>
                      <span className="badge text-bg-secondary">
                        {statusLabels[project.status]}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        type="button"
                        onClick={() => handleEditClick(project)}
                        disabled={isSaving || deletingProjectId === project.id}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => handleDeleteClick(project)}
                        disabled={isSaving || deletingProjectId === project.id}
                      >
                        {deletingProjectId === project.id
                          ? 'Excluindo...'
                          : 'Excluir'}
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-muted mt-3 mb-2">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <p className="small mb-2">
                      <strong>Tecnologias:</strong> {project.technologies}
                    </p>
                  )}

                  <div className="d-flex gap-3 small">
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

                <div className="card-footer text-muted small">
                  Criado em{' '}
                  {formatDate(project.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {projectToDelete && (
        <ConfirmModal
          title="Excluir projeto"
          message={`Tem certeza que deseja excluir o projeto "${projectToDelete.title}"?`}
          description="Essa ação não poderá ser desfeita."
          confirmLabel="Excluir projeto"
          isLoading={deletingProjectId === projectToDelete.id}
          onCancel={() => setProjectToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}