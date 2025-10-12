export type UserRole = 'orgadmin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar?: string;
  organization?: string;
}

export interface ClassSession {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  participants: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  totalPoints: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
}
