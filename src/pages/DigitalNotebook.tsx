import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { BookOpen, Plus, Download, Share2, Pen, Eraser, Highlighter, Undo, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import CanvasService from '@/services/canvas.service';
import WebSocketService from '@/services/websocket.service';
import { toast } from 'sonner';

export default function DigitalNotebook() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<'pen' | 'eraser' | 'highlighter'>('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedWidth, setSelectedWidth] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sessionId = 'session-1'; // This should come from props or route params

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Initialize canvas when component mounts
    if (canvasRef.current) {
      initializeCanvas(userData);
    }

    return () => {
      CanvasService.destroy();
    };
  }, [navigate]);

  useEffect(() => {
    if (canvasRef.current && user) {
      // Reinitialize canvas when page changes
      CanvasService.changePage(currentPage);
    }
  }, [currentPage, user]);

  const initializeCanvas = async (userData: User) => {
    if (!canvasRef.current) return;

    try {
      // Initialize canvas service
      CanvasService.initialize(canvasRef.current, userData.id, sessionId, currentPage);

      // Connect to WebSocket if not already connected
      if (!WebSocketService.isConnected()) {
        await WebSocketService.connect(userData.id, sessionId);
        setIsConnected(true);
      }

      // Listen for notebook updates from teacher (if teacher is viewing)
      if (userData.role === 'teacher') {
        WebSocketService.on('notebook-update', (page) => {
          // Teacher receives student notebook updates
          toast.info(`Notebook updated by student`);
        });
      }

      toast.success('Digital notebook ready');
    } catch (error) {
      console.error('Error initializing notebook:', error);
      toast.error('Failed to initialize notebook');
    }
  };

  const handleToolChange = (tool: 'pen' | 'eraser' | 'highlighter') => {
    setSelectedTool(tool);
    CanvasService.setTool(tool);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    CanvasService.setColor(color);
  };

  const handleWidthChange = (width: number) => {
    setSelectedWidth(width);
    CanvasService.setWidth(width);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this page?')) {
      CanvasService.clear();
      toast.success('Page cleared');
    }
  };

  const handleUndo = () => {
    CanvasService.undo();
  };

  const handleExport = () => {
    const imageData = CanvasService.exportAsImage();
    const link = document.createElement('a');
    link.download = `notebook-page-${currentPage}-${Date.now()}.png`;
    link.href = imageData;
    link.click();
    toast.success('Page exported');
  };

  const handleNewPage = () => {
    setCurrentPage(prev => prev + 1);
    toast.success(`Switched to page ${currentPage + 1}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      toast.success(`Switched to page ${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    toast.success(`Switched to page ${currentPage + 1}`);
  };

  if (!user) return null;

  const tools = [
    { id: 'pen' as const, icon: Pen, label: 'Pen' },
    { id: 'highlighter' as const, icon: Highlighter, label: 'Highlighter' },
    { id: 'eraser' as const, icon: Eraser, label: 'Eraser' },
  ];

  const colors = [
    '#000000', // Black
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#6b7280', // Gray
  ];

  const widths = [2, 4, 8];

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Digital Notebook
              {isConnected && (
                <span className="text-sm font-normal text-green-500">(Live)</span>
              )}
            </h1>
            <p className="text-muted-foreground">
              {user.role === 'student' 
                ? 'Your notes are shared live with your teacher' 
                : 'Viewing student notebooks in real-time'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button className="gradient-primary text-white" onClick={handleNewPage}>
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
                      onClick={() => handleToolChange(tool.id)}
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
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-smooth ${
                        selectedColor === color ? 'border-primary ring-2 ring-primary' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-sm">Pen Width</h4>
                <div className="space-y-2">
                  {widths.map((width) => (
                    <button
                      key={width}
                      className={`w-full flex items-center gap-2 p-2 rounded hover:bg-accent ${
                        selectedWidth === width ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleWidthChange(width)}
                    >
                      <div 
                        className="bg-foreground rounded-full"
                        style={{ width: `${width}px`, height: `${width}px` }}
                      />
                      <span className="text-sm">{width}px</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleUndo}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Undo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 hover:text-red-600"
                  onClick={handleClear}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card className="col-span-10 shadow-card">
            <CardContent className="p-0 relative">
              {/* Page Navigation */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-4">
                  Page {currentPage}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNextPage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Canvas */}
              <div className="bg-white min-h-[calc(100vh-16rem)] flex items-center justify-center p-8">
                <div className="relative w-full h-full border-2 border-dashed border-border rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    className="w-full h-full bg-white cursor-crosshair"
                    style={{ touchAction: 'none' }}
                  />
                  
                  {/* Watermark for live sharing */}
                  {user.role === 'student' && isConnected && (
                    <div className="absolute bottom-4 right-4 bg-green-500/10 border border-green-500 px-3 py-1 rounded-lg text-green-700 text-xs font-medium">
                      🟢 Live - Teacher can view
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
