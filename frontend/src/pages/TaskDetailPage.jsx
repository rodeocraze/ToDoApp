import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskAPI.getTaskById(taskId);
        setTask(taskData);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const getPriorityColor = (priority) => {
    // Backend uses boolean: true = high priority, false = low priority
    return priority ? 'priority-high' : 'priority-low';
  };

  const getPriorityText = (priority) => {
    return priority ? 'HIGH PRIORITY' : 'LOW PRIORITY';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="task-detail-page">
        <div className="page-header">
          <Link to="/" className="back-link">← Back to All Tasks</Link>
          <h1>Loading Task...</h1>
        </div>
        <div className="loading">Loading task details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-detail-page">
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

  if (!task) {
    return (
      <div className="task-detail-page">
        <div className="page-header">
          <Link to="/" className="back-link">← Back to All Tasks</Link>
          <h1>Task Not Found</h1>
        </div>
        <div className="error">
          <p>The task you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to All Tasks</Link>
        <h1>Task Details</h1>
      </div>

      <div className="task-detail-container">
        <div className="task-detail-card">
          <div className="task-detail-header">
            <div className="task-title-section">
              <h2>{task.title}</h2>
              <div className="badges-section">
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
                {task.completed && (
                  <span className="completed-badge">✓ Completed</span>
                )}
              </div>
            </div>
            <div className="task-id">
              Task ID: {task.id}
            </div>
          </div>

          <div className="task-detail-content">
            <div className="detail-section">
              <h3>Description</h3>
              <div className="task-description-full">
                {task.description || 'No description provided.'}
              </div>
            </div>

            <div className="detail-section">
              <h3>Task Information</h3>
              <div className="task-info-grid">
                <div className="info-item">
                  <label>Priority Level:</label>
                  <span className={`priority-text ${getPriorityColor(task.priority)}`}>
                    {task.priority ? 'High' : 'Low'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span className={task.completed ? 'status-completed' : 'status-pending'}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Category:</label>
                  <span>{task.category || 'No category'}</span>
                </div>
                <div className="info-item">
                  <label>Task ID:</label>
                  <span>{task.id}</span>
                </div>
                <div className="info-item">
                  <label>Created:</label>
                  <span>{formatDate(task.createdDate)}</span>
                </div>
                <div className="info-item">
                  <label>Due Date:</label>
                  <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="task-detail-actions">
            <button 
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Back to All Tasks
            </button>
            <Link to="/add-task" className="btn-primary">
              Add Another Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage; 