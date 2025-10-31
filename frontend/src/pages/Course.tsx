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
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { courseService } from '@/api/services/course.service';
import { useToast } from '@/hooks/use-toast';

export default function Course() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.list();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleAction = async (action: string, courseId: number) => {
    switch (action) {
      case 'edit':
        navigate(`/course/edit/${courseId}`);
        break;
      case 'delete':
        try {
          await courseService.delete(courseId);
          toast({ title: 'Success', description: 'Course deleted successfully' });
          setCourses(prev => prev.filter(c => c.identifier !== courseId));
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' });
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
            <h1 className="text-3xl font-bold mb-2">Courses</h1>
            <p className="text-muted-foreground">Manage your course records and information</p>
          </div>
          <Button onClick={() => navigate('/course/add')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Course
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      <span>Loading courses...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No courses found. Click "Add Course" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course: any) => (
                  <TableRow key={course.identifier}>
                    <TableCell>{course.course}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('edit', course.identifier)}>
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('delete', course.identifier)} className="text-red-600">
                            Delete Course
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
