
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Search, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Receipt, { ReceiptData } from './Receipt';
import { studentsData } from '@/data/studentsData';

const RecordPaymentDialog = () => {
  const [open, setOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    amount: '',
    paymentMethod: '',
    transactionId: '',
    description: ''
  });
  const { toast } = useToast();

  // Find student by admission number
  const findStudent = (admissionNumber: string) => {
    return studentsData.find(student => 
      student.admissionNumber.toLowerCase() === admissionNumber.toLowerCase()
    );
  };

  // Handle admission number change and auto-populate student data
  const handleAdmissionNumberChange = (admissionNumber: string) => {
    handleInputChange('admissionNumber', admissionNumber);
    
    if (admissionNumber.length >= 3) {
      const student = findStudent(admissionNumber);
      if (student) {
        setSelectedStudent(student);
        setFormData(prev => ({
          ...prev,
          studentName: student.name,
          admissionNumber: student.admissionNumber
        }));
      } else {
        setSelectedStudent(null);
        setFormData(prev => ({
          ...prev,
          studentName: ''
        }));
      }
    }
  };

  // Generate receipt number
  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCP-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast({
        title: "Student Not Found",
        description: "Please enter a valid admission number to find the student.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const currentBalance = parseFloat(selectedStudent.balance.replace('KES ', '').replace(',', ''));
    const newBalance = Math.max(0, currentBalance - amount);
    
    // Generate receipt data
    const now = new Date();
    const receiptInfo: ReceiptData = {
      receiptNumber: generateReceiptNumber(),
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-GB', { hour12: false }),
      studentName: selectedStudent.name,
      admissionNumber: selectedStudent.admissionNumber,
      class: selectedStudent.class,
      guardian: selectedStudent.guardian,
      amount: amount,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId || 'N/A',
      description: formData.description || 'School Fees Payment',
      academicYear: '2024/2025',
      term: 'Term 1',
      balanceBefore: currentBalance,
      balanceAfter: newBalance
    };

    setReceiptData(receiptInfo);
    setShowReceipt(true);
    setOpen(false);
    
    toast({
      title: "Payment Recorded Successfully",
      description: `KES ${amount.toLocaleString()} payment recorded for ${selectedStudent.name}. Receipt generated.`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      admissionNumber: '',
      amount: '',
      paymentMethod: '',
      transactionId: '',
      description: ''
    });
    setSelectedStudent(null);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
    resetForm();
  };

  // Show receipt dialog if receipt data exists
  if (showReceipt && receiptData) {
    return (
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Receipt Generated</DialogTitle>
          </DialogHeader>
          <Receipt 
            data={receiptData} 
            onClose={handleCloseReceipt}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Lookup Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) => handleAdmissionNumberChange(e.target.value)}
                    placeholder="Enter admission number (e.g., NA2024001)"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {/* Student Info Display */}
              {selectedStudent && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">{selectedStudent.name}</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>Class: {selectedStudent.class}</p>
                        <p>Guardian: {selectedStudent.guardian}</p>
                        <p className="font-medium">Current Balance: {selectedStudent.balance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.admissionNumber && !selectedStudent && formData.admissionNumber.length >= 3 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">Student not found. Please check the admission number.</p>
                </div>
              )}
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
    </>
  );
};

export default RecordPaymentDialog;
