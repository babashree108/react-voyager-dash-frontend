// Virtual Classroom Types

export interface StreamParticipant {
  id: string;
  userId: string;
  name: string;
  role: 'teacher' | 'student';
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  isBroadcasting: boolean;
  isFullscreenActive: boolean;
  isWindowFocused: boolean;
  notebookId?: string;
}

export interface ClassroomSession {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'ended';
  isRecording: boolean;
  isBroadcastActive: boolean;
  participants: StreamParticipant[];
}

export interface NotebookPage {
  id: string;
  studentId: string;
  sessionId: string;
  pageNumber: number;
  canvasData: string; // Base64 encoded canvas data
  timestamp: string;
}

export interface DigitalNotebook {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  pages: NotebookPage[];
  lastUpdated: string;
}

export interface HandRaiseEvent {
  studentId: string;
  studentName: string;
  timestamp: string;
  isActive: boolean;
}

export interface StudentMonitoring {
  studentId: string;
  isFullscreenActive: boolean;
  isWindowFocused: boolean;
  lastActivityTime: string;
  violations: WindowViolation[];
}

export interface WindowViolation {
  id: string;
  studentId: string;
  type: 'fullscreen_exit' | 'window_blur' | 'tab_switch';
  timestamp: string;
  duration?: number;
}

export interface WebRTCSignal {
  from: string;
  to: string;
  signal: any; // SimplePeer signal data
  type: 'offer' | 'answer' | 'ice-candidate';
}

export interface ClassroomMessage {
  type: 'join' | 'leave' | 'stream-update' | 'hand-raise' | 'broadcast-control' | 
        'mute-all' | 'notebook-update' | 'monitoring-alert' | 'signal';
  payload: any;
  from: string;
  timestamp: string;
}

export interface BroadcastControl {
  teacherId: string;
  studentId?: string; // Student to broadcast, null means stop all broadcasts
  action: 'start' | 'stop';
  includeAudio: boolean;
  includeVideo: boolean;
}

export interface TeacherControls {
  canMuteAll: boolean;
  canEnableBroadcast: boolean;
  canStopBroadcast: boolean;
  canViewNotebooks: boolean;
  canMonitorStudents: boolean;
}

export interface StudentControls {
  canToggleMic: boolean;
  canToggleVideo: boolean;
  canExitFullscreen: boolean;
  canRaiseHand: boolean;
  canAccessNotebook: boolean;
}

export interface NotebookDrawing {
  type: 'line' | 'rect' | 'circle' | 'text' | 'eraser';
  points?: { x: number; y: number }[];
  color: string;
  width: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
}

export interface CanvasState {
  drawings: NotebookDrawing[];
  backgroundImage?: string;
  pageNumber: number;
  lastModified: string;
}
