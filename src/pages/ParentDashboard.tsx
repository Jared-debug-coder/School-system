
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Calendar, FileText, Phone, Mail } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();

  // Mock data for parent's children
  const children = [
    {
      id: 'NA2024001',
      name: 'John Kamau Jr.',
      class: 'Form 4A',
      balance: 5000,
      lastPayment: '2024-12-15',
      nextFee: '2025-01-15',
      performance: 'Good',
      attendance: '95%',
    },
    {
      id: 'NA2024015',
      name: 'Mary Kamau',
      class: 'Form 2B',
      balance: 0,
      lastPayment: '2024-12-20',
      nextFee: '2025-01-15',
      performance: 'Excellent',
      attendance: '98%',
    },
  ];

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
            <Card key={child.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-teal-600" />
                  <span>{child.name}</span>
                </CardTitle>
                <CardDescription>{child.id} - {child.class}</CardDescription>
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
                  <Button size="sm" variant="outline" className="flex-1">
                    View Report
                  </Button>
                  {child.balance > 0 && (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
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
