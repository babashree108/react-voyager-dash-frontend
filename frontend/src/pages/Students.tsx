import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, MoreVertical, Search, Mail, Phone, GraduationCap, MapPin } from 'lucide-react';
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

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student: any) => {
      const fullName = `${student?.fName ?? ''} ${student?.lName ?? ''}`.trim().toLowerCase();
      return (
        fullName.includes(query) ||
        (student?.email ?? '').toLowerCase().includes(query) ||
        (student?.phoneNo ?? '').toLowerCase().includes(query) ||
        (student?.grade ?? '').toLowerCase().includes(query) ||
        (student?.lecture ?? '').toLowerCase().includes(query)
      );
    });
  }, [students, searchTerm]);

  const renderContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span>Loading students...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-destructive">
            {error}
          </TableCell>
        </TableRow>
      );
    }

    if (students.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
            No students found. Click "Add Student" to create one.
          </TableCell>
        </TableRow>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
            No students match "{searchTerm}". Try a different search term.
          </TableCell>
        </TableRow>
      );
    }

    return filteredStudents.map((student: any) => {
      const initials = `${student?.fName?.[0] ?? ''}${student?.lName?.[0] ?? ''}`.toUpperCase() || '?';
      const studentId = student?.identifier ?? student?.id;

      return (
        <TableRow key={studentId ?? initials} className="border-b border-border/60 transition-smooth hover:bg-muted/50">
          <TableCell className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold uppercase text-white">
                {initials}
              </div>
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  {student?.fName} {student?.lName}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {student?.email || 'Not provided'}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-4">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {student?.phoneNo || '—'}
              </span>
              {(student?.lecture || student?.grade) && (
                <div className="flex flex-wrap items-center gap-2">
                  {student?.grade && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      Grade {student.grade}
                    </Badge>
                  )}
                  {student?.lecture && (
                    <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
                      {student.lecture}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </TableCell>
          <TableCell className="py-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {(student?.state || student?.country) ? `${student?.state ?? ''}${student?.state && student?.country ? ', ' : ''}${student?.country ?? ''}` : 'Location unavailable'}
              </span>
              {(student?.address1 || student?.address2) && (
                <span className="text-xs leading-snug">
                  {[student?.address1, student?.address2].filter(Boolean).join(', ')}{student?.pincode ? ` • ${student.pincode}` : ''}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell className="py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Manage student">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => studentId && handleAction('edit', studentId)}>
                  Edit Student
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => studentId && handleAction('delete', studentId)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage your student records and information
            </p>
          </div>
          <Button onClick={() => navigate('/students/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Students ({filteredStudents.length})</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search students..."
                  className="pl-10"
                  aria-label="Search students"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/60">
                  <TableHead className="text-sm font-semibold text-muted-foreground">Student</TableHead>
                  <TableHead className="text-sm font-semibold text-muted-foreground">Details</TableHead>
                  <TableHead className="text-sm font-semibold text-muted-foreground">Location</TableHead>
                  <TableHead className="w-[80px] text-sm font-semibold text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderContent()}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}