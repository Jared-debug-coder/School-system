import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Calendar, MapPin, Phone, Mail, FileText, AlertCircle } from 'lucide-react';

export interface BalanceStatementData {
  statementNumber: string;
  date: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  guardianEmail: string;
  academicYear: string;
  term: string;
  transactions: Array<{
    date: string;
    description: string;
    type: 'invoice' | 'payment';
    amount: number;
    balance: number;
    reference?: string;
  }>;
  currentBalance: number;
  totalInvoiced: number;
  totalPaid: number;
}

interface BalanceStatementProps {
  data: BalanceStatementData;
  onPrint?: () => void;
  onClose?: () => void;
}

const BalanceStatement: React.FC<BalanceStatementProps> = ({ data, onPrint, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Balance Statement - ${data.statementNumber}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: #333;
            }
            .statement-container { 
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
            .statement-title { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 8px;
            }
            .statement-number { 
              font-size: 16px; 
              opacity: 0.9;
            }
            .content { 
              padding: 30px;
            }
            .statement-meta {
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
            .balance-summary {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              margin: 20px 0;
            }
            .balance-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 4px 0;
            }
            .current-balance {
              font-size: 20px;
              font-weight: bold;
              color: #dc2626;
              border-top: 2px solid #d1d5db;
              padding-top: 12px;
              margin-top: 12px;
            }
            .transactions-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .transactions-table th,
            .transactions-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              font-size: 12px;
            }
            .transactions-table th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #374151;
            }
            .amount-debit {
              color: #dc2626;
              font-weight: 600;
            }
            .amount-credit {
              color: #059669;
              font-weight: 600;
            }
            .balance-amount {
              font-weight: 600;
              color: #374151;
            }
            .notice-section {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
            }
            .notice-section h4 {
              color: #92400e;
              margin: 0 0 8px 0;
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
            .separator { 
              border: none; 
              border-top: 1px dashed #d1d5db; 
              margin: 20px 0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .statement-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="statement-container">
            <div class="header">
              <div class="school-name">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9L5 11.18V17.18C5 17.97 5.63 18.6 6.42 18.6H17.58C18.37 18.6 19 17.97 19 17.18V11.18L23 9L12 3ZM6.5 10.47L12 7.61L17.5 10.47L12 13.33L6.5 10.47ZM18 16.7H6V12.24L12 15.54L18 12.24V16.7Z"/>
                </svg>
                Drumvale Secondary School
              </div>
              <div class="school-tagline">Nurturing Tomorrow's Leaders</div>
              <div class="statement-title">FEE BALANCE STATEMENT</div>
              <div class="statement-number">Statement #: ${data.statementNumber}</div>
            </div>
            
            <div class="content">
              <div class="statement-meta">
                <div>
                  <div class="section-title">Statement Information</div>
                  <div class="info-row">
                    <span class="info-label">Statement Date:</span>
                    <span class="info-value">${data.date}</span>
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

              <div class="balance-summary">
                <div class="balance-row">
                  <span>Total Amount Invoiced:</span>
                  <span>KES ${data.totalInvoiced.toLocaleString()}</span>
                </div>
                <div class="balance-row">
                  <span>Total Amount Paid:</span>
                  <span>KES ${data.totalPaid.toLocaleString()}</span>
                </div>
                <div class="balance-row current-balance">
                  <span>CURRENT OUTSTANDING BALANCE:</span>
                  <span>KES ${data.currentBalance.toLocaleString()}</span>
                </div>
              </div>

              <div class="section-title">Transaction History</div>
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Reference</th>
                    <th style="text-align: right;">Charges</th>
                    <th style="text-align: right;">Payments</th>
                    <th style="text-align: right;">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.transactions.map(transaction => `
                    <tr>
                      <td>${transaction.date}</td>
                      <td>${transaction.description}</td>
                      <td>${transaction.reference || '-'}</td>
                      <td style="text-align: right;" class="${transaction.type === 'invoice' ? 'amount-debit' : ''}">${transaction.type === 'invoice' ? transaction.amount.toLocaleString() : '-'}</td>
                      <td style="text-align: right;" class="${transaction.type === 'payment' ? 'amount-credit' : ''}">${transaction.type === 'payment' ? transaction.amount.toLocaleString() : '-'}</td>
                      <td style="text-align: right;" class="balance-amount">${transaction.balance.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              ${data.currentBalance > 0 ? `
                <div class="notice-section">
                  <h4>Payment Notice</h4>
                  <p style="margin: 0; font-size: 14px; color: #92400e;">
                    You have an outstanding balance of KES ${data.currentBalance.toLocaleString()}. 
                    Please make payment as soon as possible to avoid any inconvenience. 
                    Contact the finance office for payment arrangements if needed.
                  </p>
                </div>
              ` : `
                <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
                  <h4 style="color: #166534; margin: 0 0 8px 0;">Account Status: PAID UP</h4>
                  <p style="margin: 0; font-size: 14px; color: #166534;">
                    All fees have been paid. Thank you for your prompt payment!
                  </p>
                </div>
              `}
            </div>

            <div class="footer">
              <div><strong>Drumvale Secondary School</strong> - Nurturing Tomorrow's Leaders</div>
              <div class="contact-info">
                <div>📍 P.O. Box 12345, Nairobi, Kenya</div>
                <div>📞 +254 20 123 4567 | 📱 +254 711 123 456</div>
                <div>✉️ info@drumvale-secondary.ac.ke</div>
              </div>
              <div style="margin-top: 15px; font-style: italic;">
                This is a computer-generated statement. For inquiries, contact the Finance Office.
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
    <div className="statement-preview max-w-4xl mx-auto">
      <Card className="border-2">
        {/* Statement Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 rounded-t-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <GraduationCap className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Drumvale Secondary School</h1>
            </div>
            <p className="text-teal-100 text-lg">Nurturing Tomorrow's Leaders</p>
            <h2 className="text-2xl font-bold mt-6 mb-3">FEE BALANCE STATEMENT</h2>
            <p className="text-teal-100 text-lg">Statement #: {data.statementNumber}</p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Statement Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Statement Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statement Date:</span>
                  <span className="font-medium">{data.date}</span>
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

          {/* Balance Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount Invoiced:</span>
                <span className="font-medium">KES {data.totalInvoiced.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount Paid:</span>
                <span className="font-medium text-green-600">KES {data.totalPaid.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Current Outstanding Balance:</span>
                <span className={data.currentBalance > 0 ? "text-red-600" : "text-green-600"}>
                  KES {data.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reference</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Charges</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Payments</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{transaction.reference || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {transaction.type === 'invoice' ? (
                          <span className="font-medium text-red-600">
                            {transaction.amount.toLocaleString()}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {transaction.type === 'payment' ? (
                          <span className="font-medium text-green-600">
                            {transaction.amount.toLocaleString()}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {transaction.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Notice */}
          {data.currentBalance > 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Payment Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have an outstanding balance of KES {data.currentBalance.toLocaleString()}. 
                    Please make payment as soon as possible to avoid any inconvenience. 
                    Contact the finance office for payment arrangements if needed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-green-800">Account Status: PAID UP ✓</h4>
              <p className="text-sm text-green-700 mt-1">
                All fees have been paid. Thank you for your prompt payment!
              </p>
            </div>
          )}

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
              This is a computer-generated statement. For inquiries, contact the Finance Office.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700">
              🖨️ Print Statement
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

export default BalanceStatement;
