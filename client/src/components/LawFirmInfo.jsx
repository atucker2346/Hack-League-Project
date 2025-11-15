import './LawFirmInfo.css';

const LawFirmInfo = ({ lawFirm }) => {
  if (!lawFirm) {
    return null;
  }

  return (
    <div className="law-firm-info">
      <div className="law-firm-header">
        <img 
          src={lawFirm.logo || '/law-firm-logo.jpg'} 
          alt={lawFirm.name}
          className="law-firm-logo"
        />
        <div className="law-firm-title">
          <h2>{lawFirm.name}</h2>
          <p className="law-firm-description">{lawFirm.description}</p>
        </div>
      </div>

      <div className="law-firm-details">
        <div className="detail-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href={`mailto:${lawFirm.email}`} className="contact-value">
                {lawFirm.email}
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href={`tel:${lawFirm.phone}`} className="contact-value">
                {lawFirm.phone}
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Website:</span>
              <a 
                href={lawFirm.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-value"
              >
                {lawFirm.website}
              </a>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Specialties</h3>
          <div className="specialties">
            {lawFirm.specialties.map((specialty, index) => (
              <span key={index} className="specialty-badge">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>Benefits</h3>
          <ul className="benefits-list">
            {lawFirm.benefits.map((benefit, index) => (
              <li key={index} className="benefit-item">
                <span className="benefit-icon">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LawFirmInfo;

