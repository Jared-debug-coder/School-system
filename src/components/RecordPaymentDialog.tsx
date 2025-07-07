
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecordPaymentDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    amount: '',
    paymentMethod: '',
    transactionId: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Recording payment:', formData);
    
    toast({
      title: "Payment Recorded Successfully",
      description: `KES ${parseFloat(formData.amount).toLocaleString()} payment recorded for ${formData.studentName}. Receipt sent via SMS.`,
    });
    
    setOpen(false);
    setFormData({
      studentName: '',
      admissionNumber: '',
      amount: '',
      paymentMethod: '',
      transactionId: '',
      description: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto p-4 justify-start text-left hover:bg-gray-50" variant="outline">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg text-white bg-green-500 hover:bg-green-600">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Record Payment</div>
              <div className="text-sm text-gray-500 mt-1">Process and record student fee payments</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            <div>
              <Label htmlFor="admissionNumber">Admission Number</Label>
              <Input
                id="admissionNumber"
                value={formData.admissionNumber}
                onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                placeholder="e.g., NA2024001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="transactionId">Transaction/Reference ID</Label>
            <Input
              id="transactionId"
              value={formData.transactionId}
              onChange={(e) => handleInputChange('transactionId', e.target.value)}
              placeholder="M-Pesa code or bank reference"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., Term 1 Tuition Fees"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
