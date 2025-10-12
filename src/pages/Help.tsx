import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { HelpCircle, MessageSquare, BookOpen, Mail, Phone } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  const supportOptions = [
    { icon: MessageSquare, title: 'Live Chat', description: 'Chat with our support team in real-time', action: 'Start Chat' },
    { icon: BookOpen, title: 'Documentation', description: 'Browse our comprehensive guides', action: 'View Docs' },
    { icon: Mail, title: 'Email Support', description: 'Send us a detailed message', action: 'Send Email' },
    { icon: Phone, title: 'Phone Support', description: 'Call us during business hours', action: 'Call Now' },
  ];

  const popularArticles = [
    { title: 'Getting Started with Virtual Classrooms', description: 'Learn how to set up and manage your first classroom session' },
    { title: 'Setting Up Huion Note X10', description: 'Step-by-step guide to connect and configure your device' },
    { title: 'Managing User Roles', description: 'How to assign and manage different user roles' },
    { title: 'Understanding Analytics', description: 'Make sense of your engagement metrics and reports' },
  ];

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            Help & Support
          </h1>
          <p className="text-muted-foreground">Get help with your questions and issues</p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Popular Articles */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div 
                  key={index}
                  className="p-4 bg-muted rounded-lg hover:bg-muted/70 transition-smooth cursor-pointer"
                >
                  <h4 className="font-semibold mb-1">{article.title}</h4>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
