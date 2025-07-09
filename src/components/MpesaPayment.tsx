import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MpesaPaymentProps {
  studentName: string;
  admissionNumber: string;
  outstandingBalance: number;
  trigger?: React.ReactNode;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ 
  studentName, 
  admissionNumber, 
  outstandingBalance, 
  trigger 
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Processing, 3: Complete
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(outstandingBalance.toString());
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const { toast } = useToast();

  const generateTransactionId = () => {
    return 'NL' + Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handlePayment = async () => {
    if (!phoneNumber || !amount) {
      toast({
        title: "Missing Information",
        description: "Please provide phone number and amount",
        variant: "destructive",
      });
      return;
    }

    // Validate Kenyan phone number
    const kenyanPhoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    if (!kenyanPhoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (e.g., +254712345678)",
        variant: "destructive",
      });
      return;
    }

    const txId = generateTransactionId();
    setTransactionId(txId);
    setStep(2);

    // Simulate M-Pesa payment process
    toast({
      title: "Payment Initiated",
      description: `M-Pesa payment request sent to ${phoneNumber}`,
    });

    // Simulate processing time
    setTimeout(() => {
      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentStatus('success');
        setStep(3);
        toast({
          title: "Payment Successful",
          description: `KES ${parseInt(amount).toLocaleString()} payment confirmed`,
        });
      } else {
        setPaymentStatus('failed');
        setStep(3);
        toast({
          title: "Payment Failed",
          description: "Please try again or use alternative payment method",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const resetForm = () => {
    setStep(1);
    setPhoneNumber('');
    setAmount(outstandingBalance.toString());
    setPaymentStatus('pending');
    setTransactionId('');
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const formatPhoneNumber = (value: string) => {
    // Auto-format to Kenyan format
    let cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('254')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+254' + cleaned.slice(1);
    } else if (cleaned.length > 0) {
      return '+254' + cleaned;
    }
    
    return value;
  };

  const defaultTrigger = (
    <Button className="bg-green-600 hover:bg-green-700">
      <CreditCard className="h-4 w-4 mr-2" />
      Pay via M-Pesa
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span>M-PESA Payment</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="text-gray-600">Student:</span> {studentName}</p>
                <p className="text-sm"><span className="text-gray-600">Admission No:</span> {admissionNumber}</p>
                <p className="text-sm"><span className="text-gray-600">Outstanding:</span> KES {outstandingBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the phone number registered with M-Pesa
                </p>
              </div>

              <div>
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max={outstandingBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: KES {outstandingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Payment Instructions</h5>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. You will receive an M-Pesa prompt on your phone</li>
                <li>2. Enter your M-Pesa PIN to confirm payment</li>
                <li>3. You will receive a confirmation SMS</li>
                <li>4. School fees will be updated automatically</li>
              </ol>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700">
                Send Payment Request
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600 mb-4">
                Please check your phone for M-Pesa prompt and enter your PIN
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Waiting for confirmation...</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Transaction ID: {transactionId}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-8">
            {paymentStatus === 'success' ? (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Your payment of KES {parseInt(amount).toLocaleString()} has been processed successfully
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono font-medium">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">KES {parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Payment Confirmed</Badge>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <AlertCircle className="h-16 w-16 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-4">
                    Your payment could not be processed. Please try again.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-800">
                      Common issues: Insufficient balance, incorrect PIN, or network timeout
                    </p>
                  </div>
                </div>
                <Badge variant="destructive">Payment Failed</Badge>
              </>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              {paymentStatus === 'failed' && (
                <Button onClick={resetForm} className="flex-1 bg-green-600 hover:bg-green-700">
                  Try Again
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPayment;
