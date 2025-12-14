import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { studentService } from '@/api/services/student.service';
import { gradeService, GradeDetails, SectionDetails } from '@/api/services/grade.service';

export default function StudentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // Get the student ID from URL if editing
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  interface StudentFormData {
    identifier: number | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    gradeIdentifier?: number | null;
    sectionIdentifier?: number | null;
    lecture: string;
    address1: string;
    address2?: string;
    pincode: string;
    state: string;
    country: string;
    adharNo: string;
  }

  const [formData, setFormData] = useState<StudentFormData>({
    identifier: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    gradeIdentifier: null,
    sectionIdentifier: null,
    lecture: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    country: '',
    adharNo: ''
  });

  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [sections, setSections] = useState<SectionDetails[]>([]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!isEditing) return;
      
      try {
        setLoading(true);
        const data = await studentService.getStudentDetails(parseInt(id));
        setFormData({
          ...data,
          identifier: data.identifier || null,
          gradeIdentifier: (data as any).gradeIdentifier ?? null,
          sectionIdentifier: (data as any).sectionIdentifier ?? null
        });
        // if gradeIdentifier present, preload sections
        const cid = (data as any).gradeIdentifier;
        if (cid) {
          try {
            const all = await gradeService.list();
            setGrades(all || []);
            const sel = all.find(c => c.identifier === cid);
            setSections(sel?.sections || []);
          } catch (e) {
            console.warn('Failed to preload grades for student', e);
          }
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        toast({
          title: "Error",
          description: "Failed to load student details. Please try again.",
          variant: "destructive",
        });
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    // always load grade list for selects
    const loadGrades = async () => {
      try {
        const all = await gradeService.list();
        setGrades(all || []);
      } catch (e) {
        console.error('Failed to load grades', e);
      }
    };

    loadGrades();
    fetchStudentDetails();
  }, [id, isEditing, navigate, toast]);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value ? Number(e.target.value) : null;
    // map grade selection into gradeIdentifier
    setFormData(prev => ({ ...prev, gradeIdentifier: cid, sectionIdentifier: null }));
    const selected = grades.find(c => c.identifier === cid);
    setSections(selected?.sections || []);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sid = e.target.value ? Number(e.target.value) : null;
    setFormData(prev => ({ ...prev, sectionIdentifier: sid }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (isEditing) {
        await studentService.updateStudent(formData);
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        await studentService.saveStudent(formData);
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} student. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update the student\'s information below' : 'Enter the student\'s information below'}
          </p>
        </div>

        {loading && !formData.identifier ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="lg:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNo">Phone Number</Label>
                      <Input
                        id="phoneNo"
                        name="phoneNo"
                        placeholder="Enter phone number"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <select
                        id="grade"
                        name="grade"
                        className="w-full p-2 border rounded"
                        value={formData.gradeIdentifier ?? ''}
                        onChange={handleGradeChange}
                        required
                      >
                        <option value="">-- Select grade --</option>
                        {grades.map(c => (
                          <option key={c.identifier} value={c.identifier}>{c.grade}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <select
                        id="section"
                        name="section"
                        className="w-full p-2 border rounded"
                        value={formData.sectionIdentifier ?? ''}
                        onChange={handleSectionChange}
                      >
                        <option value="">-- No section / Select --</option>
                        {sections.map(s => (
                          <option key={s.identifier} value={s.identifier}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lecture">Subjects</Label>
                      <Input
                        id="lecture"
                        name="lecture"
                        placeholder="Enter lecture"
                        value={formData.lecture}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input
                        id="address1"
                        name="address1"
                        placeholder="Enter address line 1"
                        value={formData.address1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        name="address2"
                        placeholder="Enter address line 2 (optional)"
                        value={formData.address2}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adharNo">Aadhar Number</Label>
                      <Input
                        id="adharNo"
                        name="adharNo"
                        placeholder="Enter Aadhar number"
                        value={formData.adharNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/students')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        {isEditing ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      isEditing ? 'Update Student' : 'Save Student'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}