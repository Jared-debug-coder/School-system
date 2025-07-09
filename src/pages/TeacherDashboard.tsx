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
  BookMarked
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';
import { getStudentAttendanceStats, getTodayAttendanceSummary } from '@/data/attendanceData';
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
    const classStudents = studentsData.filter(s => s.class === className);
    const presentCount = Math.floor(Math.random() * classStudents.length) + Math.floor(classStudents.length * 0.8);
    
    toast({
      title: "✅ Attendance Marked Successfully",
      description: `${className}: ${presentCount}/${classStudents.length} students present`,
    });
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
          <TabsList>
            <TabsTrigger value="timetable">Today's Timetable</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="students">Students & Marks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
                        <Button 
                          onClick={() => handleMarkAttendance(className)}
                          className="w-full"
                          size="sm"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Mark Attendance
                        </Button>
                        
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

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Teacher Students (if applicable) */}
              {user.classTeacher && myClassStudents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-teal-600" />
                      <span>My Class Students ({user.classTeacher})</span>
                    </CardTitle>
                    <CardDescription>Students in your class teacher responsibilities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {myClassStudents.slice(0, 5).map((student) => {
                      // Generate academic performance for display
                      const reportCard = generateReportCard(student.admissionNumber);
                      const avgScore = reportCard?.academic.averageScore || 0;
                      const grade = reportCard?.academic.overallGrade || 'N/A';
                      
                      return (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.admissionNumber} • {student.residence}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">Avg: {avgScore.toFixed(1)}% ({grade})</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewStudent(student)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {myClassStudents.length > 5 && (
                      <Button variant="outline" className="w-full" size="sm">
                        View All {myClassStudents.length} Students
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Marks Entry Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5 text-orange-600" />
                    <span>Quick Marks Entry</span>
                  </CardTitle>
                  <CardDescription>Enter marks for your subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="marksClass">Select Class</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose class" />
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
                      <Label htmlFor="marksSubject">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose subject" />
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
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Students in {selectedClass}</h4>
                      {studentsForMarks.slice(0, 3).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-white border rounded">
                          <span className="text-sm">{student.name}</span>
                          <Button 
                            size="sm" 
                            onClick={() => handleEnterMarks(student, selectedSubject)}
                          >
                            Enter Marks
                          </Button>
                        </div>
                      ))}
                      <Button className="w-full" variant="outline" size="sm">
                        View All {studentsForMarks.length} Students
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                  {user.assignedClasses?.slice(0, 3).map((className) => (
                    <Button 
                      key={className}
                      onClick={() => handleMarkAttendance(className)}
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      Mark {className} Attendance
                    </Button>
                  ))}
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
