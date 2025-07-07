
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';

const Students = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    class: '',
    guardianName: '',
    guardianPhone: '',
    feeBalance: ''
  });
  const { toast } = useToast();

  const students = studentsData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Adding student:', formData);
    
    toast({
      title: "Student Added Successfully",
      description: `${formData.name} has been registered with admission number ${formData.admissionNumber}`,
    });
    
    setOpen(false);
    setFormData({
      name: '',
      admissionNumber: '',
      class: '',
      guardianName: '',
      guardianPhone: '',
      feeBalance: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (studentName: string) => {
    toast({
      title: "Student Details",
      description: `Opening detailed profile for ${studentName}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-2 text-gray-600">Manage student records and fee information</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Users className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter student name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionNumber">Admission Number</Label>
                    <Input
                      id="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                      placeholder="e.g., NA2024001"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select onValueChange={(value) => handleInputChange('class', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="form1a">Form 1A</SelectItem>
                      <SelectItem value="form1b">Form 1B</SelectItem>
                      <SelectItem value="form2a">Form 2A</SelectItem>
                      <SelectItem value="form2b">Form 2B</SelectItem>
                      <SelectItem value="form3a">Form 3A</SelectItem>
                      <SelectItem value="form3b">Form 3B</SelectItem>
                      <SelectItem value="form4a">Form 4A</SelectItem>
                      <SelectItem value="form4b">Form 4B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      placeholder="Enter guardian name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                      placeholder="+254712345678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="feeBalance">Initial Fee Balance (KES)</Label>
                  <Input
                    id="feeBalance"
                    type="number"
                    value={formData.feeBalance}
                    onChange={(e) => handleInputChange('feeBalance', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    Add Student
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Students Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Students</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guardian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.admissionNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        student.balance === 'KES 0' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.balance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{student.guardian}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-teal-600 hover:text-teal-700"
                        onClick={() => handleViewDetails(student.name)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Students;
