export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed';

export type Project = {
  id: number;
  title: string;
  description: string;
  repository_url: string;
  deploy_url: string;
  technologies: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};