import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Link, useLocation } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';

const HomePage = () => {
  const { tasks, loading, error, deleteTask, updateTask } = useTasks();
  const location = useLocation();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, task: null });
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archiving, setArchiving] = useState(null);

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
    if (!dateString) return null;
    
    const dateOnly = formatDate(dateString);
    const timeFormatted = formatTime(timeString);
    
    if (timeFormatted) {
      return `${dateOnly} at ${timeFormatted}`;
    }
    return dateOnly;
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

  const handleArchiveToggle = async (task, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setArchiving(task.id);
      await updateTask(task.id, { ...task, archived: !task.archived });
      setSuccessMessage(`Task "${task.title}" ${task.archived ? 'unarchived' : 'archived'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error archiving task:', err);
    } finally {
      setArchiving(null);
    }
  };

  // Filter tasks based on archived status
  const filteredTasks = tasks ? tasks.filter(task => showArchived ? task.archived : !task.archived) : [];

  // Helper function to get upcoming tasks (due within next 7 days)
  const getUpcomingTasks = () => {
    if (!tasks) return [];
    
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks.filter(task => {
      if (task.archived || task.completed) return false;
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  // Helper function to get overdue tasks
  const getOverdueTasks = () => {
    if (!tasks) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.archived || task.completed) return false;
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  // Helper function to render task cards
  const renderTaskCard = (task, showDueDate = false) => (
    <div key={task.id} className="task-card-wrapper">
      <Link to={`/task/${task.id}`} className="task-card-link">
        <div className="task-card">
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              {getPriorityText(task.priority)}
            </span>
          </div>
          
          {task.description && (
            <p className="task-description">
              {task.description.length > 80 
                ? `${task.description.substring(0, 80)}...` 
                : task.description
              }
            </p>
          )}

          {task.category && (
            <div className="task-category">
              <span className="category-badge">{task.category}</span>
            </div>
          )}
          
          {showDueDate && (
            <div className="task-meta">
              <span className="task-due-date">
                Due: {formatDateWithTime(task.dueDate, task.endTime)}
              </span>
            </div>
          )}

          <div className="task-status">
            {task.completed && (
              <span className="completed-badge">✓ Completed</span>
            )}
            {task.archived && (
              <span className="archived-badge">Archived</span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="task-card-actions">
        <Link 
          to={`/task/${task.id}/edit`} 
          className="edit-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </Link>
        <button 
          className="archive-btn"
          onClick={(e) => handleArchiveToggle(task, e)}
          disabled={archiving === task.id}
        >
          {archiving === task.id ? 'Processing...' : (task.archived ? 'Unarchive' : 'Archive')}
        </button>
        <button 
          className="delete-btn"
          onClick={(e) => handleDeleteClick(task, e)}
          disabled={deleting}
        >
          Delete
        </button>
      </div>
    </div>
  );

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
        <div className="page-actions">
          <Link to="/add-task" className="add-task-btn">
            + Add New Task
          </Link>
          <button 
            className={`archive-toggle-btn ${showArchived ? 'active' : ''}`}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Priority Sections - Only show for active tasks */}
      {!showArchived && (
        <>
          {/* Overdue Tasks Section */}
          {overdueTasks.length > 0 && (
            <div className="priority-section overdue-section">
              <div className="section-header">
                <h2>Overdue Tasks</h2>
                <span className="task-count">{overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="tasks-grid">
                {overdueTasks.map(task => renderTaskCard(task, true))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks Section */}
          {upcomingTasks.length > 0 && (
            <div className="priority-section upcoming-section">
              <div className="section-header">
                <h2>Upcoming Tasks</h2>
                <span className="task-count">{upcomingTasks.length} task{upcomingTasks.length !== 1 ? 's' : ''} due within 7 days</span>
              </div>
              <div className="tasks-grid">
                {upcomingTasks.map(task => renderTaskCard(task, true))}
              </div>
            </div>
          )}
        </>
      )}

      {/* All Tasks Section */}
      <div className="all-tasks-section">
        <div className="section-header">
          <h2>{showArchived ? 'Archived Tasks' : 'All Active Tasks'}</h2>
          {filteredTasks.length > 0 && (
            <span className="task-count">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {(!filteredTasks || filteredTasks.length === 0) ? (
          <div className="empty-state">
            <h3>{showArchived ? 'No archived tasks' : 'No active tasks found'}</h3>
            <p>{showArchived ? 'Your archived tasks will appear here.' : 'Get started by adding your first task!'}</p>
            {!showArchived && (
              <Link to="/add-task" className="btn-primary">Add Your First Task</Link>
            )}
          </div>
        ) : (
          <div className="tasks-container">
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
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
                        {formatDateWithTime(task.startDate, task.startTime) && (
                          <span className="task-start-date">
                            Starts: {formatDateWithTime(task.startDate, task.startTime)}
                          </span>
                        )}
                        {formatDateWithTime(task.dueDate, task.endTime) && (
                          <span className="task-due-date">
                            Due: {formatDateWithTime(task.dueDate, task.endTime)}
                          </span>
                        )}
                        <span className="task-id">ID: {task.id}</span>
                      </div>

                      <div className="task-status">
                        {task.completed && (
                          <span className="completed-badge">✓ Completed</span>
                        )}
                        {task.archived && (
                          <span className="archived-badge">Archived</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="task-card-actions">
                    <Link 
                      to={`/task/${task.id}/edit`} 
                      className="edit-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <button 
                      className="archive-btn"
                      onClick={(e) => handleArchiveToggle(task, e)}
                      disabled={archiving === task.id}
                    >
                      {archiving === task.id ? 'Processing...' : (task.archived ? 'Unarchive' : 'Archive')}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(task, e)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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