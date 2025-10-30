import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import { User } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case 'orgadmin':
        return <AdminDashboard userName={user.name} />;
      case 'teacher':
        return <TeacherDashboard userName={user.name} />;
      case 'student':
        return <StudentDashboard userName={user.name} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      {renderDashboard()}
    </DashboardLayout>
  );
}
