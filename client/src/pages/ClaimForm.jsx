import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { settlementService } from '../services/settlementService';
import { claimService } from '../services/claimService';
import AutoFillField from '../components/AutoFillField';
import LoadingSpinner from '../components/LoadingSpinner';
import './ClaimForm.css';

const ClaimForm = () => {
  const { settlementId } = useParams();
  const navigate = useNavigate();
  const [settlement, setSettlement] = useState(null);
  const [autofillData, setAutofillData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    purchasePeriod: '',
    receivedNotification: '',
    amountSpent: '',
    additionalInfo: ''
  });
  const [confirmedFields, setConfirmedFields] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingAutofill, setLoadingAutofill] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettlement();
    loadAutofill();
  }, [settlementId]);

  const loadSettlement = async () => {
    try {
      const data = await settlementService.getById(settlementId);
      setSettlement(data);
    } catch (error) {
      setError('Failed to load settlement details');
    } finally {
      setLoading(false);
    }
  };

  const loadAutofill = async () => {
    setLoadingAutofill(true);
    try {
      const data = await claimService.getAutofill(parseInt(settlementId));
      setAutofillData(data);
      
      // Pre-populate form with suggestions (but require confirmation)
      if (data.autofillData) {
        setFormData({
          fullName: data.autofillData.personalInfo?.fullName || '',
          email: data.autofillData.personalInfo?.email || '',
          address: data.autofillData.personalInfo?.address || '',
          phone: data.autofillData.personalInfo?.phone || '',
          purchasePeriod: data.autofillData.suggestedAnswers?.purchasePeriod || '',
          receivedNotification: data.autofillData.suggestedAnswers?.receivedNotification || '',
          amountSpent: data.autofillData.suggestedAnswers?.amountSpent?.toString() || '',
          additionalInfo: ''
        });
      }
    } catch (error) {
      console.error('Failed to load autofill data:', error);
    } finally {
      setLoadingAutofill(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirm = (fieldName, value) => {
    setConfirmedFields(new Set([...confirmedFields, fieldName]));
  };

  const handleContinue = () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    // Store form data and navigate to review
    const claimData = {
      settlementInfo: {
        id: settlement.id,
        name: settlement.name,
        officialSite: settlement.officialSite
      },
      personalInfo: {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        phone: formData.phone
      },
      claimInfo: {
        purchasePeriod: formData.purchasePeriod,
        receivedNotification: formData.receivedNotification,
        amountSpent: formData.amountSpent,
        additionalInfo: formData.additionalInfo
      },
      purchaseHistory: autofillData?.autofillData?.purchaseHistory || []
    };

    // Store in sessionStorage for review page
    sessionStorage.setItem('claimData', JSON.stringify(claimData));
    navigate(`/review/${settlementId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !settlement) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="claim-form-page">
      <div className="claim-form-header">
        <h1>Claim Form: {settlement?.name}</h1>
        <p>We'll help you fill out this form. Please review and confirm all information.</p>
      </div>

      {loadingAutofill && (
        <div className="loading-autofill">
          <p>Loading auto-fill suggestions...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">{error}</div>
      )}

      <form className="claim-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <p className="section-note">
            We've detected some information from your account. Please review and confirm each field.
          </p>

          <AutoFillField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            suggestedValue={autofillData?.autofillData?.personalInfo?.fullName}
            onChange={handleChange}
            onConfirm={handleConfirm}
            required
            placeholder="Enter your full name"
          />

          <AutoFillField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            suggestedValue={autofillData?.autofillData?.personalInfo?.email}
            onChange={handleChange}
            onConfirm={handleConfirm}
            required
            placeholder="Enter your email"
          />

          <AutoFillField
            label="Address"
            name="address"
            value={formData.address}
            suggestedValue={autofillData?.autofillData?.personalInfo?.address}
            onChange={handleChange}
            onConfirm={handleConfirm}
            required
            placeholder="Enter your address"
          />

          <AutoFillField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            suggestedValue={autofillData?.autofillData?.personalInfo?.phone}
            onChange={handleChange}
            onConfirm={handleConfirm}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-section">
          <h2>Claim Information</h2>
          <p className="section-note">
            Answer these questions based on your knowledge. We may have suggestions, but you must verify all answers.
          </p>

          <div className="form-group">
            <label htmlFor="purchasePeriod">
              Did you make purchases during the relevant period?
              <span className="required">*</span>
            </label>
            <select
              id="purchasePeriod"
              name="purchasePeriod"
              value={formData.purchasePeriod}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unsure">Unsure</option>
            </select>
            {autofillData?.autofillData?.suggestedAnswers?.purchasePeriod && (
              <p className="suggestion-hint">
                💡 Suggested: {autofillData.autofillData.suggestedAnswers.purchasePeriod}
                (based on detected purchases)
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="receivedNotification">
              Did you receive a notification about this settlement?
              <span className="required">*</span>
            </label>
            <select
              id="receivedNotification"
              name="receivedNotification"
              value={formData.receivedNotification}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unsure">Unsure</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amountSpent">
              Estimated amount spent (if known)
            </label>
            <input
              type="number"
              id="amountSpent"
              name="amountSpent"
              value={formData.amountSpent}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {autofillData?.autofillData?.suggestedAnswers?.amountSpent > 0 && (
              <p className="suggestion-hint">
                💡 Detected from receipts: ${autofillData.autofillData.suggestedAnswers.amountSpent.toFixed(2)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information (Optional)</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any additional information you'd like to include"
              rows="4"
            />
          </div>
        </div>

        {autofillData?.autofillData?.purchaseHistory?.length > 0 && (
          <div className="form-section">
            <h2>Detected Purchase History</h2>
            <p className="section-note">
              We found these purchases that may be relevant. Please review and verify.
            </p>
            <div className="purchase-history">
              {autofillData.autofillData.purchaseHistory.map((purchase, index) => (
                <div key={index} className="purchase-item">
                  <div className="purchase-date">{purchase.date}</div>
                  <div className="purchase-details">
                    <strong>{purchase.merchant}</strong>
                    <span>{purchase.product}</span>
                  </div>
                  <div className="purchase-amount">${purchase.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="continue-button"
            onClick={handleContinue}
          >
            Continue to Review
          </button>
          <p className="action-note">
            You'll review all information before any submission
          </p>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;

