import React from 'react';
import jsPDF from 'jspdf';
import { ReportCardData } from '@/data/academicData';

export const generateReportCardPDF = (reportData: ReportCardData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Colors as proper tuples
  const primaryColor: [number, number, number] = [34, 139, 34]; // Forest Green
  const secondaryColor: [number, number, number] = [255, 140, 0]; // Orange
  const textColor: [number, number, number] = [0, 0, 0];
  const lightGray: [number, number, number] = [240, 240, 240];
  
  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, 210, 30, 'F');
  
  // School Logo (simulated)
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
  pdf.text('Tel: +254 20 123 4567 | Email: info@nairobi-academy.com', 35, 27);
  
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
  
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STUDENT INFORMATION', 20, yPos + 2);
  
  yPos += 15;
  
  const studentInfo = [
    ['Student Name:', reportData.student.name],
    ['Admission Number:', reportData.student.admissionNumber],
    ['Class:', reportData.student.class],
    ['House:', reportData.student.streamName || 'N/A']
  ];
  
  const academicInfo = [
    ['Class Teacher:', reportData.classTeacher.name],
    ['Next Term Begins:', reportData.nextTerm.opensOn],
    ['Fee Due Date:', reportData.nextTerm.feeDue],
    ['Position:', `${reportData.academic.position} out of ${reportData.academic.outOf}`]
  ];
  
  // Two column layout
  studentInfo.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 20, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 70, yPos + (index * 6));
  });
  
  academicInfo.forEach((item, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item[0], 120, yPos + (index * 6));
    pdf.setFont('helvetica', 'normal');
    pdf.text(item[1], 170, yPos + (index * 6));
  });
  
  yPos += 35;
  
  // Subjects and Grades Section
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
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  
  pdf.text('SUBJECT', 20, yPos + 2);
  pdf.text('CAT (30)', 70, yPos + 2);
  pdf.text('EXAM (70)', 95, yPos + 2);
  pdf.text('TOTAL', 125, yPos + 2);
  pdf.text('GRADE', 150, yPos + 2);
  pdf.text('REMARKS', 170, yPos + 2);
  
  yPos += 12;
  
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'normal');
  
  // Subject grades
  reportData.academic.subjects.forEach((subject, index) => {
    if (yPos > 240) {
      pdf.addPage();
      yPos = 30;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      const rowColor: [number, number, number] = [248, 248, 248];
      pdf.setFillColor(...rowColor);
      pdf.rect(15, yPos - 2, 180, 6, 'F');
    }
    
    pdf.text(subject.subject, 20, yPos + 2);
    pdf.text(subject.catScore.toString(), 70, yPos + 2);
    pdf.text(subject.examScore.toString(), 95, yPos + 2);
    pdf.text(subject.totalScore.toString(), 125, yPos + 2);
    
    // Color code grades
    const gradeColor = subject.grade.startsWith('A') ? [0, 128, 0] : 
                      subject.grade.startsWith('B') ? [0, 0, 255] :
                      subject.grade.startsWith('C') ? [255, 140, 0] : [255, 0, 0];
    
    pdf.setTextColor(...(gradeColor as [number, number, number]));
    pdf.text(subject.grade, 150, yPos + 2);
    pdf.setTextColor(...textColor);
    
    pdf.text(subject.remarks || '-', 170, yPos + 2);
    
    yPos += 6;
  });
  
  yPos += 10;
  
  // Summary Section
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TERM SUMMARY', 20, yPos + 2);
  
  yPos += 15;
  
  const summaryData = [
    ['Total Marks:', `${reportData.academic.totalMarks}`],
    ['Average Score:', `${reportData.academic.averageScore}%`],
    ['Overall Grade:', reportData.academic.overallGrade],
    ['Class Position:', `${reportData.academic.position} out of ${reportData.academic.outOf}`],
    ['Attendance:', `${reportData.attendance.daysPresent}/${reportData.attendance.totalDays} days (${reportData.attendance.percentage}%)`],
    ['Fee Status:', reportData.fees.status]
  ];
  
  summaryData.forEach((item, index) => {
    if (index < 3) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(item[0], 20, yPos + (index * 6));
      pdf.setFont('helvetica', 'normal');
      pdf.text(item[1], 80, yPos + (index * 6));
    } else {
      pdf.setFont('helvetica', 'bold');
      pdf.text(item[0], 120, yPos + ((index - 3) * 6));
      pdf.setFont('helvetica', 'normal');
      pdf.text(item[1], 170, yPos + ((index - 3) * 6));
    }
  });
  
  yPos += 25;
  
  // Comments Section
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPos - 3, 180, 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('COMMENTS', 20, yPos + 2);
  
  yPos += 15;
  
  // Class Teacher's Comment
  pdf.setFont('helvetica', 'bold');
  pdf.text('Class Teacher:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  const classTeacherText = pdf.splitTextToSize(reportData.classTeacher.remarks, 170);
  pdf.text(classTeacherText, 20, yPos + 6);
  yPos += 6 + (classTeacherText.length * 4) + 6;
  
  // Head Teacher's Comment
  pdf.setFont('helvetica', 'bold');
  pdf.text('Head Teacher:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  const headTeacherText = pdf.splitTextToSize(reportData.headTeacher.remarks, 170);
  pdf.text(headTeacherText, 20, yPos + 6);
  yPos += 6 + (headTeacherText.length * 4) + 12;
  
  // Signature Section
  yPos = Math.max(yPos + 20, 250);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Signature lines
  pdf.line(20, yPos, 80, yPos);
  pdf.text('Class Teacher', 20, yPos + 5);
  pdf.text(reportData.classTeacher.name, 20, yPos + 10);
  
  pdf.line(130, yPos, 190, yPos);
  pdf.text('Head Teacher', 130, yPos + 5);
  pdf.text(reportData.headTeacher.name, 130, yPos + 10);
  
  // Footer
  yPos = 280;
  const footerColor: [number, number, number] = [100, 100, 100];
  pdf.setFontSize(8);
  pdf.setTextColor(...footerColor);
  pdf.setFont('helvetica', 'italic');
  pdf.text('This is a computer-generated report card. For inquiries, contact the school office.', 20, yPos);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos + 5);
  pdf.text('Nairobi Academy - Excellence in Education', 105, yPos + 2, { align: 'center' });
  
  // Save PDF
  pdf.save(`Report_Card_${reportData.student.name.replace(/\s+/g, '_')}_${reportData.student.term}_${reportData.student.year}.pdf`);
};

export default generateReportCardPDF;