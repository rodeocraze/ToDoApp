import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    priority: false,
    completed: false,
    archived: false,
    startDate: '',
    dueDate: '',
    startTime: '',
    endTime: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskAPI.getTaskById(taskId);
        
        // Format the dates for the input fields
        const formattedStartDate = taskData.startDate ? 
          new Date(taskData.startDate).toISOString().split('T')[0] : '';
        const formattedDueDate = taskData.dueDate ? 
          new Date(taskData.dueDate).toISOString().split('T')[0] : '';
        
        setTask({
          id: taskData.id,
          title: taskData.title || '',
          description: taskData.description || '',
          category: taskData.category || '',
          priority: taskData.priority || false,
          completed: taskData.completed || false,
          archived: taskData.archived || false,
          startDate: formattedStartDate,
          dueDate: formattedDueDate,
          startTime: taskData.startTime || '',
          endTime: taskData.endTime || ''
        });
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!task.title.trim()) {
      setError('Task title is required');
      return false;
    }

    // Validate date fields if both are provided
    if (task.startDate && task.dueDate) {
      const startDate = new Date(task.startDate);
      const dueDate = new Date(task.dueDate);
      
      if (startDate > dueDate) {
        setError('Due date must be on or after start date');
        return false;
      }
    }

    // Validate time fields if both are provided
    if (task.startTime && task.endTime) {
      const startTime = new Date(`2000-01-01T${task.startTime}`);
      const endTime = new Date(`2000-01-01T${task.endTime}`);
      
      if (startTime >= endTime) {
        setError('End time must be after start time');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Prepare task data for submission
      const taskData = {
        id: task.id,
        title: task.title.trim(),
        description: task.description.trim(),
        category: task.category.trim(),
        priority: task.priority,
        completed: task.completed,
        archived: task.archived,
        startDate: task.startDate ? new Date(task.startDate).toISOString() : null,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        startTime: task.startTime || null,
        endTime: task.endTime || null
      };
      
      await taskAPI.updateTask(taskData);
      navigate(`/task/${taskId}`, { 
        state: { message: 'Task updated successfully!' }
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-task-page">
        <div className="page-header">
          <Link to={`/task/${taskId}`} className="back-link">← Back to Task</Link>
          <h1>Loading Task...</h1>
        </div>
        <div className="loading">Loading task details...</div>
      </div>
    );
  }

  if (error && !task.id) {
    return (
      <div className="edit-task-page">
        <div className="page-header">
          <Link to="/" className="back-link">← Back to All Tasks</Link>
          <h1>Error</h1>
        </div>
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <div className="page-header">
        <Link to={`/task/${taskId}`} className="back-link">← Back to Task Details</Link>
        <h1>Edit Task</h1>
        <p>Update your task details</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleInputChange}
              placeholder="Enter task description (optional)"
              rows="4"
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={task.category}
                onChange={handleInputChange}
                placeholder="e.g., Work, Personal, Shopping"
                disabled={saving}
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
                value={task.startDate}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={task.dueDate}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={task.startTime}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={task.endTime}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="priority"
                  checked={task.priority}
                  onChange={handleInputChange}
                  disabled={saving}
                />
                <span className="checkmark"></span>
                High Priority
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="completed"
                  checked={task.completed}
                  onChange={handleInputChange}
                  disabled={saving}
                />
                <span className="checkmark"></span>
                Mark as Completed
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="archived"
                  checked={task.archived}
                  onChange={handleInputChange}
                  disabled={saving}
                />
                <span className="checkmark"></span>
                Archive Task
              </label>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <Link 
              to={`/task/${taskId}`} 
              className="btn-secondary"
              style={{ pointerEvents: saving ? 'none' : 'auto' }}
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving || !task.title.trim()}
            >
              {saving ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage; 