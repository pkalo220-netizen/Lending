import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanAPI } from '../services/api';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalBorrowed: 0,
    totalRepaid: 0
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loanAPI.getMyLoans();
      const loansData = response.data.loans;
      setLoans(loansData);

      const totalBorrowed = loansData
        .filter(l => l.status === 'approved')
        .reduce((sum, l) => sum + parseFloat(l.loan_amount), 0);

      setStats({
        totalLoans: loansData.length,
        activeLoans: loansData.filter(l => l.status === 'approved').length,
        totalBorrowed,
        totalRepaid: 0
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.full_name}</span>
              <Link
                to="/logout"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Loans</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLoans}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeLoans}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Borrowed</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              ₹{stats.totalBorrowed.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Repaid</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ₹{stats.totalRepaid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/apply-loan"
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow p-6 text-center transition"
          >
            <div className="text-4xl mb-2">💰</div>
            <h3 className="text-xl font-semibold">Apply for Loan</h3>
            <p className="text-sm mt-1 opacity-90">Submit a new loan application</p>
          </Link>
          <Link
            to="/calculator"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow p-6 text-center transition"
          >
            <div className="text-4xl mb-2">🧮</div>
            <h3 className="text-xl font-semibold">Loan Calculator</h3>
            <p className="text-sm mt-1 opacity-90">Calculate EMI and interest</p>
          </Link>
          <Link
            to="/profile"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow p-6 text-center transition"
          >
            <div className="text-4xl mb-2">👤</div>
            <h3 className="text-xl font-semibold">My Profile</h3>
            <p className="text-sm mt-1 opacity-90">Update your information</p>
          </Link>
        </div>

        {/* Loans List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Loans</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading loans...</div>
          ) : loans.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>You don't have any loans yet.</p>
              <Link
                to="/apply-loan"
                className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
              >
                Apply for your first loan →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Loan ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Interest Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tenure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Monthly EMI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{loan.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{parseFloat(loan.loan_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.interest_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.tenure_months} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{parseFloat(loan.monthly_emi).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(loan.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
