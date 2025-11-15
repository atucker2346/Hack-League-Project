import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { claimService } from '../services/claimService';
import LoadingSpinner from '../components/LoadingSpinner';
import './ReviewScreen.css';

const ReviewScreen = () => {
  const { settlementId } = useParams();
  const navigate = useNavigate();
  const [claimData, setClaimData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmations, setConfirmations] = useState({
    accuracyConfirmed: false,
    responsibilityAccepted: false
  });
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    loadClaimData();
  }, []);

  useEffect(() => {
    setCanSubmit(
      confirmations.accuracyConfirmed &&
      confirmations.responsibilityAccepted
    );
  }, [confirmations]);

  const loadClaimData = () => {
    const stored = sessionStorage.getItem('claimData');
    if (stored) {
      setClaimData(JSON.parse(stored));
    } else {
      // Redirect back if no data
      navigate(`/claim/${settlementId}`);
    }
    setLoading(false);
  };

  const handleConfirmationChange = (field) => {
    setConfirmations({
      ...confirmations,
      [field]: !confirmations[field]
    });
  };

  const handleEdit = () => {
    navigate(`/claim/${settlementId}`);
  };

  const handleSubmitToOfficialSite = () => {
    if (!canSubmit) {
      return;
    }

    // Get official site URL
    const officialSite = claimData?.settlementInfo?.officialSite || '#';
    
    // Open in new tab
    window.open(officialSite, '_blank');
    
    // Show success message
    alert('You are being redirected to the official settlement website. Please complete your claim submission there. This application does not submit claims on your behalf.');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!claimData) {
    return (
      <div className="error-message">
        <p>No claim data found. Please start over.</p>
        <button onClick={() => navigate('/settlements')} className="back-button">
          Go to Settlements
        </button>
      </div>
    );
  }

  return (
    <div className="review-screen">
      <div className="review-header">
        <h1>Review Your Claim Information</h1>
        <p>Please carefully review all information before proceeding to the official claim site.</p>
      </div>

      <div className="review-content">
        <div className="review-section">
          <div className="section-header">
            <h2>Settlement Information</h2>
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
          </div>
          <div className="review-data">
            <div className="data-row">
              <span className="data-label">Settlement:</span>
              <span className="data-value">{claimData.settlementInfo.name}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
          </div>
          <div className="review-data">
            <div className="data-row">
              <span className="data-label">Full Name:</span>
              <span className="data-value">{claimData.personalInfo.fullName}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Email:</span>
              <span className="data-value">{claimData.personalInfo.email}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Address:</span>
              <span className="data-value">{claimData.personalInfo.address}</span>
            </div>
            {claimData.personalInfo.phone && (
              <div className="data-row">
                <span className="data-label">Phone:</span>
                <span className="data-value">{claimData.personalInfo.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="review-section">
          <div className="section-header">
            <h2>Claim Information</h2>
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
          </div>
          <div className="review-data">
            <div className="data-row">
              <span className="data-label">Purchase Period:</span>
              <span className="data-value">{claimData.claimInfo.purchasePeriod || 'Not specified'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Received Notification:</span>
              <span className="data-value">{claimData.claimInfo.receivedNotification || 'Not specified'}</span>
            </div>
            {claimData.claimInfo.amountSpent && (
              <div className="data-row">
                <span className="data-label">Amount Spent:</span>
                <span className="data-value">${parseFloat(claimData.claimInfo.amountSpent).toFixed(2)}</span>
              </div>
            )}
            {claimData.claimInfo.additionalInfo && (
              <div className="data-row">
                <span className="data-label">Additional Info:</span>
                <span className="data-value">{claimData.claimInfo.additionalInfo}</span>
              </div>
            )}
          </div>
        </div>

        {claimData.purchaseHistory && claimData.purchaseHistory.length > 0 && (
          <div className="review-section">
            <div className="section-header">
              <h2>Purchase History</h2>
            </div>
            <div className="purchase-history-review">
              {claimData.purchaseHistory.map((purchase, index) => (
                <div key={index} className="purchase-item-review">
                  <div className="purchase-date-review">{purchase.date}</div>
                  <div className="purchase-details-review">
                    <strong>{purchase.merchant}</strong>
                    <span>{purchase.product}</span>
                  </div>
                  <div className="purchase-amount-review">${purchase.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="review-confirmations">
        <h2>Final Confirmations</h2>
        <p className="confirmation-note">
          You must confirm all of the following before proceeding to the official claim site:
        </p>

        <div className="confirmation-item">
          <label className="confirmation-checkbox">
            <input
              type="checkbox"
              checked={confirmations.accuracyConfirmed}
              onChange={() => handleConfirmationChange('accuracyConfirmed')}
            />
            <span>
              I have reviewed all information above and confirm it is accurate and complete.
            </span>
          </label>
        </div>

        <div className="confirmation-item">
          <label className="confirmation-checkbox">
            <input
              type="checkbox"
              checked={confirmations.responsibilityAccepted}
              onChange={() => handleConfirmationChange('responsibilityAccepted')}
            />
            <span>
              I understand that I am responsible for verifying all information before submission.
            </span>
          </label>
        </div>
      </div>

      <div className="review-actions">
        <div className="action-buttons">
          <button onClick={handleEdit} className="back-button">
            Go Back and Edit
          </button>
          <button
            onClick={handleSubmitToOfficialSite}
            disabled={!canSubmit}
            className={`submit-button ${canSubmit ? '' : 'disabled'}`}
          >
            Proceed to Official Claim Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;

