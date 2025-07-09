import { studentsData } from './studentsData';

export interface SubjectGrade {
  subject: string;
  catScore: number; // Continuous Assessment Test (out of 30)
  examScore: number; // End of term exam (out of 70)
  totalScore: number; // Total out of 100
  grade: string; // A, A-, B+, etc.
  remarks: string;
}

export interface ReportCardData {
  student: {
    name: string;
    admissionNumber: string;
    class: string;
    streamName: string;
    term: string;
    year: string;
    dateOfBirth: string;
    gender: string;
    residence: string;
  };
  academic: {
    subjects: SubjectGrade[];
    totalMarks: number;
    averageScore: number;
    overallGrade: string;
    position: number;
    outOf: number;
  };
  attendance: {
    daysPresent: number;
    daysAbsent: number;
    totalDays: number;
    percentage: number;
  };
  fees: {
    balance: string;
    status: string;
  };
  nextTerm: {
    opensOn: string;
    feeDue: string;
  };
  classTeacher: {
    name: string;
    remarks: string;
  };
  headTeacher: {
    name: string;
    remarks: string;
  };
}

// Kenyan Secondary School Subjects by Form
const subjectsByForm = {
  'Form 1': [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History & Government', 'Geography', 'CRE', 'Computer Studies', 'Business Studies'
  ],
  'Form 2': [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History & Government', 'Geography', 'CRE', 'Computer Studies', 'Business Studies'
  ],
  'Form 3': [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History & Government', 'Geography', 'CRE', 'Computer Studies'
  ],
  'Form 4': [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History & Government', 'Geography', 'CRE'
  ]
};

const gradeScale = [
  { min: 80, grade: 'A', remarks: 'Excellent' },
  { min: 75, grade: 'A-', remarks: 'Very Good' },
  { min: 70, grade: 'B+', remarks: 'Good' },
  { min: 65, grade: 'B', remarks: 'Above Average' },
  { min: 60, grade: 'B-', remarks: 'Average' },
  { min: 55, grade: 'C+', remarks: 'Below Average' },
  { min: 50, grade: 'C', remarks: 'Poor' },
  { min: 45, grade: 'C-', remarks: 'Poor' },
  { min: 40, grade: 'D+', remarks: 'Very Poor' },
  { min: 35, grade: 'D', remarks: 'Very Poor' },
  { min: 30, grade: 'D-', remarks: 'Very Poor' },
  { min: 0, grade: 'E', remarks: 'Fail' }
];

function getGradeInfo(score: number) {
  for (const grade of gradeScale) {
    if (score >= grade.min) {
      return { grade: grade.grade, remarks: grade.remarks };
    }
  }
  return { grade: 'E', remarks: 'Fail' };
}

export function updateStudentSubjectGrade(admissionNumber: string, subject: string, catScore: number, examScore: number): ReportCardData | null {
  let student = studentsData.find(s => s.admissionNumber === admissionNumber);
  if (!student) return null;
  
  const performanceLevel = getStudentPerformanceLevel(student.name);
  const subjects = generateSubjectGrades(student.class, performanceLevel).map(sub => {
    if(sub.subject === subject) {
      const totalScore = catScore + examScore;
      const gradeInfo = getGradeInfo(totalScore);
      return {
        ...sub,
        catScore,
        examScore,
        totalScore,
        grade: gradeInfo.grade,
        remarks: gradeInfo.remarks
      };
    }
    return sub;
  });

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.totalScore, 0);
  const averageScore = Math.round((totalMarks / subjects.length) * 100) / 100;
  const overallGradeInfo = getGradeInfo(averageScore);
  const position = subjects.findIndex(sub => sub.subject === subject) + 1;

  return {
    student: {
      name: student.name,
      admissionNumber: student.admissionNumber,
      class: student.class,
      streamName: student.class.includes('A') ? 'A' : student.class.includes('B') ? 'B' : 'C',
      term: 'Term 1',
      year: '2024',
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      residence: student.residence
    },
    academic: {
      subjects,
      totalMarks,
      averageScore,
      overallGrade: overallGradeInfo.grade,
      position,
      outOf: 35
    },
    attendance: {
      daysPresent: 0,
      daysAbsent: 0,
      totalDays: 0,
      percentage: 0
    },
    fees: {
      balance: student.balance,
      status: student.balance === 'KES 0' ? 'Paid' : 'Outstanding'
    },
    nextTerm: {
      opensOn: '2025-01-13',
      feeDue: '2025-01-15'
    },
    classTeacher: {
      name: getClassTeacherName(student.class),
      remarks: getClassTeacherRemarks(performanceLevel, student.name)
    },
    headTeacher: {
      name: 'Mr. James Wachira, B.Ed, M.A',
      remarks: getHeadTeacherRemarks(performanceLevel)
    }
  };
}

