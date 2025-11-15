import './Disclaimer.css';

const Disclaimer = ({ variant = 'default' }) => {
  return (
    <div className={`disclaimer disclaimer-${variant}`}>
      <div className="disclaimer-icon">⚠️</div>
      <div className="disclaimer-content">
        <strong>Legal Disclaimer:</strong> This application does not provide legal advice and is not a substitute for professional legal counsel. We are not attorneys and do not act as your legal representative. All information provided is for assistance purposes only. You are responsible for verifying the accuracy of all information before submission. This tool helps streamline the claim process but does not guarantee eligibility or specific payouts.
      </div>
    </div>
  );
};

export default Disclaimer;

