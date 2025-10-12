import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { mockAnnouncements } from '@/data/mockData';
import { Plus, AlertCircle, Bell } from 'lucide-react';

export default function Announcements() {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-info/20 text-info';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Announcements
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
          </div>
          {(user.role === 'teacher' || user.role === 'orgadmin') && (
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {mockAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    announcement.priority === 'high' ? 'bg-destructive/10' :
                    announcement.priority === 'medium' ? 'bg-warning/10' :
                    'bg-info/10'
                  }`}>
                    <AlertCircle className={`w-6 h-6 ${
                      announcement.priority === 'high' ? 'text-destructive' :
                      announcement.priority === 'medium' ? 'text-warning' :
                      'text-info'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority} priority
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{announcement.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Posted by {announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
