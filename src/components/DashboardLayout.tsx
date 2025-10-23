import { ReactNode } from 'react';
import { UserRole } from '@/types';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
}

export default function DashboardLayout({ userRole, userName, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#f9fafb]">
      <Sidebar userRole={userRole} userName={userName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}