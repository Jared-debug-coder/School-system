import { teachersData } from './teachersData';

export interface TimetableSlot {
  time: string;
  period: string;
  day: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  className: string;
  room: string;
  isBreak?: boolean;
}

// School periods structure
export const schoolPeriods = [
  { time: '7:30 - 8:00', period: 'Assembly', isBreak: true },
  { time: '8:00 - 8:40', period: '1st' },
  { time: '8:40 - 9:20', period: '2nd' },
  { time: '9:20 - 10:00', period: '3rd' },
  { time: '10:00 - 10:20', period: 'Break', isBreak: true },
  { time: '10:20 - 11:00', period: '4th' },
  { time: '11:00 - 11:40', period: '5th' },
  { time: '11:40 - 12:20', period: '6th' },
  { time: '12:20 - 1:00', period: 'Lunch', isBreak: true },
  { time: '1:00 - 1:40', period: '7th' },
  { time: '1:40 - 2:20', period: '8th' },
  { time: '2:20 - 3:00', period: '9th' },
];

// Generate weekly timetable for all teachers
export const generateWeeklyTimetable = (): TimetableSlot[] => {
  const timetable: TimetableSlot[] = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const rooms = [
    'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5',
    'Science Lab 1', 'Science Lab 2', 'Computer Lab', 'Library', 'Room 6',
    'Room 7', 'Room 8', 'Room 9', 'Room 10', 'Hall A'
  ];

  days.forEach(day => {
    schoolPeriods.forEach(period => {
      if (period.isBreak) {
        timetable.push({
          time: period.time,
          period: period.period,
          day,
          teacherId: '',
          teacherName: '',
          subject: period.period,
          className: '',
          room: '',
          isBreak: true
        });
      } else {
        // Assign classes to teachers based on their assignments
        teachersData.forEach(teacher => {
          teacher.assignedClasses.forEach(className => {
            teacher.subjects.forEach(subject => {
              // Create some realistic distribution (not every teacher every period)
              const shouldAssign = Math.random() > 0.7; // 30% chance per slot
              
              if (shouldAssign) {
                timetable.push({
                  time: period.time,
                  period: period.period,
                  day,
                  teacherId: teacher.employeeId,
                  teacherName: teacher.name,
                  subject,
                  className,
                  room: rooms[Math.floor(Math.random() * rooms.length)],
                  isBreak: false
                });
              }
            });
          });
        });
      }
    });
  });

  return timetable;
};

// Get today's timetable for a specific teacher
export const getTodayTimetableForTeacher = (employeeId: string): TimetableSlot[] => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const weeklyTimetable = generateWeeklyTimetable();
  
  return schoolPeriods.map(period => {
    if (period.isBreak) {
      return {
        time: period.time,
        period: period.period,
        day: today,
        teacherId: '',
        teacherName: '',
        subject: period.period,
        className: '',
        room: '',
        isBreak: true
      };
    }

    // Find assigned slot for this teacher and period
    const teacherSlot = weeklyTimetable.find(slot => 
      slot.teacherId === employeeId && 
      slot.period === period.period && 
      slot.day === today
    );

    if (teacherSlot) {
      return teacherSlot;
    }

    // Return free period if no assignment
    return {
      time: period.time,
      period: period.period,
      day: today,
      teacherId: employeeId,
      teacherName: '',
      subject: 'Free Period',
      className: '',
      room: '',
      isBreak: false
    };
  });
};

// Get timetable for a specific class
export const getTimetableForClass = (className: string): TimetableSlot[] => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const weeklyTimetable = generateWeeklyTimetable();
  
  return schoolPeriods.map(period => {
    if (period.isBreak) {
      return {
        time: period.time,
        period: period.period,
        day: today,
        teacherId: '',
        teacherName: '',
        subject: period.period,
        className,
        room: '',
        isBreak: true
      };
    }

    // Find assigned slot for this class and period
    const classSlot = weeklyTimetable.find(slot => 
      slot.className === className && 
      slot.period === period.period && 
      slot.day === today
    );

    return classSlot || {
      time: period.time,
      period: period.period,
      day: today,
      teacherId: '',
      teacherName: 'No Teacher Assigned',
      subject: 'Free Period',
      className,
      room: '',
      isBreak: false
    };
  });
};
