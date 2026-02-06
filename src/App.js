import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import LoanCalculator from './components/LoanCalculator';
import LoanApplicationForm from './components/LoanApplicationForm';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">
                  LendingPro
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-700">
                      Welcome, <span className="font-semibold">{user.fullName}</span>
                    </span>
                    <a 
                      href="/" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2"
                    >
                      Calculator
                    </a>
                    <a 
                      href="/apply" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2"
                    >
                      Apply
                    </a>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <a 
                    href="/login" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-10">
          <Routes>
            <Route path="/" element={<LoanCalculator />} />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/apply" 
              element={
                user ? <LoanApplicationForm /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">LendingPro</h3>
                <p className="text-gray-600 text-sm">
                  Your trusted partner for personal and business loans
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Links</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><a href="/" className="hover:text-primary-600">Loan Calculator</a></li>
                  <li><a href="/apply" className="hover:text-primary-600">Apply for Loan</a></li>
                  <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                  <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Legal</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-primary-600">Disclaimer</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              © 2024 LendingPro. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
