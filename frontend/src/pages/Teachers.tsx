import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { teacherService } from '@/api/services/teacher.service';
import { useToast } from '@/hooks/use-toast';

export default function Teachers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teacherService.getTeacherList();
        setTeachers(data);
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

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      <span>Loading teachers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No teachers found. Click "Add Teacher" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher: any) => (
                  <TableRow key={teacher.identifier}>
                    <TableCell>
                      {teacher.firstName} {teacher.lastName || ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{teacher.email}</span>
                        <span className="text-sm text-muted-foreground">
                          {teacher.phoneNo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {teacher.state}, {teacher.country}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction('edit', teacher.identifier)}
                          >
                            Edit Teacher
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction('delete', teacher.identifier)}
                            className="text-red-600"
                          >
                            Delete Teacher
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}