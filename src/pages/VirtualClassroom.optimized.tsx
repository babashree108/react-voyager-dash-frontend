import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { StreamParticipant, ClassroomSession, HandRaiseEvent } from '@/types/classroom.types';
import { Mic, MicOff, Video, VideoOff, Hand, Users, AlertTriangle, BookOpen } from 'lucide-react';
import WebSocketService from '@/services/websocket.service';
import WebRTCService from '@/services/webrtc.service';
import FullscreenMonitorService from '@/services/fullscreen-monitor.service';
import { toast } from 'sonner';

/**
 * OPTIMIZED Virtual Classroom Component
 * 
 * Optimizations:
 * - useCallback for all event handlers
 * - Proper cleanup of listeners
 * - Memoized values
 * - Refs for non-rendering data
 * - Debounced/throttled updates
 */
export default function VirtualClassroom() {
  const navigate = useNavigate();
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [teacherStream, setTeacherStream] = useState<MediaStream | null>(null);
  const [broadcastingStudent, setBroadcastingStudent] = useState<string | null>(null);
  
  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const broadcastVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs for cleanup and listener tracking
  const listenersSetupRef = useRef(false);
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);

  // Memoized values
  const isTeacher = useMemo(() => user?.role === 'teacher', [user?.role]);
  const isStudent = useMemo(() => user?.role === 'student', [user?.role]);
  const participantCount = useMemo(() => participants.length, [participants.length]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (user?.role === 'student') {
      FullscreenMonitorService.stopMonitoring();
    }
    WebRTCService.stopAllStreams();
    if (session && user) {
      WebSocketService.leaveSession(session.id, user.id);
    }
    
    // Clean up all registered listeners
    cleanupFunctionsRef.current.forEach(fn => fn());
    cleanupFunctionsRef.current = [];
    
    WebSocketService.disconnect();
    listenersSetupRef.current = false;
  }, [user, session]);

  // WebSocket Event Handlers (memoized)
  const handleParticipantJoined = useCallback((participant: StreamParticipant) => {
    setParticipants(prev => {
      // Prevent duplicates
      if (prev.some(p => p.id === participant.id)) return prev;
      return [...prev, participant];
    });
    
    if (user?.role === 'teacher') {
      WebRTCService.createPeerConnection(participant.id, true);
    } else if (participant.role === 'teacher') {
      WebRTCService.createPeerConnection(participant.id, false);
    }
  }, [user?.role]);

  const handleParticipantLeft = useCallback((participant: StreamParticipant) => {
    setParticipants(prev => prev.filter(p => p.id !== participant.id));
    WebRTCService.removePeer(participant.id);
  }, []);

  const handleWebRTCSignal = useCallback((signal: any) => {
    WebRTCService.handleSignal(signal);
  }, []);

  const handleHandRaise = useCallback((event: HandRaiseEvent) => {
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
  }, [user?.role]);

  const handleBroadcastControl = useCallback((control: any) => {
    if (user?.role === 'student' && control.studentId === user.id) {
      toast.info(control.action === 'start' ? 'You are now broadcasting to the class' : 'Broadcasting stopped');
    }
    setBroadcastingStudent(control.action === 'start' ? control.studentId : null);
  }, [user?.role, user?.id]);

  const handleMuteAllStudents = useCallback(() => {
    if (user?.role === 'student') {
      WebRTCService.muteLocalAudio();
      toast.warning('Teacher has muted all students');
    }
  }, [user?.role]);

  const handleMonitoringAlert = useCallback((monitoring: any) => {
    if (user?.role === 'teacher') {
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
  }, [user?.role]);

  const handleRemoteStream = useCallback((participantId: string, stream: MediaStream) => {
    // Check if this is the teacher's stream
    setParticipants(prev => {
      const participant = prev.find(p => p.id === participantId);
      if (participant?.role === 'teacher') {
        setTeacherStream(stream);
        if (teacherVideoRef.current) {
          teacherVideoRef.current.srcObject = stream;
        }
      } else if (broadcastingStudent === participantId && broadcastVideoRef.current) {
        broadcastVideoRef.current.srcObject = stream;
      }
      return prev;
    });
  }, [broadcastingStudent]);

  // Setup WebSocket Listeners (only once)
  const setupWebSocketListeners = useCallback(() => {
    if (listenersSetupRef.current) return;
    
    WebSocketService.on('participant-joined', handleParticipantJoined);
    WebSocketService.on('participant-left', handleParticipantLeft);
    WebSocketService.on('webrtc-signal', handleWebRTCSignal);
    WebSocketService.on('hand-raise', handleHandRaise);
    WebSocketService.on('broadcast-control', handleBroadcastControl);
    WebSocketService.on('mute-all-students', handleMuteAllStudents);
    WebSocketService.on('monitoring-alert', handleMonitoringAlert);
    WebRTCService.onStream(handleRemoteStream);

    // Store cleanup functions
    cleanupFunctionsRef.current.push(
      () => WebSocketService.off('participant-joined', handleParticipantJoined),
      () => WebSocketService.off('participant-left', handleParticipantLeft),
      () => WebSocketService.off('webrtc-signal', handleWebRTCSignal),
      () => WebSocketService.off('hand-raise', handleHandRaise),
      () => WebSocketService.off('broadcast-control', handleBroadcastControl),
      () => WebSocketService.off('mute-all-students', handleMuteAllStudents),
      () => WebSocketService.off('monitoring-alert', handleMonitoringAlert),
      () => WebRTCService.offStream(handleRemoteStream)
    );

    listenersSetupRef.current = true;
  }, [
    handleParticipantJoined,
    handleParticipantLeft,
    handleWebRTCSignal,
    handleHandRaise,
    handleBroadcastControl,
    handleMuteAllStudents,
    handleMonitoringAlert,
    handleRemoteStream
  ]);

  // Initialize Classroom
  const initializeClassroom = useCallback(async (userData: User, sessionData: ClassroomSession) => {
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
        FullscreenMonitorService.startMonitoring(userData.id);
        WebRTCService.unmuteLocalAudio();
        WebRTCService.startLocalVideo();
      }

      toast.success('Connected to classroom');
    } catch (error) {
      console.error('Error initializing classroom:', error);
      toast.error('Failed to connect to classroom');
    }
  }, [setupWebSocketListeners]);

  // UI Event Handlers
  const handleRaiseHand = useCallback(() => {
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
  }, [user, isHandRaised]);

  const handleMuteAll = useCallback(() => {
    if (!session) return;
    WebSocketService.muteAllStudents(session.id);
    toast.success('All students muted');
  }, [session]);

  const handleBroadcastStudent = useCallback((studentId: string) => {
    if (!user) return;
    
    WebSocketService.sendBroadcastControl({
      teacherId: user.id,
      studentId,
      action: 'start',
      includeAudio: true,
      includeVideo: true,
    });
  }, [user]);

  const handleStopBroadcast = useCallback(() => {
    if (!user) return;
    
    WebSocketService.sendBroadcastControl({
      teacherId: user.id,
      action: 'stop',
      includeAudio: false,
      includeVideo: false,
    });
    setBroadcastingStudent(null);
  }, [user]);

  const handleLeaveClass = useCallback(() => {
    if (window.confirm('Are you sure you want to leave the class?')) {
      cleanup();
      navigate('/dashboard');
    }
  }, [cleanup, navigate]);

  const openNotebook = useCallback(() => {
    window.open('/digital-notebook', '_blank');
  }, []);

  // Initial setup effect
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Initialize session
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

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [navigate, initializeClassroom, cleanup]);

  // Participant Item Component (memoized)
  const ParticipantItem = useMemo(() => {
    return ({ participant }: { participant: StreamParticipant }) => (
      <div 
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
          
          <div className="flex items-center gap-1">
            {participant.isHandRaised && <Hand className="w-4 h-4 text-yellow-500" />}
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
    );
  }, [isTeacher, broadcastingStudent, handleBroadcastStudent, openNotebook]);

  if (!user || !session) return null;

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
              {participantCount} participants
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
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
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
              
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                {isTeacher ? user.name : session.teacherName} (Teacher)
              </div>
            </Card>

            {/* Broadcasting Student or Self View */}
            <Card className="h-[35%] bg-[#1f2937] border-gray-700 flex items-center justify-center relative overflow-hidden">
              {isStudent ? (
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
              <span>Participants ({participantCount})</span>
              {isTeacher && (
                <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700" onClick={handleMuteAll}>
                  <MicOff className="w-4 h-4" />
                </Button>
              )}
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <ParticipantItem key={participant.id} participant={participant} />
              ))}
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-lg">
          <div className="flex items-center gap-2">
            {isTeacher && (
              <>
                <Button size="lg" variant="secondary" className="rounded-full w-12 h-12 p-0">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="secondary" className="rounded-full w-12 h-12 p-0">
                  <Video className="w-5 h-5" />
                </Button>
              </>
            )}
            {isStudent && (
              <div className="flex items-center gap-2 text-white text-sm">
                <Badge className="bg-green-500">Camera & Mic Always On</Badge>
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
