import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUsers } from '@/data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'orgadmin' | 'teacher' | 'student'>('orgadmin');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="flex-1 gradient-primary flex items-center justify-center p-[60px]">
        <div className="max-w-md text-white">
          <h1 className="text-[42px] font-bold mb-4 leading-tight">SaaS Online Teaching Platform</h1>
          <p className="text-[17px] opacity-95 leading-[1.7] mb-8">
            Enterprise-grade virtual learning platform with real-time collaboration, digital notebooks, and comprehensive analytics.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[15px]">
              <span>✓</span>
              <span>Live video conferencing with student controls</span>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <span>✓</span>
              <span>Real-time digital notebook capture (Huion integration)</span>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <span>✓</span>
              <span>Multi-tenant organization management</span>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <span>✓</span>
              <span>Advanced analytics and reporting</span>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <span>✓</span>
              <span>Flexible subscription plans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-[60px] bg-background">
        <div className="w-full max-w-[420px]">
          <h2 className="text-[32px] font-bold mb-2 text-[#111827]">Sign In</h2>
          <p className="text-[#6b7280] mb-8">Access your organization's learning platform</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              className="h-[48px] gap-2 text-[14px] border-[#d1d5db] hover:bg-[#f9fafb]"
            >
              <span className="text-base">🔵</span> Google
            </Button>
            <Button 
              variant="outline" 
              className="h-[48px] gap-2 text-[14px] border-[#d1d5db] hover:bg-[#f9fafb]"
            >
              <span className="text-base">🔷</span> Microsoft
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e5e7eb]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-[#9ca3af]">OR</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[14px] font-medium text-[#374151]">User Role</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger className="h-[48px] text-[15px] border-[#d1d5db] rounded-lg">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orgadmin">Organization Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-medium text-[#374151]">Email Address</Label>
              <Input 
                type="email" 
                placeholder="you@organization.com" 
                defaultValue="admin@school.edu"
                className="h-[48px] text-[15px] border-[#d1d5db] rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-medium text-[#374151]">Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                defaultValue="password"
                className="h-[48px] text-[15px] border-[#d1d5db] rounded-lg"
              />
            </div>

            <Button 
              className="w-full h-[56px] text-[16px] font-semibold rounded-lg"
              style={{ background: '#4f46e5' }}
              onClick={handleLogin}
            >
              Sign In
            </Button>

            <div className="bg-[#fef3c7] text-[#92400e] p-4 rounded-lg text-[13px]">
              🔒 Two-factor authentication enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}