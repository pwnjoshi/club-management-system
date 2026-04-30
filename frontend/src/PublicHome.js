import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Award, Sparkles } from 'lucide-react';

function PublicHome() {
  return (
    <div className="page shell-bg modern-landing">
      {/* 1. Navbar */}
      <nav className="modern-nav">
        <div className="nav-brand">QTrack</div>
        <div className="nav-actions">
          <Link className="nav-link" to="/verify">Verify Certificate</Link>
          <Link className="nav-link" to="/login">Sign In</Link>
          <Link className="btn primary small" to="/register">Get Started</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="modern-hero rise-up">
        <div className="hero-badge"><Sparkles size={16} className="inline-icon" /> The New Standard for Campus Life</div>
        <h1 className="hero-title">Revolutionize Your Campus Life</h1>
        <p className="hero-subtitle">
          A single, beautiful platform to discover events, track attendance, and manage your college club experience seamlessly.
        </p>
        <div className="hero-buttons">
          <Link className="btn primary large" to="/register">Join QTrack</Link>
          <a href="#features" className="btn ghost large">See How it Works</a>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="modern-features delay-1 rise-up">
        <div className="feature-grid">
          <div className="feature-item glass">
            <div className="feature-icon"><Calendar size={40} color="var(--brand)" /></div>
            <h3>Discover Events</h3>
            <p>Find and register for the best campus activities and workshops in one place.</p>
          </div>
          <div className="feature-item glass">
            <div className="feature-icon"><CheckCircle size={40} color="var(--brand)" /></div>
            <h3>Track Attendance</h3>
            <p>Effortless QR-based check-ins to keep your participation records accurate.</p>
          </div>
          <div className="feature-item glass">
            <div className="feature-icon"><Award size={40} color="var(--brand)" /></div>
            <h3>Earn Certificates</h3>
            <p>Automatically receive and showcase verified digital certificates for your events.</p>
          </div>
        </div>
      </section>

      {/* 4. CTA & Footer */}
      <section className="modern-cta delay-2 rise-up glass">
        <h2>Ready to upgrade your campus experience?</h2>
        <p>Join thousands of students and coordinators already using QTrack.</p>
        <Link className="btn primary large" to="/register">Create Free Account</Link>
      </section>

      <footer className="modern-footer">
        <p>© {new Date().getFullYear()} QTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PublicHome;
