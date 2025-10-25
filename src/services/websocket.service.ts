import { io, Socket } from 'socket.io-client';
import { ClassroomMessage, WebRTCSignal, HandRaiseEvent, BroadcastControl, NotebookPage, StudentMonitoring } from '@/types/classroom.types';

const SOCKET_URL = 'http://localhost:8080';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(userId: string, sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          query: { userId, sessionId },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.setupDefaultHandlers();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupDefaultHandlers(): void {
    if (!this.socket) return;

    // Handle incoming messages
    this.socket.on('classroom-message', (message: ClassroomMessage) => {
      this.notifyHandlers(message.type, message);
    });

    // Handle WebRTC signals
    this.socket.on('webrtc-signal', (signal: WebRTCSignal) => {
      this.notifyHandlers('webrtc-signal', signal);
    });

    // Handle hand raise events
    this.socket.on('hand-raise', (event: HandRaiseEvent) => {
      this.notifyHandlers('hand-raise', event);
    });

    // Handle broadcast control
    this.socket.on('broadcast-control', (control: BroadcastControl) => {
      this.notifyHandlers('broadcast-control', control);
    });

    // Handle notebook updates
    this.socket.on('notebook-update', (page: NotebookPage) => {
      this.notifyHandlers('notebook-update', page);
    });

    // Handle monitoring alerts
    this.socket.on('monitoring-alert', (monitoring: StudentMonitoring) => {
      this.notifyHandlers('monitoring-alert', monitoring);
    });

    // Handle participant updates
    this.socket.on('participant-joined', (participant: any) => {
      this.notifyHandlers('participant-joined', participant);
    });

    this.socket.on('participant-left', (participant: any) => {
      this.notifyHandlers('participant-left', participant);
    });
  }

  public on(event: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(handler);
  }

  public off(event: string, handler: (data: any) => void): void {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private notifyHandlers(event: string, data: any): void {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Send messages
  public sendMessage(message: ClassroomMessage): void {
    if (this.socket?.connected) {
      this.socket.emit('classroom-message', message);
    }
  }

  public sendWebRTCSignal(signal: WebRTCSignal): void {
    if (this.socket?.connected) {
      this.socket.emit('webrtc-signal', signal);
    }
  }

  public raiseHand(event: HandRaiseEvent): void {
    if (this.socket?.connected) {
      this.socket.emit('hand-raise', event);
    }
  }

  public sendBroadcastControl(control: BroadcastControl): void {
    if (this.socket?.connected) {
      this.socket.emit('broadcast-control', control);
    }
  }

  public sendNotebookUpdate(page: NotebookPage): void {
    if (this.socket?.connected) {
      this.socket.emit('notebook-update', page);
    }
  }

  public sendMonitoringAlert(monitoring: StudentMonitoring): void {
    if (this.socket?.connected) {
      this.socket.emit('monitoring-alert', monitoring);
    }
  }

  public muteAllStudents(sessionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('mute-all-students', { sessionId });
    }
  }

  public joinSession(sessionId: string, userId: string, role: 'teacher' | 'student'): void {
    if (this.socket?.connected) {
      this.socket.emit('join-session', { sessionId, userId, role });
    }
  }

  public leaveSession(sessionId: string, userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-session', { sessionId, userId });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageHandlers.clear();
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export default WebSocketService.getInstance();
