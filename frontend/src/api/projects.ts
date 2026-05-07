import { api } from './api';
import type { PaginatedResponse } from '../types/pagination';
import type { Project, ProjectStatus } from '../types/project';

export type SaveProjectRequest = {
  title: string;
  description: string;
  repository_url: string;
  deploy_url: string;
  technologies: string;
  status: ProjectStatus;
};

export type GetProjectsParams = {
  search?: string;
  status?: string;
  ordering?: string;
  page?: number;
};

export async function getProjects(params?: GetProjectsParams) {
  const response = await api.get<PaginatedResponse<Project>>('/projects/', {
    params,
  });

  return response.data;
}

export async function createProject(data: SaveProjectRequest) {
  const response = await api.post<Project>('/projects/', data);
  return response.data;
}

export async function updateProject(id: number, data: SaveProjectRequest) {
  const response = await api.put<Project>(`/projects/${id}/`, data);
  return response.data;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/${id}/`);
}