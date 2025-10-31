import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, MoreVertical, Search, Mail, Phone, MapPin } from 'lucide-react';
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

  const filteredTeachers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return teachers;

    return teachers.filter((teacher: any) => {
      const fullName = `${teacher?.fName ?? ''} ${teacher?.lName ?? ''}`.trim().toLowerCase();
      return (
        fullName.includes(query) ||
        (teacher?.email ?? '').toLowerCase().includes(query) ||
        (teacher?.phoneNo ?? '').toLowerCase().includes(query) ||
        (teacher?.state ?? '').toLowerCase().includes(query) ||
        (teacher?.country ?? '').toLowerCase().includes(query)
      );
    });
  }, [teachers, searchTerm]);

  const renderContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span>Loading teachers...</span>
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

    if (teachers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
            No teachers found. Click "Add Teacher" to create one.
          </TableCell>
        </TableRow>
      );
    }

    if (filteredTeachers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
            No teachers match "{searchTerm}". Try a different search term.
          </TableCell>
        </TableRow>
      );
    }

    return filteredTeachers.map((teacher: any) => {
      const initials = `${teacher?.fName?.[0] ?? ''}${teacher?.lName?.[0] ?? ''}`.toUpperCase() || '?';
      const teacherId = teacher?.identifier ?? teacher?.id;

      return (
        <TableRow key={teacherId ?? initials} className="border-b border-border/60 hover:bg-muted/50 transition-smooth">
          <TableCell className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold uppercase text-white">
                {initials}
              </div>
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  {teacher?.fName} {teacher?.lName}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {teacher?.email || 'Not provided'}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-4">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {teacher?.phoneNo || '—'}
              </span>
              {teacher?.adharNo && (
                <Badge variant="outline" className="w-fit text-[11px] uppercase tracking-wide">
                  ID • {teacher.adharNo}
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="py-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {(teacher?.state || teacher?.country) ? `${teacher?.state ?? ''}${teacher?.state && teacher?.country ? ', ' : ''}${teacher?.country ?? ''}` : 'Location unavailable'}
              </span>
              {(teacher?.address1 || teacher?.address2) && (
                <span className="text-xs leading-snug">
                  {[teacher?.address1, teacher?.address2].filter(Boolean).join(', ')}{teacher?.pincode ? ` • ${teacher.pincode}` : ''}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell className="py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Manage teacher">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => teacherId && handleAction('edit', teacherId)}>
                  Edit Teacher
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => teacherId && handleAction('delete', teacherId)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Teacher
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
            <h1 className="mb-2 text-3xl font-bold">Teachers</h1>
            <p className="text-muted-foreground">
              Manage your teacher records and information
            </p>
          </div>
          <Button onClick={() => navigate('/teachers/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search teachers..."
                  className="pl-10"
                  aria-label="Search teachers"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/60">
                  <TableHead className="text-sm font-semibold text-muted-foreground">Teacher</TableHead>
                  <TableHead className="text-sm font-semibold text-muted-foreground">Contact</TableHead>
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