import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [loanDetails, setLoanDetails] = useState(null);
  const [repaymentSchedule, setRepaymentSchedule] = useState([]);

  const COLORS = ['#0ea5e9', '#f59e0b'];

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateLoan = () => {
    // Calculate monthly payment using EMI formula
    const monthlyRate = (interestRate / 12) / 100;
    let emi, totalAmount, totalInterest;

    if (interestRate === 0) {
      emi = loanAmount / loanTerm;
      totalAmount = loanAmount;
      totalInterest = 0;
    } else {
      const rateCompound = Math.pow(1 + monthlyRate, loanTerm);
      emi = (loanAmount * monthlyRate * rateCompound) / (rateCompound - 1);
      totalAmount = emi * loanTerm;
      totalInterest = totalAmount - loanAmount;
    }

    setLoanDetails({
      monthlyPayment: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: loanAmount.toFixed(2)
    });

    // Generate repayment schedule for chart
    generateSchedule(loanAmount, monthlyRate, emi, loanTerm);
  };

  const generateSchedule = (principal, monthlyRate, emi, months) => {
    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= Math.min(months, 24); i++) { // Show max 24 months in chart
      const interestAmount = balance * monthlyRate;
      const principalAmount = emi - interestAmount;
      balance -= principalAmount;

      schedule.push({
        month: i,
        principal: parseFloat(principalAmount.toFixed(2)),
        interest: parseFloat(interestAmount.toFixed(2)),
        balance: parseFloat(Math.max(0, balance).toFixed(2))
      });
    }

    setRepaymentSchedule(schedule);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieData = loanDetails ? [
    { name: 'Principal', value: parseFloat(loanDetails.principal) },
    { name: 'Interest', value: parseFloat(loanDetails.totalInterest) }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Calculator</h2>
        
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="1000"
              max="10000000"
              step="1000"
            />
            <input
              type="range"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2"
              min="1000"
              max="1000000"
              step="1000"
            />
            <div className="text-2xl font-bold text-primary-600 mt-2">
              {formatCurrency(loanAmount)}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              max="30"
              step="0.1"
            />
            <input
              type="range"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2"
              min="0"
              max="30"
              step="0.1"
            />
            <div className="text-2xl font-bold text-primary-600 mt-2">
              {interestRate.toFixed(1)}%
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Months)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="1"
              max="360"
              step="1"
            />
            <input
              type="range"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full mt-2"
              min="12"
              max="360"
              step="12"
            />
            <div className="text-2xl font-bold text-primary-600 mt-2">
              {loanTerm} months ({(loanTerm / 12).toFixed(1)} years)
            </div>
          </div>
        </div>

        {/* Results */}
        {loanDetails && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary-50 rounded-lg p-6 border-l-4 border-primary-500">
                <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(loanDetails.monthlyPayment)}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(loanDetails.principal)}
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-orange-700">
                  {formatCurrency(loanDetails.totalInterest)}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(loanDetails.totalAmount)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Repayment Schedule Line Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Repayment Schedule (First 24 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={repaymentSchedule}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="principal" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      name="Principal"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interest" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Interest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Principal vs Interest Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Principal vs Interest
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Principal</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(pieData[0]?.value || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Interest</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(pieData[1]?.value || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
                Apply for This Loan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
