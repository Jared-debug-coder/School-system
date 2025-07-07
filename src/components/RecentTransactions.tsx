
import React from 'react';

const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      student: 'John Kamau',
      class: 'Form 4A',
      amount: 'KES 15,000',
      type: 'School Fees',
      method: 'M-Pesa',
      date: '2025-01-07',
      status: 'completed',
    },
    {
      id: 2,
      student: 'Mary Wanjiku',
      class: 'Form 2B',
      amount: 'KES 2,500',
      type: 'Uniform',
      method: 'Cash',
      date: '2025-01-07',
      status: 'completed',
    },
    {
      id: 3,
      student: 'Peter Ochieng',
      class: 'Form 3C',
      amount: 'KES 8,000',
      type: 'Transport',
      method: 'M-Pesa',
      date: '2025-01-06',
      status: 'pending',
    },
    {
      id: 4,
      student: 'Grace Akinyi',
      class: 'Form 1A',
      amount: 'KES 12,000',
      type: 'School Fees',
      method: 'Bank Transfer',
      date: '2025-01-06',
      status: 'completed',
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.student}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.class} • {transaction.type}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
