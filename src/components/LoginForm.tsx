
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap, User, UserCheck } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, parentLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to ShulePro!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!admissionNumber || !parentPhone) {
      toast({
        title: "Error",
        description: "Please provide both admission number and phone number",
        variant: "destructive",
      });
      return;
    }

    const success = await parentLogin(admissionNumber, parentPhone);
    
    if (success) {
      toast({
        title: "Parent Login Successful",
        description: "Welcome to your parent portal!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admission number or phone number",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">ShulePro</span>
          </div>
          <p className="text-gray-600">School Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your login method below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="staff" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="staff" className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Staff</span>
                </TabsTrigger>
                <TabsTrigger value="parent" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Parent</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="staff" className="space-y-4">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Staff'}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Demo Staff Credentials:</p>
                  <div className="space-y-2">
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium text-gray-700">Admin</div>
                      <div className="text-gray-600">admin@nairobi-academy.com</div>
                      <div className="text-gray-600">password123</div>
                    </div>
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium text-gray-700">Accountant</div>
                      <div className="text-gray-600">accountant@nairobi-academy.com</div>
                      <div className="text-gray-600">password123</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parent" className="space-y-4">
                <form onSubmit={handleParentLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admissionNumber">Student Admission Number</Label>
                    <Input
                      id="admissionNumber"
                      type="text"
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      placeholder="e.g., NA2024001"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parentPhone">Your Phone Number</Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+254712345678"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Parent'}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Demo Parent Login:</p>
                  <div className="space-y-2">
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium text-gray-700">Peter Kamau (Parent)</div>
                      <div className="text-gray-600">Admission: NA2024001 or NA2024015</div>
                      <div className="text-gray-600">Phone: Any 10+ digit number</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
