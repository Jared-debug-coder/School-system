
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'accountant' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolName?: string;
  children?: string[]; // For parents - student IDs
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('shulePro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shulePro_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
