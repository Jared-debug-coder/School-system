import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, User, Phone, Mail, MapPin, Calendar, GraduationCap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student, studentsData } from '@/data/studentsData';
import { useToast } from '@/hooks/use-toast';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const student = studentsData.find(s => s.id === parseInt(id!));
  
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Student Not Found</h2>
          <p className="text-gray-600 mt-2">The student with ID {id} could not be found.</p>
          <Button 
            onClick={() => navigate('/students')}
            className="mt-4"
          >
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const balance = parseFloat(student.balance.replace('KES ', '').replace(',', '')) || 0;
  const isBoarding = student.residence === 'Boarding';
  
  // Fee structure based on student type
  const baseFees = {
    tuition: isBoarding ? 45000 : 35000,
    boarding: isBoarding ? 25000 : 0,
    transport: isBoarding ? 0 : 12000,
    activity: 3000,
    uniform: 5000,
    exam: 2500
  };
  
  const totalTermFees = Object.values(baseFees).reduce((sum, fee) => sum + fee, 0);
  const amountPaid = totalTermFees - balance;
  const paymentPercentage = Math.round((amountPaid / totalTermFees) * 100);

  // Generate realistic academic and behavioral data based on student info
  const generateStudentDetails = () => {
    // Base subjects for all forms
    const baseSubjects = [
      { name: 'Mathematics', score: 78 + Math.floor(Math.random() * 20) },
      { name: 'English', score: 75 + Math.floor(Math.random() * 20) },
      { name: 'Kiswahili', score: 70 + Math.floor(Math.random() * 25) },
      { name: 'Chemistry', score: 72 + Math.floor(Math.random() * 23) },
      { name: 'Biology', score: 76 + Math.floor(Math.random() * 19) },
      { name: 'Physics', score: 74 + Math.floor(Math.random() * 21) },
      { name: 'History', score: 69 + Math.floor(Math.random() * 26) },
      { name: 'Geography', score: 71 + Math.floor(Math.random() * 24) }
    ];

    // Additional subjects based on form level
    const getSubjectsByForm = (studentClass: string) => {
      const form = studentClass.charAt(5); // Extract form number
      switch (form) {
        case '1':
        case '2':
          return [
            ...baseSubjects,
            { name: 'Computer Studies', score: 80 + Math.floor(Math.random() * 15) },
            { name: 'Business Studies', score: 73 + Math.floor(Math.random() * 22) }
          ];
        case '3':
        case '4':
          return [
            ...baseSubjects,
            { name: 'Computer Studies', score: 82 + Math.floor(Math.random() * 13) },
            { name: 'Business Studies', score: 75 + Math.floor(Math.random() * 20) }
          ];
        default:
          return baseSubjects;
      }
    };
    
    return {
      dateOfBirth: student.dateOfBirth || '2008-03-15',
      gender: student.gender || 'Male',
      address: `${student.guardian} Residence, Nairobi County`,
      admissionDate: '2024-01-15',
      medicalInfo: 'No known allergies - Updated annually',
      emergencyContact: student.phone.replace(/\d{3}$/, '679'),
      subjects: getSubjectsByForm(student.class),
      currentGrade: balance === 0 ? 'A-' : balance < 10000 ? 'B+' : 'B',
      attendance: balance === 0 ? '97%' : '94%',
      feeStructure: baseFees,
      residence: student.residence || 'Day Scholar'
    };
  };
  
  const studentDetails = generateStudentDetails();
  const averageScore = Math.round(studentDetails.subjects.reduce((sum, subject) => sum + subject.score, 0) / studentDetails.subjects.length);

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: `Student report for ${student.name} has been downloaded.`,
    });
  };

  const handleDownloadFeeStatement = () => {
    toast({
      title: "Fee Statement Downloaded", 
      description: `Fee statement for ${student.name} has been downloaded.`,
    });
  };

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/students')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">Student Profile - {student.admissionNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={handleDownloadFeeStatement}>
              <Download className="h-4 w-4 mr-2" />
              Fee Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <div className="space-y-2 mt-4 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{student.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission No:</span>
                      <span className="font-medium">{student.admissionNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="default">{student.status}</Badge>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm text-gray-600">Date of Birth: {studentDetails.dateOfBirth}</div>
                      <div className="text-sm text-gray-600">Gender: {studentDetails.gender}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Residence & Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-sm text-gray-600">
                      Residence: {studentDetails.residence}
                    </div>
                    <div className="text-sm text-gray-600">
                      Address: {studentDetails.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Guardian Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{student.guardian}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Performance & Fee Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">{averageScore}%</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{studentDetails.currentGrade}</div>
                      <div className="text-sm text-gray-600">Current Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{studentDetails.attendance}</div>
                      <div className="text-sm text-gray-600">Attendance</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Subject Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentDetails.subjects.slice(0, 8).map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{subject.score}%</span>
                            <Badge 
                              variant="outline" 
                              className={getGradeColor(subject.score)}
                            >
                              {getGradeLetter(subject.score)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Fee Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">KES {amountPaid.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Amount Paid</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {student.balance}
                      </div>
                      <div className="text-sm text-gray-600">Outstanding Balance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{paymentPercentage}%</div>
                      <div className="text-sm text-gray-600">Payment Progress</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Fee Breakdown (Term 1, 2024)</h4>
                    <div className="space-y-2">
                      {Object.entries(studentDetails.feeStructure).filter(([_, amount]) => amount > 0).map(([feeType, amount]) => (
                        <div key={feeType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium capitalize">{feeType.replace(/([A-Z])/g, ' $1').trim()} Fee</span>
                          <span className="font-semibold">KES {amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border-2 border-teal-200">
                        <span className="font-bold">Total Term Fees</span>
                        <span className="font-bold text-teal-600">KES {totalTermFees.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Payment Progress</span>
                      <span>{paymentPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${paymentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;