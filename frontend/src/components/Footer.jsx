const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>TodoApp</h4>
            <p>Your productivity companion</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Task Management</li>
              <li>Priority Levels</li>
              <li>Real-time Updates</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Built with React & Spring Boot</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} TodoApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 