import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  time: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  guardian: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  description: string;
  academicYear: string;
  term: string;
  balanceBefore: number;
  balanceAfter: number;
}

interface ReceiptProps {
  data: ReceiptData;
  onPrint?: () => void;
  onClose?: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ data, onPrint, onClose }) => {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${data.receiptNumber}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: #333;
            }
            .receipt-container { 
              max-width: 600px; 
              margin: 0 auto; 
              border: 2px solid #ddd;
              border-radius: 8px;
              background: white;
            }
            .header { 
              background: linear-gradient(135deg, #0d9488 0%, #1e40af 100%);
              color: white; 
              padding: 20px; 
              text-align: center;
              border-radius: 6px 6px 0 0;
            }
            .school-name { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .school-tagline { 
              font-size: 14px; 
              opacity: 0.9;
            }
            .receipt-title { 
              font-size: 20px; 
              font-weight: bold; 
              margin: 15px 0 5px 0;
            }
            .receipt-number { 
              font-size: 14px; 
              opacity: 0.9;
            }
            .content { 
              padding: 20px;
            }
            .section { 
              margin-bottom: 20px;
            }
            .section-title { 
              font-weight: bold; 
              font-size: 16px; 
              color: #374151;
              margin-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 8px;
              padding: 4px 0;
            }
            .info-label { 
              font-weight: 500; 
              color: #6b7280;
            }
            .info-value { 
              font-weight: 600; 
              color: #374151;
            }
            .amount-section {
              background: #f8fafc;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .total-amount { 
              font-size: 24px; 
              font-weight: bold; 
              color: #059669;
              text-align: center;
              margin: 10px 0;
            }
            .footer { 
              background: #f9fafb; 
              padding: 15px 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              border-radius: 0 0 6px 6px;
            }
            .contact-info {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              font-size: 11px;
            }
            .separator { 
              border: none; 
              border-top: 1px dashed #d1d5db; 
              margin: 15px 0;
            }
            .status-paid {
              background: #dcfce7;
              color: #166534;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 14px;
              display: inline-block;
              margin: 10px 0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .receipt-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="school-name">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9L5 11.18V17.18C5 17.97 5.63 18.6 6.42 18.6H17.58C18.37 18.6 19 17.97 19 17.18V11.18L23 9L12 3ZM6.5 10.47L12 7.61L17.5 10.47L12 13.33L6.5 10.47ZM18 16.7H6V12.24L12 15.54L18 12.24V16.7Z"/>
                </svg>
                Nairobi Academy
              </div>
              <div class="school-tagline">Excellence in Education</div>
              <div class="receipt-title">PAYMENT RECEIPT</div>
              <div class="receipt-number">Receipt #: ${data.receiptNumber}</div>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${data.date} at ${data.time}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Academic Year:</span>
                  <span class="info-value">${data.academicYear}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Term:</span>
                  <span class="info-value">${data.term}</span>
                </div>
              </div>

              <hr class="separator">

              <div class="section">
                <div class="section-title">Student Information</div>
                <div class="info-row">
                  <span class="info-label">Student Name:</span>
                  <span class="info-value">${data.studentName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Admission Number:</span>
                  <span class="info-value">${data.admissionNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Class:</span>
                  <span class="info-value">${data.class}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Parent/Guardian:</span>
                  <span class="info-value">${data.guardian}</span>
                </div>
              </div>

              <hr class="separator">

              <div class="section">
                <div class="section-title">Payment Details</div>
                <div class="info-row">
                  <span class="info-label">Description:</span>
                  <span class="info-value">${data.description}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Method:</span>
                  <span class="info-value">${data.paymentMethod}</span>
                </div>
                ${data.transactionId ? `
                <div class="info-row">
                  <span class="info-label">Transaction ID:</span>
                  <span class="info-value">${data.transactionId}</span>
                </div>
                ` : ''}
              </div>

              <div class="amount-section">
                <div class="info-row">
                  <span class="info-label">Balance Before Payment:</span>
                  <span class="info-value">KES ${data.balanceBefore.toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Amount Paid:</span>
                  <span class="info-value">KES ${data.amount.toLocaleString()}</span>
                </div>
                <hr class="separator">
                <div class="info-row">
                  <span class="info-label">Balance After Payment:</span>
                  <span class="info-value">KES ${data.balanceAfter.toLocaleString()}</span>
                </div>
                <div class="total-amount">PAID: KES ${data.amount.toLocaleString()}</div>
                <div style="text-align: center;">
                  <span class="status-paid">✓ PAYMENT RECEIVED</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div><strong>Nairobi Academy</strong> - Excellence in Education</div>
              <div class="contact-info">
                <span>📍 P.O. Box 12345, Nairobi, Kenya</span>
                <span>📞 +254 20 123 4567</span>
                <span>✉️ info@nairobi-academy.ac.ke</span>
              </div>
              <div style="margin-top: 10px; font-style: italic;">
                This is a computer-generated receipt and is valid without signature.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    // Close the print window after printing
    setTimeout(() => {
      printWindow.close();
    }, 1000);

    if (onPrint) onPrint();
  };

  return (
    <div className="receipt-preview max-w-2xl mx-auto">
      <Card className="border-2">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <GraduationCap className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Nairobi Academy</h1>
            </div>
            <p className="text-teal-100 text-sm">Excellence in Education</p>
            <h2 className="text-xl font-bold mt-4 mb-2">PAYMENT RECEIPT</h2>
            <p className="text-teal-100">Receipt #: {data.receiptNumber}</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Date and Academic Info */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>{data.date} at {data.time}</span>
              </div>
              <div className="text-sm text-gray-600">
                Academic Year: {data.academicYear} | Term: {data.term}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ PAID
              </div>
            </div>
          </div>

          <Separator />

          {/* Student Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Student Name:</span>
                <p className="font-medium">{data.studentName}</p>
              </div>
              <div>
                <span className="text-gray-600">Admission Number:</span>
                <p className="font-medium">{data.admissionNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Class:</span>
                <p className="font-medium">{data.class}</p>
              </div>
              <div>
                <span className="text-gray-600">Parent/Guardian:</span>
                <p className="font-medium">{data.guardian}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium">{data.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{data.paymentMethod}</span>
              </div>
              {data.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{data.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Balance Before Payment:</span>
                <span className="font-medium">KES {data.balanceBefore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">KES {data.amount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Balance After Payment:</span>
                <span className="font-medium">KES {data.balanceAfter.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-green-600">
                PAID: KES {data.amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* School Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg text-center text-xs text-gray-600">
            <div className="font-semibold mb-2">Nairobi Academy - Excellence in Education</div>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                P.O. Box 12345, Nairobi
              </span>
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                +254 20 123 4567
              </span>
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                info@nairobi-academy.ac.ke
              </span>
            </div>
            <div className="mt-2 italic">
              This is a computer-generated receipt and is valid without signature.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700">
              🖨️ Print Receipt
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;
