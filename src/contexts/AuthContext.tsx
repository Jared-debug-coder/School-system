
import React, { createContext, useContext, useState, useEffect } from 'react';
import { teachersData } from '@/data/teachersData';
import { studentsData } from '@/data/studentsData';

export type UserRole = 'admin' | 'accountant' | 'parent' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolName?: string;
  children?: string[]; // For parents - student admission numbers
  employeeId?: string; // For teachers
  assignedClasses?: string[]; // For teachers - classes they teach
  subjects?: string[]; // For teachers - subjects they teach
  classTeacher?: string; // For teachers - class they are class teacher of
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  parentLogin: (admissionNumber: string, parentPhone: string) => Promise<boolean>;
  teacherLogin: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Mwangi',
    email: 'admin@nairobi-academy.com',
    role: 'admin',
    schoolName: 'Nairobi Academy',
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    email: 'accountant@nairobi-academy.com',
    role: 'accountant',
    schoolName: 'Nairobi Academy',
  },
];

// Mock parent users with their children's admission numbers
const parentUsers: User[] = [
  {
    id: '3',
    name: 'Peter Kamau',
    email: 'peter.kamau@gmail.com',
    role: 'parent',
    children: ['NA2024001', 'NA2024015'],
  },
  {
    id: '4',
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@gmail.com',
    role: 'parent',
    children: ['NA2024002'],
  },
  {
    id: '5',
    name: 'Robert Ochieng',
    email: 'robert.ochieng@gmail.com',
    role: 'parent',
    children: ['NA2024003'],
  },
  {
    id: '6',
    name: 'Jane Mwangi',
    email: 'jane.mwangi@gmail.com',
    role: 'parent',
    children: ['NA2024004'],
  },
  {
    id: '7',
    name: 'Paul Kiprotich',
    email: 'paul.kiprotich@gmail.com',
    role: 'parent',
    children: ['NA2024005'],
  },
];

// Mock teacher users
const teacherUsers: User[] = teachersData.map(teacher => ({
  id: teacher.id,
  name: teacher.name,
  email: teacher.email,
  role: 'teacher' as UserRole,
  employeeId: teacher.employeeId,
  assignedClasses: teacher.assignedClasses,
  subjects: teacher.subjects,
  classTeacher: teacher.classTeacher,
}));


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('shulePro_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Add timestamp check to auto-logout after 8 hours
        const loginTime = localStorage.getItem('shulePro_loginTime');
        if (loginTime) {
          const timeDiff = Date.now() - parseInt(loginTime);
          const eightHours = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
          
          if (timeDiff > eightHours) {
            // Session expired
            localStorage.removeItem('shulePro_user');
            localStorage.removeItem('shulePro_loginTime');
            sessionStorage.clear();
          } else {
            setUser(parsedUser);
          }
        } else {
          setUser(parsedUser);
          // Set login time if not present
          localStorage.setItem('shulePro_loginTime', Date.now().toString());
        }
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('shulePro_user');
        localStorage.removeItem('shulePro_loginTime');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('shulePro_user', JSON.stringify(foundUser));
      localStorage.setItem('shulePro_loginTime', Date.now().toString());
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const parentLogin = async (admissionNumber: string, parentPhone: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find parent by checking if they have a child with this admission number
    const parentUser = parentUsers.find(parent => 
      parent.children && parent.children.includes(admissionNumber)
    );
    
    // Simple phone validation (must be at least 10 digits)
    const phoneValid = parentPhone.replace(/\D/g, '').length >= 10;
    
    if (parentUser && phoneValid) {
      setUser(parentUser);
      localStorage.setItem('shulePro_user', JSON.stringify(parentUser));
      localStorage.setItem('shulePro_loginTime', Date.now().toString());
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const teacherLogin = async (employeeId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const teacherUser = teacherUsers.find(teacher => teacher.employeeId === employeeId);
    
    if (teacherUser && password === 'teacher123') {
      setUser(teacherUser);
      localStorage.setItem('shulePro_user', JSON.stringify(teacherUser));
      localStorage.setItem('shulePro_loginTime', Date.now().toString());
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };


  const logout = () => {
    setUser(null);
    // Clear all possible storage locations
    localStorage.removeItem('shulePro_user');
    localStorage.removeItem('shulePro_loginTime');
    sessionStorage.removeItem('shulePro_user');
    sessionStorage.removeItem('shulePro_loginTime');
    // Clear any other auth-related data
    localStorage.removeItem('shulePro_token');
    sessionStorage.removeItem('shulePro_token');
    // Navigate to root which will show login form
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, parentLogin, teacherLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