function generateSubjectGrades(formLevel: string, studentPerformance: 'excellent' | 'good' | 'average' | 'poor'): SubjectGrade[] {
  const subjects = subjectsByForm[formLevel as keyof typeof subjectsByForm] || subjectsByForm['Form 1'];
  
  // Performance ranges based on student level
  const performanceRanges = {
    excellent: { catMin: 25, catMax: 30, examMin: 60, examMax: 70 },
    good: { catMin: 20, catMax: 28, examMin: 50, examMax: 65 },
    average: { catMin: 15, catMax: 25, examMin: 35, examMax: 55 },
    poor: { catMin: 10, catMax: 20, examMin: 20, examMax: 40 }
  };
  
  const range = performanceRanges[studentPerformance];
  
  return subjects.map(subject => {
    const catScore = Math.floor(Math.random() * (range.catMax - range.catMin + 1)) + range.catMin;
    const examScore = Math.floor(Math.random() * (range.examMax - range.examMin + 1)) + range.examMin;
    const totalScore = catScore + examScore;
    const gradeInfo = getGradeInfo(totalScore);
    
    return {
      subject,
      catScore,
      examScore,
      totalScore,
      grade: gradeInfo.grade,
      remarks: gradeInfo.remarks
    };
  });
}

function getStudentPerformanceLevel(name: string): 'excellent' | 'good' | 'average' | 'poor' {
  // Generate consistent performance based on student name hash
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const mod = hash % 10;
  
  if (mod >= 8) return 'excellent';
  if (mod >= 6) return 'good';
  if (mod >= 3) return 'average';
  return 'poor';
}

function getClassTeacherName(className: string): string {
  const classTeachers = {
    'Form 1A': 'Mrs. Sarah Muthoni, B.Ed',
    'Form 1B': 'Mr. Peter Ochieng, B.Sc, PGDE',
    'Form 1C': 'Ms. Grace Njeri, B.A, PGDE',
    'Form 2A': 'Mrs. Mary Wanjiku, B.Ed',
    'Form 2B': 'Mr. David Kiprotich, B.Sc, M.Ed',
    'Form 2C': 'Ms. Ruth Chebet, B.A, PGDE',
    'Form 3A': 'Mr. Francis Mutua, B.Ed, M.A',
    'Form 3B': 'Mrs. Rose Akinyi, B.Sc, PGDE',
    'Form 3C': 'Ms. Catherine Njeri, B.A, M.Ed',
    'Form 4A': 'Mr. Joseph Karanja, B.Ed, M.Sc',
    'Form 4B': 'Mrs. Margaret Nyongo, B.A, M.Ed',
    'Form 4C': 'Mr. Daniel Mwenda, B.Sc, PGDE'
  };
  
  return classTeachers[className as keyof typeof classTeachers] || 'Mrs. Sarah Muthoni, B.Ed';
}

function getClassTeacherRemarks(performanceLevel: string, studentName: string): string {
  const firstName = studentName.split(' ')[0];
  
  const remarkTemplates = {
    excellent: [
      `${firstName} has shown exceptional performance this term. Keep up the excellent work!`,
      `Outstanding work, ${firstName}! Your dedication to studies is commendable.`,
      `${firstName} is a role model to other students. Excellent academic performance.`
    ],
    good: [
      `${firstName} has performed well this term. With more effort, you can achieve excellence.`,
      `Good work, ${firstName}! Continue with the same dedication and you will excel.`,
      `${firstName} shows great potential. Keep working hard to reach your full potential.`
    ],
    average: [
      `${firstName} needs to put more effort in studies. Seek help from teachers when needed.`,
      `Average performance, ${firstName}. More concentration and practice will improve your grades.`,
      `${firstName} can do better. Allocate more time to studies and revision.`
    ],
    poor: [
      `${firstName} requires immediate attention and extra support. Please see me for guidance.`,
      `Poor performance, ${firstName}. You need to work much harder and seek help from teachers.`,
      `${firstName} must improve study habits and attendance. Parental support is needed.`
    ]
  };
  
  const remarks = remarkTemplates[performanceLevel as keyof typeof remarkTemplates];
  return remarks[Math.floor(Math.random() * remarks.length)];
}

