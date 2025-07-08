import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to={isAuthenticated ? "/" : "/welcome"}>
            <h2>Zen</h2>
          </Link>
        </div>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Tasks
              </Link>
              <Link 
                to="/calendar" 
                className={`nav-link ${isActive('/calendar') ? 'active' : ''}`}
              >
                Calendar
              </Link>
              <Link 
                to="/add-task" 
                className={`nav-link ${isActive('/add-task') ? 'active' : ''}`}
              >
                Add Task
              </Link>
              <div className="nav-user">
                <span className="nav-username">Welcome, {user?.username}</span>
                <button onClick={handleLogout} className="nav-logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 