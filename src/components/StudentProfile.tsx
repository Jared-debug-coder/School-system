
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, DollarSign, BookOpen, Calendar } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  balance: string;
  guardian: string;
  phone: string;
  status: string;
}

interface StudentProfileProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, open, onOpenChange }) => {
  if (!student) return null;

  // Generate realistic student data based on the actual student
  const generateStudentDetails = () => {
    const balance = parseFloat(student.balance.replace('KES ', '').replace(',', '')) || 0;
    const isBoarding = student.residence === 'Boarding';
    
    // Fee structure based on student type
    const baseFees = {
      tuition: isBoarding ? 45000 : 35000,
      boarding: isBoarding ? 25000 : 0,
      transport: isBoarding ? 0 : 12000,
      activity: 3000,
      uniform: 5000
    };
    
    const totalFees = Object.values(baseFees).reduce((sum, fee) => sum + fee, 0);
    const paidAmount = totalFees - balance;
    
    const feeStructure = [
      {
        item: 'Tuition Fee',
        amount: `KES ${baseFees.tuition.toLocaleString()}`,
        paid: `KES ${Math.min(baseFees.tuition, paidAmount).toLocaleString()}`,
        balance: `KES ${Math.max(0, baseFees.tuition - paidAmount).toLocaleString()}`
      },
      ...(isBoarding ? [{
        item: 'Boarding Fee',
        amount: `KES ${baseFees.boarding.toLocaleString()}`,
        paid: `KES ${Math.min(baseFees.boarding, Math.max(0, paidAmount - baseFees.tuition)).toLocaleString()}`,
        balance: `KES ${Math.max(0, baseFees.boarding - Math.max(0, paidAmount - baseFees.tuition)).toLocaleString()}`
      }] : []),
      ...(!isBoarding ? [{
        item: 'Transport Fee',
        amount: `KES ${baseFees.transport.toLocaleString()}`,
        paid: `KES ${Math.min(baseFees.transport, Math.max(0, paidAmount - baseFees.tuition)).toLocaleString()}`,
        balance: `KES ${Math.max(0, baseFees.transport - Math.max(0, paidAmount - baseFees.tuition)).toLocaleString()}`
      }] : []),
      {
        item: 'Activity Fee',
        amount: `KES ${baseFees.activity.toLocaleString()}`,
        paid: `KES ${baseFees.activity.toLocaleString()}`,
        balance: 'KES 0'
      },
      {
        item: 'Uniform & Books',
        amount: `KES ${baseFees.uniform.toLocaleString()}`,
        paid: `KES ${baseFees.uniform.toLocaleString()}`,
        balance: 'KES 0'
      }
    ];
    
    // Generate subjects based on form level
    const getSubjectsByForm = (className: string) => {
      const form = className.split(' ')[0];
      const baseSubjects = ['Mathematics', 'English', 'Kiswahili'];
      
      switch (form) {
        case 'Form':
          if (className.includes('1') || className.includes('2')) {
            return [...baseSubjects, 'Biology', 'Chemistry', 'Physics', 'History & Government', 'Geography', 'CRE', 'Computer Studies', 'Business Studies'];
          } else {
            return [...baseSubjects, 'Biology', 'Chemistry', 'Physics', 'History & Government', 'Geography', 'CRE'];
          }
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
      feeStructure,
      residence: student.residence || 'Day Scholar'
    };
  };
  
  const studentDetails = generateStudentDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-teal-600" />
            <span>Student Profile - {student.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Admission Number:</span>
                  <span className="text-sm font-medium">{student.admissionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Class:</span>
                  <span className="text-sm font-medium">{student.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date of Birth:</span>
                  <span className="text-sm font-medium">{studentDetails.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender:</span>
                  <span className="text-sm font-medium">{studentDetails.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Admission Date:</span>
                  <span className="text-sm font-medium">{studentDetails.admissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default">{student.status}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{student.guardian}</p>
                    <p className="text-xs text-gray-500">Primary Guardian</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{student.phone}</p>
                    <p className="text-xs text-gray-500">Guardian Phone</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{studentDetails.emergencyContact}</p>
                    <p className="text-xs text-gray-500">Emergency Contact</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{studentDetails.address}</p>
                    <p className="text-xs text-gray-500">Home Address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Academic Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Grade</p>
                <p className="text-2xl font-bold text-blue-600">{studentDetails.currentGrade}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">{studentDetails.attendance}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-purple-600">{studentDetails.subjects.length}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Enrolled Subjects:</p>
              <div className="flex flex-wrap gap-2">
                {studentDetails.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Fee Information</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fee Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentDetails.feeStructure.map((fee, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{fee.item}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{fee.amount}</td>
                      <td className="px-4 py-2 text-sm text-green-600">{fee.paid}</td>
                      <td className="px-4 py-2 text-sm font-medium">
                        <span className={fee.balance === 'KES 0' ? 'text-green-600' : 'text-red-600'}>
                          {fee.balance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfile;
