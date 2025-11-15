import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { settlementService } from '../services/settlementService';
import SettlementCard from '../components/SettlementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Settlements.css';

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    loadSettlements();
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [loading]);

  const loadSettlements = async () => {
    try {
      const data = await settlementService.getAll();
      // Ensure data is an array
      setSettlements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load settlements:', error);
      setSettlements([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="settlements-page">
      <div className="settlements-header" ref={headerRef}>
        <h1>All Available Settlements</h1>
        <p>Browse all class action settlements you may qualify for</p>
        <div className="header-actions">
          <Link to="/questionnaire" className="ai-match-button">
            🤖 Get AI Matched
          </Link>
          <Link to="/ai-matched" className="view-matched-button">
            View My Matches
          </Link>
        </div>
      </div>

      <div className="settlements-grid" ref={gridRef}>
        {(Array.isArray(settlements) ? settlements : []).map((settlement) => (
          <SettlementCard key={settlement.id} settlement={settlement} />
        ))}
      </div>

      {(!Array.isArray(settlements) || settlements.length === 0) && (
        <div className="no-settlements">
          <p>No settlements available at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Settlements;

