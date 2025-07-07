
import React from 'react';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import RecentTransactions from '@/components/RecentTransactions';
import QuickActions from '@/components/QuickActions';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to ShulePro - Your comprehensive school finance management system
          </p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
