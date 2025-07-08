import axios from 'axios';

const API_BASE_URL = '/main';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const authAPI = {
  setAuthHeader: (username, password) => {
    const credentials = btoa(`${username}:${password}`);
    api.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
  },

  clearAuthHeader: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  login: async (username, password) => {
    try {
      // Set auth header for this request
      const credentials = btoa(`${username}:${password}`);
      const response = await api.get('/tasks', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      // If successful, set the default header
      authAPI.setAuthHeader(username, password);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },
};

// Task API (unchanged but with authentication)
export const taskAPI = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }
  },

  addTask: async (taskData) => {
    try {
      const response = await api.post('/add', taskData);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  },

  updateTask: async (taskData) => {
    try {
      const response = await api.put('/tasks/update', taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },
};

// Subtask API
export const subtaskAPI = {
  addSubtask: async (taskId, subtaskData) => {
    try {
      const response = await api.post(`/${taskId}/add/subtask`, subtaskData);
      return response.data;
    } catch (error) {
      console.error('Error adding subtask:', error);
      throw new Error('Failed to add subtask');
    }
  },

  getSubtasksForTask: async (taskId) => {
    try {
      const response = await api.get(`/${taskId}/subtasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      throw new Error('Failed to fetch subtasks');
    }
  },

  getAllSubtasks: async () => {
    try {
      const response = await api.get('/subtasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching all subtasks:', error);
      throw new Error('Failed to fetch all subtasks');
    }
  },

  getSubtaskById: async (subtaskId) => {
    try {
      const response = await api.get(`/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subtask:', error);
      throw new Error('Failed to fetch subtask');
    }
  },

  updateSubtask: async (subtaskData) => {
    try {
      const response = await api.put('/subtasks/update', subtaskData);
      return response.data;
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw new Error('Failed to update subtask');
    }
  },

  deleteSubtask: async (subtaskId) => {
    try {
      const response = await api.delete(`/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw new Error('Failed to delete subtask');
    }
  },
};

export default api; 