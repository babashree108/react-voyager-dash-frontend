import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Video, FileText, Bell, BookOpen, 
  BarChart3, Settings, HelpCircle, LogOut, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
}

const getNavigationItems = (role: UserRole) => {
  const commonItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  if (role === 'orgadmin') {
    return [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'User Management', path: '/users' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      ...commonItems.slice(1),
    ];
  }

  if (role === 'teacher') {
    return [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Video, label: 'Virtual Classroom', path: '/classroom' },
      { icon: FileText, label: 'Assignments', path: '/assignments' },
      { icon: BookOpen, label: 'Digital Notebook', path: '/notebook' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      ...commonItems.slice(1),
    ];
  }

  // student
  return [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Video, label: 'My Classes', path: '/classroom' },
    { icon: FileText, label: 'Assignments', path: '/assignments' },
    { icon: BookOpen, label: 'Digital Notebook', path: '/notebook' },
    ...commonItems.slice(1),
  ];
};

const getRoleBadgeStyles = (role: UserRole) => {
  switch (role) {
    case 'orgadmin':
      return 'bg-[hsl(var(--admin-badge))] text-[hsl(var(--admin-badge-foreground))]';
    case 'teacher':
      return 'bg-[hsl(var(--teacher-badge))] text-[hsl(var(--teacher-badge-foreground))]';
    case 'student':
      return 'bg-[hsl(var(--student-badge))] text-[hsl(var(--student-badge-foreground))]';
  }
};

export default function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationItems = getNavigationItems(userRole);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-xl font-bold text-sidebar-foreground">EduPlatform</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
              <span className={cn('text-xs px-2 py-0.5 rounded-full inline-block mt-1', getRoleBadgeStyles(userRole))}>
                {userRole === 'orgadmin' ? 'Admin' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sm',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-muted overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
