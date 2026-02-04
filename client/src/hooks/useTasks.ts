import { useState, useCallback, useEffect } from 'react';
import { tasksApi, type Task, taskSchema } from '../lib/Api';
import { z } from 'zod';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const response = await tasksApi.getAll();
    if (response.success && response.data) {
      setTasks(response.data);
    } else {
      setError(response.error || 'Failed to fetch tasks');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (data: z.infer<typeof taskSchema>) => {
    const response = await tasksApi.create(data);
    if (response.success && response.data) {
      setTasks(prev => [...prev, response.data!]);
      return { success: true, task: response.data };
    }
    return { success: false, error: response.error };
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<z.infer<typeof taskSchema>>) => {
    const response = await tasksApi.update(id, data);
    if (response.success && response.data) {
      setTasks(prev => prev.map(t => t._id === id ? response.data! : t));
      return { success: true, task: response.data };
    }
    return { success: false, error: response.error };
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const response = await tasksApi.delete(id);
    if (response.success) {
      setTasks(prev => prev.filter(t => t._id !== id));
      return { success: true };
    }
    return { success: false, error: response.error };
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
