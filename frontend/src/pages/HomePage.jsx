import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { tasks, loading, error } = useTasks();

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
        <h1>All Tasks</h1>
        <p>Manage and organize all your tasks</p>
        <Link to="/add-task" className="add-task-btn">
          + Add New Task
        </Link>
      </div>

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
              <Link 
                key={task.id} 
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 