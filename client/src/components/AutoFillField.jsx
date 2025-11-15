import { useState } from 'react';
import './AutoFillField.css';

const AutoFillField = ({
  label,
  name,
  type = 'text',
  value,
  suggestedValue,
  onChange,
  onConfirm,
  required = false,
  placeholder = ''
}) => {
  const [showSuggestion, setShowSuggestion] = useState(!!suggestedValue && !value);
  const [confirmed, setConfirmed] = useState(false);

  const handleAcceptSuggestion = () => {
    onChange({ target: { name, value: suggestedValue } });
    setConfirmed(true);
    setShowSuggestion(false);
    if (onConfirm) {
      onConfirm(name, suggestedValue);
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
  };

  const handleManualChange = (e) => {
    onChange(e);
    if (suggestedValue && e.target.value !== suggestedValue) {
      setConfirmed(false);
    }
  };

  return (
    <div className="autofill-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      {showSuggestion && (
        <div className="suggestion-banner">
          <div className="suggestion-content">
            <span className="suggestion-icon">💡</span>
            <span className="suggestion-text">
              We found: <strong>{suggestedValue}</strong>
            </span>
          </div>
          <div className="suggestion-actions">
            <button
              type="button"
              className="accept-button"
              onClick={handleAcceptSuggestion}
            >
              Accept
            </button>
            <button
              type="button"
              className="reject-button"
              onClick={handleRejectSuggestion}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={handleManualChange}
        placeholder={placeholder}
        required={required}
        className={confirmed ? 'confirmed' : ''}
      />

      {confirmed && value && (
        <div className="confirmation-badge">
          ✓ Confirmed
        </div>
      )}
    </div>
  );
};

export default AutoFillField;

