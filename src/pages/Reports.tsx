
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { studentsData } from '@/data/studentsData';

const Reports = () => {
  const { toast } = useToast();

  const reports = [
    {
      name: 'Financial Summary Report',
      description: 'Overview of income, expenses, and outstanding balances',
      lastGenerated: '2025-01-07',
      type: 'Financial',
    },
    {
      name: 'Fee Collection Report',
      description: 'Detailed breakdown of fee payments by class and term',
      lastGenerated: '2025-01-06',
      type: 'Financial',
    },
    {
      name: 'Outstanding Balances',
      description: 'List of students with pending fee payments',
      lastGenerated: '2025-01-07',
      type: 'Financial',
    },
    {
      name: 'Payment Methods Analysis',
      description: 'Breakdown of payments by M-Pesa, cash, and bank transfers',
      lastGenerated: '2025-01-05',
      type: 'Analysis',
    },
  ];

  const generateFinancialSummaryPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Header
    pdf.setFillColor(34, 139, 34);
    pdf.rect(0, 0, 210, 25, 'F');
    
    // School Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NAIROBI ACADEMY', 20, 15);
    
    // Report Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FINANCIAL SUMMARY REPORT', 20, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Calculate actual statistics from student data
    const totalStudents = studentsData.length;
    const studentsWithBalance = studentsData.filter(s => 
      parseFloat(s.balance.replace('KES ', '').replace(',', '')) > 0
    ).length;
    const totalOutstanding = studentsData.reduce((sum, s) => 
      sum + parseFloat(s.balance.replace('KES ', '').replace(',', '')), 0
    );
    const paidStudents = totalStudents - studentsWithBalance;
    const totalCollected = 1720000; // Simulated total collected
    
    let yPos = 65;
    
    // Summary Statistics
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 3, 180, 8, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUMMARY STATISTICS', 20, yPos + 2);
    
    yPos += 20;
    
    const summaryData = [
      ['Total Students:', totalStudents.toString()],
      ['Students with Outstanding Balance:', studentsWithBalance.toString()],
      ['Students Fully Paid:', paidStudents.toString()],
      ['Total Outstanding Amount:', `KES ${totalOutstanding.toLocaleString()}`],
      ['Total Collected This Term:', `KES ${totalCollected.toLocaleString()}`],
      ['Collection Rate:', `${Math.round((paidStudents / totalStudents) * 100)}%`]
    ];
    
    summaryData.forEach((item, index) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(item[0], 20, yPos + (index * 8));
      pdf.setFont('helvetica', 'normal');
      pdf.text(item[1], 120, yPos + (index * 8));
    });
    
    yPos += 60;
    
    // Outstanding Balances by Class
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 3, 180, 8, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OUTSTANDING BALANCES BY CLASS', 20, yPos + 2);
    
    yPos += 15;
    
    // Group students by class
    const classSummary = studentsData.reduce((acc, student) => {
      const className = student.class;
      const balance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      
      if (!acc[className]) {
        acc[className] = { total: 0, count: 0, outstanding: 0 };
      }
      
      acc[className].count += 1;
      if (balance > 0) {
        acc[className].outstanding += balance;
        acc[className].total += 1;
      }
      
      return acc;
    }, {} as any);
    
    // Table headers
    pdf.setFillColor(34, 139, 34);
    pdf.rect(15, yPos - 3, 180, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CLASS', 20, yPos + 2);
    pdf.text('TOTAL STUDENTS', 70, yPos + 2);
    pdf.text('WITH BALANCE', 120, yPos + 2);
    pdf.text('AMOUNT OUTSTANDING', 150, yPos + 2);
    
    yPos += 12;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    Object.entries(classSummary).forEach(([className, data]: [string, any], index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(15, yPos - 2, 180, 6, 'F');
      }
      
      pdf.text(className, 20, yPos + 2);
      pdf.text(data.count.toString(), 80, yPos + 2);
      pdf.text(data.total.toString(), 130, yPos + 2);
      pdf.text(`KES ${data.outstanding.toLocaleString()}`, 155, yPos + 2);
      
      yPos += 6;
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Nairobi Academy - Financial Summary Report', 105, 280, { align: 'center' });
    
    pdf.save(`Financial_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const generateOutstandingBalancesPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Header
    pdf.setFillColor(34, 139, 34);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NAIROBI ACADEMY', 20, 15);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OUTSTANDING BALANCES REPORT', 20, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 50);
    
    let yPos = 65;
    
    // Filter students with outstanding balances
    const studentsWithBalance = studentsData.filter(s => 
      parseFloat(s.balance.replace('KES ', '').replace(',', '')) > 0
    );
    
    // Table headers
    pdf.setFillColor(34, 139, 34);
    pdf.rect(15, yPos - 3, 180, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT NAME', 20, yPos + 2);
    pdf.text('ADM NO', 80, yPos + 2);
    pdf.text('CLASS', 110, yPos + 2);
    pdf.text('BALANCE', 140, yPos + 2);
    pdf.text('GUARDIAN', 170, yPos + 2);
    
    yPos += 12;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    studentsWithBalance.forEach((student, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(15, yPos - 2, 180, 6, 'F');
      }
      
      pdf.text(student.name.substring(0, 18), 20, yPos + 2);
      pdf.text(student.admissionNumber, 80, yPos + 2);
      pdf.text(student.class, 110, yPos + 2);
      pdf.text(student.balance, 140, yPos + 2);
      pdf.text(student.guardian.substring(0, 15), 170, yPos + 2);
      
      yPos += 6;
    });
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Nairobi Academy - Outstanding Balances Report', 105, 280, { align: 'center' });
    
    pdf.save(`Outstanding_Balances_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleGenerateReport = (reportName: string) => {
    toast({
      title: "Generating Report",
      description: `Generating ${reportName}...`,
    });
    
    setTimeout(() => {
      switch (reportName) {
        case 'Financial Summary Report':
          generateFinancialSummaryPDF();
          break;
        case 'Outstanding Balances':
          generateOutstandingBalancesPDF();
          break;
        case 'Fee Collection Report':
          generateFinancialSummaryPDF(); // Use same for now
          break;
        default:
          // For other reports, generate a simple PDF
          const pdf = new jsPDF();
          pdf.text(`${reportName} - Generated on ${new Date().toLocaleDateString()}`, 20, 20);
          pdf.text('This is a placeholder report. Real implementation would contain actual data.', 20, 40);
          pdf.save(`${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
      toast({
        title: "Report Downloaded",
        description: `${reportName} has been downloaded successfully.`,
      });
    }, 1500);
  };

  const handleGenerateNewReport = () => {
    toast({
      title: "Custom Report Builder",
      description: "Opening custom report builder interface...",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-gray-600">Generate and view financial and academic reports</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleGenerateNewReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-teal-600" />
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {report.type}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{report.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Last generated: {report.lastGenerated}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateReport(report.name)}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">92%</div>
                <div className="text-sm text-gray-500">Fee Collection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">KES 1.72M</div>
                <div className="text-sm text-gray-500">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-500">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">355</div>
                <div className="text-sm text-gray-500">Pending Payments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
