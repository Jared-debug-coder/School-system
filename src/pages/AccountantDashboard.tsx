
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, CreditCard, AlertCircle, TrendingUp, FileText, Calculator, Banknote, Receipt, Search, User, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuickActions from '@/components/QuickActions';
import { studentsData } from '@/data/studentsData';
import { generateFeeStatementPDF } from '@/components/FeeStatementPDF';
import MpesaPayment from '@/components/MpesaPayment';

const AccountantDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Calculate real statistics from students data
  const totalOutstanding = studentsData.reduce((sum, student) => {
    return sum + parseFloat(student.balance.replace('KES ', '').replace(',', ''));
  }, 0);
  
  const studentsWithBalance = studentsData.filter(student => 
    parseFloat(student.balance.replace('KES ', '').replace(',', '')) > 0
  ).length;

  const handleViewDetails = (section: string) => {
    switch (section) {
      case 'View All Transactions':
        navigate('/finance');
        break;
      case 'Send Fee Reminders':
        toast({
          title: "Fee Reminders Sent",
          description: `Bulk SMS reminders sent to ${studentsWithBalance} parents.`,
        });
        break;
      default:
        navigate('/finance');
    }
  };

  const financialStats = [
    { title: 'Today\'s Collections', value: 'KES 847,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', change: '+12%' },
    { title: 'Outstanding Fees', value: 'KES 2.1M', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', change: '-5%' },
    { title: 'M-Pesa Payments', value: 'KES 623,400', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', change: '+18%' },
    { title: 'Bank Deposits', value: 'KES 224,100', icon: Banknote, color: 'text-purple-600', bg: 'bg-purple-50', change: '+8%' },
  ];

  const recentTransactions = [
    { time: '09:23 AM', student: 'John Mwangi - Form 4A', amount: 'KES 45,000', method: 'M-Pesa', status: 'completed' },
    { time: '09:15 AM', student: 'Grace Wanjiku - Form 2B', amount: 'KES 22,500', method: 'Bank Transfer', status: 'completed' },
    { time: '09:08 AM', student: 'Peter Kiprotich - Form 3A', amount: 'KES 30,000', method: 'Cash', status: 'completed' },
    { time: '08:54 AM', student: 'Mary Nyambura - Form 1A', amount: 'KES 18,750', method: 'M-Pesa', status: 'pending' },
  ];

  const outstandingByClass = [
    { class: 'Form 4A', students: 28, amount: 'KES 425,000', urgency: 'high' },
    { class: 'Form 3B', students: 15, amount: 'KES 287,500', urgency: 'medium' },
    { class: 'Form 2A', students: 12, amount: 'KES 195,000', urgency: 'low' },
    { class: 'Form 1B', students: 22, amount: 'KES 380,250', urgency: 'high' },
  ];

  const handleStudentSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter an admission number to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const student = studentsData.find(s => 
        s.admissionNumber.toLowerCase() === searchQuery.toLowerCase().trim()
      );
      
      if (student) {
        setFoundStudent(student);
        toast({
          title: "Student Found",
          description: `Found ${student.name} - ${student.class}`,
        });
      } else {
        setFoundStudent(null);
        toast({
          title: "Student Not Found",
          description: `No student found with admission number: ${searchQuery}`,
          variant: "destructive",
        });
      }
      setIsSearching(false);
    }, 500);
  };

  const handleGenerateFeeStatement = () => {
    if (!foundStudent) return;
    
    toast({
      title: "Generating Fee Statement",
      description: `Generating fee statement for ${foundStudent.name}...`,
    });
    
    setTimeout(() => {
      const success = generateFeeStatementPDF(foundStudent.admissionNumber);
      
      if (success) {
        toast({
          title: "Fee Statement Downloaded",
          description: `Fee statement for ${foundStudent.name} has been downloaded successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate fee statement. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFoundStudent(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor school finances, track payments, and manage fee collections
          </p>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-teal-600" />
                <span>Recent Payments</span>
              </CardTitle>
              <CardDescription>Latest fee payments and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.student}</p>
                    <p className="text-xs text-gray-500">{transaction.time} • {transaction.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{transaction.amount}</p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewDetails('View All Transactions')}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Outstanding Balances by Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Outstanding Balances</span>
              </CardTitle>
              <CardDescription>Fee balances by class requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {outstandingByClass.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.class}</p>
                    <p className="text-xs text-gray-500">{item.students} students affected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{item.amount}</p>
                    <Badge variant={item.urgency === 'high' ? 'destructive' : item.urgency === 'medium' ? 'default' : 'secondary'}>
                      {item.urgency} priority
                    </Badge>
                  </div>
                </div>
              ))}
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleViewDetails('Send Fee Reminders')}>
                Send Bulk Reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Student Search & Fee Statement Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-teal-600" />
              <span>Student Fee Statement Generator</span>
            </CardTitle>
            <CardDescription>Search by admission number to generate fee statements and manage payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Section */}
            <div className="flex space-x-3">
              <div className="flex-1">
                <Label htmlFor="searchInput">Admission Number</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="searchInput"
                    placeholder="Enter admission number (e.g., NA2024001)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-6">
                <Button onClick={handleStudentSearch} disabled={isSearching} className="bg-teal-600 hover:bg-teal-700">
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
                {(searchQuery || foundStudent) && (
                  <Button variant="outline" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Student Results */}
            {foundStudent && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 rounded-full">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{foundStudent.name}</h4>
                      <p className="text-sm text-gray-600">{foundStudent.admissionNumber} • {foundStudent.class}</p>
                      <p className="text-sm text-gray-600">Guardian: {foundStudent.guardian}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Fee Balance</p>
                    <p className={`text-lg font-bold ${foundStudent.balance === 'KES 0' ? 'text-green-600' : 'text-red-600'}`}>
                      {foundStudent.balance}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <Button 
                    onClick={handleGenerateFeeStatement}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Generate Fee Statement</span>
                  </Button>
                  
                  {parseFloat(foundStudent.balance.replace('KES ', '').replace(',', '')) > 0 && (
                    <MpesaPayment
                      studentName={foundStudent.name}
                      admissionNumber={foundStudent.admissionNumber}
                      outstandingBalance={parseFloat(foundStudent.balance.replace('KES ', '').replace(',', ''))}
                      trigger={
                        <Button variant="outline" className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Process M-Pesa Payment</span>
                        </Button>
                      }
                    />
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/students');
                      // You could also pass the student data to highlight them in the list
                    }}
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>

        {/* Quick Finance Actions */}
        <QuickActions />
      </div>
    </Layout>
  );
};

export default AccountantDashboard;
