import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskAPI.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      await taskAPI.addTask(taskData);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      await taskAPI.updateTask(taskData);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await taskAPI.deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}; 