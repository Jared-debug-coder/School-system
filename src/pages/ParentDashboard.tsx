
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Calendar, FileText, Phone, Mail, ExternalLink, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';
import { generateReportCard } from '@/data/academicData';
import { generateReportCardPDF } from '@/components/ReportCardPDF';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handlePayFees = (child: any) => {
    // Redirect to M-Pesa payment or show payment options
    toast({
      title: "Payment Options",
      description: `Redirecting to payment gateway for ${child.name}. Amount: KES ${child.balance.toLocaleString()}`,
    });
    
    // Simulate opening payment gateway
    setTimeout(() => {
      window.open(`https://payments.nairobi-academy.ac.ke/pay?student=${child.id}&amount=${child.balance}`, '_blank');
    }, 1000);
  };
  
  const handleViewReport = (child: any) => {
    toast({
      title: "Generating Report Card",
      description: `Generating ${child.name}'s latest report card...`,
    });
    
    // Generate real report card using student data
    setTimeout(() => {
      const reportData = generateReportCard(child.admissionNumber);
      
      if (reportData) {
        generateReportCardPDF(reportData);
        toast({
          title: "Download Complete",
          description: `${child.name}'s report card has been downloaded successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Could not generate report card. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  // Get parent's children based on logged in user
  const getParentChildren = () => {
    if (!user?.children) return [];
    
    return user.children.map(admissionNumber => {
      const student = studentsData.find(s => s.admissionNumber === admissionNumber);
      if (!student) return null;
      
      const balance = parseFloat(student.balance.replace('KES ', '').replace(',', '')) || 0;
      
      return {
        admissionNumber: student.admissionNumber,
        name: student.name,
        class: student.class,
        balance: balance,
        lastPayment: '2024-12-15',
        nextFee: '2025-01-15',
        performance: balance === 0 ? 'Excellent' : balance < 10000 ? 'Good' : 'Average',
        attendance: balance === 0 ? '98%' : '95%',
      };
    }).filter(Boolean);
  };
  
  const children = getParentChildren();

  const upcomingEvents = [
    { date: '2025-01-10', event: 'Parent-Teacher Conference', time: '2:00 PM' },
    { date: '2025-01-15', event: 'School Fees Due', time: 'All Day' },
    { date: '2025-01-20', event: 'Science Fair', time: '10:00 AM' },
  ];

  const recentNotices = [
    { date: '2024-12-28', title: 'Holiday Assignment Reminder', priority: 'Medium' },
    { date: '2024-12-25', title: 'Term 1 Report Cards Available', priority: 'High' },
    { date: '2024-12-20', title: 'Transport Route Changes', priority: 'Low' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Here's an overview of your children's progress.
          </p>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <Card key={child.admissionNumber}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-teal-600" />
                  <span>{child.name}</span>
                </CardTitle>
                <CardDescription>{child.admissionNumber} - {child.class}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Fee Balance</div>
                    <div className={`text-lg font-semibold ${child.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      KES {child.balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Performance</div>
                    <Badge variant={child.performance === 'Excellent' ? 'default' : 'secondary'}>
                      {child.performance}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Attendance</div>
                    <div className="text-sm font-medium">{child.attendance}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Next Fee Due</div>
                    <div className="text-sm font-medium">{child.nextFee}</div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewReport(child)}>
                    <FileText className="h-4 w-4 mr-1" />
                    View Report
                  </Button>
                  {child.balance > 0 && (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handlePayFees(child)}>
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pay Fees
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions and Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{event.event}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </div>
                    <div className="text-sm font-medium text-teal-600">{event.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <span>Recent Notices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotices.map((notice, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{notice.title}</div>
                      <div className="text-sm text-gray-500">{notice.date}</div>
                    </div>
                    <Badge variant={notice.priority === 'High' ? 'destructive' : notice.priority === 'Medium' ? 'default' : 'secondary'}>
                      {notice.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>School Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-600" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-600">+254 20 123 4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-600" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">info@nairobi-academy.com</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ParentDashboard;
