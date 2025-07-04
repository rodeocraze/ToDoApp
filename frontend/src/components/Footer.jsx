const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Zen</h4>
            <p>Make organizing easy</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Mindful Organization</li>
              <li>Clear Priorities</li>
              <li>Effortless Simplicity</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Built with React & Spring Boot</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Zen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 