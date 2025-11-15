import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settlements from './pages/Settlements';
import Subscription from './pages/Subscription';
import ClaimForm from './pages/ClaimForm';
import ReviewScreen from './pages/ReviewScreen';
import LawFirmDetail from './pages/LawFirmDetail';
import Questionnaire from './pages/Questionnaire';
import AIMatched from './pages/AIMatched';
import Landing from './pages/Landing';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/questionnaire"
        element={
          <Layout>
            <Questionnaire />
          </Layout>
        }
      />
      <Route
        path="/ai-matched"
        element={
          <Layout>
            <AIMatched />
          </Layout>
        }
      />
      <Route
        path="/settlements"
        element={
          <Layout>
            <Settlements />
          </Layout>
        }
      />
      <Route
        path="/subscription"
        element={
          <Layout>
            <Subscription />
          </Layout>
        }
      />
      <Route
        path="/claim/:settlementId"
        element={
          <Layout>
            <ClaimForm />
          </Layout>
        }
      />
      <Route
        path="/review/:settlementId"
        element={
          <Layout>
            <ReviewScreen />
          </Layout>
        }
      />
      <Route
        path="/lawfirm/settlement/:settlementId"
        element={
          <Layout>
            <LawFirmDetail />
          </Layout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <AppRoutes />
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

