import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { claimService } from '../services/claimService';
import { getCompanyIcon, getCategoryIcon } from '../utils/companyIcons';
import LawFirmBadge from './LawFirmBadge';
import './SettlementCard.css';

const SettlementCard = ({ settlement }) => {
  const [checking, setChecking] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, []);

  const handleCheckEligibility = async () => {
    setChecking(true);
    try {
      const result = await claimService.detectEligibility(settlement.id);
      setEligibility(result);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    } finally {
      setChecking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div 
      className="settlement-card" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="settlement-card-header">
        <div className="company-icon-wrapper">
          <img 
            src={getCompanyIcon(settlement.company)} 
            alt={settlement.company}
            className="company-icon"
          />
        </div>
        <div className="settlement-header-content">
          <div className="settlement-header">
            <h3>{settlement.name}</h3>
            <span className="settlement-category">
              <span className="category-icon">{getCategoryIcon(settlement.category)}</span>
              {settlement.category}
            </span>
          </div>
          <div className="settlement-company">
            <span className="company-name">{settlement.company}</span>
          </div>
        </div>
      </div>
      
      <p className="settlement-description">{settlement.description}</p>

      {settlement.partneredLawFirm && (
        <LawFirmBadge settlementId={settlement.id} />
      )}

      <div className="settlement-details">
        <div className="detail-item">
          <strong>Deadline:</strong> {formatDate(settlement.deadline)}
        </div>
        <div className="detail-item">
          <strong>Potential Amount:</strong> ${settlement.potentialAmount.min} - ${settlement.potentialAmount.max}
        </div>
      </div>

      <div className="eligibility-section">
        {!eligibility && (
          <button
            className="check-eligibility-button"
            onClick={handleCheckEligibility}
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Check if You May Qualify'}
          </button>
        )}

        {eligibility && (
          <div className={`eligibility-result ${eligibility.mayQualify ? 'may-qualify' : 'no-match'}`}>
            <div className="eligibility-icon">
              {eligibility.mayQualify ? '✓' : '✗'}
            </div>
            <div className="eligibility-content">
              <strong>{eligibility.message}</strong>
              <p className="eligibility-note">
                {eligibility.mayQualify
                  ? 'This is not a guarantee of eligibility. Please review the settlement details carefully.'
                  : 'You may still qualify. Review the settlement criteria to be sure.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="settlement-actions">
        <Link
          to={`/claim/${settlement.id}`}
          className="action-button primary"
        >
          Start Claim Process
        </Link>
      </div>
    </div>
  );
};

export default SettlementCard;

