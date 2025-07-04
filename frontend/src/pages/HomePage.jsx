import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Link, useLocation } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';

const HomePage = () => {
  const { tasks, loading, error, deleteTask } = useTasks();
  const location = useLocation();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, task: null });
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const getPriorityColor = (priority) => {
    // Backend uses boolean: true = high priority, false = low priority
    return priority ? 'priority-high' : 'priority-low';
  };

  const getPriorityText = (priority) => {
    return priority ? 'HIGH' : 'LOW';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteClick = (task, e) => {
    e.preventDefault(); // Prevent navigation to task detail
    e.stopPropagation();
    setDeleteDialog({ isOpen: true, task });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.task) return;
    
    try {
      setDeleting(true);
      await deleteTask(deleteDialog.task.id);
      setDeleteDialog({ isOpen: false, task: null });
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, task: null });
  };

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

  if (loading) {
    return (
      <div className="home-page">
        <div className="page-header">
          <h1>All Tasks</h1>
          <p>Manage and organize all your tasks</p>
        </div>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="page-header">
          <h1>All Tasks</h1>
          <p>Manage and organize all your tasks</p>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Your Tasks</h1>
        <p>Organize with ease, accomplish with zen</p>
        <Link to="/add-task" className="add-task-btn">
          + Add New Task
        </Link>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {(!tasks || tasks.length === 0) ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Get started by adding your first task!</p>
          <Link to="/add-task" className="btn-primary">Add Your First Task</Link>
        </div>
      ) : (
        <div className="tasks-container">
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card-wrapper">
                <Link 
                  to={`/task/${task.id}`} 
                  className="task-card-link"
                >
                  <div className="task-card">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="task-description">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description
                        }
                      </p>
                    )}

                    {task.category && (
                      <div className="task-category">
                        <span className="category-badge">{task.category}</span>
                      </div>
                    )}
                    
                    <div className="task-meta">
                      <span className="task-date">
                        Created: {formatDate(task.createdDate)}
                      </span>
                      {task.dueDate && (
                        <span className="task-due-date">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                      <span className="task-id">ID: {task.id}</span>
                    </div>

                    {task.completed && (
                      <div className="task-status">
                        <span className="completed-badge">✓ Completed</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="task-card-actions">
                  <Link 
                    to={`/task/${task.id}/edit`} 
                    className="edit-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteClick(task, e)}
                    disabled={deleting}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={deleteDialog.task ? `Are you sure you want to delete "${deleteDialog.task.title}"? This action cannot be undone.` : ''}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default HomePage; 