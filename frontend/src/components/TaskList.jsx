const TaskList = ({ tasks, loading, error }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="task-list">
        <h3>Tasks</h3>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list">
        <h3>Tasks</h3>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list">
        <h3>Tasks</h3>
        <div className="empty-state">No tasks found. Add your first task above!</div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h3>Tasks ({tasks.length})</h3>
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task.taskID} className="task-card">
            <div className="task-header">
              <h4 className="task-title">{task.title}</h4>
              <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList; 