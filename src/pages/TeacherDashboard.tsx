import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Edit,
  Search,
  GraduationCap,
  ClipboardList,
  FileText,
  Target,
  Mail,
  Play,
  BookMarked,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Award,
  Send,
  PlusCircle,
  Eye,
  Download,
  Upload,
  Bell,
  Calculator,
  Lightbulb,
  Brain,
  Star,
  ChevronRight,
  Activity,
  PieChart,
  Settings
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';
import { getStudentAttendanceStats, getTodayAttendanceSummary, StudentAttendance, markAttendance } from '@/data/attendanceData';
import { generateReportCard } from '@/data/academicData';
import { getTodayTimetableForTeacher } from '@/data/timetableData';
import { updateStudentSubjectGrade } from '@/data/academicData';
import { sendMessageToParent, getMessagesForTeacher } from '@/data/communicationData';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonObjective, setLessonObjective] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceClass, setAttendanceClass] = useState('');
  const [attendanceSubject, setAttendanceSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const [catScore, setCatScore] = useState<{[key: string]: string}>({});
  const [examScore, setExamScore] = useState<{[key: string]: string}>({});
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState('');
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState('');
  const [parentMessage, setParentMessage] = useState('');
  const [messageStudent, setMessageStudent] = useState('');
  
  if (!user || user.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Get students in teacher's assigned classes
  const getStudentsInMyClasses = () => {
    if (!user.assignedClasses) return [];
    return studentsData.filter(student => 
      user.assignedClasses!.includes(student.class)
    );
  };

  // Get students in class teacher's class (if teacher is a class teacher)
  const getMyClassStudents = () => {
    if (!user.classTeacher) return [];
    return studentsData.filter(student => 
      student.class === user.classTeacher
    );
  };

  // Filter students for marks entry
  const getStudentsForMarks = () => {
    if (!selectedClass) return [];
    return studentsData.filter(student => student.class === selectedClass);
  };

  const myStudents = getStudentsInMyClasses();
  const myClassStudents = getMyClassStudents();
  const attendanceSummary = getTodayAttendanceSummary();
  const studentsForMarks = getStudentsForMarks();

  // Calculate statistics
  const totalStudents = myStudents.length;
  const totalClasses = user.assignedClasses?.length || 0;
  const totalSubjects = user.subjects?.length || 0;
  const classTeacherStudents = myClassStudents.length;


  // Create simplified timetable for Excel-like display
  const createTimetableData = () => {
    const periods = [
      { time: '7:30 - 8:00', period: 'Assembly', subject: 'Assembly', className: 'All Classes', room: 'Main Hall', isBreak: true },
      { time: '8:00 - 8:40', period: '1st', subject: user.subjects?.[0] || 'Mathematics', className: user.assignedClasses?.[0] || 'Form 1A', room: 'Room 1', isBreak: false },
      { time: '8:40 - 9:20', period: '2nd', subject: user.subjects?.[1] || 'Computer Studies', className: user.assignedClasses?.[1] || 'Form 2A', room: 'Computer Lab', isBreak: false },
      { time: '9:20 - 10:00', period: '3rd', subject: user.subjects?.[0] || 'Mathematics', className: user.assignedClasses?.[0] || 'Form 1A', room: 'Room 2', isBreak: false },
      { time: '10:00 - 10:20', period: 'Break', subject: 'Tea Break', className: 'All Staff', room: 'Staff Room', isBreak: true },
      { time: '10:20 - 11:00', period: '4th', subject: user.subjects?.[1] || 'Computer Studies', className: user.assignedClasses?.[1] || 'Form 2A', room: 'Computer Lab', isBreak: false },
      { time: '11:00 - 11:40', period: '5th', subject: 'Free Period', className: '', room: 'Staff Room', isBreak: false },
      { time: '11:40 - 12:20', period: '6th', subject: user.subjects?.[0] || 'Mathematics', className: user.assignedClasses?.[0] || 'Form 1A', room: 'Room 1', isBreak: false },
      { time: '12:20 - 1:00', period: 'Lunch', subject: 'Lunch Break', className: 'All Staff', room: 'Cafeteria', isBreak: true },
      { time: '1:00 - 1:40', period: '7th', subject: user.subjects?.[1] || 'Computer Studies', className: user.assignedClasses?.[1] || 'Form 2A', room: 'Computer Lab', isBreak: false },
      { time: '1:40 - 2:20', period: '8th', subject: user.subjects?.[0] || 'Mathematics', className: user.assignedClasses?.[0] || 'Form 1A', room: 'Room 2', isBreak: false },
      { time: '2:20 - 3:00', period: '9th', subject: 'Free Period', className: '', room: 'Staff Room', isBreak: false },
    ];
    return periods;
  };
  
  const todayTimetable = createTimetableData();

  const handleMarkAttendance = (className: string) => {
    setSelectedClassForAttendance(className);
    setShowAttendanceDialog(true);
    // Initialize attendance data for the class
    const classStudents = studentsData.filter(s => s.class === className);
    const initialAttendance: {[key: string]: 'present' | 'absent' | 'late'} = {};
    classStudents.forEach(student => {
      initialAttendance[student.admissionNumber] = 'present'; // Default to present
    });
    setAttendanceData(initialAttendance);
  };

  const handleSaveAttendance = () => {
    const classStudents = studentsData.filter(s => s.class === selectedClassForAttendance);
    const updatedAttendance: StudentAttendance[] = classStudents.map(student => ({
      admissionNumber: student.admissionNumber,
      studentName: student.name,
      status: attendanceData[student.admissionNumber] || 'absent',
    }));

    // Mark the attendance and notify parents
    markAttendance(attendanceDate, selectedClassForAttendance, updatedAttendance, [], user.employeeId);

    updatedAttendance.forEach(att => {
      if (att.status === 'absent') {
        sendMessageToParent(
          user.employeeId, user.name, att.admissionNumber,
          'Attendance Alert',
          `${att.studentName} was marked absent today in ${selectedClassForAttendance}. Please contact the school if there are any concerns.`,
          'high'
        );
      }
    });

    toast({
      title: "✅ Attendance Marked Successfully",
      description: `${selectedClassForAttendance}: ${updatedAttendance.filter(att => att.status === 'present').length}/${classStudents.length} students present`,
    });

    setShowAttendanceDialog(false);
  };
  
  const handleRegister = (period: string, className: string) => {
    if (!className) {
      toast({
        title: "ℹ️ Free Period",
        description: "No class scheduled for this period",
      });
      return;
    }
    
    toast({
      title: "📋 Opening Class Register",
      description: `Marking attendance for ${className} - ${period} period`,
    });
  };
  
  const handleLessonPlan = (subject: string, className: string) => {
    if (!className) {
      toast({
        title: "ℹ️ Free Period",
        description: "No lesson plan needed for free period",
      });
      return;
    }
    
    toast({
      title: "📖 Opening Lesson Plan",
      description: `${subject} lesson plan for ${className}`,
    });
  };

  const handleViewStudent = (student: any) => {
    toast({
      title: "Student Profile",
      description: `Viewing academic profile for ${student.name}`,
    });
  };

  const handleEnterMarks = (student: any, subject: string) => {
    // Example scores
    const catScore = 24; // Example CAT score
    const examScore = 68; // Example Exam score

    const updatedReport = updateStudentSubjectGrade(student.admissionNumber, subject, catScore, examScore);

    if (updatedReport) {
      toast({
        title: "Marks Entered",
        description: `${student.name}'s marks for ${subject} have been entered successfully.`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to enter marks for ${student.name}.`,
        variant: "destructive",
      });
    }
  };

  const handleGenerateReports = () => {
    toast({
      title: "Academic Reports",
      description: "Generating class performance reports...",
    });
  };

  const quickStats = [
    { 
      title: 'My Students', 
      value: totalStudents.toString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Subjects Teaching', 
      value: totalSubjects.toString(), 
      icon: BookOpen, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Classes Assigned', 
      value: totalClasses.toString(), 
      icon: GraduationCap, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      title: 'Class Teacher', 
      value: user.classTeacher ? classTeacherStudents.toString() : 'No', 
      icon: Target, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50' 
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user.name}! Here's your teaching overview.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat) => (
            <Card key={stat.title}>
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

        {/* Teacher Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-teal-600" />
              <span>My Teaching Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>Employee ID: {user.employeeId}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Subjects Teaching</h4>
                <div className="flex flex-wrap gap-2">
                  {user.subjects?.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Classes Assigned</h4>
                <div className="flex flex-wrap gap-2">
                  {user.assignedClasses?.map((className) => (
                    <Badge key={className} variant="outline">
                      {className}
                    </Badge>
                  ))}
                </div>
                {user.classTeacher && (
                  <div className="mt-2">
                    <Badge variant="default" className="bg-teal-600">
                      Class Teacher: {user.classTeacher}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="timetable" className="space-y-6">
          <TabsList className={`grid ${user.classTeacher ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'} w-full`}>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            {user.classTeacher && <TabsTrigger value="attendance">Attendance</TabsTrigger>}
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="communication">Exams/Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <span>Today's Teaching Schedule</span>
                </CardTitle>
                <CardDescription>Your lessons for {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Excel-like Timetable Table */}
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900 border-r">Time</TableHead>
                        <TableHead className="font-semibold text-gray-900 border-r">Period</TableHead>
                        <TableHead className="font-semibold text-gray-900 border-r">Subject</TableHead>
                        <TableHead className="font-semibold text-gray-900 border-r">Class</TableHead>
                        <TableHead className="font-semibold text-gray-900 border-r">Room</TableHead>
                        <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayTimetable.map((period, index) => (
                        <TableRow 
                          key={index} 
                          className={`${
                            period.isBreak 
                              ? 'bg-yellow-50 hover:bg-yellow-100' 
                              : period.subject === 'Free Period'
                              ? 'bg-gray-50 hover:bg-gray-100'
                              : 'bg-blue-50 hover:bg-blue-100'
                          } border-b transition-colors`}
                        >
                          <TableCell className="font-medium border-r text-gray-700">
                            {period.time}
                          </TableCell>
                          <TableCell className="border-r text-center">
                            <Badge 
                              variant={period.isBreak ? 'secondary' : 'default'}
                              className={period.isBreak ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}
                            >
                              {period.period}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium border-r">
                            {period.subject}
                          </TableCell>
                          <TableCell className="border-r text-center">
                            {period.className || '-'}
                          </TableCell>
                          <TableCell className="border-r text-gray-600">
                            {period.room}
                          </TableCell>
                          <TableCell>
                            {!period.isBreak ? (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleRegister(period.period, period.className)}
                                >
                                  <ClipboardList className="h-3 w-3 mr-1" />
                                  Register
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleLessonPlan(period.subject, period.className)}
                                >
                                  <BookMarked className="h-3 w-3 mr-1" />
                                  Lesson
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {period.subject === 'Assembly' ? '🏫' : period.subject === 'Tea Break' ? '☕' : '🍽️'}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Quick Stats Below Table */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {todayTimetable.filter(p => !p.isBreak && p.subject !== 'Free Period').length}
                    </div>
                    <div className="text-sm text-blue-700">Teaching Periods</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todayTimetable.filter(p => p.subject === 'Free Period').length}
                    </div>
                    <div className="text-sm text-green-700">Free Periods</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(todayTimetable.filter(p => p.className).map(p => p.className)).size}
                    </div>
                    <div className="text-sm text-purple-700">Classes Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.assignedClasses?.map((className) => {
                const classStudents = studentsData.filter(s => s.class === className);
                const presentToday = classStudents.length; // In real app, calculate from attendance
                
                return (
                  <Card key={className}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{className}</span>
                        {user.classTeacher === className && (
                          <Badge variant="default" className="bg-teal-600">Class Teacher</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{classStudents.length} students enrolled</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Present Today</span>
                        <span className="font-medium">{presentToday}/{classStudents.length}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {user.classTeacher === className && (
                          <Button 
                            onClick={() => handleMarkAttendance(className)}
                            className="w-full"
                            size="sm"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Mark Attendance
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          size="sm"
                          onClick={() => toast({
                            title: "Class Details",
                            description: `Viewing detailed information for ${className}`,
                          })}
                        >
                          View Class Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>


          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Today's Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Students Present</span>
                    <span className="font-bold text-green-600">
                      {attendanceSummary.students.present}/{attendanceSummary.students.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Students Absent</span>
                    <span className="font-bold text-red-600">
                      {attendanceSummary.students.absent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="font-bold text-blue-600">
                      {attendanceSummary.students.percentage}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => toast({
                      title: "📊 Attendance Report",
                      description: "Generating attendance report for all classes",
                    })}
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Attendance Report
                  </Button>
                  <Button 
                    onClick={() => toast({
                      title: "📈 Attendance Analysis",
                      description: "Analyzing attendance patterns",
                    })}
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Attendance Trends
                  </Button>
                  <Button 
                    onClick={() => toast({
                      title: "🔔 Send Notifications",
                      description: "Sending absence notifications to parents",
                    })}
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Parents of Absences
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Attendance Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">3 students absent today</p>
                    <p className="text-xs text-red-600">Form 2A, Form 3A</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">2 students consistently late</p>
                    <p className="text-xs text-yellow-600">Requires intervention</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lesson Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span>Lesson Planning</span>
                  </CardTitle>
                  <CardDescription>Create and manage lesson plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lessonTitle">Lesson Title</Label>
                    <Input
                      id="lessonTitle"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="Enter lesson title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lessonObjective">Learning Objective</Label>
                    <Input
                      id="lessonObjective"
                      value={lessonObjective}
                      onChange={(e) => setLessonObjective(e.target.value)}
                      placeholder="What will students learn?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.subjects?.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.assignedClasses?.map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => {
                    toast({
                      title: "Lesson Plan Created",
                      description: `Lesson plan for "${lessonTitle}" has been saved`,
                    });
                    setLessonTitle('');
                    setLessonObjective('');
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Lesson Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span>Recent Lessons</span>
                  </CardTitle>
                  <CardDescription>Your recent lesson plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Quadratic Equations", subject: "Mathematics", class: "Form 3A", date: "Today" },
                    { title: "Database Design", subject: "Computer Studies", class: "Form 2A", date: "Yesterday" },
                    { title: "Algebraic Expressions", subject: "Mathematics", class: "Form 1A", date: "2 days ago" },
                    { title: "HTML Basics", subject: "Computer Studies", class: "Form 1B", date: "3 days ago" },
                  ].map((lesson, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <span className="text-xs text-gray-500">{lesson.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge variant="secondary" className="text-xs">{lesson.subject}</Badge>
                        <span>•</span>
                        <span>{lesson.class}</span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Message to Parent */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-green-600" />
                    <span>Send Message to Parent</span>
                  </CardTitle>
                  <CardDescription>Communicate with parents about their child's progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="messageStudent">Select Student</Label>
                    <Select value={messageStudent} onValueChange={setMessageStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose student" />
                      </SelectTrigger>
                      <SelectContent>
                        {myStudents.slice(0, 10).map((student) => (
                          <SelectItem key={student.id} value={student.admissionNumber}>
                            {student.name} - {student.class} ({student.guardian})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="parentMessage">Message</Label>
                    <textarea
                      id="parentMessage"
                      value={parentMessage}
                      onChange={(e) => setParentMessage(e.target.value)}
                      placeholder="Type your message to the parent here..."
                      className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <Button className="w-full" onClick={() => {
                    if (messageStudent && parentMessage) {
                      const student = myStudents.find(s => s.admissionNumber === messageStudent);
                      toast({
                        title: "Message Sent Successfully",
                        description: `Message sent to ${student?.guardian} about ${student?.name}`,
                      });
                      setParentMessage('');
                      setMessageStudent('');
                    } else {
                      toast({
                        title: "Missing Information",
                        description: "Please select a student and enter a message",
                        variant: "destructive",
                      });
                    }
                  }}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Exam Marks Entry */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span>Enter Exam Marks</span>
                  </CardTitle>
                  <CardDescription>Enter marks to be sent to Exams Office</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="marksClass" className="text-sm font-medium">Class</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.assignedClasses?.map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marksSubject" className="text-sm font-medium">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {user.subjects?.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedClass && selectedSubject && (
                    <div className="space-y-3">
                      {/* Compact Table with scrollable container */}
                      <div className="border rounded-lg overflow-x-auto overflow-y-auto max-h-[80vh]">
                        <Table>
                          <TableHeader className="sticky top-0 bg-gray-50">
                            <TableRow className="text-xs">
                              <TableHead className="py-2 px-3 w-32">Student</TableHead>
                              <TableHead className="py-2 px-3 w-24">Admission</TableHead>
                              <TableHead className="py-2 px-3 w-20 text-center">CAT (30)</TableHead>
                              <TableHead className="py-2 px-3 w-20 text-center">Exam (100)</TableHead>
                              <TableHead className="py-2 px-3 w-20 text-center">Total</TableHead>
                              <TableHead className="py-2 px-3 w-20 text-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentsForMarks.map(student => {
                              const catValue = catScore[student.admissionNumber] || '';
                              const examValue = examScore[student.admissionNumber] || '';
                              
                              // Only calculate total if both values exist and are valid numbers
                              const hasCatScore = catValue !== '' && !isNaN(Number(catValue));
                              const hasExamScore = examValue !== '' && !isNaN(Number(examValue));
                              const hasCompleteMarks = hasCatScore && hasExamScore;
                              
                              let total;
                              if (hasCompleteMarks) {
                                total = `${(parseInt(catValue) || 0) + (parseInt(examValue) || 0)}/100`;
                              } else if (hasCatScore || hasExamScore) {
                                // Show partial progress if at least one score is entered
                                const catNum = hasCatScore ? parseInt(catValue) : 0;
                                const examNum = hasExamScore ? parseInt(examValue) : 0;
                                total = `${catNum + examNum}/100 (Partial)`;
                              } else {
                                total = 'Not Started';
                              }
                              
                              return (
                                <TableRow key={student.admissionNumber} className="text-sm">
                                  <TableCell className="py-2 px-3 font-medium">{student.name}</TableCell>
                                  <TableCell className="py-2 px-3 text-xs">{student.admissionNumber}</TableCell>
                                  <TableCell className="py-2 px-3">
                                    <div className="space-y-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={catValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          // Only allow values between 0 and 30
                                          if (value === '' || (Number(value) >= 0 && Number(value) <= 30)) {
                                            console.log('CAT Score changed:', value);
                                            setCatScore({
                                              ...catScore,
                                              [student.admissionNumber]: value
                                            });
                                          }
                                        }}
                                        placeholder="CAT"
                                        className="w-16 h-8 px-2 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                      />
                                      <div className="text-xs text-gray-500 text-center">
                                        {catValue ? `CAT: ${catValue}` : 'Enter CAT'}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2 px-3">
                                    <div className="space-y-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={examValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          // Only allow values between 0 and 100
                                          if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                                            console.log('Exam Score changed:', value);
                                            setExamScore({
                                              ...examScore,
                                              [student.admissionNumber]: value
                                            });
                                          }
                                        }}
                                        placeholder="Exam"
                                        className="w-16 h-8 px-2 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                      />
                                      <div className="text-xs text-gray-500 text-center">
                                        {examValue ? `Exam: ${examValue}` : 'Enter Exam'}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2 px-3 text-center">
                                    <span className={`text-sm font-medium ${hasCompleteMarks ? 'text-green-600' : 'text-gray-500'}`}>
                                      {total}
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-2 px-3 text-center">
                                    {hasCompleteMarks ? (
                                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">Ready</Badge>
                                    ) : hasCatScore || hasExamScore ? (
                                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Partial</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs px-2 py-1">Not Started</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Compact Summary and Submit Button */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Class:</span> {selectedClass} • 
                            <span className="font-medium">Subject:</span> {selectedSubject}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Total:</span> {studentsForMarks.length} • 
                            <span className="font-medium">Ready:</span> {studentsForMarks.filter(student => 
                              catScore[student.admissionNumber] && examScore[student.admissionNumber]
                            ).length}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 h-9"
                          onClick={() => {
                            const studentsWithMarks = studentsForMarks.filter(student => 
                              catScore[student.admissionNumber] && examScore[student.admissionNumber]
                            );
                            
                            if (studentsWithMarks.length === 0) {
                              toast({
                                title: "No Marks to Submit",
                                description: "Please enter CAT and Exam scores for at least one student.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Submit marks for all students with complete data
                            let successCount = 0;
                            studentsWithMarks.forEach(student => {
                              const success = updateStudentSubjectGrade(
                                student.admissionNumber, 
                                selectedSubject, 
                                catScore[student.admissionNumber], 
                                examScore[student.admissionNumber]
                              );
                              if (success) successCount++;
                            });
                            
                            // Clear the entered marks after successful submission
                            setCatScore({});
                            setExamScore({});
                            
                            toast({
                              title: "📊 Marks Submitted to Exams Office",
                              description: `Successfully submitted marks for ${successCount} students in ${selectedSubject} (${selectedClass}).`,
                            });
                          }}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Submit All Marks to Exams Office
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
        
        {/* Attendance Dialog */}
        <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mark Attendance - {selectedClassForAttendance}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="attendanceDate">Date:</Label>
                <Input
                  id="attendanceDate"
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-48"
                />
              </div>
              
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Admission Number</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsData.filter(s => s.class === selectedClassForAttendance).map(student => (
                      <TableRow key={student.admissionNumber}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.admissionNumber}</TableCell>
                        <TableCell>
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNumber}`}
                            value="present"
                            checked={attendanceData[student.admissionNumber] === 'present'}
                            onChange={() => setAttendanceData({
                              ...attendanceData,
                              [student.admissionNumber]: 'present'
                            })}
                            className="h-4 w-4 text-green-600"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNumber}`}
                            value="absent"
                            checked={attendanceData[student.admissionNumber] === 'absent'}
                            onChange={() => setAttendanceData({
                              ...attendanceData,
                              [student.admissionNumber]: 'absent'
                            })}
                            className="h-4 w-4 text-red-600"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="radio"
                            name={`attendance-${student.admissionNumber}`}
                            value="late"
                            checked={attendanceData[student.admissionNumber] === 'late'}
                            onChange={() => setAttendanceData({
                              ...attendanceData,
                              [student.admissionNumber]: 'late'
                            })}
                            className="h-4 w-4 text-yellow-600"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600">
                  Total Students: {studentsData.filter(s => s.class === selectedClassForAttendance).length}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAttendance} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Attendance & Notify Parents
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
