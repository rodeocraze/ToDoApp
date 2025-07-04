import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="brand-highlight">Zen</span>
          </h1>
          <p className="hero-description">
            Make organizing easy. A minimalist approach to task management that brings clarity and calm to your busy life.
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
          <h2 className="features-title">Why Choose Zen?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧘</div>
              <h3>Mindful Organization</h3>
              <p>Clean, distraction-free interface that helps you focus on what truly matters without overwhelming complexity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Effortless Simplicity</h3>
              <p>Intuitive design that makes task management feel natural. No steep learning curves, just pure productivity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Clear Priorities</h3>
              <p>Simple priority system that helps you identify what needs attention without decision fatigue.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Private & Secure</h3>
              <p>Your personal space for organization. Secure, private, and completely focused on your needs.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to find your zen?</h2>
          <p>Join others who have discovered the peace of effortless organization.</p>
          <Link to="/register" className="btn-primary cta-btn">
            Begin Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 