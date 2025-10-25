import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { StreamParticipant, ClassroomSession, HandRaiseEvent } from '@/types/classroom.types';
import { Mic, MicOff, Video, VideoOff, Hand, Users, AlertTriangle, BookOpen, MoreVertical } from 'lucide-react';
import WebSocketService from '@/services/websocket.service';
import WebRTCService from '@/services/webrtc.service';
import FullscreenMonitorService from '@/services/fullscreen-monitor.service';
import { toast } from 'sonner';

export default function VirtualClassroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [teacherStream, setTeacherStream] = useState<MediaStream | null>(null);
  const [broadcastingStudent, setBroadcastingStudent] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const broadcastVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Initialize session (mock data for now)
    const mockSession: ClassroomSession = {
      id: 'session-1',
      title: 'Advanced Mathematics',
      subject: 'Mathematics',
      teacherId: 'teacher-1',
      teacherName: 'Sarah Johnson',
      startTime: new Date().toISOString(),
      status: 'active',
      isRecording: true,
      isBroadcastActive: true,
      participants: [],
    };
    setSession(mockSession);

    // Initialize connections
    initializeClassroom(userData, mockSession);

    return () => {
      cleanup();
    };
  }, [navigate]);

  const initializeClassroom = async (userData: User, sessionData: ClassroomSession) => {
    try {
      // Connect WebSocket
      await WebSocketService.connect(userData.id, sessionData.id);
      WebSocketService.joinSession(sessionData.id, userData.id, userData.role as 'teacher' | 'student');
      setIsConnected(true);

      // Initialize media stream
      const stream = await WebRTCService.initializeLocalStream(true, true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup WebSocket listeners
      setupWebSocketListeners();

      // Student-specific setup
      if (userData.role === 'student') {
        // Start fullscreen monitoring
        FullscreenMonitorService.startMonitoring(userData.id);
        
        // Disable mic/video controls (they're always on for students)
        WebRTCService.unmuteLocalAudio();
        WebRTCService.startLocalVideo();
      }

      // Teacher-specific setup
      if (userData.role === 'teacher') {
        // Create peer connections with all students
        // This would be done when students join
      }

      toast.success('Connected to classroom');
    } catch (error) {
      console.error('Error initializing classroom:', error);
      toast.error('Failed to connect to classroom');
    }
  };

  const setupWebSocketListeners = () => {
    // Handle participant joined
    WebSocketService.on('participant-joined', (participant: StreamParticipant) => {
      setParticipants(prev => [...prev, participant]);
      
      if (user?.role === 'teacher') {
        // Teacher creates peer connection with new student
        WebRTCService.createPeerConnection(participant.id, true);
      } else if (participant.role === 'teacher') {
        // Student creates peer connection with teacher
        WebRTCService.createPeerConnection(participant.id, false);
      }
    });

    // Handle participant left
    WebSocketService.on('participant-left', (participant: StreamParticipant) => {
      setParticipants(prev => prev.filter(p => p.id !== participant.id));
      WebRTCService.removePeer(participant.id);
    });

    // Handle WebRTC signals
    WebSocketService.on('webrtc-signal', (signal) => {
      WebRTCService.handleSignal(signal);
    });

    // Handle hand raise
    WebSocketService.on('hand-raise', (event: HandRaiseEvent) => {
      if (user?.role === 'teacher') {
        toast.info(`${event.studentName} raised their hand`);
      }
      setParticipants(prev => 
        prev.map(p => 
          p.userId === event.studentId 
            ? { ...p, isHandRaised: event.isActive }
            : p
        )
      );
    });

    // Handle broadcast control
    WebSocketService.on('broadcast-control', (control) => {
      if (user?.role === 'student' && control.studentId === user.id) {
        // This student is being broadcasted
        toast.info(control.action === 'start' ? 'You are now broadcasting to the class' : 'Broadcasting stopped');
      }
      setBroadcastingStudent(control.action === 'start' ? control.studentId : null);
    });

    // Handle mute all
    WebSocketService.on('mute-all-students', () => {
      if (user?.role === 'student') {
        WebRTCService.muteLocalAudio();
        toast.warning('Teacher has muted all students');
      }
    });

    // Handle monitoring alerts
    WebSocketService.on('monitoring-alert', (monitoring) => {
      if (user?.role === 'teacher') {
        // Update participant monitoring status
        setParticipants(prev =>
          prev.map(p =>
            p.userId === monitoring.studentId
              ? {
                  ...p,
                  isFullscreenActive: monitoring.isFullscreenActive,
                  isWindowFocused: monitoring.isWindowFocused,
                }
              : p
          )
        );
      }
    });

    // Handle remote streams
    WebRTCService.onStream((participantId, stream) => {
      // Find if this is the teacher's stream
      const participant = participants.find(p => p.id === participantId);
      if (participant?.role === 'teacher') {
        setTeacherStream(stream);
        if (teacherVideoRef.current) {
          teacherVideoRef.current.srcObject = stream;
        }
      }
    });
  };

  const handleRaiseHand = () => {
    if (!user) return;
    
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    
    const event: HandRaiseEvent = {
      studentId: user.id,
      studentName: user.name,
      timestamp: new Date().toISOString(),
      isActive: newState,
    };
    
    WebSocketService.raiseHand(event);
    toast.success(newState ? 'Hand raised' : 'Hand lowered');
  };

  const handleMuteAll = () => {
    if (!session) return;
    WebSocketService.muteAllStudents(session.id);
    toast.success('All students muted');
  };

  const handleBroadcastStudent = (studentId: string) => {
    if (!user) return;
    
    WebSocketService.sendBroadcastControl({
      teacherId: user.id,
      studentId,
      action: 'start',
      includeAudio: true,
      includeVideo: true,
    });
  };

  const handleStopBroadcast = () => {
    if (!user) return;
    
    WebSocketService.sendBroadcastControl({
      teacherId: user.id,
      action: 'stop',
      includeAudio: false,
      includeVideo: false,
    });
    setBroadcastingStudent(null);
  };

  const handleLeaveClass = () => {
    if (window.confirm('Are you sure you want to leave the class?')) {
      cleanup();
      navigate('/dashboard');
    }
  };

  const cleanup = () => {
    if (user?.role === 'student') {
      FullscreenMonitorService.stopMonitoring();
    }
    WebRTCService.stopAllStreams();
    if (session && user) {
      WebSocketService.leaveSession(session.id, user.id);
    }
    WebSocketService.disconnect();
  };

  const openNotebook = () => {
    // Open digital notebook in a side panel or new window
    window.open('/digital-notebook', '_blank');
  };

  if (!user || !session) return null;

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="h-[calc(100vh-4rem)] bg-[#111827] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">{session.title}</h2>
            <p className="text-sm text-gray-400">with {session.teacherName} • Live Session</p>
          </div>
          <div className="flex items-center gap-2">
            {session.isRecording && (
              <Badge className="bg-red-500 text-white">
                🔴 Recording
              </Badge>
            )}
            <Badge className="bg-green-500 text-white">
              <Users className="w-3 h-3 mr-1" />
              {participants.length} participants
            </Badge>
            {!isConnected && (
              <Badge className="bg-yellow-500 text-white">
                Connecting...
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Video Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Teacher Video (Main) */}
            <Card className="h-[60%] bg-[#1f2937] border-gray-700 flex items-center justify-center relative overflow-hidden">
              {isTeacher ? (
                // Teacher sees their own video
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // Students see teacher video
                teacherStream ? (
                  <video
                    ref={teacherVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold">
                      {session.teacherName.charAt(0)}
                    </div>
                    <p className="text-xl font-semibold mb-2">{session.teacherName}</p>
                    <p className="text-gray-400">Waiting for teacher stream...</p>
                  </div>
                )
              )}
              
              {/* Overlay for student name */}
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                {isTeacher ? user.name : session.teacherName} (Teacher)
              </div>
            </Card>

            {/* Broadcasting Student or Self View */}
            <Card className="h-[35%] bg-[#1f2937] border-gray-700 flex items-center justify-center relative overflow-hidden">
              {isStudent ? (
                // Students see their own camera (always on)
                <div className="relative w-full h-full">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                    You (Camera Always On)
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-green-500">
                      <Video className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                    <Badge className="bg-green-500">
                      <Mic className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              ) : (
                // Teacher sees broadcasting student
                broadcastingStudent ? (
                  <video
                    ref={broadcastVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">No student broadcasting</p>
                  </div>
                )
              )}
            </Card>
          </div>

          {/* Participants Panel */}
          <Card className="bg-[#1f2937] border-gray-700 p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
              <span>Participants ({participants.length})</span>
              {isTeacher && (
                <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700" onClick={handleMuteAll}>
                  <MicOff className="w-4 h-4" />
                </Button>
              )}
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div 
                  key={participant.id}
                  className={`p-3 rounded-lg ${
                    !participant.isFullscreenActive && isTeacher && participant.role === 'student'
                      ? 'bg-red-900/30 border border-red-500'
                      : participant.isSpeaking
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
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
                    
                    {/* Status Icons */}
                    <div className="flex items-center gap-1">
                      {participant.isHandRaised && (
                        <Hand className="w-4 h-4 text-yellow-500" />
                      )}
                      {participant.isMuted ? (
                        <MicOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Mic className="w-4 h-4 text-green-500" />
                      )}
                      {participant.isVideoOff ? (
                        <VideoOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Video className="w-4 h-4 text-green-500" />
                      )}
                      {isTeacher && participant.role === 'student' && !participant.isFullscreenActive && (
                        <AlertTriangle className="w-4 h-4 text-red-500" title="Not in fullscreen" />
                      )}
                    </div>
                  </div>

                  {/* Teacher Controls for Students */}
                  {isTeacher && participant.role === 'student' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleBroadcastStudent(participant.userId)}
                        disabled={broadcastingStudent === participant.userId}
                      >
                        {broadcastingStudent === participant.userId ? 'Broadcasting' : 'Broadcast'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={openNotebook}
                      >
                        <BookOpen className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-lg">
          <div className="flex items-center gap-2">
            {isTeacher && (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Video className="w-5 h-5" />
                </Button>
              </>
            )}
            {isStudent && (
              <div className="flex items-center gap-2 text-white text-sm">
                <Badge className="bg-green-500">
                  Camera & Mic Always On
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isStudent && (
              <>
                <Button
                  variant={isHandRaised ? "default" : "secondary"}
                  className={`text-white ${isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                  onClick={handleRaiseHand}
                >
                  <Hand className="w-4 h-4 mr-2" />
                  {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                </Button>
                <Button variant="secondary" className="text-white" onClick={openNotebook}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Notebook
                </Button>
              </>
            )}
            
            {isTeacher && (
              <>
                <Button variant="secondary" className="text-white" onClick={handleMuteAll}>
                  <MicOff className="w-4 h-4 mr-2" />
                  Mute All
                </Button>
                {broadcastingStudent && (
                  <Button variant="secondary" className="text-white" onClick={handleStopBroadcast}>
                    Stop Broadcast
                  </Button>
                )}
              </>
            )}
            
            <Button variant="destructive" onClick={handleLeaveClass}>
              Leave Class
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
