import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

// ============ TYPES ============
export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'inprogress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user?: { name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

// ============ AXIOS INSTANCE ============
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR: Automatically attach Token ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ SCHEMAS ============
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['user', 'admin']).default('user'),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['pending', 'inprogress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

type CreateUserType = z.infer<typeof userSchema>;
type CreateTaskType = z.infer<typeof taskSchema>;
type UpdateTaskType = Partial<CreateTaskType>;

// ============ HELPER FOR ERRORS ============
// This safely extracts the error message without using 'any'
const getErrorMessage = (error: unknown, defaultMessage: string) => {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};

// ============ AUTH API ============
export const authApi = {
  async register(userInfo: CreateUserType) {
    try {
      const res = await api.post<{ success: boolean; token?: string; user: User }>('/user/register', userInfo);
      
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Registration failed') };
    }
  },

  async login(credentials: { email: string; password: string }) {
    try {
      const res = await api.post<{ success: boolean; token?: string; user: User }>('/user/login', credentials);
      
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Login failed') };
    }
  },

  async logout() {
    localStorage.removeItem('token');
    try {
      await api.get('/user/logout');
    } catch (e) {
      // Ignore logout errors
    }
    return { success: true };
  },

  async getCurrentUser() {
    try {
      const res = await api.get<{ success: boolean; user: User }>('/user/me');
      if (res.data.success) {
        return res.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};

// ============ TASKS API ============
export const tasksApi = {
  async getAll() {
    try {
      const res = await api.get<{ success: boolean; tasks: Task[] }>('/task/getTask');
      return { success: true, data: res.data.tasks };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to fetch tasks') };
    }
  },

  async create(taskData: CreateTaskType) {
    try {
      const res = await api.post<{ success: boolean; task: Task }>('/task/createTask', taskData);
      return { success: true, data: res.data.task };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to create task') };
    }
  },

  async update(id: string, updates: UpdateTaskType) {
    try {
      const res = await api.patch<{ success: boolean; task: Task }>(`/task/updateTask/${id}`, updates);
      return { success: true, data: res.data.task };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to update task') };
    }
  },

  async delete(id: string) {
    try {
      await api.delete(`/task/deleteTask/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to delete task') };
    }
  }
};

export const initializeDemoData = async () => {};