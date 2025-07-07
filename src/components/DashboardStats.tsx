
import React from 'react';
import { Users, FileText, Check, Clock } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      name: 'Total Students',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'This Term Revenue',
      value: 'KES 2.4M',
      change: '+18%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Paid Fees',
      value: '892',
      change: '71.6%',
      changeType: 'positive',
      icon: Check,
    },
    {
      name: 'Outstanding',
      value: 'KES 680K',
      change: '-5%',
      changeType: 'negative',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-teal-600" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
