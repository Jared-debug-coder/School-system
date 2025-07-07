
import React from 'react';
import { Users, FileText, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const actions = [
    {
      name: 'Add New Student',
      description: 'Register a new student and set up their fee structure',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Generate Invoices',
      description: 'Create bulk invoices for school fees and other charges',
      icon: FileText,
      color: 'bg-teal-500 hover:bg-teal-600',
    },
    {
      name: 'Record Payment',
      description: 'Process and record student fee payments',
      icon: Check,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'View Outstanding',
      description: 'Check students with pending fee payments',
      icon: Clock,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.name}
                variant="outline"
                className="h-auto p-4 justify-start text-left hover:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
