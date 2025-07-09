export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  className: string;
  studentAttendance: StudentAttendance[];
  teacherAttendance: TeacherAttendance[];
  markedBy: string; // Teacher employee ID who marked attendance
  markedAt: string; // timestamp
}

export interface StudentAttendance {
  admissionNumber: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'sick' | 'excused';
  timeIn?: string; // for late arrivals
  reason?: string; // for absences
}

export interface TeacherAttendance {
  employeeId: string;
  teacherName: string;
  status: 'present' | 'absent' | 'late' | 'sick' | 'leave';
  timeIn?: string;
  timeOut?: string;
  reason?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}

// Sample attendance data for the current week
export const attendanceData: AttendanceRecord[] = [
  {
    id: 'ATT_2025_01_06_1A',
    date: '2025-01-06',
    className: 'Form 1A',
    studentAttendance: [
      { admissionNumber: 'NA2024001', studentName: 'John Kamau', status: 'present' },
      { admissionNumber: 'NA2024005', studentName: 'David Kiprotich', status: 'present' },
      { admissionNumber: 'NA2024010', studentName: 'Faith Wambui', status: 'late', timeIn: '08:15' },
      { admissionNumber: 'NA2024012', studentName: 'Mercy Njeri', status: 'absent', reason: 'Sick' },
    ],
    teacherAttendance: [
      { employeeId: 'EMP001', teacherName: 'Mrs. Sarah Muthoni', status: 'present', timeIn: '07:30' },
      { employeeId: 'EMP009', teacherName: 'Ms. Catherine Njeri', status: 'present', timeIn: '07:45' },
    ],
    markedBy: 'EMP001',
    markedAt: '2025-01-06T08:00:00Z',
  },
  {
    id: 'ATT_2025_01_06_2A',
    date: '2025-01-06',
    className: 'Form 2A',
    studentAttendance: [
      { admissionNumber: 'NA2024004', studentName: 'Grace Mwangi', status: 'present' },
      { admissionNumber: 'NA2024013', studentName: 'Brian Mwenda', status: 'present' },
    ],
    teacherAttendance: [
      { employeeId: 'EMP004', teacherName: 'Mrs. Mary Wanjiku', status: 'present', timeIn: '07:35' },
      { employeeId: 'EMP001', teacherName: 'Mrs. Sarah Muthoni', status: 'present', timeIn: '07:30' },
    ],
    markedBy: 'EMP004',
    markedAt: '2025-01-06T08:05:00Z',
  },
  {
    id: 'ATT_2025_01_06_3A',
    date: '2025-01-06',
    className: 'Form 3A',
    studentAttendance: [
      { admissionNumber: 'NA2024007', studentName: 'Samuel Mutua', status: 'present' },
    ],
    teacherAttendance: [
      { employeeId: 'EMP007', teacherName: 'Mr. Francis Mutua', status: 'present', timeIn: '07:40' },
      { employeeId: 'EMP004', teacherName: 'Mrs. Mary Wanjiku', status: 'present', timeIn: '07:35' },
    ],
    markedBy: 'EMP007',
    markedAt: '2025-01-06T08:10:00Z',
  },
];

// Helper functions for attendance management
export const getAttendanceByDate = (date: string): AttendanceRecord[] => {
  return attendanceData.filter(record => record.date === date);
};

export const getAttendanceByClass = (className: string, date?: string): AttendanceRecord[] => {
  let filtered = attendanceData.filter(record => record.className === className);
  if (date) {
    filtered = filtered.filter(record => record.date === date);
  }
  return filtered;
};

export const getStudentAttendanceStats = (admissionNumber: string, days: number = 30): AttendanceStats => {
  // Get attendance records for the last 'days' days
  const today = new Date();
  const startDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
  
  const relevantRecords = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= today;
  });

  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let totalDays = 0;

  relevantRecords.forEach(record => {
    const studentRecord = record.studentAttendance.find(
      att => att.admissionNumber === admissionNumber
    );
    if (studentRecord) {
      totalDays++;
      switch (studentRecord.status) {
        case 'present':
          presentDays++;
          break;
        case 'late':
          lateDays++;
          presentDays++; // Late is still considered present
          break;
        case 'absent':
        case 'sick':
          absentDays++;
          break;
        case 'excused':
          // Excused absences don't count against attendance
          break;
      }
    }
  });

  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    attendancePercentage,
  };
};

export const getTeacherAttendanceStats = (employeeId: string, days: number = 30): AttendanceStats => {
  const today = new Date();
  const startDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
  
  const relevantRecords = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= today;
  });

  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let totalDays = 0;

  relevantRecords.forEach(record => {
    const teacherRecord = record.teacherAttendance.find(
      att => att.employeeId === employeeId
    );
    if (teacherRecord) {
      totalDays++;
      switch (teacherRecord.status) {
        case 'present':
          presentDays++;
          break;
        case 'late':
          lateDays++;
          presentDays++;
          break;
        case 'absent':
        case 'sick':
          absentDays++;
          break;
        case 'leave':
          // Approved leave doesn't count against attendance
          break;
      }
    }
  });

  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    attendancePercentage,
  };
};

export const getTodayAttendanceSummary = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = getAttendanceByDate(today);
  
  let totalStudents = 0;
  let presentStudents = 0;
  let absentStudents = 0;
  let lateStudents = 0;
  
  let totalTeachers = 0;
  let presentTeachers = 0;
  let absentTeachers = 0;

  todayRecords.forEach(record => {
    record.studentAttendance.forEach(att => {
      totalStudents++;
      switch (att.status) {
        case 'present':
          presentStudents++;
          break;
        case 'late':
          lateStudents++;
          presentStudents++;
          break;
        case 'absent':
        case 'sick':
          absentStudents++;
          break;
      }
    });

    record.teacherAttendance.forEach(att => {
      totalTeachers++;
      if (att.status === 'present' || att.status === 'late') {
        presentTeachers++;
      } else {
        absentTeachers++;
      }
    });
  });

  return {
    students: {
      total: totalStudents,
      present: presentStudents,
      absent: absentStudents,
      late: lateStudents,
      percentage: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0,
    },
    teachers: {
      total: totalTeachers,
      present: presentTeachers,
      absent: absentTeachers,
      percentage: totalTeachers > 0 ? Math.round((presentTeachers / totalTeachers) * 100) : 0,
    },
  };
};

// Function to mark attendance for a class
export const markAttendance = (
  date: string,
  className: string,
  studentAttendance: StudentAttendance[],
  teacherAttendance: TeacherAttendance[],
  markedBy: string
): AttendanceRecord => {
  const newRecord: AttendanceRecord = {
    id: `ATT_${date.replace(/-/g, '_')}_${className.replace(' ', '')}`,
    date,
    className,
    studentAttendance,
    teacherAttendance,
    markedBy,
    markedAt: new Date().toISOString(),
  };

  // In a real app, this would save to database
  attendanceData.push(newRecord);
  
  return newRecord;
};
