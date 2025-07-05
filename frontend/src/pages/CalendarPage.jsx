import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router-dom';

const CalendarPage = () => {
  const { tasks, loading, error } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Get tasks for a specific date (excluding archived)
  const getTasksForDate = (date) => {
    if (!tasks) return [];
    
    const dateString = date.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      // Filter out archived tasks
      if (task.archived) return false;
      
      // Check if task starts on this date
      const taskStartDate = task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : null;
      // Check if task is due on this date
      const taskDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null;
      
      return taskStartDate === dateString || taskDueDate === dateString;
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return null;
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes} ${ampm}`;
  };

  // Get tasks for selected date with timeline (excluding archived)
  const getTimelineForDate = (date) => {
    if (!date || !tasks) return [];
    
    const dateString = date.toISOString().split('T')[0];
    const dayTasks = [];
    
    tasks.forEach(task => {
      // Filter out archived tasks
      if (task.archived) return;
      
      const taskStartDate = task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : null;
      const taskDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null;
      
      // Add task if it starts on this date
      if (taskStartDate === dateString) {
        dayTasks.push({
          ...task,
          type: 'start',
          time: task.startTime,
          sortTime: task.startTime || '00:00'
        });
      }
      
      // Add task if it's due on this date (and not the same as start date)
      if (taskDueDate === dateString && taskStartDate !== dateString) {
        dayTasks.push({
          ...task,
          type: 'due',
          time: task.endTime,
          sortTime: task.endTime || '23:59'
        });
      }
    });
    
    // Sort by time
    return dayTasks.sort((a, b) => a.sortTime.localeCompare(b.sortTime));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tasksForDay = getTasksForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      
      days.push({
        date,
        day,
        tasksCount: tasksForDay.length,
        isToday,
        isSelected,
        tasks: tasksForDay
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const timelineTasks = selectedDate ? getTimelineForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="calendar-page">
        <div className="page-header">
          <h1>Calendar</h1>
          <p>View your tasks by date</p>
        </div>
        <div className="loading">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-page">
        <div className="page-header">
          <h1>Calendar</h1>
          <p>View your tasks by date</p>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View your tasks by date</p>
        <Link to="/add-task" className="add-task-btn">
          + Add New Task
        </Link>
      </div>

      <div className="calendar-container">
        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={goToPreviousMonth} className="nav-btn">
              ← Previous
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={goToNextMonth} className="nav-btn">
              Next →
            </button>
          </div>
          
          <button onClick={goToToday} className="today-btn">
            Go to Today
          </button>

          <div className="calendar-grid">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`calendar-day ${!dayData ? 'empty' : ''} ${
                  dayData?.isToday ? 'today' : ''
                } ${dayData?.isSelected ? 'selected' : ''} ${
                  dayData?.tasksCount > 0 ? 'has-tasks' : ''
                }`}
                onClick={() => dayData && setSelectedDate(dayData.date)}
              >
                {dayData && (
                  <>
                    <span className="day-number">{dayData.day}</span>
                    {dayData.tasksCount > 0 && (
                      <div className="task-indicator">
                        <span className="task-count">{dayData.tasksCount}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline for selected date */}
        {selectedDate && (
          <div className="timeline-section">
            <div className="timeline-header">
              <h3>
                Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="close-timeline"
              >
                ✕
              </button>
            </div>
            
            {timelineTasks.length === 0 ? (
              <div className="no-tasks">
                <p>No tasks scheduled for this date.</p>
                <Link to="/add-task" className="btn-primary">
                  Add a Task
                </Link>
              </div>
            ) : (
              <div className="timeline">
                {timelineTasks.map((task, index) => (
                  <div key={`${task.id}-${task.type}-${index}`} className="timeline-item">
                    <div className="timeline-time">
                      {formatTime(task.time) || 'All day'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-task">
                        <div className="task-header">
                          <Link to={`/task/${task.id}`} className="task-title">
                            {task.title}
                          </Link>
                          <div className="task-badges">
                            <span className={`type-badge ${task.type}`}>
                              {task.type === 'start' ? 'Starts' : 'Due'}
                            </span>
                            <span className={`priority-badge ${task.priority ? 'priority-high' : 'priority-low'}`}>
                              {task.priority ? 'HIGH' : 'LOW'}
                            </span>
                          </div>
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
                          <span className="category-badge">{task.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 