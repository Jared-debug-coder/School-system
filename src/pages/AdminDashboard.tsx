
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, BookOpen, TrendingUp, AlertTriangle, UserCheck, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuickActions from '@/components/QuickActions';
import { studentsData } from '@/data/studentsData';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate real statistics from students data
  const totalStudents = studentsData.length;
  const studentsWithBalance = studentsData.filter(student => 
    parseFloat(student.balance.replace('KES ', '').replace(',', '')) > 0
  ).length;
  const totalOutstanding = studentsData.reduce((sum, student) => {
    return sum + parseFloat(student.balance.replace('KES ', '').replace(',', ''));
  }, 0);
  
  const handleViewDetails = (section: string) => {
    switch (section) {
      case 'Student Management':
        navigate('/students');
        break;
      case 'Financial Overview':
        navigate('/finance');
        break;
      case 'Academic Management':
        navigate('/reports');
        break;
      case 'System Alerts':
        toast({
          title: "System Alerts",
          description: "Viewing system alerts...",
        });
        break;
      case 'Activity Log':
        toast({
          title: "Activity Log",
          description: "Detailed activity log feature coming soon...",
        });
        break;
      default:
        toast({
          title: "Opening Details",
          description: `Viewing ${section} details...`,
        });
    }
  };


  const overviewStats = [
    { title: 'Total Students', value: '2,847', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Revenue', value: 'KES 45.2M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Active Teachers', value: '156', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Departments', value: '12', icon: Building, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentActivities = [
    { time: '2 minutes ago', action: 'New student enrollment', user: 'Mary Wanjiku', status: 'success' },
    { time: '15 minutes ago', action: 'Fee payment received', user: 'Peter Kamau', amount: 'KES 25,000', status: 'success' },
    { time: '1 hour ago', action: 'Report card generated', user: 'Form 4A - 35 students', status: 'info' },
    { time: '2 hours ago', action: 'Transport route updated', user: 'Route 7 - Kiambu', status: 'warning' },
  ];

  const alerts = [
    { type: 'urgent', message: '127 students have overdue fees', count: 127 },
    { type: 'warning', message: 'Report cards pending approval', count: 23 },
    { type: 'info', message: 'New parent registrations', count: 8 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Complete school management overview and system administration
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat) => (
            <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.type === 'urgent' ? 'bg-red-500' : 
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{alert.message}</span>
                  </div>
                  <Badge variant={alert.type === 'urgent' ? 'destructive' : 'secondary'}>
                    {alert.count}
                  </Badge>
                </div>
              ))}
              <Button size="sm" className="w-full" onClick={() => handleViewDetails('System Alerts')}>
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    {activity.amount && (
                      <p className="text-xs font-medium text-green-600">{activity.amount}</p>
                    )}
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewDetails('Activity Log')}>
                View Full Log
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails('Student Management')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Student Management</span>
              </CardTitle>
              <CardDescription>Enrollment, profiles, and class assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Enrollments (This Week)</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Approvals</span>
                  <span className="font-medium text-orange-600">7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails('Financial Overview')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Financial Overview</span>
              </CardTitle>
              <CardDescription>Revenue, expenses, and outstanding balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Collections</span>
                  <span className="font-medium text-green-600">KES 847,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Outstanding Fees</span>
                  <span className="font-medium text-red-600">KES 2.1M</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails('Academic Management')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Academic Management</span>
              </CardTitle>
              <CardDescription>Curriculum, assessments, and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pending Report Cards</span>
                  <span className="font-medium text-orange-600">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Assessments</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
