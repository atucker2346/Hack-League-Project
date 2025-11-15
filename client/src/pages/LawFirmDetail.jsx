import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { lawFirmService } from '../services/lawFirmService';
import { settlementService } from '../services/settlementService';
import LawFirmInfo from '../components/LawFirmInfo';
import LawFirmUpdates from '../components/LawFirmUpdates';
import LoadingSpinner from '../components/LoadingSpinner';
import './LawFirmDetail.css';

const LawFirmDetail = () => {
  const { settlementId } = useParams();
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [lawFirm, setLawFirm] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    if (subscription?.tier !== 'premium') {
      navigate('/subscription');
      return;
    }
    loadData();
  }, [settlementId, subscription]);

  const loadData = async () => {
    try {
      const [lawFirmData, settlementData] = await Promise.all([
        lawFirmService.getBySettlement(settlementId),
        settlementService.getById(settlementId)
      ]);
      setLawFirm(lawFirmData);
      setSettlement(settlementData);
    } catch (error) {
      console.error('Failed to load law firm data:', error);
      if (error.response?.status === 403) {
        navigate('/subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setContactSuccess(false);

    try {
      await lawFirmService.contact(
        lawFirm.id,
        contactForm.subject,
        contactForm.message,
        parseInt(settlementId)
      );
      setContactSuccess(true);
      setContactForm({ subject: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!lawFirm) {
    return (
      <div className="error-message">
        <p>Law firm information not available.</p>
        <button onClick={() => navigate('/settlements')} className="back-button">
          Go to Settlements
        </button>
      </div>
    );
  }

  return (
    <div className="law-firm-detail">
      <div className="law-firm-detail-header">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back
        </button>
        <h1>Partnered Law Firm</h1>
        {settlement && (
          <p className="settlement-context">
            For: <Link to={`/settlements`}>{settlement.name}</Link>
          </p>
        )}
      </div>

      <LawFirmInfo lawFirm={lawFirm} />

      <LawFirmUpdates lawFirmId={lawFirm.id} />

      <div className="contact-section">
        <h3>Contact the Law Firm</h3>
        <p className="contact-description">
          Have questions about this settlement? Contact our partnered law firm directly.
        </p>

        {contactSuccess && (
          <div className="success-message">
            Your message has been sent successfully! The law firm will contact you shortly.
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              required
              placeholder="Enter message subject"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
              rows="6"
              placeholder="Enter your message or question"
            />
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LawFirmDetail;

