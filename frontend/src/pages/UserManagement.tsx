import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'orgadmin') {
      navigate('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  if (!user) return null;

  // Placeholder users - replace with actual API calls later
  const users: User[] = [
    { id: '1', name: 'John Admin', email: 'admin@school.com', role: 'orgadmin', status: 'active' },
    { id: '2', name: 'Jane Teacher', email: 'teacher@school.com', role: 'teacher', status: 'active' },
    { id: '3', name: 'Bob Student', email: 'student@school.com', role: 'student', status: 'active' },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'orgadmin': return 'bg-[hsl(var(--admin-badge))] text-[hsl(var(--admin-badge-foreground))]';
      case 'teacher': return 'bg-[hsl(var(--teacher-badge))] text-[hsl(var(--teacher-badge-foreground))]';
      case 'student': return 'bg-[hsl(var(--student-badge))] text-[hsl(var(--student-badge-foreground))]';
      default: return '';
    }
  };

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage all users in your organization</p>
          </div>
          <Button className="gradient-primary text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{u.email}</td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleBadgeClass(u.role)}>
                          {u.role === 'orgadmin' ? 'Admin' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={u.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