function getHeadTeacherRemarks(performanceLevel: string): string {
  const remarkTemplates = {
    excellent: [
      'Continue to excel and be an inspiration to others. Success in KCSE is within reach.',
      'Outstanding performance! Maintain this level of excellence throughout your education.',
      'Excellent work! Keep focusing on your goals and success will follow.'
    ],
    good: [
      'Good performance. Push harder to achieve excellence in all subjects.',
      'Well done! With consistent effort, you can achieve even better results.',
      'Keep up the good work. Strive for excellence in all your endeavors.'
    ],
    average: [
      'Work harder and be more disciplined in your studies. Success requires dedication.',
      'Average performance requires improvement. Seek guidance from your teachers.',
      'You have the potential to do better. Apply yourself more diligently to your studies.'
    ],
    poor: [
      'Immediate improvement is needed. Seek extra help and commit to your studies.',
      'Poor performance is concerning. Parents and teachers must work together to help you.',
      'Serious effort is required to improve. Do not give up - seek help and work harder.'
    ]
  };
  
  const remarks = remarkTemplates[performanceLevel as keyof typeof remarkTemplates];
  return remarks[Math.floor(Math.random() * remarks.length)];
}

export function generateReportCard(admissionNumber: string): ReportCardData | null {
  const student = studentsData.find(s => s.admissionNumber === admissionNumber);
  if (!student) return null;
  
  const performanceLevel = getStudentPerformanceLevel(student.name);
  const subjects = generateSubjectGrades(student.class, performanceLevel);
  
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.totalScore, 0);
  const averageScore = Math.round(totalMarks / subjects.length * 100) / 100;
  const overallGradeInfo = getGradeInfo(averageScore);
  
  // Generate position based on performance
  const positionRange = {
    excellent: { min: 1, max: 5 },
    good: { min: 6, max: 15 },
    average: { min: 16, max: 25 },
    poor: { min: 26, max: 35 }
  };
  
  const range = positionRange[performanceLevel];
  const position = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  // Generate attendance based on performance
  const attendanceBase = performanceLevel === 'excellent' ? 95 : 
                        performanceLevel === 'good' ? 90 : 
                        performanceLevel === 'average' ? 85 : 80;
  
  const attendancePercentage = attendanceBase + Math.floor(Math.random() * 8) - 4;
  const totalDays = 63; // Typical term days
  const daysPresent = Math.floor(totalDays * attendancePercentage / 100);
  const daysAbsent = totalDays - daysPresent;
  
  return {
    student: {
      name: student.name,
      admissionNumber: student.admissionNumber,
      class: student.class,
      streamName: student.class.includes('A') ? 'A' : student.class.includes('B') ? 'B' : 'C',
      term: 'Term 1',
      year: '2024',
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      residence: student.residence
    },
    academic: {
      subjects,
      totalMarks,
      averageScore,
      overallGrade: overallGradeInfo.grade,
      position,
      outOf: 35
    },
    attendance: {
      daysPresent,
      daysAbsent,
      totalDays,
      percentage: attendancePercentage
    },
    fees: {
      balance: student.balance,
      status: student.balance === 'KES 0' ? 'Paid' : 'Outstanding'
    },
    nextTerm: {
      opensOn: '2025-01-13',
      feeDue: '2025-01-15'
    },
    classTeacher: {
      name: getClassTeacherName(student.class),
      remarks: getClassTeacherRemarks(performanceLevel, student.name)
    },
    headTeacher: {
      name: 'Mr. James Wachira, B.Ed, M.A',
      remarks: getHeadTeacherRemarks(performanceLevel)
    }
  };
}
