
import React from 'react';
import AddStudentDialog from './AddStudentDialog';
import GenerateInvoicesDialog from './GenerateInvoicesDialog';
import RecordPaymentDialog from './RecordPaymentDialog';
import OutstandingBalancesDialog from './OutstandingBalancesDialog';

const QuickActions = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AddStudentDialog />
          <GenerateInvoicesDialog />
          <RecordPaymentDialog />
          <OutstandingBalancesDialog />
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
