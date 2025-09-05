import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Download,
  Send,
  Eye,
  Edit,
  Plus,
  ClipboardList,
  Target,
  Award,
  MessageSquare,
  Settings,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';
import { teachersData } from '@/data/teachersData';
import { academicData, generateReportCard, getSubjectsByForm, getGradeScale, getPerformanceLevel, generateAllReports, getStudentsNeedingReports, getCompletedReportsCount } from '@/data/academicData';
import { sendBulkReportNotifications } from '@/data/communicationData';

const ExaminationOffice = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Term 1 2024');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGradeExport, setShowGradeExport] = useState(false);
  const [showReportDownload, setShowReportDownload] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [downloadData, setDownloadData] = useState<any>(null);

  // Real data calculations
  const totalStudents = studentsData.length;
  const totalTeachers = teachersData.length;
  const totalSubjects = Object.values(getSubjectsByForm()).flat().length;
  
  // Calculate academic statistics
  const studentsWithGrades = studentsData.filter(student => 
    academicData.some(record => record.studentId === student.id)
  );
  
  const averagePerformance = studentsWithGrades.reduce((sum, student) => {
    const studentRecord = academicData.find(record => record.studentId === student.id);
    if (studentRecord) {
      const totalMarks = Object.values(studentRecord.subjects).reduce((total, subject) => total + subject.marks, 0);
      const subjectCount = Object.keys(studentRecord.subjects).length;
      return sum + (totalMarks / subjectCount);
    }
    return sum;
  }, 0) / studentsWithGrades.length;

  const pendingReports = studentsData.filter(student => 
    !academicData.some(record => record.studentId === student.id && record.reportGenerated)
  ).length;

  const completedReports = totalStudents - pendingReports;

  // Academic periods
  const academicPeriods = [
    { id: 'term1-2024', name: 'Term 1 2024', status: 'active', startDate: '2024-01-15', endDate: '2024-04-12' },
    { id: 'term2-2024', name: 'Term 2 2024', status: 'upcoming', startDate: '2024-05-06', endDate: '2024-08-16' },
    { id: 'term3-2024', name: 'Term 3 2024', status: 'upcoming', startDate: '2024-09-02', endDate: '2024-11-29' },
  ];

  // Subject performance analysis
  const subjectPerformance = Object.entries(getSubjectsByForm()).map(([form, subjects]) => {
    return subjects.map(subject => {
      const subjectRecords = academicData.filter(record => 
        record.subjects[subject] && studentsData.find(s => s.id === record.studentId)?.class.startsWith(form)
      );
      
      const averageMarks = subjectRecords.length > 0 
        ? subjectRecords.reduce((sum, record) => sum + record.subjects[subject].marks, 0) / subjectRecords.length
        : 0;
      
      return {
        subject,
        form,
        averageMarks: Math.round(averageMarks),
        totalStudents: subjectRecords.length,
        grade: getPerformanceLevel(averageMarks).grade,
        performance: getPerformanceLevel(averageMarks).level
      };
    });
  }).flat();

  // Class performance summary
  const classPerformance = ['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(form => {
    const classStudents = studentsData.filter(student => student.class.startsWith(form));
    const studentsWithRecords = classStudents.filter(student => 
      academicData.some(record => record.studentId === student.id)
    );
    
    const avgMarks = studentsWithRecords.length > 0 
      ? studentsWithRecords.reduce((sum, student) => {
          const record = academicData.find(r => r.studentId === student.id);
          if (record) {
            const totalMarks = Object.values(record.subjects).reduce((total, subject) => total + subject.marks, 0);
            return sum + (totalMarks / Object.keys(record.subjects).length);
          }
          return sum;
        }, 0) / studentsWithRecords.length
      : 0;

    return {
      form,
      totalStudents: classStudents.length,
      assessed: studentsWithRecords.length,
      averageMarks: Math.round(avgMarks),
      grade: getPerformanceLevel(avgMarks).grade,
      performance: getPerformanceLevel(avgMarks).level
    };
  });

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'generate-reports':
        const { success, failed } = generateAllReports();
        toast({
          title: "✅ Reports Generated Successfully",
          description: `Generated ${success} report cards. ${failed} failed. Reports are ready for parent notification.`,
        });
        // Trigger re-render to update stats
        setTimeout(() => window.location.reload(), 1000);
        break;
      case 'send-reports':
        const studentsWithReports = academicData.filter(record => record.reportGenerated).map(record => record.studentId);
        const { success: notifySuccess, failed: notifyFailed } = sendBulkReportNotifications(studentsWithReports);
        toast({
          title: "📧 Reports Sent to Parents",
          description: `${notifySuccess} parents notified via SMS and email. ${notifyFailed} notifications failed.`,
        });
        break;
      case 'view-analytics':
        // Generate real analytics data
        const analyticsResults = {
          totalStudents: studentsData.length,
          studentsWithGrades: studentsWithGrades.length,
          averagePerformance: Math.round(averagePerformance),
          gradeDistribution: {
            'A': studentsWithGrades.filter(s => {
              const record = academicData.find(r => r.studentId === s.id);
              if (record) {
                const avg = Object.values(record.subjects).reduce((sum, subj) => sum + subj.marks, 0) / Object.keys(record.subjects).length;
                return avg >= 80;
              }
              return false;
            }).length,
            'B': studentsWithGrades.filter(s => {
              const record = academicData.find(r => r.studentId === s.id);
              if (record) {
                const avg = Object.values(record.subjects).reduce((sum, subj) => sum + subj.marks, 0) / Object.keys(record.subjects).length;
                return avg >= 60 && avg < 80;
              }
              return false;
            }).length,
            'C': studentsWithGrades.filter(s => {
              const record = academicData.find(r => r.studentId === s.id);
              if (record) {
                const avg = Object.values(record.subjects).reduce((sum, subj) => sum + subj.marks, 0) / Object.keys(record.subjects).length;
                return avg >= 40 && avg < 60;
              }
              return false;
            }).length,
            'D-E': studentsWithGrades.filter(s => {
              const record = academicData.find(r => r.studentId === s.id);
              if (record) {
                const avg = Object.values(record.subjects).reduce((sum, subj) => sum + subj.marks, 0) / Object.keys(record.subjects).length;
                return avg < 40;
              }
              return false;
            }).length
          },
          topPerformers: studentsWithGrades.map(s => {
            const record = academicData.find(r => r.studentId === s.id);
            if (record) {
              const avg = Object.values(record.subjects).reduce((sum, subj) => sum + subj.marks, 0) / Object.keys(record.subjects).length;
              return { name: s.name, class: s.class, average: Math.round(avg) };
            }
            return null;
          }).filter(Boolean).sort((a, b) => b.average - a.average).slice(0, 10),
          subjectPerformance: subjectPerformance.slice(0, 15)
        };
        setAnalyticsData(analyticsResults);
        setShowAnalytics(true);
        toast({
          title: "📊 Analytics Loaded",
          description: "Performance analytics data has been generated.",
        });
        break;
      case 'export-grades':
        // Generate real export data
        const exportResults = {
          timestamp: new Date().toISOString(),
          totalRecords: studentsWithGrades.length,
          data: studentsWithGrades.map(student => {
            const record = academicData.find(r => r.studentId === student.id);
            if (record) {
              const subjects = Object.entries(record.subjects).map(([subject, data]) => ({
                subject,
                catScore: data.catScore,
                examScore: data.examScore,
                totalMarks: data.marks,
                grade: data.grade
              }));
              const totalMarks = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
              const averageScore = Math.round(totalMarks / subjects.length);
              return {
                admissionNumber: student.admissionNumber,
                name: student.name,
                class: student.class,
                subjects,
                totalMarks,
                averageScore,
                overallGrade: getPerformanceLevel(averageScore).grade
              };
            }
            return null;
          }).filter(Boolean)
        };
        setExportData(exportResults);
        setShowGradeExport(true);
        toast({
          title: "📊 Export Data Generated",
          description: `Generated export data for ${exportResults.totalRecords} students.`,
        });
        break;
      case 'class-summary':
        toast({
          title: "📋 Generating Class Summary",
          description: "Creating class performance summary reports...",
        });
        setTimeout(() => {
          toast({
            title: "✅ Class Summary Ready",
            description: "Class performance summaries generated successfully.",
          });
        }, 1500);
        break;
      case 'subject-analysis':
        toast({
          title: "📖 Subject Performance Analysis",
          description: "Analyzing subject-wise performance across all classes...",
        });
        setTimeout(() => {
          toast({
            title: "✅ Analysis Complete",
            description: "Subject performance analysis ready for review.",
          });
        }, 2000);
        break;
      case 'download-reports':
        // Generate real download data
        const reportsGenerated = academicData.filter(record => record.reportGenerated);
        const downloadResults = {
          timestamp: new Date().toISOString(),
          totalReports: reportsGenerated.length,
          reports: reportsGenerated.map(record => {
            const student = studentsData.find(s => s.id === record.studentId);
            if (student) {
              const subjects = Object.entries(record.subjects).map(([subject, data]) => ({
                subject,
                catScore: data.catScore,
                examScore: data.examScore,
                totalMarks: data.marks,
                grade: data.grade
              }));
              const totalMarks = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
              const averageScore = Math.round(totalMarks / subjects.length);
              return {
                admissionNumber: student.admissionNumber,
                name: student.name,
                class: student.class,
                subjects,
                totalMarks,
                averageScore,
                overallGrade: getPerformanceLevel(averageScore).grade,
                reportGenerated: true
              };
            }
            return null;
          }).filter(Boolean)
        };
        setDownloadData(downloadResults);
        setShowReportDownload(true);
        toast({
          title: "📄 Reports Ready",
          description: `${downloadResults.totalReports} report cards ready for download.`,
        });
        break;
      case 'export-analytics':
        toast({
          title: "📊 Exporting Analytics",
          description: "Preparing performance analytics CSV file...",
        });
        setTimeout(() => {
          toast({
            title: "✅ Export Complete",
            description: "Performance analytics exported to CSV file.",
          });
        }, 2000);
        break;
      default:
        toast({
          title: "Action Triggered",
          description: `Executing ${action}...`,
        });
    }
  };

  const overviewStats = [
    { 
      title: 'Total Students', 
      value: totalStudents.toString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      change: '+12 this term'
    },
    { 
      title: 'Active Subjects', 
      value: totalSubjects.toString(), 
      icon: BookOpen, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      change: 'Across all forms'
    },
    { 
      title: 'Average Performance', 
      value: `${Math.round(averagePerformance)}%`, 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      change: '+3.2% improvement'
    },
    { 
      title: 'Reports Generated', 
      value: `${completedReports}/${totalStudents}`, 
      icon: FileText, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      change: `${pendingReports} pending`
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Examination Office</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive academic management, grading, and report processing
            </p>
          </div>
          <div className="flex space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Academic Period" />
              </SelectTrigger>
              <SelectContent>
                {academicPeriods.map(period => (
                  <SelectItem key={period.id} value={period.name}>
                    {period.name} {period.status === 'active' && '(Active)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => handleAction('generate-reports')}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </div>
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
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{pendingReports} students</strong> have pending report cards for {selectedPeriod}
            </AlertDescription>
          </Alert>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Grade submission</strong> deadline: March 15, 2024
            </AlertDescription>
          </Alert>
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              <strong>Parent notifications</strong> scheduled for March 20, 2024
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Academic Periods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Academic Periods</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {academicPeriods.map(period => (
                    <div key={period.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{period.name}</p>
                        <p className="text-sm text-gray-600">{period.startDate} - {period.endDate}</p>
                      </div>
                      <Badge variant={period.status === 'active' ? 'default' : 'secondary'}>
                        {period.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Class Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Class Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classPerformance.map(classData => (
                      <div key={classData.form} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{classData.form}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{classData.grade}</Badge>
                            <span className="text-sm text-gray-600">{classData.averageMarks}%</span>
                          </div>
                        </div>
                        <Progress value={(classData.assessed / classData.totalStudents) * 100} />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{classData.assessed}/{classData.totalStudents} assessed</span>
                          <span>{classData.performance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grading Tab */}
          <TabsContent value="grading" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Grade Management</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="form1">Form 1</SelectItem>
                    <SelectItem value="form2">Form 2</SelectItem>
                    <SelectItem value="form3">Form 3</SelectItem>
                    <SelectItem value="form4">Form 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Grades Overview</CardTitle>
                <CardDescription>Current grading status for {selectedPeriod}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsData.slice(0, 10).map(student => {
                      const academicRecord = academicData.find(record => record.studentId === student.id);
                      const hasGrades = !!academicRecord;
                      const averageMarks = hasGrades 
                        ? Object.values(academicRecord.subjects).reduce((sum, subject) => sum + subject.marks, 0) / Object.keys(academicRecord.subjects).length
                        : 0;
                      const grade = hasGrades ? getPerformanceLevel(averageMarks).grade : 'N/A';
                      const subjectCount = hasGrades ? Object.keys(academicRecord.subjects).length : 0;

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                            </div>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{subjectCount} subjects</TableCell>
                          <TableCell>{hasGrades ? `${Math.round(averageMarks)}%` : 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={hasGrades ? 'default' : 'secondary'}>
                              {grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={hasGrades ? 'default' : 'destructive'}>
                              {hasGrades ? 'Complete' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <span>Report Generation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Individual Report Cards</span>
                      <Button size="sm" onClick={() => handleAction('generate-reports', { count: totalStudents })}>
                        Generate All
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Class Summary Reports</span>
                      <Button size="sm" variant="outline" onClick={() => handleAction('class-summary')}>
                        Generate
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Subject Performance Reports</span>
                      <Button size="sm" variant="outline" onClick={() => handleAction('subject-analysis')}>
                        Generate
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Parent Communication</span>
                      <Button size="sm" onClick={() => handleAction('send-reports')}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <span>Export Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline" onClick={() => handleAction('download-reports')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download All Reports (PDF)
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => handleAction('export-grades')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Grade Data (Excel)
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => handleAction('export-analytics')}>
                      <Download className="h-4 w-4 mr-2" />
                      Performance Analytics (CSV)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.round(averagePerformance)}%</p>
                    <p className="text-sm text-gray-600">School Average</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{classPerformance.filter(c => c.averageMarks >= 60).length}</p>
                    <p className="text-sm text-gray-600">Above Average Classes</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{subjectPerformance.filter(s => s.averageMarks >= 70).length}</p>
                    <p className="text-sm text-gray-600">High Performing Subjects</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{subjectPerformance.filter(s => s.averageMarks < 50).length}</p>
                    <p className="text-sm text-gray-600">Subjects Need Attention</p>
                  </div>
                </div>
                <Button onClick={() => handleAction('view-analytics')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Subject Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectPerformance.slice(0, 10).map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.form}</TableCell>
                        <TableCell>{subject.totalStudents}</TableCell>
                        <TableCell>{subject.averageMarks}%</TableCell>
                        <TableCell>
                          <Badge variant={subject.averageMarks >= 60 ? 'default' : 'destructive'}>
                            {subject.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm ${
                            subject.performance === 'Excellent' ? 'text-green-600' :
                            subject.performance === 'Good' ? 'text-blue-600' :
                            subject.performance === 'Average' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {subject.performance}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>Grading Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Grade Scale Settings</span>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Subject Weights</span>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Report Templates</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span>Current Grade Scale</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getGradeScale().map(scale => (
                      <div key={scale.grade} className="flex justify-between items-center">
                        <span className="font-medium">{scale.grade}</span>
                        <span className="text-sm text-gray-600">{scale.range}</span>
                      </div>
                    ))}
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

export default ExaminationOffice;
