import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { teacherService } from '@/api/services/teacher.service';
import { useToast } from '@/hooks/use-toast';

// (List view uses simple initial avatar; removed card avatars)

export default function Teachers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teacherService.getTeacherList() as any[];
        // Normalize name fields (fname/fName) from backend variations
        const normalized = (data || []).map((t: any) => ({
          ...t,
          fName: t.fName ?? t.fname ?? t.firstName ?? t.first_name ?? '',
          lName: t.lName ?? t.lname ?? t.lastName ?? t.last_name ?? ''
        }));
        setTeachers(normalized);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Failed to load teachers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleAction = async (action: string, teacherId: number) => {
    switch (action) {
      case 'edit':
        navigate(`/teachers/edit/${teacherId}`);
        break;
      case 'delete':
        try {
          await teacherService.deleteTeacher(teacherId);
          toast({
            title: "Success",
            description: "Teacher deleted successfully",
          });
          // Refresh the list
          const updatedTeachers = teachers.filter((t: any) => t.identifier !== teacherId);
          setTeachers(updatedTeachers);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete teacher",
            variant: "destructive",
          });
        }
        break;
      default:
        break;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-[hsl(var(--teacher-badge))] text-[hsl(var(--teacher-badge-foreground))]';
      default: return '';
    }
  };

  const filtered = teachers.filter((t) => {
    const name = `${t.fName ?? ''} ${t.lName ?? ''}`.trim().toLowerCase();
    const email = (t.email ?? '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teachers</h1>
            <p className="text-muted-foreground">
              Manage your teacher records and information
            </p>
          </div>
          <Button 
            onClick={() => navigate('/teachers/add')} 
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Teachers ({loading ? '...' : filtered.length})</CardTitle>
              <div className="relative w-64">
                <Input 
                  placeholder="Search teachers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No teachers found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((teacher: any) => (
                      <tr key={teacher.identifier} className="border-b border-border hover:bg-muted/50 transition-smooth">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                              {(teacher.fName || 'T').charAt(0)}
                            </div>
                            <span className="font-medium">{(teacher.fName || '') + ' ' + (teacher.lName || '')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{teacher.email || '-'}</td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeClass('teacher')}>Teacher</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={'bg-success/20 text-success'}>active</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction('edit', teacher.identifier)}>Edit Teacher</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('delete', teacher.identifier)} className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
