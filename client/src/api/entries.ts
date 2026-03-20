import api from './axios';
import { Entry } from '../types';

export interface EntryPayload {
  name: string;
  location: string;
  latitude?: string;
  longitude?: string;
  medianPrice: string;
  description: string;
}

export const getEntries = () => api.get<Entry[]>('/entries');

export const getEntry = (id: string) => api.get<Entry>(`/entries/${id}`);

export const createEntry = (data: EntryPayload) =>
  api.post<Entry>('/entries', data);

export const updateEntry = (id: string, data: EntryPayload) =>
  api.put<Entry>(`/entries/${id}`, data);

export const deleteEntry = (id: string) => api.delete(`/entries/${id}`);

export const uploadPhotos = (id: string, files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('photos', file));
  return api.post(`/entries/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePhoto = (id: string) => api.delete(`/photos/${id}`);
