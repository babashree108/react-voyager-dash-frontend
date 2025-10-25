// Stream.io specific types

export interface StreamConfig {
  apiKey: string;
  userId: string;
  userToken: string;
  userName: string;
}

export interface StreamCallSettings {
  audio: {
    mic_default_on: boolean;
    default_device: string;
  };
  video: {
    camera_default_on: boolean;
    camera_facing: string;
  };
  screensharing?: {
    enabled: boolean;
  };
}

export interface StreamParticipant {
  userId: string;
  name: string;
  role: 'teacher' | 'student';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised: boolean;
  isBroadcasting: boolean;
  isScreenSharing: boolean;
  joinedAt: string;
}

export interface StreamCustomEvent {
  type: 'hand-raise' | 'broadcast-student' | 'stop-broadcast' | 'mute-all-students' | 'monitoring-alert';
  user_id?: string;
  student_id?: string;
  is_raised?: boolean;
  data?: any;
}

export interface StreamCallMetadata {
  callId: string;
  sessionId: string;
  title: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  isRecording: boolean;
}
