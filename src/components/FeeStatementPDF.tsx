import jsPDF from 'jspdf';
import { studentsData } from '@/data/studentsData';

interface FeeStatementData {
  student: {
    name: string;
    admissionNumber: string;
    class: string;
    guardian: string;
    phone: string;
    residence: string;
  };
  fees: {
    termFees: Array<{
      item: string;
      amount: number;
      paid: number;
      balance: number;
    }>;
    totalDue: number;
    totalPaid: number;
    totalBalance: number;
  };
  payments: Array<{
    date: string;
    description: string;
    method: string;
    amount: number;
    receiptNo: string;
  }>;
  term: string;
  year: string;
}

export const generateFeeStatementPDF = (admissionNumber: string): boolean => {
  const student = studentsData.find(s => s.admissionNumber === admissionNumber);
  if (!student) return false;

  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Colors
  const primaryColor = [34, 139, 34]; // Forest Green
  const secondaryColor = [255, 140, 0]; // Orange
  const textColor = [0, 0, 0];
  const lightGray = [240, 240, 240];
  
  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, 210, 30, 'F');
  
  // School Logo
  pdf.setFillColor(...secondaryColor);
  pdf.circle(20, 15, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NA', 16.5, 18);
  
  // School Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NAIROBI ACADEMY', 35, 18);
  
  // School Details
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('P.O. Box 12345-00100, Nairobi', 35, 23);
  pdf.text('Tel: +254 20 123 4567 | Email: accounts@nairobi-academy.com', 35, 27);
  
  // Document Title
  pdf.setTextColor(...textColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FEE STATEMENT', 105, 45, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text('Term 1, 2024', 105, 52, { align: 'center' });
  
  let yPos = 65;
  
  // Student Information
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STUDENT INFORMATION', 20, yPos + 2);
  
  yPos += 15;
  
  const studentInfo = [
    ['Student Name:', student.name],
    ['Admission Number:', student.admissionNumber],
    ['Class:', student.class],
    ['Residence:', student.residence || 'Day Scholar']
  ];
  
  const guardianInfo = [
    ['Guardian Name:', student.guardian],
    ['Guardian Phone:', student.phone],
    ['Statement Date:', new Date().toLocaleDateString()],
    ['Academic Year:', '2024']
  ];
  
  // Two column layout for student info
  studentInfo.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 20, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 70, yPos + (index * 6));
  });
  
  guardianInfo.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 120, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 170, yPos + (index * 6));
  });
  
  yPos += 35;
  
  // Generate realistic fee structure
  const currentBalance = parseFloat(student.balance.replace('KES ', '').replace(',', '')) || 0;
  const isBoarding = student.residence === 'Boarding';
  
  const feeStructure = [
    { item: 'Tuition Fee', amount: isBoarding ? 45000 : 35000 },
    ...(isBoarding ? [{ item: 'Boarding Fee', amount: 25000 }] : []),
    ...(isBoarding ? [] : [{ item: 'Transport Fee', amount: 12000 }]),
    { item: 'Activity Fee', amount: 3000 },
    { item: 'Uniform & Books', amount: 5000 },
    { item: 'Exam Fee', amount: 2500 }
  ];
  
  const totalDue = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = totalDue - currentBalance;
  
  // Fee Structure Section
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FEE STRUCTURE - TERM 1, 2024', 20, yPos + 2);
  
  yPos += 15;
  
  // Table Headers
  pdf.setFillColor(...primaryColor);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  
  pdf.text('FEE ITEM', 20, yPos + 2);
  pdf.text('AMOUNT DUE', 80, yPos + 2);
  pdf.text('AMOUNT PAID', 120, yPos + 2);
  pdf.text('BALANCE', 160, yPos + 2);
  
  yPos += 12;
  
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'normal');
  
  let runningBalance = currentBalance;
  feeStructure.reverse().forEach((fee, index) => {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 30;
    }
    
    const paidAmount = Math.max(0, Math.min(fee.amount, totalPaid - feeStructure.slice(index + 1).reduce((sum, f) => sum + f.amount, 0)));
    const feeBalance = fee.amount - paidAmount;
    
    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(15, yPos - 2, 180, 6, 'F');
    }
    
    pdf.text(fee.item, 20, yPos + 2);
    pdf.text(`KES ${fee.amount.toLocaleString()}`, 80, yPos + 2);
    pdf.text(`KES ${paidAmount.toLocaleString()}`, 120, yPos + 2);
    
    // Color code the balance
    if (feeBalance > 0) {
      pdf.setTextColor(255, 0, 0);
    } else {
      pdf.setTextColor(0, 128, 0);
    }
    pdf.text(`KES ${feeBalance.toLocaleString()}`, 160, yPos + 2);
    pdf.setTextColor(...textColor);
    
    yPos += 6;
  });
  
  // Totals
  yPos += 10;
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  
  pdf.text('TOTALS', 20, yPos + 2);
  pdf.text(`KES ${totalDue.toLocaleString()}`, 80, yPos + 2);
  pdf.text(`KES ${totalPaid.toLocaleString()}`, 120, yPos + 2);
  
  if (currentBalance > 0) {
    pdf.setTextColor(255, 0, 0);
  } else {
    pdf.setTextColor(0, 128, 0);
  }
  pdf.text(`KES ${currentBalance.toLocaleString()}`, 160, yPos + 2);
  pdf.setTextColor(...textColor);
  
  yPos += 20;
  
  // Payment History
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT HISTORY', 20, yPos + 2);
  
  yPos += 15;
  
  // Generate realistic payment history
  const generatePaymentHistory = () => {
    const payments = [];
    let remainingPaid = totalPaid;
    let paymentCount = 0;
    
    while (remainingPaid > 0 && paymentCount < 4) {
      const paymentAmount = Math.min(remainingPaid, Math.floor(Math.random() * 20000) + 10000);
      const paymentDate = new Date(2024, 0, 15 + (paymentCount * 20) + Math.floor(Math.random() * 10));
      const methods = ['M-Pesa', 'Bank Transfer', 'Cash'];
      const method = methods[Math.floor(Math.random() * methods.length)];
      
      payments.push({
        date: paymentDate.toLocaleDateString(),
        method: method,
        amount: paymentAmount,
        receiptNo: `RCP${paymentDate.getFullYear()}${String(paymentDate.getMonth() + 1).padStart(2, '0')}${String(paymentCount + 1).padStart(3, '0')}`
      });
      
      remainingPaid -= paymentAmount;
      paymentCount++;
    }
    
    return payments.reverse();
  };
  
  const payments = generatePaymentHistory();
  
  if (payments.length > 0) {
    // Payment table headers
    pdf.setFillColor(...primaryColor);
    pdf.rect(15, yPos - 3, 180, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    pdf.text('DATE', 20, yPos + 2);
    pdf.text('PAYMENT METHOD', 60, yPos + 2);
    pdf.text('AMOUNT', 120, yPos + 2);
    pdf.text('RECEIPT NO', 160, yPos + 2);
    
    yPos += 12;
    
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    
    payments.forEach((payment, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(15, yPos - 2, 180, 6, 'F');
      }
      
      pdf.text(payment.date, 20, yPos + 2);
      pdf.text(payment.method, 60, yPos + 2);
      pdf.text(`KES ${payment.amount.toLocaleString()}`, 120, yPos + 2);
      pdf.text(payment.receiptNo, 160, yPos + 2);
      
      yPos += 6;
    });
  } else {
    pdf.setFont('helvetica', 'italic');
    pdf.text('No payments recorded for this term.', 20, yPos + 10);
    yPos += 20;
  }
  
  // Outstanding Balance Notice
  if (currentBalance > 0) {
    yPos += 10;
    pdf.setFillColor(255, 245, 245);
    pdf.rect(15, yPos - 5, 180, 20, 'F');
    pdf.setFillColor(255, 0, 0);
    pdf.rect(15, yPos - 5, 5, 20, 'F');
    
    pdf.setTextColor(180, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OUTSTANDING BALANCE NOTICE', 25, yPos + 2);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Your account has an outstanding balance of KES ${currentBalance.toLocaleString()}.`, 25, yPos + 8);
    pdf.text('Please clear this balance by the due date to avoid penalties.', 25, yPos + 13);
    
    yPos += 25;
  }
  
  // Footer
  yPos = 280;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont('helvetica', 'italic');
  pdf.text('This is a computer-generated statement. For inquiries, contact the accounts office.', 20, yPos);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos + 5);
  pdf.text('Nairobi Academy - Excellence in Education', 105, yPos + 2, { align: 'center' });
  
  // Save the PDF
  pdf.save(`Fee_Statement_${student.name.replace(/\s+/g, '_')}_${admissionNumber}.pdf`);
  
  return true;
};

export default generateFeeStatementPDF;
