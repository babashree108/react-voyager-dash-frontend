import { useState } from 'react';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stat } from '@/types';
import { Users, Calendar, GraduationCap, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
interface AdminDashboardProps {
  userName: string;
}

export default function AdminDashboard({ userName }: AdminDashboardProps) {
  const navigate = useNavigate();
  
  // Placeholder stats - replace with actual API calls later
  const [stats] = useState<Stat[]>([
    { label: 'Total Students', value: '1,234', change: '+56 this month', trend: 'up' },
    { label: 'Total Teachers', value: '89', change: '+4', trend: 'up' },
    { label: 'Active Classes', value: '45', change: '+2', trend: 'up' },
    { label: 'Attendance Rate', value: '93%', change: '+1%', trend: 'up' },
  ]);
 
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/users')}>
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/analytics')}>
            <Calendar className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}