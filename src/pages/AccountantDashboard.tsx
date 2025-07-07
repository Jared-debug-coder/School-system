
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, AlertCircle, TrendingUp, FileText, Calculator, Banknote, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccountantDashboard = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} process started...`,
    });
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
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleAction('View All Transactions')}>
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
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleAction('Send Fee Reminders')}>
                Send Bulk Reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Finance Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction('Record Payment')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <span>Record Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Manually record cash or bank payments</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction('Generate Invoices')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Generate Invoices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Create term or custom fee invoices</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction('Financial Reports')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>Financial Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">P&L, balance sheets, and analytics</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAction('M-Pesa Reconciliation')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span>M-Pesa Sync</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Reconcile mobile payment transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AccountantDashboard;
