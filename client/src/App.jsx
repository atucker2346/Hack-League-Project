import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import ProtectedRoute from './components/ProtectedRoute';
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
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/questionnaire"
        element={
          <ProtectedRoute>
            <Layout>
              <Questionnaire />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-matched"
        element={
          <ProtectedRoute>
            <Layout>
              <AIMatched />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settlements"
        element={
          <ProtectedRoute>
            <Layout>
              <Settlements />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Layout>
              <Subscription />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/claim/:settlementId"
        element={
          <ProtectedRoute>
            <Layout>
              <ClaimForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:settlementId"
        element={
          <ProtectedRoute>
            <Layout>
              <ReviewScreen />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lawfirm/settlement/:settlementId"
        element={
          <ProtectedRoute>
            <Layout>
              <LawFirmDetail />
            </Layout>
          </ProtectedRoute>
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

