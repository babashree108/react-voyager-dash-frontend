import { User, ClassSession, Assignment, Announcement, Stat } from '@/types';
import { DataService } from '@/api/services/data.service';

const dataService = DataService.getInstance();

// Function to fetch data with fallback to mock data
const fetchWithFallback = async <T>(
  fetchFn: () => Promise<T>,
  mockData: T
): Promise<T> => {
  try {
    const data = await fetchFn();
    return data;
  } catch (error) {
    console.warn('Falling back to mock data:', error);
    return mockData;
  }
};

// Mock data (will be used as fallback)
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@school.com',
    role: 'orgadmin',
    status: 'active',
    organization: 'Sunrise Academy'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@school.com',
    role: 'teacher',
    status: 'active',
    organization: 'Sunrise Academy'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@school.com',
    role: 'teacher',
    status: 'active',
    organization: 'Sunrise Academy'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@students.school.com',
    role: 'student',
    status: 'active',
    organization: 'Sunrise Academy'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@students.school.com',
    role: 'student',
    status: 'active',
    organization: 'Sunrise Academy'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.a@students.school.com',
    role: 'student',
    status: 'inactive',
    organization: 'Sunrise Academy'
  }
];

export const mockClasses: ClassSession[] = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    teacher: 'Sarah Johnson',
    subject: 'Mathematics',
    date: '2025-10-15',
    time: '10:00 AM',
    duration: 60,
    participants: 24,
    status: 'live'
  },
  {
    id: '2',
    title: 'Introduction to Physics',
    teacher: 'Michael Chen',
    subject: 'Physics',
    date: '2025-10-15',
    time: '2:00 PM',
    duration: 90,
    participants: 18,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'World History',
    teacher: 'Sarah Johnson',
    subject: 'History',
    date: '2025-10-14',
    time: '11:00 AM',
    duration: 60,
    participants: 22,
    status: 'completed'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Calculus Problem Set',
    subject: 'Mathematics',
    dueDate: '2025-10-20',
    status: 'pending',
    totalPoints: 100
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    subject: 'Physics',
    dueDate: '2025-10-18',
    status: 'submitted',
    totalPoints: 50
  },
  {
    id: '3',
    title: 'History Essay',
    subject: 'History',
    dueDate: '2025-10-10',
    status: 'graded',
    grade: 92,
    totalPoints: 100
  },
  {
    id: '4',
    title: 'Chemistry Worksheet',
    subject: 'Chemistry',
    dueDate: '2025-10-22',
    status: 'pending',
    totalPoints: 75
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'School Closed Next Monday',
    content: 'The school will be closed next Monday for staff development day.',
    author: 'John Admin',
    date: '2025-10-12',
    priority: 'high'
  },
  {
    id: '2',
    title: 'New Digital Notebook Feature',
    content: 'We have integrated Huion Note X10 support for enhanced digital note-taking.',
    author: 'Sarah Johnson',
    date: '2025-10-11',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Parent-Teacher Conferences',
    content: 'Parent-teacher conferences will be held from October 25-27.',
    author: 'John Admin',
    date: '2025-10-10',
    priority: 'medium'
  }
];

export const orgAdminStats: Stat[] = [
  { label: 'Total Users', value: 245, change: '+12%', trend: 'up' },
  { label: 'Active Classes', value: 32, change: '+5%', trend: 'up' },
  { label: 'Teachers', value: 18, change: '+2', trend: 'up' },
  { label: 'Students', value: 227, change: '+10%', trend: 'up' }
];

export const teacherStats: Stat[] = [
  { label: 'My Classes', value: 5, change: '+1', trend: 'up' },
  { label: 'Total Students', value: 124, change: '+8%', trend: 'up' },
  { label: 'Assignments', value: 12, change: '3 due', trend: 'up' },
  { label: 'Avg. Attendance', value: '92%', change: '+3%', trend: 'up' }
];

export const studentStats: Stat[] = [
  { label: 'Enrolled Classes', value: 6, change: 'On track', trend: 'up' },
  { label: 'Assignments Due', value: 3, change: 'This week', trend: 'up' },
  { label: 'Overall Grade', value: 'A-', change: '+2%', trend: 'up' },
  { label: 'Attendance', value: '95%', change: 'Excellent', trend: 'up' }
];

// Data fetching functions with mock fallback
export const getUsers = () => fetchWithFallback(
  () => dataService.getAll<User>('users'),
  mockUsers
);

export const getClasses = () => fetchWithFallback(
  () => dataService.getAll<ClassSession>('classes'),
  mockClasses
);

export const getAssignments = () => fetchWithFallback(
  () => dataService.getAll<Assignment>('assignments'),
  mockAssignments
);

export const getAnnouncements = () => fetchWithFallback(
  () => dataService.getAll<Announcement>('announcements'),
  mockAnnouncements
);

export const getOrgAdminStats = () => fetchWithFallback(
  () => dataService.queryStats<Stat>('orgadmin'),
  orgAdminStats
);

export const getTeacherStats = async () => {
  const studentCount = await getStudentCount();
  const updatedTeacherStats = [...teacherStats];
  const studentStatIndex = updatedTeacherStats.findIndex(stat => stat.label === 'Total Students');
  if (studentStatIndex !== -1) {
    updatedTeacherStats[studentStatIndex] = {
      ...updatedTeacherStats[studentStatIndex],
      value: studentCount
    };
  }
  return fetchWithFallback(
    () => dataService.queryStats<Stat>('teacher'),
    updatedTeacherStats
  );
};

export const getStudentStats = () => fetchWithFallback(
  () => dataService.queryStats<Stat>('student'),
  studentStats
);

// Function to get student count from the backend
export const getStudentCount = () => fetchWithFallback(
  async () => {
    const response = await dataService.getById<number>('student-details', 'count');
    return response;
  },
  mockUsers.filter(user => user.role === 'student').length
);

// In mockData.ts

export const getStatsForRole = async (role: string) => {
  switch (role) {
    case 'orgadmin':
      return getOrgAdminStats();
    case 'teacher': {
      const stats = await getTeacherStats();
      return stats;
    }
    case 'student':
      return getStudentStats();
    default:
      return [];
  }
};