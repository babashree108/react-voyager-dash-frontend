import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, TrendingUp, Video, FileText, Bell, BookOpen, Settings, HelpCircle, LogOut, Calendar, CreditCard, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const getNavItems = (role: UserRole): NavSection[] => {
  switch (role) {
    case 'orgadmin':
      return [
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
            { href: '/classroom', label: 'Classrooms', icon: Video },
            { href: '/assignments', label: 'Scheduling', icon: Calendar },
          ]
        },
        {
          title: 'SETTINGS',
          items: [
            { href: '/settings', label: 'Billing', icon: CreditCard },
            { href: '/settings', label: 'Permissions', icon: Lock },
            { href: '/settings', label: 'Feature Flags', icon: Settings },
            { href: '/settings', label: 'Configuration', icon: Settings },
          ]
        }
      ];
    case 'teacher':
      return [
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
      ];
    case 'student':
      return [
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
      ];
    default:
      return [];
  }
};

export default function DashboardLayout({ userRole, userName, children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navSections = getNavItems(userRole);

  return (
    <div className="min-h-screen flex bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#1f2937] flex flex-col">
        <div className="pt-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="px-6 pb-3">
                <h3 className="text-[11px] font-semibold uppercase text-[#9ca3af] tracking-[0.5px]">
                  {section.title}
                </h3>
              </div>
              <div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 transition-smooth text-[14px]",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/90 hover:bg-white/10"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto p-4 border-t border-[#374151]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white/80 hover:bg-white/10 transition-smooth text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}