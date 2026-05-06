import { api } from './api';
import type { Topic } from '../types/track';

export type SaveTopicRequest = {
  track: number;
  title: string;
  description: string;
  completed: boolean;
  order: number;
};

export async function createTopic(data: SaveTopicRequest) {
  const response = await api.post<Topic>('/topics/', data);
  return response.data;
}

export async function updateTopic(id: number, data: SaveTopicRequest) {
  const response = await api.put<Topic>(`/topics/${id}/`, data);
  return response.data;
}

export async function deleteTopic(id: number) {
  await api.delete(`/topics/${id}/`);
}