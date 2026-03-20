import api from './axios';
import { User } from '../types';

export const getUsers = () => api.get<User[]>('/users');

export const createUser = (data: { email: string; name: string; password: string; role: string }) =>
  api.post<User>('/users', data);

export const updateUser = (
  id: string,
  data: { email?: string; name?: string; password?: string; role?: string }
) => api.put<User>(`/users/${id}`, data);

export const deleteUser = (id: string) => api.delete(`/users/${id}`);
