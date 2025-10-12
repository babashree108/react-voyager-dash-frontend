import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { BookOpen, Plus, Download, Share2, Pen, Eraser, Highlighter } from 'lucide-react';

export default function DigitalNotebook() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState('pen');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Digital Notebook
            </h1>
            <p className="text-muted-foreground">Enhanced note-taking with Huion Note X10 support</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <Card className="col-span-2 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Tools</h3>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedTool === tool.id ? 'gradient-primary text-white' : ''
                      }`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tool.label}
                    </Button>
                  );
                })}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-sm">Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-smooth"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-sm">Pen Width</h4>
                <div className="space-y-2">
                  {[2, 4, 8].map((width) => (
                    <div key={width} className="flex items-center gap-2">
                      <div 
                        className="bg-foreground rounded-full"
                        style={{ width: `${width}px`, height: `${width}px` }}
                      />
                      <span className="text-sm">{width}px</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card className="col-span-10 shadow-card">
            <CardContent className="p-0">
              <div className="bg-white min-h-[calc(100vh-16rem)] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Start Taking Notes</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your Huion Note X10 or use your mouse/trackpad to draw
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Device Ready</span>
                    </div>
                    <span>•</span>
                    <span>Pressure Sensitive</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
