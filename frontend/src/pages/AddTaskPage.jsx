import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';

const AddTaskPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: false, // boolean: false = low, true = high
    startDate: '',
    dueDate: '',
    startTime: '',
    endTime: '',
    completed: false,
    archived: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate date fields if both are provided
    if (formData.startDate && formData.dueDate) {
      const startDate = new Date(formData.startDate);
      const dueDate = new Date(formData.dueDate);
      
      if (startDate > dueDate) {
        newErrors.dueDate = 'Due date must be on or after start date';
      }
    }

    // Validate time fields if both are provided
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);
      
      if (startTime >= endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        completed: formData.completed,
        archived: formData.archived,
        // Convert dates to Date objects if provided
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        // Send time strings directly - backend expects LocalTime format
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        // createdDate will be set by backend
      };

      await taskAPI.addTask(taskData);
      // Navigate back to home page after successful submission
      navigate('/');
    } catch (error) {
      console.error('Error adding task:', error);
      setErrors({ submit: 'Failed to add task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="add-task-page">
      <div className="page-header">
        <h1>Add New Task</h1>
        <p>Bring clarity to your goals, one task at a time</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="task-form">
          <h3>Task Details</h3>
          
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
              disabled={loading}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter task category (e.g., Work, Personal, etc.)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
              disabled={loading}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={errors.endTime ? 'error' : ''}
                disabled={loading}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="priority"
                checked={formData.priority}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">High Priority</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">Mark as Completed</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="archived"
                checked={formData.archived}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">Archive Task</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding Task...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage; 