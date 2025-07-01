import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <h2>TodoApp</h2>
          </Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            All Tasks
          </Link>
          <Link 
            to="/add-task" 
            className={`nav-link ${isActive('/add-task') ? 'active' : ''}`}
          >
            Add Task
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 