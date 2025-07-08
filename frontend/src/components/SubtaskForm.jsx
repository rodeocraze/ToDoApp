import { useState } from 'react';
import { subtaskAPI } from '../services/api';

const SubtaskForm = ({ taskId, onSubtaskAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: false,
    completed: false,
    archived: false,
    startDate: '',
    dueDate: '',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.startDate && formData.dueDate) {
      const startDate = new Date(formData.startDate);
      const dueDate = new Date(formData.dueDate);
      if (startDate > dueDate) {
        newErrors.dueDate = 'Due date cannot be before start date';
      }
    }

    if (formData.startTime && formData.endTime && formData.startDate === formData.dueDate) {
      if (formData.startTime >= formData.endTime) {
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
      const subtaskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        completed: formData.completed,
        archived: formData.archived,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
      };

      await subtaskAPI.addSubtask(taskId, subtaskData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: false,
        completed: false,
        archived: false,
        startDate: '',
        dueDate: '',
        startTime: '',
        endTime: '',
      });
      
      if (onSubtaskAdded) {
        onSubtaskAdded();
      }
    } catch (error) {
      console.error('Error adding subtask:', error);
      setErrors({ submit: 'Failed to add subtask. Please try again.' });
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
    <div className="subtask-form-container">
      <form onSubmit={handleSubmit} className="subtask-form">
        <h4>Add Subtask</h4>
        
        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Subtask Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter subtask title"
              disabled={loading}
              required
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter subtask description"
            disabled={loading}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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

        <div className="checkbox-row">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="priority"
                checked={formData.priority}
                onChange={handleChange}
                disabled={loading}
              />
              High Priority
            </label>
          </div>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                disabled={loading}
              />
              Mark as Completed
            </label>
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Subtask'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubtaskForm; 