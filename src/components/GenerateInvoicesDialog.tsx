
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Invoice, { InvoiceData } from './Invoice';
import { studentsData } from '@/data/studentsData';

const GenerateInvoicesDialog = () => {
  const [open, setOpen] = useState(false);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [generatedInvoices, setGeneratedInvoices] = useState<InvoiceData[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    term: '',
    feeTypes: [] as string[],
    dueDate: ''
  });
  const { toast } = useToast();

  const feeTypes = [
    { id: 'tuition', label: 'Tuition Fees', amount: 25000 },
    { id: 'transport', label: 'Transport', amount: 8000 },
    { id: 'lunch', label: 'Lunch Program', amount: 12000 },
    { id: 'uniform', label: 'Uniform', amount: 5000 },
    { id: 'books', label: 'Books & Stationery', amount: 7500 },
  ];

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class || !formData.term || formData.feeTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one fee type.",
        variant: "destructive"
      });
      return;
    }

    // Filter students based on selected class
    let filteredStudents = studentsData;
    if (formData.class !== 'all') {
      const classMap: { [key: string]: string[] } = {
        'form1': ['Form 1A', 'Form 1B', 'Form 1C'],
        'form2': ['Form 2A', 'Form 2B', 'Form 2C'],
        'form3': ['Form 3A', 'Form 3B', 'Form 3C'],
        'form4': ['Form 4A', 'Form 4B', 'Form 4C'],
      };
      const classNames = classMap[formData.class] || [];
      filteredStudents = studentsData.filter(student => 
        classNames.some(className => student.class.includes(className.split(' ')[1]))
      );
    }

    // Generate invoices for filtered students
    const invoices: InvoiceData[] = filteredStudents.map(student => {
      const selectedFees = feeTypes.filter(fee => formData.feeTypes.includes(fee.id));
      const totalAmount = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
      const currentBalance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      
      return {
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toLocaleDateString('en-GB'),
        dueDate: new Date(formData.dueDate).toLocaleDateString('en-GB'),
        studentName: student.name,
        admissionNumber: student.admissionNumber,
        class: student.class,
        guardian: student.guardian,
        guardianPhone: student.phone,
        guardianEmail: student.email,
        feeItems: selectedFees.map(fee => ({
          description: fee.label,
          amount: fee.amount
        })),
        academicYear: '2024/2025',
        term: formData.term === 'term1' ? 'Term 1' : formData.term === 'term2' ? 'Term 2' : 'Term 3',
        totalAmount,
        previousBalance: currentBalance,
        grandTotal: currentBalance + totalAmount
      };
    });

    setGeneratedInvoices(invoices);
    setShowInvoiceList(true);
    setOpen(false);
    
    toast({
      title: "Invoices Generated Successfully",
      description: `${invoices.length} invoices created for ${formData.class === 'all' ? 'all classes' : formData.class}. Ready for printing.`,
    });
  };

  const handleFeeTypeChange = (feeType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      feeTypes: checked 
        ? [...prev.feeTypes, feeType]
        : prev.feeTypes.filter(type => type !== feeType)
    }));
  };

  const totalAmount = formData.feeTypes.reduce((sum, type) => {
    const fee = feeTypes.find(f => f.id === type);
    return sum + (fee?.amount || 0);
  }, 0);

  // Show invoice preview if an invoice is selected
  if (showInvoicePreview && currentInvoice) {
    return (
      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <Invoice 
            data={currentInvoice} 
            onClose={() => {
              setShowInvoicePreview(false);
              setCurrentInvoice(null);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Show invoice list if invoices are generated
  if (showInvoiceList && generatedInvoices.length > 0) {
    return (
      <Dialog open={showInvoiceList} onOpenChange={setShowInvoiceList}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Invoices ({generatedInvoices.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-semibold">Batch Summary</h3>
                <p className="text-sm text-gray-600">
                  {generatedInvoices.length} invoices generated • 
                  Total Value: KES {generatedInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <Button 
                  onClick={() => {
                    generatedInvoices.forEach((invoice, index) => {
                      setTimeout(() => {
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          const printContent = `
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>School Fee Invoice - ${invoice.invoiceNumber}</title>
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
                                  .footer { 
                                    background: #f9fafb; 
                                    padding: 20px 30px; 
                                    text-align: center; 
                                    font-size: 12px; 
                                    color: #6b7280;
                                    border-top: 1px solid #e5e7eb;
                                    border-radius: 0 0 6px 6px;
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
                                      Nairobi Academy
                                    </div>
                                    <div class="school-tagline">Excellence in Education</div>
                                    <div class="invoice-title">SCHOOL FEE INVOICE</div>
                                    <div class="invoice-number">Invoice #: ${invoice.invoiceNumber}</div>
                                  </div>
                                  
                                  <div class="content">
                                    <div class="section-title">Student Information</div>
                                    <div class="info-row">
                                      <span class="info-label">Student Name:</span>
                                      <span class="info-value">${invoice.studentName}</span>
                                    </div>
                                    <div class="info-row">
                                      <span class="info-label">Admission Number:</span>
                                      <span class="info-value">${invoice.admissionNumber}</span>
                                    </div>
                                    <div class="info-row">
                                      <span class="info-label">Class:</span>
                                      <span class="info-value">${invoice.class}</span>
                                    </div>
                                    <div class="info-row">
                                      <span class="info-label">Parent/Guardian:</span>
                                      <span class="info-value">${invoice.guardian}</span>
                                    </div>
                                    
                                    <div class="section-title">Fee Breakdown</div>
                                    <table class="fees-table">
                                      <thead>
                                        <tr>
                                          <th>Description</th>
                                          <th class="amount">Amount (KES)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        ${invoice.feeItems.map(item => `
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
                                        <span>KES ${invoice.previousBalance.toLocaleString()}</span>
                                      </div>
                                      <div class="total-row">
                                        <span>Current Charges:</span>
                                        <span>KES ${invoice.totalAmount.toLocaleString()}</span>
                                      </div>
                                      <div class="total-row grand-total">
                                        <span>TOTAL AMOUNT DUE:</span>
                                        <span>KES ${invoice.grandTotal.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
            
                                  <div class="footer">
                                    <div><strong>Nairobi Academy</strong> - Excellence in Education</div>
                                    <div>📍 P.O. Box 12345, Nairobi, Kenya | 📞 +254 20 123 4567 | ✉️ info@nairobi-academy.ac.ke</div>
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
                        }
                      }, index * 500); // Stagger the print windows
                    });
                  }}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  🖨️ Print All
                </Button>
                <Button variant="outline" onClick={() => setShowInvoiceList(false)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generatedInvoices.map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{invoice.studentName}</div>
                          <div className="text-gray-500">{invoice.admissionNumber}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.class}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        KES {invoice.grandTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentInvoice(invoice);
                              setShowInvoicePreview(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
              <div className="p-2 rounded-lg text-white bg-teal-500 hover:bg-teal-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Generate Invoices</div>
                <div className="text-sm text-gray-500 mt-1">Create bulk invoices for school fees and other charges</div>
              </div>
            </div>
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Bulk Invoices</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">Class</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="form1">Form 1</SelectItem>
                  <SelectItem value="form2">Form 2</SelectItem>
                  <SelectItem value="form3">Form 3</SelectItem>
                  <SelectItem value="form4">Form 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="term">Term</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term1">Term 1, 2025</SelectItem>
                  <SelectItem value="term2">Term 2, 2025</SelectItem>
                  <SelectItem value="term3">Term 3, 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Fee Types</Label>
            <div className="space-y-3 mt-2">
              {feeTypes.map((feeType) => (
                <div key={feeType.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={feeType.id}
                      checked={formData.feeTypes.includes(feeType.id)}
                      onCheckedChange={(checked) => handleFeeTypeChange(feeType.id, checked as boolean)}
                    />
                    <label htmlFor={feeType.id} className="text-sm font-medium">
                      {feeType.label}
                    </label>
                  </div>
                  <span className="text-sm text-gray-600">KES {feeType.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          {formData.feeTypes.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Invoice Summary</div>
              <div className="text-lg font-bold text-teal-600">
                Total: KES {totalAmount.toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Generate Invoices
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default GenerateInvoicesDialog;
