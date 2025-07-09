export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClasses: string[];
  classTeacher?: string; // Class they are class teacher of
  qualification: string;
  experience: number; // years
  dateJoined: string;
  department: string;
  isClassTeacher: boolean;
}

export const teachersData: Teacher[] = [
  {
    id: 'T001',
    employeeId: 'EMP001',
    name: 'Mrs. Sarah Muthoni',
    email: 'sarah.muthoni@nairobi-academy.com',
    phone: '+254712000001',
    subjects: ['Mathematics', 'Computer Studies'],
    assignedClasses: ['Form 1A', 'Form 2A'],
    classTeacher: 'Form 1A',
    qualification: 'B.Ed (Mathematics)',
    experience: 8,
    dateJoined: '2018-01-15',
    department: 'Mathematics',
    isClassTeacher: true,
  },
  {
    id: 'T002',
    employeeId: 'EMP002',
    name: 'Mr. Peter Ochieng',
    email: 'peter.ochieng@nairobi-academy.com',
    phone: '+254712000002',
    subjects: ['Biology', 'Chemistry'],
    assignedClasses: ['Form 1B', 'Form 3B'],
    classTeacher: 'Form 1B',
    qualification: 'B.Sc (Biology), PGDE',
    experience: 12,
    dateJoined: '2015-02-10',
    department: 'Sciences',
    isClassTeacher: true,
  },
  {
    id: 'T003',
    employeeId: 'EMP003',
    name: 'Ms. Grace Njeri',
    email: 'grace.njeri@nairobi-academy.com',
    phone: '+254712000003',
    subjects: ['English', 'Literature'],
    assignedClasses: ['Form 1C', 'Form 4C'],
    classTeacher: 'Form 1C',
    qualification: 'B.A (English), PGDE',
    experience: 6,
    dateJoined: '2020-08-15',
    department: 'Languages',
    isClassTeacher: true,
  },
  {
    id: 'T004',
    employeeId: 'EMP004',
    name: 'Mrs. Mary Wanjiku',
    email: 'mary.wanjiku@nairobi-academy.com',
    phone: '+254712000004',
    subjects: ['History & Government', 'Geography'],
    assignedClasses: ['Form 2A', 'Form 3A'],
    classTeacher: 'Form 2A',
    qualification: 'B.Ed (History)',
    experience: 10,
    dateJoined: '2016-09-01',
    department: 'Humanities',
    isClassTeacher: true,
  },
  {
    id: 'T005',
    employeeId: 'EMP005',
    name: 'Mr. David Kiprotich',
    email: 'david.kiprotich@nairobi-academy.com',
    phone: '+254712000005',
    subjects: ['Mathematics', 'Physics'],
    assignedClasses: ['Form 2B', 'Form 4A'],
    classTeacher: 'Form 2B',
    qualification: 'B.Sc (Physics), M.Ed',
    experience: 15,
    dateJoined: '2012-01-20',
    department: 'Mathematics',
    isClassTeacher: true,
  },
  {
    id: 'T006',
    employeeId: 'EMP006',
    name: 'Ms. Ruth Chebet',
    email: 'ruth.chebet@nairobi-academy.com',
    phone: '+254712000006',
    subjects: ['Kiswahili', 'CRE'],
    assignedClasses: ['Form 2C', 'Form 3C'],
    classTeacher: 'Form 2C',
    qualification: 'B.A (Kiswahili), PGDE',
    experience: 7,
    dateJoined: '2019-05-10',
    department: 'Languages',
    isClassTeacher: true,
  },
  {
    id: 'T007',
    employeeId: 'EMP007',
    name: 'Mr. Francis Mutua',
    email: 'francis.mutua@nairobi-academy.com',
    phone: '+254712000007',
    subjects: ['Chemistry', 'Biology'],
    assignedClasses: ['Form 3A', 'Form 4B'],
    classTeacher: 'Form 3A',
    qualification: 'B.Ed (Chemistry), M.A',
    experience: 14,
    dateJoined: '2013-03-15',
    department: 'Sciences',
    isClassTeacher: true,
  },
  {
    id: 'T008',
    employeeId: 'EMP008',
    name: 'Mrs. Rose Akinyi',
    email: 'rose.akinyi@nairobi-academy.com',
    phone: '+254712000008',
    subjects: ['Physics', 'Mathematics'],
    assignedClasses: ['Form 3B', 'Form 4C'],
    classTeacher: 'Form 3B',
    qualification: 'B.Sc (Physics), PGDE',
    experience: 9,
    dateJoined: '2017-07-20',
    department: 'Sciences',
    isClassTeacher: true,
  },
  {
    id: 'T009',
    employeeId: 'EMP009',
    name: 'Ms. Catherine Njeri',
    email: 'catherine.njeri@nairobi-academy.com',
    phone: '+254712000009',
    subjects: ['English', 'History & Government'],
    assignedClasses: ['Form 3C', 'Form 1A'],
    classTeacher: 'Form 3C',
    qualification: 'B.A (English), M.Ed',
    experience: 11,
    dateJoined: '2014-11-05',
    department: 'Languages',
    isClassTeacher: true,
  },
  {
    id: 'T010',
    employeeId: 'EMP010',
    name: 'Mr. Joseph Karanja',
    email: 'joseph.karanja@nairobi-academy.com',
    phone: '+254712000010',
    subjects: ['Mathematics', 'Business Studies'],
    assignedClasses: ['Form 4A', 'Form 2A'],
    classTeacher: 'Form 4A',
    qualification: 'B.Ed (Mathematics), M.Sc',
    experience: 16,
    dateJoined: '2010-01-10',
    department: 'Mathematics',
    isClassTeacher: true,
  },
  {
    id: 'T011',
    employeeId: 'EMP011',
    name: 'Mrs. Margaret Nyongo',
    email: 'margaret.nyongo@nairobi-academy.com',
    phone: '+254712000011',
    subjects: ['Geography', 'CRE'],
    assignedClasses: ['Form 4B', 'Form 1B'],
    classTeacher: 'Form 4B',
    qualification: 'B.A (Geography), M.Ed',
    experience: 13,
    dateJoined: '2013-08-20',
    department: 'Humanities',
    isClassTeacher: true,
  },
  {
    id: 'T012',
    employeeId: 'EMP012',
    name: 'Mr. Daniel Mwenda',
    email: 'daniel.mwenda@nairobi-academy.com',
    phone: '+254712000012',
    subjects: ['Biology', 'Computer Studies'],
    assignedClasses: ['Form 4C', 'Form 2B'],
    classTeacher: 'Form 4C',
    qualification: 'B.Sc (Biology), PGDE',
    experience: 5,
    dateJoined: '2021-09-15',
    department: 'Sciences',
    isClassTeacher: true,
  },
  // Additional teachers who are not class teachers but teach various subjects
  {
    id: 'T013',
    employeeId: 'EMP013',
    name: 'Mr. Samuel Kimani',
    email: 'samuel.kimani@nairobi-academy.com',
    phone: '+254712000013',
    subjects: ['Physical Education', 'Mathematics'],
    assignedClasses: ['Form 1A', 'Form 1B', 'Form 1C'],
    qualification: 'B.Ed (Physical Education)',
    experience: 4,
    dateJoined: '2022-01-15',
    department: 'Physical Education',
    isClassTeacher: false,
  },
  {
    id: 'T014',
    employeeId: 'EMP014',
    name: 'Mrs. Lydia Wangari',
    email: 'lydia.wangari@nairobi-academy.com',
    phone: '+254712000014',
    subjects: ['Art & Design', 'Computer Studies'],
    assignedClasses: ['Form 2A', 'Form 2B', 'Form 2C'],
    qualification: 'B.A (Fine Arts), PGDE',
    experience: 6,
    dateJoined: '2020-02-10',
    department: 'Creative Arts',
    isClassTeacher: false,
  },
  {
    id: 'T015',
    employeeId: 'EMP015',
    name: 'Mr. Patrick Mbugua',
    email: 'patrick.mbugua@nairobi-academy.com',
    phone: '+254712000015',
    subjects: ['Music', 'CRE'],
    assignedClasses: ['Form 3A', 'Form 3B', 'Form 3C'],
    qualification: 'B.A (Music), PGDE',
    experience: 8,
    dateJoined: '2018-05-20',
    department: 'Creative Arts',
    isClassTeacher: false,
  },
];

// Helper functions to get teacher information
export const getTeacherByEmployeeId = (employeeId: string): Teacher | undefined => {
  return teachersData.find(teacher => teacher.employeeId === employeeId);
};

export const getClassTeacher = (className: string): Teacher | undefined => {
  return teachersData.find(teacher => teacher.classTeacher === className);
};

export const getTeachersBySubject = (subject: string): Teacher[] => {
  return teachersData.filter(teacher => teacher.subjects.includes(subject));
};

export const getTeachersByClass = (className: string): Teacher[] => {
  return teachersData.filter(teacher => teacher.assignedClasses.includes(className));
};

export const getAllClasses = (): string[] => {
  const classes = new Set<string>();
  teachersData.forEach(teacher => {
    teacher.assignedClasses.forEach(className => classes.add(className));
  });
  return Array.from(classes).sort();
};

export const getAllSubjects = (): string[] => {
  const subjects = new Set<string>();
  teachersData.forEach(teacher => {
    teacher.subjects.forEach(subject => subjects.add(subject));
  });
  return Array.from(subjects).sort();
};
