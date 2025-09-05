import React from 'react';
import jsPDF from 'jspdf';
import { ReportCardData } from '@/data/academicData';

export const generateReportCardPDF = (reportData: ReportCardData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Colors
  const primaryColor = [34, 139, 34]; // Forest Green
  const secondaryColor = [255, 140, 0]; // Orange
  const textColor = [0, 0, 0];
  const lightGray = [240, 240, 240];
  
  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, 210, 30, 'F');
  
  // School Logo (simulated)
  pdf.setFillColor(...secondaryColor);
  pdf.circle(20, 15, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DS', 16.5, 18);
  
  // School Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DRUMVALE SECONDARY SCHOOL', 35, 18);
  
  // School Details
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('P.O. Box 12345-00100, Nairobi', 35, 23);
  pdf.text('Tel: +254 20 123 4567 | Email: info@drumvale-secondary.ac.ke', 35, 27);
  
  // Report Card Title
  pdf.setTextColor(...textColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STUDENT REPORT CARD', 105, 45, { align: 'center' });
  
  // Term and Year
  pdf.setFontSize(12);
  pdf.text(`${reportData.student.term} ${reportData.student.year}`, 105, 52, { align: 'center' });
  
  // Student Information Section
  let yPos = 65;
  
  // Section Header
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STUDENT INFORMATION', 20, yPos + 2);
  
  yPos += 15;
  
  // Student details in two columns
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const leftCol = [
    ['Name:', reportData.student.name],
    ['Admission No:', reportData.student.admissionNumber],
    ['Class:', reportData.student.class],
    ['Gender:', reportData.student.gender]
  ];
  
  const rightCol = [
    ['Date of Birth:', reportData.student.dateOfBirth],
    ['Residence:', reportData.student.residence],
    ['Term:', reportData.student.term],
    ['Year:', reportData.student.year]
  ];
  
  leftCol.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 20, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 50, yPos + (index * 6));
  });
  
  rightCol.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 120, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 150, yPos + (index * 6));
  });
  
  yPos += 35;
  
  // Academic Performance Section
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACADEMIC PERFORMANCE', 20, yPos + 2);
  
  yPos += 15;
  
  // Table Headers
  pdf.setFillColor(...primaryColor);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  const headers = ['SUBJECT', 'CAT (30)', 'EXAM (70)', 'TOTAL (100)', 'GRADE', 'REMARKS'];
  const colWidths = [60, 20, 25, 25, 20, 30];
  let xPos = 20;
  
  headers.forEach((header, index) => {
    pdf.text(header, xPos, yPos + 2);
    xPos += colWidths[index];
  });
  
  yPos += 12;
  
  // Subject rows
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'normal');
  
  reportData.academic.subjects.forEach((subject, index) => {
    if (yPos > 250) { // New page if needed
      pdf.addPage();
      yPos = 30;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(15, yPos - 2, 180, 6, 'F');
    }
    
    xPos = 20;
    const values = [
      subject.subject,
      subject.catScore.toString(),
      subject.examScore.toString(),
      subject.totalScore.toString(),
      subject.grade,
      subject.remarks
    ];
    
    values.forEach((value, colIndex) => {
      pdf.text(value, xPos, yPos + 2);
      xPos += colWidths[colIndex];
    });
    
    yPos += 6;
  });
  
  // Summary Section
  yPos += 10;
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUMMARY', 20, yPos + 2);
  
  yPos += 15;
  
  const summaryData = [
    ['Total Marks:', `${reportData.academic.totalMarks}/${reportData.academic.subjects.length * 100}`],
    ['Average Score:', `${reportData.academic.averageScore}%`],
    ['Overall Grade:', reportData.academic.overallGrade],
    ['Class Position:', `${reportData.academic.position} out of ${reportData.academic.outOf}`]
  ];
  
  summaryData.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 20, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 70, yPos + (index * 6));
  });
  
  // Attendance Section
  yPos += 35;
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ATTENDANCE', 20, yPos + 2);
  
  yPos += 15;
  
  const attendanceData = [
    ['Days Present:', reportData.attendance.daysPresent.toString()],
    ['Days Absent:', reportData.attendance.daysAbsent.toString()],
    ['Total Days:', reportData.attendance.totalDays.toString()],
    ['Attendance %:', `${reportData.attendance.percentage}%`]
  ];
  
  attendanceData.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 20, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 70, yPos + (index * 6));
  });
  
  // Fees Section
  const rightYPos = yPos;
  const feesData = [
    ['Fee Balance:', reportData.fees.balance],
    ['Fee Status:', reportData.fees.status],
    ['Next Term Opens:', reportData.nextTerm.opensOn],
    ['Fees Due:', reportData.nextTerm.feeDue]
  ];
  
  feesData.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 120, rightYPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 170, rightYPos + (index * 6));
  });
  
  // Check if we need a new page for comments
  if (yPos > 230) {
    pdf.addPage();
    yPos = 30;
  }
  
  // Comments Section
  yPos += 15;
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...textColor);
  pdf.text('TEACHER COMMENTS', 20, yPos + 2);
  
  yPos += 15;
  
  // Class Teacher Comment
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Class Teacher:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportData.classTeacher.name, 70, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'italic');
  pdf.text('Remarks:', 20, yPos);
  
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  const classTeacherRemarks = pdf.splitTextToSize(reportData.classTeacher.remarks, 170);
  pdf.text(classTeacherRemarks, 20, yPos);
  
  yPos += (classTeacherRemarks.length * 5) + 15;
  
  // Head Teacher Comment
  pdf.setFont('helvetica', 'bold');
  pdf.text('Head Teacher:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportData.headTeacher.name, 70, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'italic');
  pdf.text('Remarks:', 20, yPos);
  
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  const headTeacherRemarks = pdf.splitTextToSize(reportData.headTeacher.remarks, 170);
  pdf.text(headTeacherRemarks, 20, yPos);
  
  yPos += (headTeacherRemarks.length * 5) + 10;
  
  // Footer
  yPos = 280;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Generated on: ' + new Date().toLocaleDateString(), 20, yPos);
  pdf.text('Drumvale Secondary School - Nurturing Tomorrow\'s Leaders', 105, yPos, { align: 'center' });
  
  // Save the PDF
  const fileName = `${reportData.student.name.replace(/\s+/g, '_')}_${reportData.student.term}_${reportData.student.year}_ReportCard.pdf`;
  pdf.save(fileName);
};

