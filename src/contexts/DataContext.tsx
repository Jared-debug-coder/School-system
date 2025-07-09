import React, { createContext, useContext, useState, useCallback } from 'react';
import { studentsData as initialStudentsData } from '@/data/studentsData';

// Types
export interface Student {
  id: number;
  name: string;
  class: string;
  admissionNumber: string;
  balance: string;
  status: string;
  guardian: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  residence: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: string;
  transactionId: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: Array<{
    description: string;
    amount: number;
  }>;
  createdDate: string;
}

interface DataContextType {
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: number, updates: Partial<Student>) => void;
  deleteStudent: (id: number) => void;
  getStudentByAdmission: (admissionNumber: string) => Student | undefined;
  
  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => string;
  getPaymentsByStudent: (studentId: string) => Payment[];
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => string;
  getInvoicesByStudent: (studentId: string) => Invoice[];
  
  // Statistics
  getTotalOutstanding: () => number;
  getStudentsWithBalance: () => Student[];
  getTotalCollected: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'PAY-001',
      studentId: 'NA2024001',
      amount: 15000,
      method: 'M-Pesa',
      transactionId: 'MPB7H8I9J0',
      description: 'Term 1 Tuition Fees',
      date: '2025-01-07',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      studentId: 'NA2024002',
      amount: 12000,
      method: 'Bank Transfer',
      transactionId: 'BT123456789',
      description: 'Term 1 Fees',
      date: '2025-01-06',
      status: 'completed'
    }
  ]);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      invoiceNumber: 'INV-2025-001',
      studentId: 'NA2024001',
      amount: 25000,
      dueDate: '2025-01-15',
      status: 'paid',
      items: [
        { description: 'Tuition Fees', amount: 20000 },
        { description: 'Transport', amount: 5000 }
      ],
      createdDate: '2025-01-01'
    }
  ]);

  // Student Management
  const addStudent = useCallback((newStudent: Omit<Student, 'id'>) => {
    const id = Math.max(...students.map(s => s.id), 0) + 1;
    const student: Student = {
      ...newStudent,
      id,
      status: 'Active'
    };
    setStudents(prev => [...prev, student]);
  }, [students]);

  const updateStudent = useCallback((id: number, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  }, []);

  const deleteStudent = useCallback((id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  }, []);

  const getStudentByAdmission = useCallback((admissionNumber: string) => {
    return students.find(student => 
      student.admissionNumber.toLowerCase() === admissionNumber.toLowerCase()
    );
  }, [students]);

  // Payment Management
  const addPayment = useCallback((newPayment: Omit<Payment, 'id'>) => {
    const id = `PAY-${Date.now()}`;
    const payment: Payment = { ...newPayment, id };
    setPayments(prev => [...prev, payment]);
    
    // Update student balance
    const student = students.find(s => s.admissionNumber === newPayment.studentId);
    if (student) {
      const currentBalance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      const newBalance = Math.max(0, currentBalance - newPayment.amount);
      updateStudent(student.id, { 
        balance: `KES ${newBalance.toLocaleString()}` 
      });
    }
    
    return id;
  }, [students, updateStudent]);

  const getPaymentsByStudent = useCallback((studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  }, [payments]);

  // Invoice Management
  const addInvoice = useCallback((newInvoice: Omit<Invoice, 'id'>) => {
    const id = `INV-${Date.now()}`;
    const invoice: Invoice = { ...newInvoice, id };
    setInvoices(prev => [...prev, invoice]);
    
    // Update student balance
    const student = students.find(s => s.admissionNumber === newInvoice.studentId);
    if (student) {
      const currentBalance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      const newBalance = currentBalance + newInvoice.amount;
      updateStudent(student.id, { 
        balance: `KES ${newBalance.toLocaleString()}` 
      });
    }
    
    return id;
  }, [students, updateStudent]);

  const getInvoicesByStudent = useCallback((studentId: string) => {
    return invoices.filter(invoice => invoice.studentId === studentId);
  }, [invoices]);

  // Statistics
  const getTotalOutstanding = useCallback(() => {
    return students.reduce((total, student) => {
      const balance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      return total + balance;
    }, 0);
  }, [students]);

  const getStudentsWithBalance = useCallback(() => {
    return students.filter(student => {
      const balance = parseFloat(student.balance.replace('KES ', '').replace(',', ''));
      return balance > 0;
    });
  }, [students]);

  const getTotalCollected = useCallback(() => {
    return payments.reduce((total, payment) => {
      return payment.status === 'completed' ? total + payment.amount : total;
    }, 0);
  }, [payments]);

  const value: DataContextType = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentByAdmission,
    payments,
    addPayment,
    getPaymentsByStudent,
    invoices,
    addInvoice,
    getInvoicesByStudent,
    getTotalOutstanding,
    getStudentsWithBalance,
    getTotalCollected
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
