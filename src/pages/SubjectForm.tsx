import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { subjectService, SubjectDetails } from '@/api/subejct.service';
import { X, Plus } from 'lucide-react';

export default function SubjectForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const [subjects, setSubjects] = useState<SubjectDetails[]>([
    { identifier: undefined, subject: '' },
  ]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const data = await subjectService.details(parseInt(id));
        setSubjects([data]);
      } catch (error) {
        console.error('Error fetching subject details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subject details. Please try again.',
          variant: 'destructive',
        });
        navigate('/subject');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [id, isEditing, navigate, toast]);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleChange = (index: number, value: string) => {
    setSubjects(prev =>
      prev.map((item, i) => (i === index ? { ...item, subject: value } : item))
    );
  };

  const addSubjectRow = () => {
    setSubjects(prev => [...prev, { identifier: undefined, subject: '' }]);
  };

  const removeSubjectRow = (index: number) => {
    setSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove empty rows
    const validSubjects = subjects.filter(subj => subj.subject.trim() !== '');

    if (validSubjects.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter at least one subject.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await subjectService.update(validSubjects[0]);
        toast({
          title: 'Success',
          description: 'Subject updated successfully',
        });
      } else {
        await subjectService.save(validSubjects);
        toast({
          title: 'Success',
          description: 'Subjects added successfully',
        });
      }
      navigate('/subject');
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'add'} subject(s). Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Edit Subject' : 'Add New Subjects'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Update the subject information below'
              : 'Add multiple subjects if needed'}
          </p>
        </div>

        {loading && !subjects.length ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="lg:px-6">
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-6">
                  {subjects.map((subj, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 border rounded-lg p-4 bg-muted/30 ${
                        index === 0 ? 'mt-4' : ''
                      }`}
                    >
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`subject-${index}`}>
                          Subject Name {subjects.length > 1 && `(${index + 1})`}
                        </Label>
                        <Input
                          id={`subject-${index}`}
                          name="subject"
                          placeholder="Enter subject name"
                          value={subj.subject}
                          onChange={e => handleChange(index, e.target.value)}
                          required
                        />
                      </div>

                      {subjects.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubjectRow(index)}
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {!isEditing && (
                  <div className="w-full flex justify-center mt-6">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addSubjectRow}
                      className="px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add More
                    </Button>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/subject')}
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
                      isEditing ? 'Update Subject' : 'Save Subjects'
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
