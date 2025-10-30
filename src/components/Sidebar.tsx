import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { navigationConfig, NavSection } from '@/config/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
}

export default function Sidebar({ userRole, userName }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navSections = navigationConfig[userRole] || [];
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="w-[260px] bg-[#1f2937] flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${initials}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">{userName}</p>
            <p className="text-[#9ca3af] text-sm capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto pt-6">
        {navSections.map((section: NavSection, idx: number) => (
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

      {/* Logout Section */}
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
  );
}