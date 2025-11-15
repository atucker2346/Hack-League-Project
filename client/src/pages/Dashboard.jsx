import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { settlementService } from '../services/settlementService';
import LoadingSpinner from '../components/LoadingSpinner';
import EarningsSummary from '../components/EarningsSummary';
import { getCompanyIcon, getCategoryIcon } from '../utils/companyIcons';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const actionsRef = useRef(null);
  const cardsRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    loadSettlements();
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [loading]);

  const loadSettlements = async () => {
    try {
      const data = await settlementService.getAll();
      setSettlements(data.slice(0, 3)); // Show first 3 on dashboard
    } catch (error) {
      console.error('Failed to load settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header" ref={headerRef}>
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Discover settlements you may qualify for</p>
      </div>

      <EarningsSummary />

      <div className="dashboard-actions" ref={actionsRef}>
        <Link to="/questionnaire" className="action-button primary">
          <span className="button-icon">🤖</span>
          Get AI Matched
        </Link>
        <Link to="/settlements" className="action-button secondary">
          <span className="button-icon">🔍</span>
          Browse All Settlements
        </Link>
        <Link to="/subscription" className="action-button secondary">
          <span className="button-icon">⭐</span>
          Manage Subscription
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Recent Settlements</h2>
        <div className="settlements-grid" ref={cardsRef}>
          {settlements.map((settlement) => (
            <div key={settlement.id} className="settlement-card-preview">
              <div className="preview-card-header">
                <img 
                  src={getCompanyIcon(settlement.company)} 
                  alt={settlement.company}
                  className="preview-company-icon"
                />
                <div className="preview-header-content">
                  <h3>{settlement.name}</h3>
                  <p className="settlement-category">
                    <span className="category-icon">{getCategoryIcon(settlement.category)}</span>
                    {settlement.category}
                  </p>
                </div>
              </div>
              <p className="settlement-description">{settlement.description}</p>
              <div className="settlement-meta">
                <div className="meta-item">
                  <span className="meta-label">Deadline:</span>
                  <span className="meta-value">{new Date(settlement.deadline).toLocaleDateString()}</span>
                </div>
                <div className="meta-item highlight">
                  <span className="meta-label">Potential:</span>
                  <span className="meta-value">${settlement.potentialAmount.min} - ${settlement.potentialAmount.max}</span>
                </div>
              </div>
              <Link
                to={`/settlements`}
                className="view-link"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-info">
        <h3>How It Works</h3>
        <div className="info-steps" ref={stepsRef}>
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Discover Settlements</h4>
              <p>Browse available class action settlements</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Check Eligibility</h4>
              <p>We'll help detect if you may qualify</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Auto-Fill Forms</h4>
              <p>We'll help fill out claim forms (you review everything)</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Submit Claim</h4>
              <p>Review and submit through the official settlement site</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

