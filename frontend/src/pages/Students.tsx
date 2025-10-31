import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
import { studentService } from '@/api/services/student.service';

// (List view uses simple initial avatar; removed card avatars)

export default function Students() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
  const data = await studentService.getStudentList() as any[];
        // Normalize possible backend JSON key variants (fname/fName) to fName/lName
        const normalized = (data || []).map((s: any) => ({
          ...s,
          fName: s.fName ?? s.fname ?? s.firstName ?? s.first_name ?? '',
          lName: s.lName ?? s.lname ?? s.lastName ?? s.last_name ?? ''
        }));
        setStudents(normalized);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const { toast } = useToast();

  const handleAction = async (action: string, studentId: number) => {
    switch (action) {
      case 'edit':
        navigate(`/students/edit/${studentId}`);
        break;
      case 'delete':
        try {
          await studentService.deleteStudent(studentId);
          toast({
            title: "Success",
            description: "Student deleted successfully",
          });
          // Refresh the list
          const updatedStudents = students.filter((s: any) => s.identifier !== studentId);
          setStudents(updatedStudents);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete student",
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
      case 'student': return 'bg-[hsl(var(--student-badge))] text-[hsl(var(--student-badge-foreground))]';
      default: return '';
    }
  };

  const filtered = students.filter((s) => {
    const name = `${s.fName ?? ''} ${s.lName ?? ''}`.trim().toLowerCase();
    const email = (s.email ?? '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Students</h1>
            <p className="text-muted-foreground">
              Manage your student records and information
            </p>
          </div>
          <Button 
            onClick={() => navigate('/students/add')} 
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Students ({loading ? '...' : filtered.length})</CardTitle>
              <div className="relative w-64">
                <Input 
                  placeholder="Search students..."
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
              <div className="text-center py-12 text-muted-foreground">No students found.</div>
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
                    {filtered.map((student: any) => (
                      <tr key={student.identifier} className="border-b border-border hover:bg-muted/50 transition-smooth">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                              {(student.fName || 'S').charAt(0)}
                            </div>
                            <span className="font-medium">{(student.fName || '') + ' ' + (student.lName || '')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{student.email || '-'}</td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeClass('student')}>Student</Badge>
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
                              <DropdownMenuItem onClick={() => handleAction('edit', student.identifier)}>Edit Student</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('delete', student.identifier)} className="text-red-600">Delete</DropdownMenuItem>
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
