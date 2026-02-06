import React, { useState } from 'react';
import axios from 'axios';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '8.5',
    loanTermMonths: '',
    loanPurpose: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loanPurposes = [
    'Personal',
    'Home Purchase',
    'Home Renovation',
    'Business',
    'Education',
    'Medical',
    'Debt Consolidation',
    'Vehicle Purchase',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loanAmount || formData.loanAmount < 1000) {
      newErrors.loanAmount = 'Loan amount must be at least $1,000';
    }
    if (formData.loanAmount > 10000000) {
      newErrors.loanAmount = 'Loan amount cannot exceed $10,000,000';
    }

    if (!formData.interestRate || formData.interestRate < 0) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    }

    if (!formData.loanTermMonths || formData.loanTermMonths < 1) {
      newErrors.loanTermMonths = 'Loan term must be at least 1 month';
    }
    if (formData.loanTermMonths > 360) {
      newErrors.loanTermMonths = 'Loan term cannot exceed 360 months';
    }

    if (!formData.loanPurpose) {
      newErrors.loanPurpose = 'Please select a loan purpose';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        'http://localhost:5000/api/loans',
        {
          loanAmount: parseFloat(formData.loanAmount),
          interestRate: parseFloat(formData.interestRate),
          loanTermMonths: parseInt(formData.loanTermMonths),
          loanPurpose: formData.loanPurpose
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
      setFormData({
        loanAmount: '',
        interestRate: '8.5',
        loanTermMonths: '',
        loanPurpose: ''
      });

      // Show success message for 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (error) {
      console.error('Loan application error:', error);
      
      if (error.response?.status === 401) {
        setErrors({ submit: 'Please login to apply for a loan' });
      } else if (error.response?.status === 403) {
        setErrors({ submit: 'Please verify your email to apply for a loan' });
      } else {
        setErrors({ 
          submit: error.response?.data?.message || 'Failed to submit loan application' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Apply for a Loan</h2>
        <p className="text-gray-600 mb-6">
          Fill out the form below to submit your loan application
        </p>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  Your loan application has been submitted successfully!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  We'll review your application and get back to you soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount ($) *
            </label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter loan amount"
              min="1000"
              max="10000000"
              step="100"
            />
            {errors.loanAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.loanAmount}</p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% per year) *
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.interestRate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter interest rate"
              min="0"
              max="100"
              step="0.1"
            />
            {errors.interestRate && (
              <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Current market rate: 8.5% - 12%
            </p>
          </div>

          {/* Loan Term */}
          <div>
            <label htmlFor="loanTermMonths" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (months) *
            </label>
            <input
              type="number"
              id="loanTermMonths"
              name="loanTermMonths"
              value={formData.loanTermMonths}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.loanTermMonths ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter loan term in months"
              min="1"
              max="360"
            />
            {errors.loanTermMonths && (
              <p className="mt-1 text-sm text-red-600">{errors.loanTermMonths}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.loanTermMonths && `${(formData.loanTermMonths / 12).toFixed(1)} years`}
            </p>
          </div>

          {/* Loan Purpose */}
          <div>
            <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose *
            </label>
            <select
              id="loanPurpose"
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.loanPurpose ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            >
              <option value="">Select a purpose</option>
              {loanPurposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            {errors.loanPurpose && (
              <p className="mt-1 text-sm text-red-600">{errors.loanPurpose}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              } transition duration-200`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Important Notes:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Your application will be reviewed within 24-48 hours</li>
            <li>You must have a verified email address to apply</li>
            <li>Additional documentation may be required</li>
            <li>Approval is subject to credit check and verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;
