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
    dueDate: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskAPI.getTaskById(taskId);
        
        // Format the dueDate for the input field
        const formattedDueDate = taskData.dueDate ? 
          new Date(taskData.dueDate).toISOString().split('T')[0] : '';
        
        setTask({
          id: taskData.id,
          title: taskData.title || '',
          description: taskData.description || '',
          category: taskData.category || '',
          priority: taskData.priority || false,
          completed: taskData.completed || false,
          dueDate: formattedDueDate
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task.title.trim()) {
      setError('Task title is required');
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
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null
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