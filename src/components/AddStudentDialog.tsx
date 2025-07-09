
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { studentsData } from '@/data/studentsData';

const AddStudentDialog = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate adding student
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto p-4 justify-start text-left hover:bg-gray-50" variant="outline">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Add New Student</div>
              <div className="text-sm text-gray-500 mt-1">Register a new student and set up their fee structure</div>
            </div>
          </div>
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
  );
};

export default AddStudentDialog;
