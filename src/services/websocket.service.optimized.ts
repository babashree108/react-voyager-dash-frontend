import { io, Socket } from 'socket.io-client';
import { ClassroomMessage, WebRTCSignal, HandRaiseEvent, BroadcastControl, NotebookPage, StudentMonitoring } from '@/types/classroom.types';

const SOCKET_URL = 'http://localhost:8080';

// Throttle utility
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecuted = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    if (timeSinceLastExecution >= delay) {
      func(...args);
      lastExecuted = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecuted = Date.now();
      }, delay - timeSinceLastExecution);
    }
  };
}

/**
 * OPTIMIZED WebSocket Service
 * 
 * Improvements:
 * - Message throttling for high-frequency events
 * - Connection state management
 * - Message queuing for offline scenarios
 * - Better error handling and reconnection logic
 * - Memory-efficient handler management
 */
export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private messageQueue: Array<{ event: string; data: any }> = [];
  private isConnecting: boolean = false;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 5;

  // Throttled send functions (avoid flooding)
  private throttledNotebookUpdate!: (page: NotebookPage) => void;
  private throttledMonitoringAlert!: (monitoring: StudentMonitoring) => void;

  private constructor() {
    // Initialize throttled functions
    this.throttledNotebookUpdate = throttle((page: NotebookPage) => {
      this.emitMessage('notebook-update', page);
    }, 1000); // Max 1 update per second

    this.throttledMonitoringAlert = throttle((monitoring: StudentMonitoring) => {
      this.emitMessage('monitoring-alert', monitoring);
    }, 2000); // Max 1 alert every 2 seconds
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(userId: string, sessionId: string): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      return Promise.reject(new Error('Connection already in progress'));
    }

    // Already connected
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    this.isConnecting = true;
    this.connectionAttempts++;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          query: { userId, sessionId },
          transports: ['websocket', 'polling'], // Fallback to polling
          reconnection: true,
          reconnectionAttempts: this.maxConnectionAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 10000,
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.connectionAttempts = 0;
          this.setupDefaultHandlers();
          this.processMessageQueue();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnecting = false;
          
          if (this.connectionAttempts >= this.maxConnectionAttempts) {
            reject(new Error('Max connection attempts reached'));
          }
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.isConnecting = false;
          
          // Attempt auto-reconnect for client-side disconnects
          if (reason === 'io client disconnect') {
            // Don't auto-reconnect if intentional disconnect
            return;
          }
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('WebSocket reconnected after', attemptNumber, 'attempts');
          this.processMessageQueue();
        });

        this.socket.on('reconnect_failed', () => {
          console.error('WebSocket reconnection failed');
          reject(new Error('Failed to reconnect'));
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private setupDefaultHandlers(): void {
    if (!this.socket) return;

    // Batch handler setup
    const handlers = [
      { event: 'classroom-message', handler: (message: ClassroomMessage) => this.notifyHandlers(message.type, message) },
      { event: 'webrtc-signal', handler: (signal: WebRTCSignal) => this.notifyHandlers('webrtc-signal', signal) },
      { event: 'hand-raise', handler: (event: HandRaiseEvent) => this.notifyHandlers('hand-raise', event) },
      { event: 'broadcast-control', handler: (control: BroadcastControl) => this.notifyHandlers('broadcast-control', control) },
      { event: 'notebook-update', handler: (page: NotebookPage) => this.notifyHandlers('notebook-update', page) },
      { event: 'monitoring-alert', handler: (monitoring: StudentMonitoring) => this.notifyHandlers('monitoring-alert', monitoring) },
      { event: 'participant-joined', handler: (participant: any) => this.notifyHandlers('participant-joined', participant) },
      { event: 'participant-left', handler: (participant: any) => this.notifyHandlers('participant-left', participant) },
      { event: 'mute-all-students', handler: (data: any) => this.notifyHandlers('mute-all-students', data) },
    ];

    handlers.forEach(({ event, handler }) => {
      this.socket!.on(event, handler);
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
      
      // Clean up empty handler sets to prevent memory leaks
      if (handlers.size === 0) {
        this.messageHandlers.delete(event);
      }
    }
  }

  private notifyHandlers(event: string, data: any): void {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      // Create array to avoid issues if handler modifies the set
      Array.from(handlers).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in handler for event ${event}:`, error);
        }
      });
    }
  }

  // Generic emit with queuing
  private emitMessage(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      // Queue message for later if not connected
      this.messageQueue.push({ event, data });
      console.warn(`Message queued: ${event} (socket not connected)`);
    }
  }

  // Process queued messages
  private processMessageQueue(): void {
    if (!this.socket?.connected || this.messageQueue.length === 0) return;

    console.log(`Processing ${this.messageQueue.length} queued messages`);
    
    // Process in batches to avoid overwhelming the socket
    const batchSize = 10;
    const batch = this.messageQueue.splice(0, batchSize);
    
    batch.forEach(({ event, data }) => {
      this.socket!.emit(event, data);
    });

    // Continue processing if more messages remain
    if (this.messageQueue.length > 0) {
      setTimeout(() => this.processMessageQueue(), 100);
    }
  }

  // Public send methods
  public sendMessage(message: ClassroomMessage): void {
    this.emitMessage('classroom-message', message);
  }

  public sendWebRTCSignal(signal: WebRTCSignal): void {
    // WebRTC signals should be sent immediately (not throttled)
    this.emitMessage('webrtc-signal', signal);
  }

  public raiseHand(event: HandRaiseEvent): void {
    this.emitMessage('hand-raise', event);
  }

  public sendBroadcastControl(control: BroadcastControl): void {
    this.emitMessage('broadcast-control', control);
  }

  public sendNotebookUpdate(page: NotebookPage): void {
    // Use throttled version for notebook updates
    this.throttledNotebookUpdate(page);
  }

  public sendMonitoringAlert(monitoring: StudentMonitoring): void {
    // Use throttled version for monitoring alerts
    this.throttledMonitoringAlert(monitoring);
  }

  public muteAllStudents(sessionId: string): void {
    this.emitMessage('mute-all-students', { sessionId });
  }

  public joinSession(sessionId: string, userId: string, role: 'teacher' | 'student'): void {
    this.emitMessage('join-session', { sessionId, userId, role });
  }

  public leaveSession(sessionId: string, userId: string): void {
    this.emitMessage('leave-session', { sessionId, userId });
  }

  public disconnect(): void {
    if (this.socket) {
      // Clear message queue
      this.messageQueue = [];
      
      // Disconnect socket
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Clear all handlers to prevent memory leaks
    this.messageHandlers.clear();
    
    this.isConnecting = false;
    this.connectionAttempts = 0;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }

  public clearQueue(): void {
    this.messageQueue = [];
  }

  public getConnectionState(): 'connected' | 'connecting' | 'disconnected' {
    if (this.socket?.connected) return 'connected';
    if (this.isConnecting) return 'connecting';
    return 'disconnected';
  }
}

export default WebSocketService.getInstance();
