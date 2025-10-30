import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { teacherService, TeacherDetails } from '@/api/services/teacher.service';

export default function TeacherForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const [formData, setFormData] = useState<TeacherDetails>({
    identifier: undefined,
    fName: '',
    lName: '',
    email: '',
    phoneNo: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    country: '',
    adharNo: ''
  });

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      if (!isEditing) return;
      
      try {
        setLoading(true);
        const data = await teacherService.getTeacherDetails(parseInt(id));
        setFormData(data);
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
      if (isEditing) {
        await teacherService.updateTeacher(formData);
        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      } else {
        await teacherService.saveTeacher(formData);
        toast({
          title: "Success",
          description: "Teacher added successfully",
        });
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
                      <Label htmlFor="fName">First Name</Label>
                      <Input
                        id="fName"
                        name="fName"
                        placeholder="Enter first name"
                        value={formData.fName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lName">Last Name</Label>
                      <Input
                        id="lName"
                        name="lName"
                        placeholder="Enter last name"
                        value={formData.lName}
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