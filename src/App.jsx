import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LoanCalculator from './components/LoanCalculator';
import LoanApplicationForm from './components/LoanApplicationForm';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function Logout() {
  const { logout } = useAuthStore();
  logout();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <LoanCalculator />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/apply-loan"
          element={
            <ProtectedRoute>
              <LoanApplicationForm />
            </ProtectedRoute>
          }
        />
        
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
