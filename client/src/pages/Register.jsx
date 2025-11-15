import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import SpaceBackground from '../components/SpaceBackground';
import './AuthPage.css';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    const result = await register(formData.email, formData.password, formData.name);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page register-page">
      <SpaceBackground />
      <div className="register-layout">
        <div className="register-logo-section">
          <img src="/logo.png" alt="SFM Logo" className="register-logo" />
        </div>
        <div className="auth-container">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Get started with settlement assistance</p>
          <AuthForm onSubmit={handleSubmit} isLogin={false} error={error} />
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

