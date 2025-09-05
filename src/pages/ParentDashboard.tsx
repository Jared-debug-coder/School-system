
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, CreditCard, Calendar, FileText, Phone, Mail, ExternalLink, Download, Bell, MessageSquare, TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle, Award, Activity, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';
import { generateReportCard, academicData } from '@/data/academicData';
import { generateReportCardPDF } from '@/components/ReportCardPDF';
import { getMessagesForParent, getStudentNotifications, sendMessageToParent } from '@/data/communicationData';

const ParentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const handlePayFees = (child: any) => {
    // Redirect to M-Pesa payment or show payment options
    toast({
      title: "Payment Options",
      description: `Redirecting to payment gateway for ${child.name}. Amount: KES ${child.balance.toLocaleString()}`,
    });
    
    // Simulate opening payment gateway
    setTimeout(() => {
      window.open(`https://payments.drumvale-secondary.ac.ke/pay?student=${child.id}&amount=${child.balance}`, '_blank');
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

  // Load notifications and messages
  useEffect(() => {
    if (user?.children) {
      // Get all notifications for user's children
      const allNotifications = user.children.flatMap(admissionNumber => 
        getStudentNotifications(admissionNumber)
      );
      setNotifications(allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));

      // Get messages for this parent
      const parentMessages = getMessagesForParent(user.id);
      setMessages(parentMessages);
      setUnreadCount(parentMessages.filter(msg => !msg.read).length);
    }
  }, [user]);

  // Get historical performance for a child
  const getChildPerformanceHistory = (admissionNumber: string) => {
    const student = studentsData.find(s => s.admissionNumber === admissionNumber);
    if (!student) return [];
    
    const academicRecord = academicData.find(record => record.studentId === student.id);
    if (!academicRecord) return [];
    
    return Object.entries(academicRecord.subjects).map(([subject, data]) => ({
      subject,
      catScore: data.catScore,
      examScore: data.examScore,
      totalMarks: data.marks,
      grade: data.grade,
      term: 'Term 1 2024'
    }));
  };

  // Get attendance summary for a child
  const getChildAttendanceSummary = (admissionNumber: string) => {
    // In a real system, this would fetch actual attendance data
    return {
      totalDays: 63,
      present: 58,
      absent: 3,
      late: 2,
      percentage: 92,
      recentAbsences: [
        { date: '2024-01-15', reason: 'Sick' },
        { date: '2024-01-18', reason: 'Family emergency' },
        { date: '2024-01-22', reason: 'Medical appointment' }
      ]
    };
  };

  // Get activities for a child
  const getChildActivities = (admissionNumber: string) => {
    // In a real system, this would fetch actual activities data
    return [
      { activity: 'Science Club', role: 'Member', status: 'Active', achievements: ['Best Project Award'] },
      { activity: 'Football Team', role: 'Player', status: 'Active', achievements: ['Tournament Winner'] },
      { activity: 'Drama Club', role: 'Lead Actor', status: 'Active', achievements: ['Best Performance'] }
    ];
  };

  const handleSendFeedback = () => {
    if (!selectedChild || !feedbackMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a child and enter your feedback.",
        variant: "destructive"
      });
      return;
    }

    const childData = children.find(c => c.admissionNumber === selectedChild);
    if (childData) {
      // Send message to class teacher
      sendMessageToParent(
        user?.id || 'PARENT001',
        user?.name || 'Parent',
        selectedChild,
        `Parent Feedback - ${childData.name}`,
        feedbackMessage,
        'medium'
      );
      
      toast({
        title: "Feedback Sent",
        description: `Your feedback about ${childData.name} has been sent to the class teacher.`,
      });
      
      setFeedbackMessage('');
      setSelectedChild('');
    }
  };

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

        {/* Enhanced Dashboard with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="communication">Messages</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </TabsContent>

          {/* Notifications Tab - Real notifications from examination office and teachers */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-red-600' : 'text-blue-600'}`} />
                  <span>Real-time Notifications</span>
                </CardTitle>
                <CardDescription>Notifications from Examination Office and Class Teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            {notification.type === 'academic' && <Award className="h-4 w-4 text-blue-600" />}
                            {notification.type === 'attendance' && <Clock className="h-4 w-4 text-orange-600" />}
                            {notification.type === 'disciplinary' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            <Badge variant="outline">
                              {notification.type === 'academic' ? 'Exam Results' : 
                               notification.type === 'attendance' ? 'Attendance' : 
                               notification.type === 'disciplinary' ? 'Discipline' : 'General'}
                            </Badge>
                          </div>
                          <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'default'}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>From: {notification.createdBy}</span>
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Attendance Tab - Daily attendance tracking */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Attendance Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {children.map((child) => {
                    const attendanceData = getChildAttendanceSummary(child.admissionNumber);
                    return (
                      <div key={child.admissionNumber} className="border rounded-lg p-4">
                        <h4 className="font-medium text-lg mb-4">{child.name} - {child.class}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{attendanceData.present}</div>
                            <div className="text-sm text-green-700">Present</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{attendanceData.absent}</div>
                            <div className="text-sm text-red-700">Absent</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{attendanceData.late}</div>
                            <div className="text-sm text-yellow-700">Late</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{attendanceData.percentage}%</div>
                            <div className="text-sm text-blue-700">Rate</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium">Recent Absences:</h5>
                          {attendanceData.recentAbsences.map((absence, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">{absence.date}</span>
                              <span className="text-sm text-gray-600">{absence.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab - Messages with teachers */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span>Communication Log</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((message, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{message.subject}</h5>
                            <Badge variant={message.read ? 'secondary' : 'default'}>
                              {message.read ? 'Read' : 'Unread'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{message.message}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>From: {message.senderName}</span>
                            <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Send Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-green-600" />
                    <span>Send Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Child:</label>
                    <select 
                      value={selectedChild} 
                      onChange={(e) => setSelectedChild(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Choose a child...</option>
                      {children.map((child) => (
                        <option key={child.admissionNumber} value={child.admissionNumber}>
                          {child.name} - {child.class}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Your Message:</label>
                    <Textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Enter your feedback or query..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSendFeedback} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab - Extracurricular participation */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Extracurricular Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {children.map((child) => {
                    const activities = getChildActivities(child.admissionNumber);
                    return (
                      <div key={child.admissionNumber} className="border rounded-lg p-4">
                        <h4 className="font-medium text-lg mb-4">{child.name} - {child.class}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activities.map((activity, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <h5 className="font-medium">{activity.activity}</h5>
                                <Badge variant={activity.status === 'Active' ? 'default' : 'secondary'}>
                                  {activity.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">Role: {activity.role}</p>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Achievements:</p>
                                {activity.achievements.map((achievement, i) => (
                                  <div key={i} className="flex items-center space-x-2">
                                    <Award className="h-3 w-3 text-yellow-500" />
                                    <span className="text-sm">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                  <div className="text-sm text-gray-600">info@drumvale-secondary.ac.ke</div>
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
