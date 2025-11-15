import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import SpaceBackground from '../components/SpaceBackground';
import './AuthPage.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page login-page">
      <SpaceBackground />
      <div className="register-layout">
        <div className="register-logo-section">
          <img src="/logo.png" alt="SFM Logo" className="register-logo" />
        </div>
        <div className="auth-container">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
          <AuthForm onSubmit={handleSubmit} isLogin={true} error={error} />
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

