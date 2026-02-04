import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Student Information System</h1>
        <p className="home-description">
          Manage student records efficiently with our Registrar dashboard.
        </p>
      </div>
      
      <div className="dashboard-cards">
        <Link to="/students" className="dashboard-card card-students">
          <div className="card-icon">👥</div>
          <h3>Total Students</h3>
          <p className="card-number">124</p>
          <p className="card-label">Enrolled</p>
          <span className="card-link">View All →</span>
        </Link>
        
        <Link to="/students?action=add" className="dashboard-card card-primary">
          <div className="card-icon">➕</div>
          <h3>Register New</h3>
          <p className="card-description">Add a new student to the system</p>
          <span className="card-link">Get Started →</span>
        </Link>
        
        <div className="dashboard-card card-status">
          <div className="card-icon">✓</div>
          <h3>System Status</h3>
          <p className="status-indicator online">System Online</p>
          <p className="card-description">All systems operational</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
