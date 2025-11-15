import { useEffect, useState } from 'react';
import { lawFirmService } from '../services/lawFirmService';
import LoadingSpinner from './LoadingSpinner';
import './LawFirmUpdates.css';

const LawFirmUpdates = ({ lawFirmId }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpdates();
  }, [lawFirmId]);

  const loadUpdates = async () => {
    try {
      const data = await lawFirmService.getUpdates(lawFirmId);
      setUpdates(data);
    } catch (error) {
      console.error('Failed to load updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'deadline':
        return '⏰';
      case 'payout':
        return '💰';
      case 'status':
        return '📢';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (updates.length === 0) {
    return (
      <div className="law-firm-updates">
        <h3>Updates</h3>
        <p className="no-updates">No updates available at this time.</p>
      </div>
    );
  }

  return (
    <div className="law-firm-updates">
      <h3>Recent Updates</h3>
      <div className="updates-list">
        {updates.map((update) => (
          <div key={update.id} className="update-item">
            <div className="update-header">
              <div className="update-icon">{getUpdateIcon(update.type)}</div>
              <div className="update-title-section">
                <h4 className="update-title">{update.title}</h4>
                <span className="update-date">{formatDate(update.date)}</span>
              </div>
            </div>
            <p className="update-content">{update.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawFirmUpdates;

