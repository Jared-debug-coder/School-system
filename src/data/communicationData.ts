import { studentsData } from './studentsData';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'parent' | 'admin';
  recipientId: string;
  recipientName: string;
  recipientRole: 'teacher' | 'parent' | 'admin';
  subject: string;
  message: string;
  studentAdmissionNumber?: string; // If message is about a specific student
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  parentPhone?: string; // For SMS notifications
}

export interface Notification {
  id: string;
  type: 'academic' | 'disciplinary' | 'attendance' | 'fee' | 'general';
  title: string;
  message: string;
  studentAdmissionNumber?: string;
  createdBy: string;
  createdAt: string;
  sentToParents: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Sample messages
export const messagesData: Message[] = [
  {
    id: 'MSG001',
    senderId: 'EMP001',
    senderName: 'Mrs. Sarah Muthoni',
    senderRole: 'teacher',
    recipientId: 'PAR001',
    recipientName: 'Peter Kamau',
    recipientRole: 'parent',
    subject: 'Academic Progress Update - John Kamau',
    message: 'Good afternoon Mr. Kamau. I wanted to update you on John\'s progress in Mathematics. He has shown significant improvement this term, scoring 85% in his recent CAT. Keep encouraging him at home.',
    studentAdmissionNumber: 'NA2024001',
    priority: 'medium',
    timestamp: '2025-01-07T14:30:00Z',
    read: false,
    parentPhone: '+254712345678'
  },
  {
    id: 'MSG002',
    senderId: 'PAR002',
    senderName: 'Jane Wanjiku',
    senderRole: 'parent',
    recipientId: 'EMP002',
    recipientName: 'Mr. Peter Ochieng',
    recipientRole: 'teacher',
    subject: 'Mary\'s Absence Today',
    message: 'Hello Teacher, Mary won\'t be in school today due to a slight fever. She should be back tomorrow. Thank you.',
    studentAdmissionNumber: 'NA2024002',
    priority: 'medium',
    timestamp: '2025-01-08T07:15:00Z',
    read: true,
    parentPhone: '+254723456789'
  },
  {
    id: 'MSG003',
    senderId: 'EMP007',
    senderName: 'Mr. Francis Mutua',
    senderRole: 'teacher',
    recipientId: 'PAR003',
    recipientName: 'Robert Ochieng',
    recipientRole: 'parent',
    subject: 'Excellent Performance in Chemistry',
    message: 'Dear Mr. Ochieng, I\'m pleased to inform you that Peter scored 92% in the Chemistry exam. He shows great potential in sciences. Consider encouraging him to pursue science subjects.',
    studentAdmissionNumber: 'NA2024003',
    priority: 'high',
    timestamp: '2025-01-06T16:45:00Z',
    read: false,
    parentPhone: '+254734567890'
  }
];

// Sample notifications
export const notificationsData: Notification[] = [
  {
    id: 'NOT001',
    type: 'attendance',
    title: 'Student Absent - Immediate Attention Required',
    message: 'Your child was absent from school today without prior notice. Please contact the school.',
    studentAdmissionNumber: 'NA2024012',
    createdBy: 'EMP001',
    createdAt: '2025-01-08T08:30:00Z',
    sentToParents: true,
    priority: 'high'
  },
  {
    id: 'NOT002',
    type: 'academic',
    title: 'Outstanding Academic Performance',
    message: 'Congratulations! Your child scored in the top 5 of their class this term.',
    studentAdmissionNumber: 'NA2024005',
    createdBy: 'EMP005',
    createdAt: '2025-01-07T15:20:00Z',
    sentToParents: true,
    priority: 'medium'
  },
  {
    id: 'NOT003',
    type: 'disciplinary',
    title: 'Behavioral Concern',
    message: 'Your child was involved in a minor disciplinary issue. Please schedule a meeting with the class teacher.',
    studentAdmissionNumber: 'NA2024009',
    createdBy: 'EMP006',
    createdAt: '2025-01-07T11:10:00Z',
    sentToParents: false,
    priority: 'urgent'
  }
];

// Helper functions
export const getMessagesForTeacher = (teacherId: string): Message[] => {
  return messagesData.filter(msg => 
    msg.senderId === teacherId || msg.recipientId === teacherId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getMessagesForParent = (parentId: string): Message[] => {
  return messagesData.filter(msg => 
    msg.senderId === parentId || msg.recipientId === parentId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getStudentNotifications = (admissionNumber: string): Notification[] => {
  return notificationsData.filter(notification => 
    notification.studentAdmissionNumber === admissionNumber
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const sendMessageToParent = (
  teacherId: string,
  teacherName: string,
  studentAdmissionNumber: string,
  subject: string,
  message: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): Message => {
  // Find student and parent details
  const student = studentsData.find(s => s.admissionNumber === studentAdmissionNumber);
  
  if (!student) {
    throw new Error('Student not found');
  }

  const newMessage: Message = {
    id: `MSG${Date.now()}`,
    senderId: teacherId,
    senderName: teacherName,
    senderRole: 'teacher',
    recipientId: `PAR_${student.guardian.replace(' ', '_')}`,
    recipientName: student.guardian,
    recipientRole: 'parent',
    subject,
    message,
    studentAdmissionNumber,
    priority,
    timestamp: new Date().toISOString(),
    read: false,
    parentPhone: student.phone
  };

  messagesData.push(newMessage);
  return newMessage;
};

export const createNotification = (
  type: 'academic' | 'disciplinary' | 'attendance' | 'fee' | 'general',
  title: string,
  message: string,
  studentAdmissionNumber: string,
  createdBy: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): Notification => {
  const newNotification: Notification = {
    id: `NOT${Date.now()}`,
    type,
    title,
    message,
    studentAdmissionNumber,
    createdBy,
    createdAt: new Date().toISOString(),
    sentToParents: true,
    priority
  };

  notificationsData.push(newNotification);
  return newNotification;
};

export const getParentContactInfo = (admissionNumber: string) => {
  const student = studentsData.find(s => s.admissionNumber === admissionNumber);
  return student ? {
    guardianName: student.guardian,
    phone: student.phone,
    email: student.email
  } : null;
};

// Quick message templates for teachers
export const messageTemplates = {
  academic: {
    excellent: "Good day! I'm pleased to inform you that {studentName} has shown excellent performance in {subject}. Keep encouraging them!",
    improvement: "{studentName} has shown improvement in {subject}. With continued effort, they can achieve even better results.",
    concern: "I'd like to discuss {studentName}'s performance in {subject}. Please schedule a meeting at your convenience."
  },
  attendance: {
    absent: "{studentName} was absent from school today. Please confirm their whereabouts and reason for absence.",
    late: "{studentName} has been arriving late to school frequently. Please ensure they arrive on time.",
    perfect: "Congratulations! {studentName} has maintained perfect attendance this term."
  },
  behavior: {
    good: "{studentName} has been exemplary in behavior and is a good role model to other students.",
    concern: "I need to discuss {studentName}'s behavior in class. Please schedule a meeting with me.",
    improvement: "{studentName} has shown positive behavioral changes. Keep encouraging them."
  }
};
