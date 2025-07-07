
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const OutstandingBalancesDialog = () => {
  const [open, setOpen] = useState(false);

  const outstandingStudents = [
    {
      name: 'John Kamau',
      admissionNumber: 'NA2024001',
      class: 'Form 4A',
      balance: 5000,
      lastPayment: '2024-12-15',
      guardian: 'Peter Kamau',
      phone: '+254712345678'
    },
    {
      name: 'Peter Ochieng',
      admissionNumber: 'NA2024003',
      class: 'Form 3C',
      balance: 15000,
      lastPayment: '2024-11-20',
      guardian: 'Robert Ochieng',
      phone: '+254734567890'
    },
    {
      name: 'Grace Mwangi',
      admissionNumber: 'NA2024005',
      class: 'Form 2A',
      balance: 8500,
      lastPayment: '2024-12-01',
      guardian: 'Jane Mwangi',
      phone: '+254745678901'
    }
  ];

  const totalOutstanding = outstandingStudents.reduce((sum, student) => sum + student.balance, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto p-4 justify-start text-left hover:bg-gray-50" variant="outline">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">View Outstanding</div>
              <div className="text-sm text-gray-500 mt-1">Check students with pending fee payments</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Outstanding Fee Balances</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-700">Total Outstanding Amount</div>
            <div className="text-2xl font-bold text-orange-800">
              KES {totalOutstanding.toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">
              {outstandingStudents.length} students with pending payments
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {outstandingStudents.map((student) => (
                <div key={student.admissionNumber} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.admissionNumber} - {student.class}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Guardian: {student.guardian} ({student.phone})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        KES {student.balance.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last payment: {student.lastPayment}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="text-blue-600">
                      Send Reminder
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600">
                      Record Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" className="text-orange-600">
              Send Bulk Reminders
            </Button>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutstandingBalancesDialog;
