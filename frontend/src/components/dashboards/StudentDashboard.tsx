import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stat, ClassSession } from '@/types';
import { getStudentStats, mockClasses } from '@/data/mockData';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardProps {
  userName: string;
}

export default function StudentDashboard({ userName }: StudentDashboardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const statsData = await getStudentStats();
      setStats(statsData);
    };
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-success text-success-foreground';
      case 'upcoming': return 'bg-info text-info-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
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

      {/* Classes/Sessions and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockClasses.map((classSession) => (
              <div 
                key={classSession.id}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{classSession.title}</h4>
                    <p className="text-sm text-muted-foreground">{classSession.teacher}</p>
                  </div>
                  <Badge className={getStatusColor(classSession.status)}>
                    {classSession.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{classSession.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{classSession.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{classSession.participants}</span>
                  </div>
                </div>
                {classSession.status === 'live' && (
                  <Button className="w-full mt-3 gradient-primary text-white" size="sm">
                    Join Now
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/classroom')}>
              <Video className="w-4 h-4 mr-2" />
              Join Class
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/assignments')}>
              <Calendar className="w-4 h-4 mr-2" />
              View Assignments
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/notebook')}>
              <Users className="w-4 h-4 mr-2" />
              Open Notebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}