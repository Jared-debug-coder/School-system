
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap, User, UserCheck, BookOpen, Library } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [librarianUsername, setLibrarianUsername] = useState('');
  const [librarianPassword, setLibrarianPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [showLibrarianPassword, setShowLibrarianPassword] = useState(false);
  const { login, parentLogin, teacherLogin, librarianLogin, isLoading } = useAuth();
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

    // Clear any existing session data before new login
    localStorage.removeItem('shulePro_user');
    localStorage.removeItem('shulePro_loginTime');
    sessionStorage.clear();

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

    // Clear any existing session data before new login
    localStorage.removeItem('shulePro_user');
    localStorage.removeItem('shulePro_loginTime');
    sessionStorage.clear();

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

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !teacherPassword) {
      toast({
        title: "Error",
        description: "Please provide both Employee ID and password",
        variant: "destructive",
      });
      return;
    }

    // Clear any existing session data before new login
    localStorage.removeItem('shulePro_user');
    localStorage.removeItem('shulePro_loginTime');
    sessionStorage.clear();

    const success = await teacherLogin(employeeId, teacherPassword);
    
    if (success) {
      toast({
        title: "Teacher Login Successful",
        description: "Welcome to your teacher portal!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid Employee ID or password",
        variant: "destructive",
      });
    }
  };

  const handleLibrarianLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!librarianUsername || !librarianPassword) {
      toast({
        title: "Error",
        description: "Please provide both username and password",
        variant: "destructive",
      });
      return;
    }

    // Clear any existing session data before new login
    localStorage.removeItem('shulePro_user');
    localStorage.removeItem('shulePro_loginTime');
    sessionStorage.clear();

    const success = await librarianLogin(librarianUsername, librarianPassword);
    
    if (success) {
      toast({
        title: "Librarian Login Successful",
        description: "Welcome to the library system!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-orange-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">NA</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">Nairobi Academy</span>
          </div>
          <p className="text-gray-600">Excellence in Education Since 2010</p>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="staff" className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Staff</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Teacher</span>
                </TabsTrigger>
                <TabsTrigger value="librarian" className="flex items-center space-x-2">
                  <Library className="h-4 w-4" />
                  <span>Librarian</span>
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

              </TabsContent>

              <TabsContent value="teacher" className="space-y-4">
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g., EMP001"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="teacherPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="teacherPassword"
                        type={showTeacherPassword ? 'text' : 'password'}
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                      >
                        {showTeacherPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Teacher'}
                  </Button>
                </form>
                
                
              </TabsContent>

              <TabsContent value="librarian" className="space-y-4">
                <form onSubmit={handleLibrarianLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="librarianUsername">Username</Label>
                    <Input
                      id="librarianUsername"
                      type="text"
                      value={librarianUsername}
                      onChange={(e) => setLibrarianUsername(e.target.value)}
                      placeholder="Enter any username"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="librarianPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="librarianPassword"
                        type={showLibrarianPassword ? 'text' : 'password'}
                        value={librarianPassword}
                        onChange={(e) => setLibrarianPassword(e.target.value)}
                        placeholder="Enter any password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowLibrarianPassword(!showLibrarianPassword)}
                      >
                        {showLibrarianPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Librarian'}
                  </Button>
                </form>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-800">
                    <Library className="h-4 w-4" />
                    <span className="font-medium">Librarian Access</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2">
                    Enter any username and password to access the library management system.
                  </p>
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

              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