// React component for rendering report card (for preview if needed)
interface ReportCardProps {
  reportData: ReportCardData;
}

export const ReportCard: React.FC<ReportCardProps> = ({ reportData }) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="report-card">
      {/* This component can be used for preview or HTML to PDF conversion */}
      <div className="header bg-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">DS</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">DRUMVALE SECONDARY SCHOOL</h1>
            <p className="text-sm">P.O. Box 12345-00100, Nairobi</p>
            <p className="text-sm">Tel: +254 20 123 4567</p>
          </div>
        </div>
      </div>
      
      <div className="content p-6 border-x border-b rounded-b-lg">
        <h2 className="text-xl font-bold text-center mb-4">STUDENT REPORT CARD</h2>
        <p className="text-center mb-6">{reportData.student.term} {reportData.student.year}</p>
        
        {/* Student Information */}
        <div className="mb-6">
          <h3 className="bg-gray-100 p-2 font-bold">STUDENT INFORMATION</h3>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p><strong>Name:</strong> {reportData.student.name}</p>
              <p><strong>Admission No:</strong> {reportData.student.admissionNumber}</p>
              <p><strong>Class:</strong> {reportData.student.class}</p>
              <p><strong>Gender:</strong> {reportData.student.gender}</p>
            </div>
            <div>
              <p><strong>Date of Birth:</strong> {reportData.student.dateOfBirth}</p>
              <p><strong>Residence:</strong> {reportData.student.residence}</p>
              <p><strong>Term:</strong> {reportData.student.term}</p>
              <p><strong>Year:</strong> {reportData.student.year}</p>
            </div>
          </div>
        </div>
        
        {/* Academic Performance */}
        <div className="mb-6">
          <h3 className="bg-gray-100 p-2 font-bold">ACADEMIC PERFORMANCE</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-gray-300 p-2">SUBJECT</th>
                <th className="border border-gray-300 p-2">CAT (30)</th>
                <th className="border border-gray-300 p-2">EXAM (70)</th>
                <th className="border border-gray-300 p-2">TOTAL (100)</th>
                <th className="border border-gray-300 p-2">GRADE</th>
                <th className="border border-gray-300 p-2">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {reportData.academic.subjects.map((subject, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="border border-gray-300 p-2">{subject.subject}</td>
                  <td className="border border-gray-300 p-2 text-center">{subject.catScore}</td>
                  <td className="border border-gray-300 p-2 text-center">{subject.examScore}</td>
                  <td className="border border-gray-300 p-2 text-center">{subject.totalScore}</td>
                  <td className="border border-gray-300 p-2 text-center font-bold">{subject.grade}</td>
                  <td className="border border-gray-300 p-2">{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Rest of the component would continue with summary, attendance, etc. */}
      </div>
    </div>
  );
};
