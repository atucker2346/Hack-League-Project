import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SpaceBackground from '../components/SpaceBackground';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [useSpline, setUseSpline] = useState(true);
  const [splineLoaded, setSplineLoaded] = useState(false);
  
  const featuresRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    // Try to load Spline scene, fallback to gradient if it fails
    const timer = setTimeout(() => {
      if (!splineLoaded) {
        setUseSpline(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [splineLoaded]);

  useEffect(() => {
    // GSAP animations for smooth entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate features first
    if (featuresRef.current) {
      gsap.set(featuresRef.current.children, { opacity: 0, y: -30 });
      tl.to(featuresRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15
      });
    }

    // Animate title
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      }, '-=0.4');
    }

    // Animate subtitle
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.6');
    }

    // Animate buttons
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current.children, { opacity: 0, y: 20 });
      tl.to(buttonsRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
      }, '-=0.4');
    }
  }, []);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  const handleSplineError = () => {
    setUseSpline(false);
  };

  return (
    <div className="landing-page">
      <SpaceBackground />
      <div className="landing-hero">
        <div className="spline-container">
          {useSpline ? (
            <iframe
              src="https://my.spline.design/web3agencysaasherosection-IDFuNOSH9mYivppt8tVhqaZX/"
              title="Spline 3D Scene"
              className="spline-iframe"
              onLoad={handleSplineLoad}
              onError={handleSplineError}
              allow="fullscreen"
              style={{
                border: 'none',
                width: '100%',
                height: '100%'
              }}
            />
          ) : null}
          <div className={`spline-fallback ${useSpline && splineLoaded ? 'hidden' : ''}`}>
            <div className="fallback-gradient"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-features-top" ref={featuresRef}>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Matching</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚖️</span>
              <span>Partnered Law Firms</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Auto-Fill Forms</span>
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-title" ref={titleRef}>
              Find Your Class Action
              <span className="gradient-text"> Settlements</span>
            </h1>
            <p className="hero-subtitle" ref={subtitleRef}>
              AI-powered matching helps you discover and claim settlements you may qualify for. 
              Get matched with relevant class action settlements in minutes.
            </p>
            <div className="hero-actions" ref={buttonsRef}>
              {isAuthenticated ? (
                <>
                  <Link to="/questionnaire" className="cta-button primary">
                    Get AI Matched
                  </Link>
                  <Link to="/dashboard" className="cta-button secondary">
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="cta-button primary">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon-large">🎯</div>
            <h3>AI Matching</h3>
            <p>Answer a few questions and our AI will match you with relevant settlements based on your purchase history and experiences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-large">⚖️</div>
            <h3>Partnered Law Firms</h3>
            <p>Access direct support from partnered law firms for certain settlements. Get expert guidance and higher payout opportunities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-large">📝</div>
            <h3>Auto-Fill Forms</h3>
            <p>Streamline the claim process with intelligent auto-fill that extracts your information while you maintain full control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-large">💰</div>
            <h3>Track Earnings</h3>
            <p>Monitor your settlement claims and track potential earnings from all your active and completed claims.</p>
          </div>
        </div>
      </div>

      <div className="landing-cta">
        <div className="cta-container">
          <h2>Ready to Find Your Settlements?</h2>
          <p>Join thousands of users discovering settlements they may qualify for</p>
          {isAuthenticated ? (
            <Link to="/questionnaire" className="cta-button large">
              Start Matching Now
            </Link>
          ) : (
            <Link to="/register" className="cta-button large">
              Get Started Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;

