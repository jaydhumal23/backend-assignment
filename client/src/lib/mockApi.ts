// Mock API Layer - Simulates REST API with localStorage persistence
// This demonstrates proper API patterns for the assignment

import { z } from 'zod';

// ============ SCHEMAS & TYPES ============

export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type User = z.infer<typeof userSchema> & { id: string; createdAt: string };
export type Task = z.infer<typeof taskSchema> & { id: string; userId: string; createdAt: string; updatedAt: string };
export type Role = 'user' | 'admin';

// ============ STORAGE HELPERS ============

const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  TASKS: 'taskflow_tasks',
  CURRENT_USER: 'taskflow_current_user',
  TOKEN: 'taskflow_token',
} as const;

const getStorage = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const setStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ============ JWT SIMULATION ============

const generateToken = (userId: string, role: Role): string => {
  // Simulated JWT - In production, this would be signed on server
  const payload = { userId, role, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
};

const decodeToken = (token: string): { userId: string; role: Role; exp: number } | null => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  return decoded !== null && decoded.exp > Date.now();
};

// ============ PASSWORD HASHING SIMULATION ============

const hashPassword = async (password: string): Promise<string> => {
  // Simulated hashing - In production, use bcrypt on server
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'taskflow_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
};

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// ============ AUTH API ============

export const authApi = {
  async register(data: z.infer<typeof userSchema>): Promise<ApiResponse<{ user: Omit<User, 'password'>; token: string }>> {
    // Validate input
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message, statusCode: 400 };
    }

    const users = getStorage<User>(STORAGE_KEYS.USERS);
    
    // Check if email exists
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered', statusCode: 409 };
    }

    // Create user
    const hashedPassword = await hashPassword(data.password);
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role || 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);

    const token = generateToken(newUser.id, newUser.role);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, data: { user: userWithoutPassword, token }, statusCode: 201 };
  },

  async login(data: z.infer<typeof loginSchema>): Promise<ApiResponse<{ user: Omit<User, 'password'>; token: string }>> {
    // Validate input
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message, statusCode: 400 };
    }

    const users = getStorage<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === data.email);

    if (!user) {
      return { success: false, error: 'Invalid credentials', statusCode: 401 };
    }

    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials', statusCode: 401 };
    }

    const token = generateToken(user.id, user.role);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, data: { user: userWithoutPassword, token }, statusCode: 200 };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): Omit<User, 'password'> | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token || !isTokenValid(token)) {
      this.logout();
      return null;
    }
    try {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && isTokenValid(token)) {
      return token;
    }
    this.logout();
    return null;
  },

  // Admin only: Get all users
  async getAllUsers(): Promise<ApiResponse<Omit<User, 'password'>[]>> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required', statusCode: 403 };
    }

    const users = getStorage<User>(STORAGE_KEYS.USERS);
    const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
    return { success: true, data: usersWithoutPasswords, statusCode: 200 };
  },
};

// ============ TASKS API ============

export const tasksApi = {
  async create(data: z.infer<typeof taskSchema>): Promise<ApiResponse<Task>> {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Please login', statusCode: 401 };
    }

    // Validate input
    const validation = taskSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message, statusCode: 400 };
    }

    const tasks = getStorage<Task>(STORAGE_KEYS.TASKS);
    const newTask: Task = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      title: data.title,
      description: data.description || '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    setStorage(STORAGE_KEYS.TASKS, tasks);

    return { success: true, data: newTask, statusCode: 201 };
  },

  async getAll(): Promise<ApiResponse<Task[]>> {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Please login', statusCode: 401 };
    }

    const tasks = getStorage<Task>(STORAGE_KEYS.TASKS);
    
    // Admin sees all tasks, users see only their own
    const filteredTasks = currentUser.role === 'admin' 
      ? tasks 
      : tasks.filter(t => t.userId === currentUser.id);

    return { success: true, data: filteredTasks, statusCode: 200 };
  },

  async getById(id: string): Promise<ApiResponse<Task>> {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Please login', statusCode: 401 };
    }

    const tasks = getStorage<Task>(STORAGE_KEYS.TASKS);
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return { success: false, error: 'Task not found', statusCode: 404 };
    }

    // Check ownership (admin can access all)
    if (currentUser.role !== 'admin' && task.userId !== currentUser.id) {
      return { success: false, error: 'Forbidden: You do not own this task', statusCode: 403 };
    }

    return { success: true, data: task, statusCode: 200 };
  },

  async update(id: string, data: Partial<z.infer<typeof taskSchema>>): Promise<ApiResponse<Task>> {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Please login', statusCode: 401 };
    }

    const tasks = getStorage<Task>(STORAGE_KEYS.TASKS);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return { success: false, error: 'Task not found', statusCode: 404 };
    }

    const task = tasks[taskIndex];

    // Check ownership (admin can modify all)
    if (currentUser.role !== 'admin' && task.userId !== currentUser.id) {
      return { success: false, error: 'Forbidden: You do not own this task', statusCode: 403 };
    }

    // Validate partial update
    const partialSchema = taskSchema.partial();
    const validation = partialSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message, statusCode: 400 };
    }

    const updatedTask: Task = {
      ...task,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    setStorage(STORAGE_KEYS.TASKS, tasks);

    return { success: true, data: updatedTask, statusCode: 200 };
  },

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Please login', statusCode: 401 };
    }

    const tasks = getStorage<Task>(STORAGE_KEYS.TASKS);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return { success: false, error: 'Task not found', statusCode: 404 };
    }

    const task = tasks[taskIndex];

    // Check ownership (admin can delete all)
    if (currentUser.role !== 'admin' && task.userId !== currentUser.id) {
      return { success: false, error: 'Forbidden: You do not own this task', statusCode: 403 };
    }

    tasks.splice(taskIndex, 1);
    setStorage(STORAGE_KEYS.TASKS, tasks);

    return { success: true, data: { message: 'Task deleted successfully' }, statusCode: 200 };
  },
};

// Initialize with demo admin user if no users exist
export const initializeDemoData = async (): Promise<void> => {
  const users = getStorage<User>(STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const hashedPassword = await hashPassword('admin123');
    const adminUser: User = {
      id: crypto.randomUUID(),
      email: 'admin@taskflow.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.USERS, [adminUser]);
  }
};
