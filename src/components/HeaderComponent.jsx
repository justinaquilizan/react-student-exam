import { Link } from 'react-router-dom';
import logo from '../assets/LJK-Logo.png';
import './HeaderComponent.css';

function HeaderComponent() {
  return (
    <header className="header">
      <div className="header-brand">
        <img src={logo} alt="LJK School of Technology" className="header-logo" />
        <h1 className="header-title">Student Information System</h1>
      </div>
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/students" className="nav-link">Students</Link>
      </nav>
    </header>
  );
}

export default HeaderComponent;
