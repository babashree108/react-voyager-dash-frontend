import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Stat } from '@/types';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role === 'student') {
      navigate('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  if (!user) return null;

  // Placeholder stats - replace with actual API calls later
  const orgAdminStats: Stat[] = [
    { label: 'Total Students', value: '1,234', change: '+56', trend: 'up' },
    { label: 'Total Teachers', value: '89', change: '+4', trend: 'up' },
    { label: 'Active Classes', value: '45', change: '+2', trend: 'up' },
    { label: 'Attendance Rate', value: '93%', change: '+1%', trend: 'up' },
  ];

  const teacherStats: Stat[] = [
    { label: 'Total Classes', value: '12', change: '+3', trend: 'up' },
    { label: 'Total Students', value: '240', change: '+15', trend: 'up' },
    { label: 'Assignments', value: '8', change: '2 pending', trend: 'down' },
    { label: 'Avg. Grade', value: '87%', change: '+3%', trend: 'up' },
  ];

  const stats = user.role === 'orgadmin' ? orgAdminStats : teacherStats;

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your {user.role === 'orgadmin' ? 'organization' : 'teaching'} performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Timeline visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
