import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { courseService, CourseDetails, SectionDetails } from '@/api/services/course.service';

export default function CourseForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const [courses, setCourses] = useState<CourseDetails[]>([
    { identifier: undefined, course: '', description: '', sections: [{ identifier: undefined, name: '' }] },
  ]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const data = await courseService.details(parseInt(id as string));
        // Normalize backend response into CourseDetails shape and wrap into array for UI parity with SubjectForm
        setCourses([{
          identifier: (data as any).identifier,
          course: (data as any).course ?? '',
          description: (data as any).description ?? '',
          sections: (data as any).sections ?? [],
        }]);
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast({ title: 'Error', description: 'Failed to load course details. Please try again.', variant: 'destructive' });
        navigate('/course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isEditing, navigate, toast]);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleCourseChange = (index: number, field: keyof CourseDetails, value: any) => {
    setCourses(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSectionChange = (courseIndex: number, sectionIndex: number, field: keyof SectionDetails, value: any) => {
    setCourses(prev => prev.map((course, i) => {
      if (i !== courseIndex) return course;
      const sections = (course.sections || []).map((s, si) => si === sectionIndex ? { ...s, [field]: value } : s);
      return { ...course, sections };
    }));
  };

  const addCourseCard = () => {
    setCourses(prev => [...prev, { identifier: undefined, course: '', description: '', sections: [{ identifier: undefined, name: '' }] }]);
  };

  const removeCourseCard = (index: number) => {
    setCourses(prev => prev.filter((_, i) => i !== index));
  };

  const addSectionRow = (courseIndex: number) => {
    setCourses(prev => prev.map((c, i) => i === courseIndex ? { ...c, sections: [...(c.sections || []), { identifier: undefined, name: '' }] } : c));
  };

  const removeSectionRow = (courseIndex: number, sectionIndex: number) => {
    setCourses(prev => prev.map((c, i) => {
      if (i !== courseIndex) return c;
      const sections = (c.sections || []).filter((_, si) => si !== sectionIndex);
      return { ...c, sections };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: course name required
    for (const c of courses) {
      if (!c.course || c.course.trim() === '') {
        toast({ title: 'Validation Error', description: 'Please enter course name for each card', variant: 'destructive' });
        return;
      }
    }

    try {
      setLoading(true);
      if (isEditing) {
        // Clean sections (remove empty names) before sending
        const cleanedSections = (courses[0].sections || []).filter(s => s.name && s.name.trim() !== '');
        const payload: CourseDetails = {
          ...courses[0],
          sections: cleanedSections.length ? cleanedSections : undefined,
        };
        await courseService.update(payload);
        toast({ title: 'Success', description: 'Course updated successfully' });
      } else {
        // create each course card sequentially, cleaning sections for each
        for (const c of courses) {
          const cleanedSections = (c.sections || []).filter(s => s.name && s.name.trim() !== '');
          const payload: CourseDetails = {
            ...c,
            sections: cleanedSections.length ? cleanedSections : undefined,
          };
          await courseService.save(payload);
        }
        toast({ title: 'Success', description: 'Course(s) added successfully' });
      }
      navigate('/course');
    } catch (error) {
      console.error('Error saving course:', error);
      toast({ title: 'Error', description: `Failed to ${isEditing ? 'update' : 'add'} course(s). Please try again.`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Course' : 'Add New Courses'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Update the course information below' : 'Add courses and their sections'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {courses.map((c, idx) => (
              <div key={idx} className={`flex flex-col gap-4 border rounded-lg p-4 bg-muted/30 ${idx === 0 ? 'mt-4' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Course {courses.length > 1 ? `(${idx + 1})` : ''}</h3>
                  {courses.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCourseCard(idx)}>
                      <X className="w-5 h-5 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`course-${idx}`}>Course Name</Label>
                    <Input id={`course-${idx}`} placeholder="Enter course name" value={c.course} onChange={e => handleCourseChange(idx, 'course', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor={`desc-${idx}`}>Description</Label>
                    <Input id={`desc-${idx}`} placeholder="Enter description" value={c.description} onChange={e => handleCourseChange(idx, 'description', e.target.value)} />
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-medium mb-2">Sections</h4>
                  <div className="space-y-3">
                    {(c.sections || []).map((s, sidx) => (
                      <div key={sidx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label>Section Name</Label>
                          <Input placeholder="e.g., A, B" value={s.name} onChange={e => handleSectionChange(idx, sidx, 'name', e.target.value)} />
                        </div>
                        
                        { (c.sections || []).length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSectionRow(idx, sidx)}>
                            <X className="w-5 h-5 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <Button type="button" variant="secondary" onClick={() => addSectionRow(idx)} className="px-4">
                      <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isEditing && (
            <div className="w-full flex justify-center mt-6">
              <Button type="button" variant="secondary" onClick={addCourseCard} className="px-6">
                <Plus className="w-4 h-4 mr-2" /> Add More
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/course')} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : isEditing ? 'Update Course' : 'Save Courses'}</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
