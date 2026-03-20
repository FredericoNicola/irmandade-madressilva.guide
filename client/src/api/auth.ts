import api from './axios';
import { User } from '../types';

export const login = (email: string, password: string) =>
  api.post<{ token: string; user: User }>('/auth/login', { email, password });

export const getMe = () => api.get<User>('/auth/me');
