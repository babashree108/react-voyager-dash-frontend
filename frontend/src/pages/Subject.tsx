import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/DashboardLayout";
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
import { subjectService } from '@/api/services/subejct.service';
import { useToast } from '@/hooks/use-toast';

export default function Subject() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await subjectService.list();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Failed to load subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleAction = async (action: string, subjectId: number) => {
    switch (action) {
      case 'edit':
        navigate(`/subject/edit/${subjectId}`);
        break;
      case 'delete':
        try {
          await subjectService.delete(subjectId);
          toast({
            title: "Success",
            description: "Subject deleted successfully",
          });
          // ✅ Update local state to reflect deletion
          const updatedSubjects = subjects.filter((t: any) => t.identifier !== subjectId);
          setSubjects(updatedSubjects);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete subject",
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
            <h1 className="text-3xl font-bold mb-2">Subjects</h1>
            <p className="text-muted-foreground">
              Manage your subject records and information
            </p>
          </div>
          <Button 
            onClick={() => navigate('/subject/add')} 
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      <span>Loading subjects...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No subjects found. Click "Add Subject" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((subject: any) => (
                  <TableRow key={subject.identifier}>
                    <TableCell>{subject.subject}</TableCell>
                    <TableCell className="text-center">
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
                            onClick={() => handleAction('edit', subject.identifier)}
                          >
                            Edit Subject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction('delete', subject.identifier)}
                            className="text-red-600"
                          >
                            Delete Subject
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
