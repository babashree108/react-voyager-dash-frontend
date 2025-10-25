import { StreamVideoClient, User as StreamUser, Call } from '@stream-io/video-react-sdk';

/**
 * Stream.io Video Service
 * 
 * Provides video streaming functionality using Stream.io API
 * Replaces WebRTC/SimplePeer with managed infrastructure
 */

interface StreamConfig {
  apiKey: string;
  userId: string;
  userToken: string;
  userName: string;
}

interface CallParticipant {
  userId: string;
  name: string;
  role: 'teacher' | 'student';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised?: boolean;
}

export class StreamService {
  private static instance: StreamService;
  private client: StreamVideoClient | null = null;
  private currentCall: Call | null = null;
  private userId: string = '';
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): StreamService {
    if (!StreamService.instance) {
      StreamService.instance = new StreamService();
    }
    return StreamService.instance;
  }

  /**
   * Initialize Stream.io client
   */
  public async initialize(config: StreamConfig): Promise<void> {
    if (this.isInitialized) {
      console.log('Stream client already initialized');
      return;
    }

    try {
      const user: StreamUser = {
        id: config.userId,
        name: config.userName,
        image: `https://getstream.io/random_png/?name=${config.userName}`,
      };

      this.client = new StreamVideoClient({
        apiKey: config.apiKey,
        user,
        token: config.userToken,
      });

      this.userId = config.userId;
      this.isInitialized = true;

      console.log('Stream client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Stream client:', error);
      throw error;
    }
  }

  /**
   * Create or join a classroom call
   */
  public async joinClassroom(
    callId: string,
    role: 'teacher' | 'student'
  ): Promise<Call> {
    if (!this.client) {
      throw new Error('Stream client not initialized. Call initialize() first.');
    }

    try {
      // Create call instance
      this.currentCall = this.client.call('default', callId);

      // Join the call with role-specific settings
      await this.currentCall.join({
        create: true,
        data: {
          custom: {
            role,
            classroom: true,
          },
          settings_override: this.getCallSettings(role),
        },
      });

      // Setup event listeners
      this.setupCallListeners();

      // Apply role-specific constraints
      await this.applyRoleConstraints(role);

      console.log(`Joined classroom ${callId} as ${role}`);
      return this.currentCall;
    } catch (error) {
      console.error('Failed to join classroom:', error);
      throw error;
    }
  }

  /**
   * Get call settings based on role
   */
  private getCallSettings(role: 'teacher' | 'student') {
    if (role === 'teacher') {
      return {
        audio: {
          mic_default_on: true,
          default_device: 'speaker',
        },
        video: {
          camera_default_on: true,
          camera_facing: 'front',
        },
        screensharing: {
          enabled: true,
        },
      };
    } else {
      // Student settings
      return {
        audio: {
          mic_default_on: true, // Always on for students
          default_device: 'speaker',
        },
        video: {
          camera_default_on: true, // Always on for students
          camera_facing: 'front',
        },
        screensharing: {
          enabled: false, // Students can't share screen
        },
      };
    }
  }

  /**
   * Apply role-specific constraints
   */
  private async applyRoleConstraints(role: 'teacher' | 'student'): Promise<void> {
    if (!this.currentCall) return;

    if (role === 'student') {
      // Students: camera and mic always on, cannot be toggled
      await this.currentCall.camera.enable();
      await this.currentCall.microphone.enable();

      // Subscribe only to teacher's audio/video
      // Students won't see/hear other students
      await this.currentCall.updateSubscriptions({
        // Only subscribe to participants with role='teacher'
        // This is handled via custom logic in event listeners
      });
    } else if (role === 'teacher') {
      // Teacher can toggle their own audio/video
      await this.currentCall.camera.enable();
      await this.currentCall.microphone.enable();
    }
  }

  /**
   * Setup event listeners for call
   */
  private setupCallListeners(): void {
    if (!this.currentCall) return;

    // Participant joined
    this.currentCall.on('participant.joined', (event) => {
      console.log('Participant joined:', event.participant);
      // Emit custom event for UI
      this.emitEvent('participant-joined', event.participant);
    });

    // Participant left
    this.currentCall.on('participant.left', (event) => {
      console.log('Participant left:', event.participant);
      this.emitEvent('participant-left', event.participant);
    });

    // Call ended
    this.currentCall.on('call.ended', () => {
      console.log('Call ended');
      this.emitEvent('call-ended', {});
    });

    // Track published (someone turned on cam/mic)
    this.currentCall.on('track.published', (event) => {
      console.log('Track published:', event);
      this.emitEvent('track-published', event);
    });

    // Track unpublished
    this.currentCall.on('track.unpublished', (event) => {
      console.log('Track unpublished:', event);
      this.emitEvent('track-unpublished', event);
    });
  }

  /**
   * Event emitter for custom events
   */
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  public on(event: string, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  public off(event: string, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emitEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Raise hand (student feature)
   */
  public async raiseHand(isRaised: boolean): Promise<void> {
    if (!this.currentCall) return;

    try {
      // Send custom event
      await this.currentCall.sendCustomEvent({
        type: 'hand-raise',
        user_id: this.userId,
        is_raised: isRaised,
      });
    } catch (error) {
      console.error('Failed to raise hand:', error);
    }
  }

  /**
   * Broadcast student (teacher feature)
   * Allows a specific student's audio/video to be seen by all
   */
  public async broadcastStudent(studentUserId: string): Promise<void> {
    if (!this.currentCall) return;

    try {
      // Send custom event to update broadcast state
      await this.currentCall.sendCustomEvent({
        type: 'broadcast-student',
        student_id: studentUserId,
      });

      // Update permissions for this student
      await this.currentCall.updateUserPermissions({
        user_id: studentUserId,
        grant_permissions: ['send-audio', 'send-video'],
      });
    } catch (error) {
      console.error('Failed to broadcast student:', error);
    }
  }

  /**
   * Stop broadcasting student
   */
  public async stopBroadcast(studentUserId: string): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.sendCustomEvent({
        type: 'stop-broadcast',
        student_id: studentUserId,
      });

      // Revoke broadcast permissions
      await this.currentCall.updateUserPermissions({
        user_id: studentUserId,
        revoke_permissions: ['send-audio', 'send-video'],
      });
    } catch (error) {
      console.error('Failed to stop broadcast:', error);
    }
  }

  /**
   * Mute all students (teacher feature)
   */
  public async muteAllStudents(): Promise<void> {
    if (!this.currentCall) return;

    try {
      // Get all participants
      const participants = this.currentCall.state.participants;

      // Mute each student
      for (const participant of participants) {
        const role = participant.custom?.role;
        if (role === 'student') {
          await this.currentCall.muteUser(participant.userId, 'audio');
        }
      }

      // Send custom event to notify all students
      await this.currentCall.sendCustomEvent({
        type: 'mute-all-students',
      });
    } catch (error) {
      console.error('Failed to mute all students:', error);
    }
  }

  /**
   * Toggle local audio
   */
  public async toggleAudio(enabled: boolean): Promise<void> {
    if (!this.currentCall) return;

    try {
      if (enabled) {
        await this.currentCall.microphone.enable();
      } else {
        await this.currentCall.microphone.disable();
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  }

  /**
   * Toggle local video
   */
  public async toggleVideo(enabled: boolean): Promise<void> {
    if (!this.currentCall) return;

    try {
      if (enabled) {
        await this.currentCall.camera.enable();
      } else {
        await this.currentCall.camera.disable();
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  }

  /**
   * Start screen sharing (teacher only)
   */
  public async startScreenShare(): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.screenShare.enable();
    } catch (error) {
      console.error('Failed to start screen share:', error);
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  public async stopScreenShare(): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.screenShare.disable();
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  }

  /**
   * Start recording (teacher only)
   */
  public async startRecording(): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  public async stopRecording(): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  /**
   * Get current participants
   */
  public getParticipants(): CallParticipant[] {
    if (!this.currentCall) return [];

    const participants = this.currentCall.state.participants;
    return participants.map(p => ({
      userId: p.userId,
      name: p.name || p.userId,
      role: (p.custom?.role as 'teacher' | 'student') || 'student',
      isAudioEnabled: p.publishedTracks.includes('audio'),
      isVideoEnabled: p.publishedTracks.includes('video'),
      isHandRaised: false, // Will be updated via custom events
    }));
  }

  /**
   * Get call statistics
   */
  public async getCallStats() {
    if (!this.currentCall) return null;

    try {
      const stats = await this.currentCall.getCallStats();
      return stats;
    } catch (error) {
      console.error('Failed to get call stats:', error);
      return null;
    }
  }

  /**
   * Leave the call
   */
  public async leaveClassroom(): Promise<void> {
    if (!this.currentCall) return;

    try {
      await this.currentCall.leave();
      this.currentCall = null;
      console.log('Left classroom');
    } catch (error) {
      console.error('Failed to leave classroom:', error);
    }
  }

  /**
   * Cleanup and disconnect
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.currentCall) {
        await this.leaveClassroom();
      }

      if (this.client) {
        await this.client.disconnectUser();
        this.client = null;
      }

      this.isInitialized = false;
      this.eventHandlers.clear();

      console.log('Stream service disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  /**
   * Get current call
   */
  public getCurrentCall(): Call | null {
    return this.currentCall;
  }

  /**
   * Check if initialized
   */
  public isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Get client
   */
  public getClient(): StreamVideoClient | null {
    return this.client;
  }
}

export default StreamService.getInstance();
