import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-highlight">TodoApp</span>
          </h1>
          <p className="hero-description">
            Organize your life, boost your productivity, and never miss a deadline again. 
            TodoApp helps you manage tasks with ease and efficiency.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary hero-btn">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary hero-btn">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose TodoApp?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Task Management</h3>
              <p>Create, organize, and track your tasks with ease. Set priorities and due dates to stay on top of your work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-standard security. Each user has their own private workspace.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Responsive</h3>
              <p>Built with modern technology for lightning-fast performance across all your devices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Priority System</h3>
              <p>Mark tasks as high or low priority to focus on what matters most and boost your productivity.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to get organized?</h2>
          <p>Join thousands of users who have transformed their productivity with TodoApp.</p>
          <Link to="/register" className="btn-primary cta-btn">
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 