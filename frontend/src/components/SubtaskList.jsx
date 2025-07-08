import { useState, useEffect } from 'react';
import { subtaskAPI } from '../services/api';
import ConfirmDialog from './ConfirmDialog';

const SubtaskList = ({ taskId, refreshTrigger }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingSubtask, setUpdatingSubtask] = useState(null);
  const [deletingSubtask, setDeletingSubtask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

  useEffect(() => {
    fetchSubtasks();
  }, [taskId, refreshTrigger]);

  const fetchSubtasks = async () => {
    try {
      setLoading(true);
      const subtasksData = await subtaskAPI.getSubtasksForTask(taskId);
      setSubtasks(subtasksData);
      setError(null);
    } catch (err) {
      console.error('Error fetching subtasks:', err);
      setError('Failed to load subtasks');
      setSubtasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (subtask) => {
    try {
      setUpdatingSubtask(subtask.id);
      const updatedSubtask = {
        ...subtask,
        completed: !subtask.completed
      };
      
      await subtaskAPI.updateSubtask(updatedSubtask);
      
      // Update local state
      setSubtasks(prev => prev.map(s => 
        s.id === subtask.id ? { ...s, completed: !s.completed } : s
      ));
    } catch (err) {
      console.error('Error updating subtask:', err);
      setError('Failed to update subtask');
    } finally {
      setUpdatingSubtask(null);
    }
  };

  const handleToggleArchive = async (subtask) => {
    try {
      setUpdatingSubtask(subtask.id);
      const updatedSubtask = {
        ...subtask,
        archived: !subtask.archived
      };
      
      await subtaskAPI.updateSubtask(updatedSubtask);
      
      // Update local state
      setSubtasks(prev => prev.map(s => 
        s.id === subtask.id ? { ...s, archived: !s.archived } : s
      ));
    } catch (err) {
      console.error('Error updating subtask:', err);
      setError('Failed to update subtask');
    } finally {
      setUpdatingSubtask(null);
    }
  };

  const handleDeleteSubtask = async () => {
    if (!subtaskToDelete) return;
    
    try {
      setDeletingSubtask(subtaskToDelete.id);
      await subtaskAPI.deleteSubtask(subtaskToDelete.id);
      
      // Remove from local state
      setSubtasks(prev => prev.filter(s => s.id !== subtaskToDelete.id));
      setShowDeleteDialog(false);
      setSubtaskToDelete(null);
    } catch (err) {
      console.error('Error deleting subtask:', err);
      setError('Failed to delete subtask');
    } finally {
      setDeletingSubtask(null);
    }
  };

  const openDeleteDialog = (subtask) => {
    setSubtaskToDelete(subtask);
    setShowDeleteDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority) => {
    return priority ? 'priority-high' : 'priority-low';
  };

  const getPriorityText = (priority) => {
    return priority ? 'HIGH' : 'LOW';
  };

  if (loading) {
    return (
      <div className="subtasks-section">
        <h3>Subtasks</h3>
        <div className="loading">Loading subtasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subtasks-section">
        <h3>Subtasks</h3>
        <div className="error-message">{error}</div>
        <button onClick={fetchSubtasks} className="btn-secondary btn-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="subtasks-section">
      <h3>Subtasks ({subtasks.length})</h3>
      
      {subtasks.length === 0 ? (
        <div className="empty-state">
          <p>No subtasks yet. Add one to break down this task into smaller steps.</p>
        </div>
      ) : (
        <div className="subtasks-list">
          {subtasks.map((subtask) => (
            <div 
              key={subtask.id} 
              className={`subtask-card ${subtask.completed ? 'completed' : ''} ${subtask.archived ? 'archived' : ''}`}
            >
              <div className="subtask-header">
                <div className="subtask-title-section">
                  <h4 className="subtask-title">{subtask.title}</h4>
                  <div className="subtask-badges">
                    <span className={`priority-badge ${getPriorityColor(subtask.priority)}`}>
                      {getPriorityText(subtask.priority)}
                    </span>
                    {subtask.completed && (
                      <span className="completed-badge">✓ Completed</span>
                    )}
                    {subtask.archived && (
                      <span className="archived-badge">Archived</span>
                    )}
                  </div>
                </div>
                <div className="subtask-id">#{subtask.id}</div>
              </div>

              {subtask.description && (
                <div className="subtask-description">
                  {subtask.description}
                </div>
              )}

              <div className="subtask-details">
                {subtask.category && (
                  <span className="subtask-category">
                    Category: {subtask.category}
                  </span>
                )}
                
                <div className="subtask-dates">
                  {subtask.startDate && (
                    <span className="subtask-date">
                      Start: {formatDate(subtask.startDate)}
                      {subtask.startTime && ` at ${formatTime(subtask.startTime)}`}
                    </span>
                  )}
                  {subtask.dueDate && (
                    <span className="subtask-date">
                      Due: {formatDate(subtask.dueDate)}
                      {subtask.endTime && ` at ${formatTime(subtask.endTime)}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="subtask-actions">
                <button
                  onClick={() => handleToggleComplete(subtask)}
                  className={`btn-sm ${subtask.completed ? 'btn-secondary' : 'btn-success'}`}
                  disabled={updatingSubtask === subtask.id}
                >
                  {updatingSubtask === subtask.id ? 'Updating...' : 
                   subtask.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                
                <button
                  onClick={() => handleToggleArchive(subtask)}
                  className="btn-archive btn-sm"
                  disabled={updatingSubtask === subtask.id}
                >
                  {updatingSubtask === subtask.id ? 'Updating...' : 
                   subtask.archived ? 'Unarchive' : 'Archive'}
                </button>
                
                <button
                  onClick={() => openDeleteDialog(subtask)}
                  className="btn-danger btn-sm"
                  disabled={deletingSubtask === subtask.id}
                >
                  {deletingSubtask === subtask.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSubtaskToDelete(null);
        }}
        onConfirm={handleDeleteSubtask}
        title="Delete Subtask"
        message={`Are you sure you want to delete "${subtaskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default SubtaskList; 