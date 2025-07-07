
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GenerateInvoicesDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    term: '',
    feeTypes: [] as string[],
    dueDate: ''
  });
  const { toast } = useToast();

  const feeTypes = [
    { id: 'tuition', label: 'Tuition Fees', amount: 25000 },
    { id: 'transport', label: 'Transport', amount: 8000 },
    { id: 'lunch', label: 'Lunch Program', amount: 12000 },
    { id: 'uniform', label: 'Uniform', amount: 5000 },
    { id: 'books', label: 'Books & Stationery', amount: 7500 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Generating invoices:', formData);
    
    toast({
      title: "Invoices Generated Successfully",
      description: `Bulk invoices created for ${formData.class} - ${formData.term}. SMS notifications sent to parents.`,
    });
    
    setOpen(false);
    setFormData({
      class: '',
      term: '',
      feeTypes: [],
      dueDate: ''
    });
  };

  const handleFeeTypeChange = (feeType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      feeTypes: checked 
        ? [...prev.feeTypes, feeType]
        : prev.feeTypes.filter(type => type !== feeType)
    }));
  };

  const totalAmount = formData.feeTypes.reduce((sum, type) => {
    const fee = feeTypes.find(f => f.id === type);
    return sum + (fee?.amount || 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto p-4 justify-start text-left hover:bg-gray-50" variant="outline">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg text-white bg-teal-500 hover:bg-teal-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Generate Invoices</div>
              <div className="text-sm text-gray-500 mt-1">Create bulk invoices for school fees and other charges</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Bulk Invoices</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">Class</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
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
            <div>
              <Label htmlFor="term">Term</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term1">Term 1, 2025</SelectItem>
                  <SelectItem value="term2">Term 2, 2025</SelectItem>
                  <SelectItem value="term3">Term 3, 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Fee Types</Label>
            <div className="space-y-3 mt-2">
              {feeTypes.map((feeType) => (
                <div key={feeType.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={feeType.id}
                      checked={formData.feeTypes.includes(feeType.id)}
                      onCheckedChange={(checked) => handleFeeTypeChange(feeType.id, checked as boolean)}
                    />
                    <label htmlFor={feeType.id} className="text-sm font-medium">
                      {feeType.label}
                    </label>
                  </div>
                  <span className="text-sm text-gray-600">KES {feeType.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          {formData.feeTypes.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Invoice Summary</div>
              <div className="text-lg font-bold text-teal-600">
                Total: KES {totalAmount.toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Generate Invoices
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoicesDialog;
