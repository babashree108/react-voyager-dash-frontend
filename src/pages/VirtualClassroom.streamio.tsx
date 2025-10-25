import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamVideo, StreamVideoClient, StreamCall } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Hand, Users, AlertTriangle, BookOpen, Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';
import StreamService from '@/services/stream.service';
import WebSocketService from '@/services/websocket.service';
import FullscreenMonitorService from '@/services/fullscreen-monitor.service';
import { toast } from 'sonner';

/**
 * Virtual Classroom using Stream.io
 * 
 * Features:
 * - Managed video infrastructure (no WebRTC setup needed)
 * - Built-in recording, screen sharing
 * - Better reliability and scalability
 * - Role-based permissions
 */

interface StreamParticipant {
  userId: string;
  name: string;
  role: 'teacher' | 'student';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised: boolean;
  isBroadcasting: boolean;
  isFullscreenActive: boolean;
}

export default function VirtualClassroomStreamIO() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [broadcastingStudent, setBroadcastingStudent] = useState<string | null>(null);
  
  const sessionId = 'session-1'; // Should come from props/route
  const callId = `classroom-${sessionId}`;

  // Initialize Stream.io
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    initializeStream(userData);

    return () => {
      cleanup();
    };
  }, [navigate]);

  const initializeStream = async (userData: User) => {
    try {
      // Get Stream.io credentials from your backend
      const streamConfig = await getStreamCredentials(userData.id);

      // Initialize Stream service
      await StreamService.initialize({
        apiKey: streamConfig.apiKey,
        userId: userData.id,
        userToken: streamConfig.token,
        userName: userData.name,
      });

      // Get client
      const streamClient = StreamService.getClient();
      if (streamClient) {
        setClient(streamClient);
      }

      // Join classroom
      const activeCall = await StreamService.joinClassroom(
        callId,
        userData.role as 'teacher' | 'student'
      );
      
      setCall(activeCall);
      setIsConnected(true);

      // Setup event listeners
      setupEventListeners();

      // Student-specific setup
      if (userData.role === 'student') {
        // Start fullscreen monitoring
        FullscreenMonitorService.startMonitoring(userData.id);
        
        // Camera and mic are always on for students (enforced by Stream.io)
        toast.info('Camera and microphone are always on during class');
      }

      // Connect WebSocket for additional features
      await WebSocketService.connect(userData.id, sessionId);
      WebSocketService.joinSession(sessionId, userData.id, userData.role as 'teacher' | 'student');

      toast.success('Connected to classroom');
    } catch (error) {
      console.error('Failed to initialize classroom:', error);
      toast.error('Failed to connect to classroom');
    }
  };

  // Get Stream.io credentials from backend
  const getStreamCredentials = async (userId: string) => {
    // TODO: Call your backend API to get Stream.io credentials
    // For now, using mock data - REPLACE THIS IN PRODUCTION!
    
    // Your backend should call Stream.io API to generate user token
    // https://getstream.io/chat/docs/react/tokens_and_authentication/
    
    return {
      apiKey: 'YOUR_STREAM_API_KEY', // Get from Stream.io dashboard
      token: 'YOUR_USER_TOKEN', // Generate on backend
    };
  };

  const setupEventListeners = useCallback(() => {
    // Stream.io events
    StreamService.on('participant-joined', (participant: any) => {
      console.log('Participant joined:', participant);
      updateParticipantsList();
    });

    StreamService.on('participant-left', (participant: any) => {
      console.log('Participant left:', participant);
      updateParticipantsList();
    });

    StreamService.on('track-published', () => {
      updateParticipantsList();
    });

    StreamService.on('track-unpublished', () => {
      updateParticipantsList();
    });

    // WebSocket events for additional features
    WebSocketService.on('hand-raise', (event: any) => {
      setParticipants(prev =>
        prev.map(p =>
          p.userId === event.studentId
            ? { ...p, isHandRaised: event.isActive }
            : p
        )
      );
      
      if (user?.role === 'teacher') {
        toast.info(`${event.studentName} raised their hand`);
      }
    });

    WebSocketService.on('monitoring-alert', (monitoring: any) => {
      if (user?.role === 'teacher') {
        setParticipants(prev =>
          prev.map(p =>
            p.userId === monitoring.studentId
              ? {
                  ...p,
                  isFullscreenActive: monitoring.isFullscreenActive,
                }
              : p
          )
        );
      }
    });
  }, [user]);

  const updateParticipantsList = useCallback(() => {
    const streamParticipants = StreamService.getParticipants();
    
    setParticipants(streamParticipants.map(p => ({
      userId: p.userId,
      name: p.name,
      role: p.role,
      isAudioEnabled: p.isAudioEnabled,
      isVideoEnabled: p.isVideoEnabled,
      isHandRaised: false,
      isBroadcasting: broadcastingStudent === p.userId,
      isFullscreenActive: true,
    })));
  }, [broadcastingStudent]);

  // Event handlers
  const handleRaiseHand = useCallback(async () => {
    if (!user) return;
    
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    
    // Notify via Stream.io
    await StreamService.raiseHand(newState);
    
    // Also send via WebSocket for backend logging
    WebSocketService.raiseHand({
      studentId: user.id,
      studentName: user.name,
      timestamp: new Date().toISOString(),
      isActive: newState,
    });
    
    toast.success(newState ? 'Hand raised' : 'Hand lowered');
  }, [user, isHandRaised]);

  const handleMuteAll = useCallback(async () => {
    await StreamService.muteAllStudents();
    WebSocketService.muteAllStudents(sessionId);
    toast.success('All students muted');
  }, [sessionId]);

  const handleBroadcastStudent = useCallback(async (studentId: string) => {
    await StreamService.broadcastStudent(studentId);
    setBroadcastingStudent(studentId);
    toast.success('Student is now broadcasting');
  }, []);

  const handleStopBroadcast = useCallback(async () => {
    if (!broadcastingStudent) return;
    
    await StreamService.stopBroadcast(broadcastingStudent);
    setBroadcastingStudent(null);
    toast.success('Broadcast stopped');
  }, [broadcastingStudent]);

  const handleStartRecording = useCallback(async () => {
    try {
      await StreamService.startRecording();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    }
  }, []);

  const handleStopRecording = useCallback(async () => {
    try {
      await StreamService.stopRecording();
      setIsRecording(false);
      toast.success('Recording stopped');
    } catch (error) {
      toast.error('Failed to stop recording');
    }
  }, []);

  const handleScreenShare = useCallback(async () => {
    try {
      await StreamService.startScreenShare();
      toast.success('Screen sharing started');
    } catch (error) {
      toast.error('Failed to start screen sharing');
    }
  }, []);

  const handleLeaveClass = useCallback(() => {
    if (window.confirm('Are you sure you want to leave the class?')) {
      cleanup();
      navigate('/dashboard');
    }
  }, [navigate]);

  const openNotebook = useCallback(() => {
    window.open('/digital-notebook', '_blank');
  }, []);

  const cleanup = useCallback(() => {
    if (user?.role === 'student') {
      FullscreenMonitorService.stopMonitoring();
    }
    
    StreamService.leaveClassroom();
    
    if (sessionId && user) {
      WebSocketService.leaveSession(sessionId, user.id);
    }
    WebSocketService.disconnect();
  }, [user, sessionId]);

  if (!user || !client) {
    return (
      <DashboardLayout userRole={user?.role || 'student'} userName={user?.name || 'User'}>
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Connecting to classroom...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="h-[calc(100vh-4rem)] bg-[#111827] p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 text-white">
              <div>
                <h2 className="text-2xl font-bold">Advanced Mathematics</h2>
                <p className="text-sm text-gray-400">Live Session • Powered by Stream.io</p>
              </div>
              <div className="flex items-center gap-2">
                {isRecording && (
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
              {/* Video Area - Stream.io will render videos here */}
              <div className="lg:col-span-3 space-y-4">
                {/* Main Video Container */}
                <Card className="h-[60%] bg-[#1f2937] border-gray-700 relative overflow-hidden">
                  {/* Stream.io video components will be rendered here */}
                  <div className="w-full h-full">
                    {/* Teacher or broadcasting student video */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <p className="text-gray-400">Video stream (rendered by Stream.io SDK)</p>
                    </div>
                  </div>
                </Card>

                {/* Secondary Video - Student self-view or broadcast */}
                <Card className="h-[35%] bg-[#1f2937] border-gray-700 relative overflow-hidden">
                  {isStudent && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Badge className="bg-green-500">
                        <Video className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                      <Badge className="bg-green-500">
                        <Mic className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  )}
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <p className="text-gray-400">Self view / Broadcast student</p>
                  </div>
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
                      key={participant.userId}
                      className={`p-3 rounded-lg ${
                        !participant.isFullscreenActive && isTeacher && participant.role === 'student'
                          ? 'bg-red-900/30 border border-red-500'
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
                          {participant.isAudioEnabled ? (
                            <Mic className="w-4 h-4 text-green-500" />
                          ) : (
                            <MicOff className="w-4 h-4 text-red-500" />
                          )}
                          {participant.isVideoEnabled ? (
                            <Video className="w-4 h-4 text-green-500" />
                          ) : (
                            <VideoOff className="w-4 h-4 text-red-500" />
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
                  ))}
                </div>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-lg">
              <div className="flex items-center gap-2">
                {isStudent && (
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Badge className="bg-green-500">Camera & Mic Always On</Badge>
                  </div>
                )}
                {isTeacher && (
                  <Button
                    variant="secondary"
                    className="text-white"
                    onClick={handleScreenShare}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Share Screen
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isStudent && (
                  <>
                    <Button
                      variant={isHandRaised ? 'default' : 'secondary'}
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
                    <Button
                      variant={isRecording ? 'destructive' : 'secondary'}
                      className="text-white"
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                    >
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                  </>
                )}

                <Button variant="destructive" onClick={handleLeaveClass}>
                  Leave Class
                </Button>
              </div>
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </DashboardLayout>
  );
}
