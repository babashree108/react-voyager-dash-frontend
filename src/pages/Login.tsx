import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/api/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types';

const DEFAULT_EMAIL = 'admin@nxtclass.com';
const DEFAULT_PASSWORD = 'Admin@123';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (!response?.token || !response?.user) {
        throw new Error('Invalid authentication response. Please try again.');
      }

      const normalizedRole = (response.user.role ?? '').toLowerCase();
      const normalizedStatus = (response.user.status ?? '').toLowerCase();

      if (!['orgadmin', 'teacher', 'student'].includes(normalizedRole)) {
        throw new Error('Unsupported role returned for this user.');
      }

      const statusValue = normalizedStatus === 'inactive' ? 'inactive' : 'active';

      const normalizedUser: User = {
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        role: normalizedRole as UserRole,
        status: statusValue,
        organization: response.user.organization ?? undefined,
        avatarUrl: response.user.avatarUrl ?? undefined,
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      toast({
        title: 'Welcome back!',
        description: `${normalizedUser.name} signed in successfully.`
      });

      navigate('/dashboard');
    } catch (error) {
      const fallbackMessage = 'Unable to sign in. Please verify your credentials and try again.';
      const description = (error as any)?.response?.data ?? (error as Error)?.message ?? fallbackMessage;
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: typeof description === 'string' ? description : fallbackMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="flex-1 gradient-primary flex items-center justify-center p-[60px]">
        <div className="max-w-md text-white">
          <h1 className="text-[42px] font-bold mb-4 leading-tight">NXT Class</h1>
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

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label className="text-[14px] font-medium text-[#374151]">Email Address</Label>
              <Input
                type="email"
                placeholder="you@organization.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-[48px] text-[15px] border-[#d1d5db] rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-medium text-[#374151]">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-[48px] text-[15px] border-[#d1d5db] rounded-lg"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[56px] text-[16px] font-semibold rounded-lg"
              style={{ background: '#4f46e5' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="bg-[#fef3c7] text-[#92400e] p-4 rounded-lg text-[13px]">
              🔒 Default admin credentials: <strong>{DEFAULT_EMAIL}</strong> / <strong>{DEFAULT_PASSWORD}</strong>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}