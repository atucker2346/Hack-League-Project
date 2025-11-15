import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SettlementCard from '../components/SettlementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './AIMatched.css';

const AIMatched = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState(null);
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [loading, matches]);

  const loadMatches = () => {
    const stored = sessionStorage.getItem('aiMatchResults');
    if (stored) {
      const data = JSON.parse(stored);
      setMatches(data.matches || []);
      setMatchInfo(data);
    } else {
      // No matches found, redirect to questionnaire
      navigate('/questionnaire');
    }
    setLoading(false);
  };

  const handleRetake = () => {
    sessionStorage.removeItem('aiMatchResults');
    navigate('/questionnaire');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (matches.length === 0) {
    return (
      <div className="ai-matched-page">
        <div className="no-matches">
          <h2>No Matches Found</h2>
          <p>We couldn't find any settlements that match your profile at this time.</p>
          <button onClick={handleRetake} className="retake-button">
            Retake Questionnaire
          </button>
        </div>
      </div>
    );
  }

  const highConfidenceMatches = matches.filter(m => m.confidence === 'high');
  const mediumConfidenceMatches = matches.filter(m => m.confidence === 'medium');
  const lowConfidenceMatches = matches.filter(m => m.confidence === 'low');

  return (
    <div className="ai-matched-page">
      <div className="ai-matched-header" ref={headerRef}>
        <h1>🎯 Your AI Matched Settlements</h1>
        <p>We found {matches.length} settlement{matches.length !== 1 ? 's' : ''} that may match your profile</p>
        <div className="header-actions">
          <button onClick={handleRetake} className="retake-button">
            Retake Questionnaire
          </button>
          <Link to="/settlements" className="view-all-button">
            View All Settlements
          </Link>
        </div>
      </div>

      {highConfidenceMatches.length > 0 && (
        <div className="matches-section" ref={el => sectionsRef.current[0] = el?.querySelector('.settlements-grid')}>
          <div className="section-header">
            <h2>⭐ High Confidence Matches</h2>
            <p className="section-description">These settlements have a strong match with your profile</p>
          </div>
          <div className="settlements-grid">
            {highConfidenceMatches.map((settlement) => (
              <div key={settlement.id} className="match-card-wrapper">
                <SettlementCard settlement={settlement} />
                <div className="match-info">
                  <div className="match-score">
                    <span className="score-label">Match Score:</span>
                    <span className="score-value">{settlement.matchScore}%</span>
                  </div>
                  <div className="match-reasons">
                    <strong>Why this matches:</strong>
                    <ul>
                      {settlement.matchReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumConfidenceMatches.length > 0 && (
        <div className="matches-section" ref={el => sectionsRef.current[1] = el?.querySelector('.settlements-grid')}>
          <div className="section-header">
            <h2>📋 Medium Confidence Matches</h2>
            <p className="section-description">These settlements may be relevant to your situation</p>
          </div>
          <div className="settlements-grid">
            {mediumConfidenceMatches.map((settlement) => (
              <div key={settlement.id} className="match-card-wrapper">
                <SettlementCard settlement={settlement} />
                <div className="match-info">
                  <div className="match-score">
                    <span className="score-label">Match Score:</span>
                    <span className="score-value">{settlement.matchScore}%</span>
                  </div>
                  <div className="match-reasons">
                    <strong>Why this matches:</strong>
                    <ul>
                      {settlement.matchReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowConfidenceMatches.length > 0 && (
        <div className="matches-section" ref={el => sectionsRef.current[2] = el?.querySelector('.settlements-grid')}>
          <div className="section-header">
            <h2>💡 Low Confidence Matches</h2>
            <p className="section-description">These settlements might be worth reviewing</p>
          </div>
          <div className="settlements-grid">
            {lowConfidenceMatches.map((settlement) => (
              <div key={settlement.id} className="match-card-wrapper">
                <SettlementCard settlement={settlement} />
                <div className="match-info">
                  <div className="match-score">
                    <span className="score-label">Match Score:</span>
                    <span className="score-value">{settlement.matchScore}%</span>
                  </div>
                  <div className="match-reasons">
                    <strong>Why this matches:</strong>
                    <ul>
                      {settlement.matchReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatched;

