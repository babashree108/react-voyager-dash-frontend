import {
  Home,
  Users,
  TrendingUp,
  Video,
  FileText,
  Bell,
  BookOpen,
  Settings,
  HelpCircle,
  Calendar,
  CreditCard,
  Lock,
} from 'lucide-react';
import { UserRole } from '@/types';

export interface NavItem {
  href: string;
  label: string;
  icon: any;
  permission?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: Record<UserRole, NavSection[]> = {
  orgadmin: [
    {
      title: 'OVERVIEW',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/analytics', label: 'Analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { href: '/users', label: 'Users', icon: Users },
        { href: '/students', label: 'Students', icon: Users },
        { href: '/teachers', label: 'Teachers', icon: Users },
        { href: '/classroom', label: 'Classrooms', icon: Video },
        { href: '/assignments', label: 'Scheduling', icon: Calendar },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { href: '/settings/billing', label: 'Billing', icon: CreditCard },
        { href: '/settings/permissions', label: 'Permissions', icon: Lock },
        { href: '/settings/features', label: 'Feature Flags', icon: Settings },
        { href: '/settings/config', label: 'Configuration', icon: Settings },
      ]
    }
  ],
  teacher: [
    {
      title: 'TEACHING',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/classroom', label: 'Virtual Classroom', icon: Video },
        { href: '/assignments', label: 'Assignments', icon: FileText },
        { href: '/announcements', label: 'Announcements', icon: Bell },
        { href: '/notebook', label: 'Digital Notebook', icon: BookOpen },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { href: '/analytics', label: 'Analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/help', label: 'Help & Support', icon: HelpCircle },
      ]
    }
  ],
  student: [
    {
      title: 'MY LEARNING',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/classroom', label: 'My Classes', icon: Video },
        { href: '/assignments', label: 'Assignments', icon: FileText },
        { href: '/announcements', label: 'Announcements', icon: Bell },
        { href: '/notebook', label: 'Digital Notebook', icon: BookOpen },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/help', label: 'Help & Support', icon: HelpCircle },
      ]
    }
  ]
};