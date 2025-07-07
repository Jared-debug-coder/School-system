
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      name: 'Financial Summary Report',
      description: 'Overview of income, expenses, and outstanding balances',
      lastGenerated: '2025-01-07',
      type: 'Financial',
    },
    {
      name: 'Fee Collection Report',
      description: 'Detailed breakdown of fee payments by class and term',
      lastGenerated: '2025-01-06',
      type: 'Financial',
    },
    {
      name: 'Outstanding Balances',
      description: 'List of students with pending fee payments',
      lastGenerated: '2025-01-07',
      type: 'Financial',
    },
    {
      name: 'Payment Methods Analysis',
      description: 'Breakdown of payments by M-Pesa, cash, and bank transfers',
      lastGenerated: '2025-01-05',
      type: 'Analysis',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-gray-600">Generate and view financial and academic reports</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-teal-600" />
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {report.type}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{report.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Last generated: {report.lastGenerated}
                  </div>
                  <Button variant="outline" size="sm">
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">92%</div>
                <div className="text-sm text-gray-500">Fee Collection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">KES 1.72M</div>
                <div className="text-sm text-gray-500">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-500">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">355</div>
                <div className="text-sm text-gray-500">Pending Payments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
