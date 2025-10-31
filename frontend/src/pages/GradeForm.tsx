import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { gradeService, GradeDetails, SectionDetails } from '@/api/services/grade.service';

export default function GradeForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const [grades, setGrades] = useState<GradeDetails[]>([
    { identifier: undefined, grade: '', description: '', sections: [{ identifier: undefined, name: '' }] },
  ]);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchGradeDetails = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const data = await gradeService.details(parseInt(id as string));
        setGrades([{
          identifier: (data as any).identifier,
          grade: (data as any).grade ?? '',
          description: (data as any).description ?? '',
          sections: (data as any).sections ?? [],
        }]);
      } catch (error) {
        console.error('Error fetching grade details:', error);
        toast({ title: 'Error', description: 'Failed to load grade details. Please try again.', variant: 'destructive' });
        navigate('/grade');
      } finally {
        setLoading(false);
      }
    };

    fetchGradeDetails();
  }, [id, isEditing, navigate, toast]);

  if (!user || user.role !== 'orgadmin') {
    navigate('/login');
    return null;
  }

  const handleGradeChange = (index: number, field: keyof GradeDetails, value: any) => {
    setGrades(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSectionChange = (gradeIndex: number, sectionIndex: number, field: keyof SectionDetails, value: any) => {
    setGrades(prev => prev.map((grade, i) => {
      if (i !== gradeIndex) return grade;
      const sections = (grade.sections || []).map((s, si) => si === sectionIndex ? { ...s, [field]: value } : s);
      return { ...grade, sections };
    }));
  };

  const addGradeCard = () => {
    setGrades(prev => [...prev, { identifier: undefined, grade: '', description: '', sections: [{ identifier: undefined, name: '' }] }]);
  };

  const removeGradeCard = (index: number) => {
    setGrades(prev => prev.filter((_, i) => i !== index));
  };

  const addSectionRow = (gradeIndex: number) => {
    setGrades(prev => prev.map((g, i) => i === gradeIndex ? { ...g, sections: [...(g.sections || []), { identifier: undefined, name: '' }] } : g));
  };

  const removeSectionRow = (gradeIndex: number, sectionIndex: number) => {
    setGrades(prev => prev.map((g, i) => {
      if (i !== gradeIndex) return g;
      const sections = (g.sections || []).filter((_, si) => si !== sectionIndex);
      return { ...g, sections };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: grade name required
    for (const g of grades) {
      if (!g.grade || g.grade.trim() === '') {
        toast({ title: 'Validation Error', description: 'Please enter grade name for each card', variant: 'destructive' });
        return;
      }
    }

    try {
      setLoading(true);
      if (isEditing) {
        // Clean sections (remove empty names) before sending
        const cleanedSections = (grades[0].sections || []).filter(s => s.name && s.name.trim() !== '');
        const payload: GradeDetails = {
          ...grades[0],
          sections: cleanedSections.length ? cleanedSections : undefined,
        };
        await gradeService.update(payload);
        toast({ title: 'Success', description: 'Grade updated successfully' });
      } else {
        for (const g of grades) {
          const cleanedSections = (g.sections || []).filter(s => s.name && s.name.trim() !== '');
          const payload: GradeDetails = {
            ...g,
            sections: cleanedSections.length ? cleanedSections : undefined,
          };
          await gradeService.save(payload);
        }
        toast({ title: 'Success', description: 'Grade(s) added successfully' });
      }
      navigate('/grade');
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({ title: 'Error', description: `Failed to ${isEditing ? 'update' : 'add'} grade(s). Please try again.`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
          <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Grade' : 'Add New Grades'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Update the grade information below' : 'Add grades and their sections'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {grades.map((g, idx) => (
              <div key={idx} className={`flex flex-col gap-4 border rounded-lg p-4 bg-muted/30 ${idx === 0 ? 'mt-4' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Grade {grades.length > 1 ? `(${idx + 1})` : ''}</h3>
                    {grades.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeGradeCard(idx)}>
                      <X className="w-5 h-5 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`grade-${idx}`}>Grade Name</Label>
                    <Input id={`grade-${idx}`} placeholder="Enter grade name" value={g.grade} onChange={e => handleGradeChange(idx, 'grade', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor={`desc-${idx}`}>Description</Label>
                    <Input id={`desc-${idx}`} placeholder="Enter description" value={g.description} onChange={e => handleGradeChange(idx, 'description', e.target.value)} />
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-medium mb-2">Sections</h4>
                  <div className="space-y-3">
                    {(g.sections || []).map((s, sidx) => (
                      <div key={sidx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label>Section Name</Label>
                          <Input placeholder="e.g., A, B" value={s.name} onChange={e => handleSectionChange(idx, sidx, 'name', e.target.value)} />
                        </div>
                        
                        { (g.sections || []).length > 1 && (
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
              <Button type="button" variant="secondary" onClick={addGradeCard} className="px-6">
                <Plus className="w-4 h-4 mr-2" /> Add More
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/grade')} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : isEditing ? 'Update Grade' : 'Save Grades'}</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
