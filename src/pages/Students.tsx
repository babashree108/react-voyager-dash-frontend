import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
import { studentService } from '@/api/services/student.service';

export default function Students() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentService.getStudentList();
        setStudents(data);
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

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      <span>Loading students...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No students found. Click "Add Student" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: any) => (
                  <TableRow key={student.identifier}>
                    <TableCell>
                      {student.firstName} {student.lastName || ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{student.email}</span>
                        <span className="text-sm text-muted-foreground">
                          {student.phoneNo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
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
                            onClick={() => handleAction('edit', student.identifier)}
                          >
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction('delete', student.identifier)}
                            className="text-red-600"
                          >
                            Delete Student
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