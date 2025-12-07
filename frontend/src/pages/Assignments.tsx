import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Assignment } from '@/types';
import { Plus, Calendar, Clock, Award } from 'lucide-react';

export default function Assignments() {
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

  // Placeholder assignments - replace with actual API calls later
  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Mathematics Quiz',
      subject: 'Mathematics',
      dueDate: '2025-12-15',
      status: 'pending',
      totalPoints: 100,
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2025-12-20',
      status: 'submitted',
      totalPoints: 50,
    },
    {
      id: '3',
      title: 'English Essay',
      subject: 'English',
      dueDate: '2025-12-10',
      status: 'graded',
      grade: 85,
      totalPoints: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning';
      case 'submitted': return 'bg-info/20 text-info';
      case 'graded': return 'bg-success/20 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assignments</h1>
            <p className="text-muted-foreground">
              {user.role === 'teacher' ? 'Manage and grade assignments' : 'View and submit your assignments'}
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {mockAssignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{assignment.subject}</p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span>
                          {assignment.status === 'graded' 
                            ? `${assignment.grade}/${assignment.totalPoints}` 
                            : `${assignment.totalPoints} points`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {user.role === 'student' && assignment.status === 'pending' && (
                      <Button className="gradient-primary text-white">
                        Submit Assignment
                      </Button>
                    )}
                    {user.role === 'student' && assignment.status === 'submitted' && (
                      <Button variant="outline" disabled>
                        Submitted
                      </Button>
                    )}
                    {user.role === 'student' && assignment.status === 'graded' && (
                      <Button variant="outline">
                        View Feedback
                      </Button>
                    )}
                    {user.role === 'teacher' && (
                      <>
                        <Button variant="outline">View Details</Button>
                        <Button className="gradient-primary text-white">
                          Grade
                        </Button>
                      </>
                    )}
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
