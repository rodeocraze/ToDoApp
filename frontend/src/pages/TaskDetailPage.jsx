import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { taskAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import SubtaskForm from '../components/SubtaskForm';
import SubtaskList from '../components/SubtaskList';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskRefreshTrigger, setSubtaskRefreshTrigger] = useState(0);

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

  useEffect(() => {
    // Check if we have a success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleDeleteTask = async () => {
    try {
      setDeleting(true);
      await taskAPI.deleteTask(task.id);
      setShowDeleteDialog(false);
      navigate('/', { 
        state: { message: 'Task deleted successfully!' }
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      setArchiving(true);
      const updatedTask = await taskAPI.updateTask(task.id, { 
        ...task, 
        archived: !task.archived 
      });
      setTask(updatedTask);
      setSuccessMessage(`Task ${task.archived ? 'unarchived' : 'archived'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error archiving task:', err);
      setError(err.message || 'Failed to archive task');
    } finally {
      setArchiving(false);
    }
  };

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
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    // Handle LocalTime format (HH:MM:SS or HH:MM)
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    
    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes} ${ampm}`;
  };

  const formatDateWithTime = (dateString, timeString) => {
    if (!dateString) return 'No date set';
    
    const dateOnly = formatDate(dateString);
    const timeFormatted = formatTime(timeString);
    
    if (timeFormatted) {
      return `${dateOnly} at ${timeFormatted}`;
    }
    return dateOnly;
  };

  const handleSubtaskAdded = () => {
    setShowSubtaskForm(false);
    setSubtaskRefreshTrigger(prev => prev + 1);
    setSuccessMessage('Subtask added successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
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
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
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
                {task.archived && (
                  <span className="archived-badge">Archived</span>
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
                  <label>Start Date:</label>
                  <span>{formatDateWithTime(task.startDate, task.startTime)}</span>
                </div>
                <div className="info-item">
                  <label>Due Date:</label>
                  <span>{formatDateWithTime(task.dueDate, task.endTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="subtasks-container">
          <div className="subtasks-header">
            <h3>Subtasks</h3>
            <button 
              onClick={() => setShowSubtaskForm(!showSubtaskForm)}
              className="btn-primary btn-sm"
            >
              {showSubtaskForm ? 'Cancel' : 'Add Subtask'}
            </button>
          </div>

          {showSubtaskForm && (
            <SubtaskForm 
              taskId={task.id}
              onSubtaskAdded={handleSubtaskAdded}
              onCancel={() => setShowSubtaskForm(false)}
            />
          )}

          <SubtaskList 
            taskId={task.id}
            refreshTrigger={subtaskRefreshTrigger}
          />
        </div>

        <div className="task-detail-card task-actions-card">
          <div className="task-detail-actions">
            <button 
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Back to All Tasks
            </button>
            <Link to={`/task/${task.id}/edit`} className="btn-primary">
              Edit Task
            </Link>
            <button 
              onClick={handleArchiveToggle}
              className="btn-archive"
              disabled={archiving}
            >
              {archiving ? 'Processing...' : (task.archived ? 'Unarchive' : 'Archive')}
            </button>
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="btn-danger"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Task'}
            </button>
            <Link to="/add-task" className="btn-outline">
              Add Another Task
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default TaskDetailPage; 