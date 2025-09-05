
import React, { createContext, useContext, useState, useEffect } from 'react';
import { teachersData } from '@/data/teachersData';
import { studentsData } from '@/data/studentsData';

export type UserRole = 'admin' | 'accountant' | 'parent' | 'teacher' | 'storekeeper' | 'librarian' | 'lab_technician' | 'nurse' | 'hostel_warden' | 'discipline_master' | 'hr_manager' | 'exam_officer' | 'alumni_coordinator';

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
    name: 'Jared Ombongi',
    email: 'admin@drumvale-secondary.com',
    role: 'admin',
    schoolName: 'Drumvale Secondary School',
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    email: 'accountant@drumvale-secondary.com',
    role: 'accountant',
    schoolName: 'Drumvale Secondary School',
  },
  {
    id: '8',
    name: 'Mary Njeri',
    email: 'storekeeper@drumvale-secondary.com',
    role: 'storekeeper',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-ST-001',
  },
  {
    id: '9',
    name: 'James Mutua',
    email: 'librarian@drumvale-secondary.com',
    role: 'librarian',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-LIB-001',
  },
  {
    id: '10',
    name: 'Alice Wanjiku',
    email: 'lab@drumvale-secondary.com',
    role: 'lab_technician',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-LAB-001',
  },
  {
    id: '11',
    name: 'Dr. Susan Mwangi',
    email: 'nurse@drumvale-secondary.com',
    role: 'nurse',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-NUR-001',
  },
  {
    id: '12',
    name: 'Patrick Ochieng',
    email: 'hostel@drumvale-secondary.com',
    role: 'hostel_warden',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-HOS-001',
  },
  {
    id: '13',
    name: 'Michael Kariuki',
    email: 'discipline@drumvale-secondary.com',
    role: 'discipline_master',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-DIS-001',
  },
  {
    id: '14',
    name: 'Nancy Wanjiru',
    email: 'hr@drumvale-secondary.com',
    role: 'hr_manager',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-HR-001',
  },
  {
    id: '15',
    name: 'David Kiptoo',
    email: 'exam@drumvale-secondary.com',
    role: 'exam_officer',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-EXM-001',
  },
  {
    id: '16',
    name: 'Ruth Akinyi',
    email: 'alumni@drumvale-secondary.com',
    role: 'alumni_coordinator',
    schoolName: 'Drumvale Secondary School',
    employeeId: 'EMP-ALM-001',
  },
];

// Mock parent users with their children's admission numbers
const parentUsers: User[] = [
  {
    id: '3',
    name: 'Peter Kamau',
    email: 'peter.kamau@gmail.com',
    role: 'parent',
    children: ['DS2024001', 'DS2024015'],
  },
  {
    id: '4',
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@gmail.com',
    role: 'parent',
    children: ['DS2024002'],
  },
  {
    id: '5',
    name: 'Robert Ochieng',
    email: 'robert.ochieng@gmail.com',
    role: 'parent',
    children: ['DS2024003'],
  },
  {
    id: '6',
    name: 'Jane Mwangi',
    email: 'jane.mwangi@gmail.com',
    role: 'parent',
    children: ['DS2024004'],
  },
  {
    id: '7',
    name: 'Paul Kiprotich',
    email: 'paul.kiprotich@gmail.com',
    role: 'parent',
    children: ['DS2024005'],
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
