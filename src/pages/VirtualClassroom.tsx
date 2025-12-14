import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Mic, MicOff, Video, VideoOff, Share2, Users, MessageSquare, Hand, MoreVertical } from 'lucide-react';

export default function VirtualClassroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  const participants = [
    { id: '1', name: 'Sarah Johnson', role: 'teacher', isSpeaking: false },
    { id: '2', name: 'Emily Davis', role: 'student', isSpeaking: true },
    { id: '3', name: 'James Wilson', role: 'student', isSpeaking: false },
    { id: '4', name: 'Michael Chen', role: 'student', isSpeaking: false },
  ];

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="h-[calc(100vh-4rem)] bg-[#111827] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">Advanced Mathematics</h2>
            <p className="text-sm text-gray-400">with Sarah Johnson • Live Session</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500 text-white">
              🔴 Recording
            </Badge>
            <Badge className="bg-green-500 text-white">
              <Users className="w-3 h-3 mr-1" />
              24 participants
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Video Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-[#1f2937] border-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <p className="text-xl font-semibold mb-2">{user.name}</p>
                <p className="text-gray-400">
                  {isVideoOff ? 'Camera is off' : 'You are on camera'}
                </p>
              </div>
            </Card>
          </div>

          {/* Participants Panel */}
          <Card className="bg-[#1f2937] border-gray-700 p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
              <span>Participants ({participants.length})</span>
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div 
                  key={participant.id}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    participant.isSpeaking ? 'bg-primary/20 border border-primary' : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{participant.name}</p>
                      <p className="text-gray-400 text-xs">
                        {participant.role === 'teacher' ? 'Teacher' : 'Student'}
                      </p>
                    </div>
                  </div>
                  {participant.isSpeaking && (
                    <Mic className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "secondary"}
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button
              size="lg"
              variant={isVideoOff ? "destructive" : "secondary"}
              onClick={() => setIsVideoOff(!isVideoOff)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-12 h-12 p-0"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'student' && (
              <Button variant="secondary" className="text-white">
                <Hand className="w-4 h-4 mr-2" />
                Raise Hand
              </Button>
            )}
            <Button variant="secondary" className="text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button variant="destructive">
              Leave Class
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
