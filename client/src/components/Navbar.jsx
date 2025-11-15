import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(navbarRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
      );
    }
    if (linksRef.current) {
      gsap.fromTo(linksRef.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" ref={logoRef}>
          <img src="/logo.png" alt="SFM Logo" className="navbar-logo" />
        </Link>
        <div className="navbar-links" ref={linksRef}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/questionnaire">AI Match</Link>
          <Link to="/settlements">All Settlements</Link>
          <Link to="/subscription">Subscription</Link>
          <span className="navbar-user">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

