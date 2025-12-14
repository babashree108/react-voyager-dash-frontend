import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { teacherService, TeacherDetails } from '@/api/services/teacher.service';
import { gradeService, GradeDetails } from '@/api/services/grade.service';
import { X, Plus } from 'lucide-react';

export default function TeacherForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const [formData, setFormData] = useState<TeacherDetails>({
    identifier: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    country: '',
    adharNo: ''
  });

  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [assignments, setAssignments] = useState<Array<{gradeIdentifier?: number; sectionIdentifier?: number}>>([
    { gradeIdentifier: undefined, sectionIdentifier: undefined },
  ]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const list = await gradeService.list();
        setGrades(list || []);
      } catch (e) {
        console.error('Failed to load grades', e);
      }
    };

    const fetchTeacherDetails = async () => {
      if (!isEditing) return;
      
      try {
        setLoading(true);
  const data = await teacherService.getTeacherDetails(parseInt(id));
  setFormData(data as TeacherDetails);
        // fetch existing assignments for teacher (if any)
        try {
          const existing = await teacherService.getAssignments(parseInt(id));
          console.log('Existing assignments:', existing);
          setAssignments((existing as any[]).map(a => ({ gradeIdentifier: a.gradeIdentifier ?? a.gradeIdentifier, sectionIdentifier: a.sectionIdentifier })));
        } catch (e) {
          // ignore if no assignments or fetch fails
        }
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        toast({
          title: "Error",
          description: "Failed to load teacher details. Please try again.",
          variant: "destructive",
        });
        navigate('/teachers');
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
    fetchTeacherDetails();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let savedId: number | undefined = formData.identifier;
      if (isEditing) {
        await teacherService.updateTeacher(formData);
        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      } else {
        const res = await teacherService.saveTeacher(formData);
        savedId = (res as unknown) as number;
        toast({
          title: "Success",
          description: "Teacher added successfully",
        });
      }

      // save assignments (grade + optional section)
      const teacherIdToSave = savedId ?? formData.identifier;
      if (teacherIdToSave) {
        const payload = assignments
          .filter(a => a.gradeIdentifier !== undefined && a.gradeIdentifier !== null)
          .map(a => ({ gradeIdentifier: a.gradeIdentifier, sectionIdentifier: a.sectionIdentifier ?? null }));
        try {
          await teacherService.saveAssignments(teacherIdToSave, payload);
        } catch (e) {
          console.warn('Failed to save assignments', e);
        }
      }

      navigate('/teachers');
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} teacher. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAssignmentRow = () => {
    setAssignments(prev => [...prev, {}]);
  };

  const removeAssignmentRow = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const updateAssignment = (index: number, patch: Partial<{gradeIdentifier?: number; sectionIdentifier?: number}>) => {
    setAssignments(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update the teacher\'s information below' : 'Enter the teacher\'s information below'}
          </p>
        </div>

        {loading && !formData.identifier ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Teacher Information</CardTitle>
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
                        required
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
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-1">
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
                    <div className="space-y-2 md:col-span-1">
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

                {/* Grade & Section assignments */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Add more design</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Grade & Section Assignments</h3>
                      <div className="space-y-3">
                        {assignments.map((row, idx) => {
                          const selectedGrade = grades.find(c => c.identifier === row.gradeIdentifier);
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-4 border rounded-lg p-4 bg-muted/30 ${idx === 0 ? 'mt-4' : ''}`}
                            >
                              <div className="flex-1 space-y-2">
                                <Label>Grade {assignments.length > 1 && `(${idx + 1})`}</Label>
                                <select
                                  className="w-full p-2 border rounded"
                                  value={row.gradeIdentifier ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    updateAssignment(idx, { gradeIdentifier: val, sectionIdentifier: undefined });
                                  }}
                                >
                                  <option value="">-- Select grade --</option>
                                  {grades.map(c => (
                                    <option key={c.identifier} value={c.identifier}>{c.grade}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex-1 space-y-2">
                                <Label>Section</Label>
                                <select
                                  className="w-full p-2 border rounded"
                                  value={row.sectionIdentifier ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    updateAssignment(idx, { sectionIdentifier: val });
                                  }}
                                >
                                  <option value="">-- No section / Select --</option>
                                  {selectedGrade?.sections?.map((s: any) => (
                                    <option key={s.identifier} value={s.identifier}>{s.name}</option>
                                  ))}
                                </select>
                              </div>

                              {assignments.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeAssignmentRow(idx)}
                                >
                                  <X className="w-5 h-5 text-red-500" />
                                </Button>
                              )}
                            </div>
                          );
                        })}

                        <div>
                          <Button type="button" variant="secondary" onClick={addAssignmentRow} className="px-6">
                            <Plus className="w-4 h-4 mr-2" /> Add More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/teachers')}
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
                      isEditing ? 'Update Teacher' : 'Save Teacher'
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