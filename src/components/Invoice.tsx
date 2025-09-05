import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Calendar, MapPin, Phone, Mail, FileText, Clock } from 'lucide-react';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  guardianEmail: string;
  feeItems: Array<{
    description: string;
    amount: number;
  }>;
  academicYear: string;
  term: string;
  totalAmount: number;
  previousBalance: number;
  grandTotal: number;
}

interface InvoiceProps {
  data: InvoiceData;
  onPrint?: () => void;
  onClose?: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ data, onPrint, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>School Fee Invoice - ${data.invoiceNumber}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: #333;
            }
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              border: 2px solid #ddd;
              border-radius: 8px;
              background: white;
            }
            .header { 
              background: linear-gradient(135deg, #0d9488 0%, #1e40af 100%);
              color: white; 
              padding: 30px; 
              text-align: center;
              border-radius: 6px 6px 0 0;
            }
            .school-name { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
            }
            .school-tagline { 
              font-size: 16px; 
              opacity: 0.9;
              margin-bottom: 20px;
            }
            .invoice-title { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 8px;
            }
            .invoice-number { 
              font-size: 16px; 
              opacity: 0.9;
            }
            .content { 
              padding: 30px;
            }
            .invoice-meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .section-title { 
              font-weight: bold; 
              font-size: 18px; 
              color: #374151;
              margin-bottom: 15px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
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
            .fees-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .fees-table th,
            .fees-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .fees-table th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #374151;
            }
            .fees-table .amount {
              text-align: right;
              font-weight: 600;
            }
            .totals-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 4px 0;
            }
            .grand-total {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
              border-top: 2px solid #d1d5db;
              padding-top: 12px;
              margin-top: 12px;
            }
            .due-notice {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .due-notice strong {
              color: #92400e;
              font-size: 16px;
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px 30px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              border-radius: 0 0 6px 6px;
            }
            .contact-info {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin: 15px 0;
              font-size: 11px;
            }
            .payment-methods {
              margin-top: 20px;
              padding: 15px;
              background: #f0f9ff;
              border-radius: 6px;
              border: 1px solid #bae6fd;
            }
            .separator { 
              border: none; 
              border-top: 1px dashed #d1d5db; 
              margin: 20px 0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="school-name">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9L5 11.18V17.18C5 17.97 5.63 18.6 6.42 18.6H17.58C18.37 18.6 19 17.97 19 17.18V11.18L23 9L12 3ZM6.5 10.47L12 7.61L17.5 10.47L12 13.33L6.5 10.47ZM18 16.7H6V12.24L12 15.54L18 12.24V16.7Z"/>
                </svg>
                Drumvale Secondary School
              </div>
              <div class="school-tagline">Nurturing Tomorrow's Leaders</div>
              <div class="invoice-title">SCHOOL FEE INVOICE</div>
              <div class="invoice-number">Invoice #: ${data.invoiceNumber}</div>
            </div>
            
            <div class="content">
              <div class="invoice-meta">
                <div>
                  <div class="section-title">Invoice Information</div>
                  <div class="info-row">
                    <span class="info-label">Invoice Date:</span>
                    <span class="info-value">${data.date}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Due Date:</span>
                    <span class="info-value">${data.dueDate}</span>
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

                <div>
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
              </div>

              <hr class="separator">

              <div class="section-title">Fee Breakdown</div>
              <table class="fees-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="amount">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.feeItems.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="amount">${item.amount.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totals-section">
                <div class="total-row">
                  <span>Previous Balance:</span>
                  <span>KES ${data.previousBalance.toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>Current Charges:</span>
                  <span>KES ${data.totalAmount.toLocaleString()}</span>
                </div>
                <div class="total-row grand-total">
                  <span>TOTAL AMOUNT DUE:</span>
                  <span>KES ${data.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div class="due-notice">
                <strong>Payment Due: ${data.dueDate}</strong><br>
                Please ensure payment is made before the due date to avoid late fees.
              </div>

              <div class="payment-methods">
                <div style="font-weight: 600; margin-bottom: 10px; color: #1e40af;">Payment Methods:</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 12px;">
                  <div>
                    <strong>M-Pesa:</strong> Paybill 522533<br>
                    Account: ${data.admissionNumber}
                  </div>
                  <div>
                    <strong>Bank Transfer:</strong> KCB Bank<br>
                    A/C: 1234567890 (Drumvale Secondary School)
                  </div>
                  <div>
                    <strong>Cash/Cheque:</strong> School Finance Office<br>
                    Mon-Fri: 8:00 AM - 4:00 PM
                  </div>
                  <div>
                    <strong>Online Portal:</strong> www.drumvale-secondary.ac.ke<br>
                    Login with admission number
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div><strong>Drumvale Secondary School</strong> - Nurturing Tomorrow's Leaders</div>
              <div class="contact-info">
                <div>📍 P.O. Box 12345, Nairobi, Kenya</div>
                <div>📞 +254 20 123 4567 | 📱 +254 711 123 456</div>
                <div>✉️ info@drumvale-secondary.ac.ke</div>
              </div>
              <div style="margin-top: 15px; font-style: italic;">
                This is a computer-generated invoice. For inquiries, contact the Finance Office.
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
    
    setTimeout(() => {
      printWindow.close();
    }, 1000);

    if (onPrint) onPrint();
  };

  return (
    <div className="invoice-preview max-w-4xl mx-auto">
      <Card className="border-2">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 rounded-t-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <GraduationCap className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Drumvale Secondary School</h1>
            </div>
            <p className="text-teal-100 text-lg">Nurturing Tomorrow's Leaders</p>
            <h2 className="text-2xl font-bold mt-6 mb-3">SCHOOL FEE INVOICE</h2>
            <p className="text-teal-100 text-lg">Invoice #: {data.invoiceNumber}</p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Invoice Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Invoice Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-medium">{data.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-red-600">{data.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Academic Year:</span>
                  <span className="font-medium">{data.academicYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium">{data.term}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Student Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-medium">{data.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admission Number:</span>
                  <span className="font-medium">{data.admissionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{data.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent/Guardian:</span>
                  <span className="font-medium">{data.guardian}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fee Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Fee Breakdown</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.feeItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Previous Balance:</span>
                <span className="font-medium">KES {data.previousBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Charges:</span>
                <span className="font-medium">KES {data.totalAmount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>TOTAL AMOUNT DUE:</span>
                <span>KES {data.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Due Date Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Payment Due: {data.dueDate}</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Please ensure payment is made before the due date to avoid late fees.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">Payment Methods:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-blue-800">M-Pesa:</span>
                  <br />Paybill 522533, Account: {data.admissionNumber}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Bank Transfer:</span>
                  <br />KCB Bank, A/C: 1234567890 (Drumvale Secondary School)
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-blue-800">Cash/Cheque:</span>
                  <br />School Finance Office (Mon-Fri: 8:00 AM - 4:00 PM)
                </div>
                <div>
                  <span className="font-medium text-blue-800">Online Portal:</span>
                  <br />www.drumvale-secondary.ac.ke
                </div>
              </div>
            </div>
          </div>

          {/* School Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg text-center text-xs text-gray-600">
            <div className="font-semibold mb-2">Drumvale Secondary School - Nurturing Tomorrow's Leaders</div>
            <div className="flex justify-center space-x-6 text-xs">
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
                info@drumvale-secondary.ac.ke
              </span>
            </div>
            <div className="mt-2 italic">
              This is a computer-generated invoice. For inquiries, contact the Finance Office.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700">
              🖨️ Print Invoice
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

export default Invoice;
