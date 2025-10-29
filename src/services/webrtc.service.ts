import SimplePeer from 'simple-peer';
import { StreamParticipant, WebRTCSignal } from '@/types/classroom.types';
import WebSocketService from './websocket.service';

export class WebRTCService {
  private static instance: WebRTCService;
  private peers: Map<string, SimplePeer.Instance> = new Map();
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private streamHandlers: Set<(participantId: string, stream: MediaStream) => void> = new Set();

  private constructor() {}

  public static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }

  public async initializeLocalStream(
    audioEnabled: boolean = true,
    videoEnabled: boolean = true
  ): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
        video: videoEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public async createPeerConnection(
    participantId: string,
    isInitiator: boolean,
    stream?: MediaStream
  ): Promise<void> {
    if (this.peers.has(participantId)) {
      console.log('Peer connection already exists for:', participantId);
      return;
    }

    const peer = new SimplePeer({
      initiator: isInitiator,
      stream: stream || this.localStream || undefined,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    this.peers.set(participantId, peer);

    peer.on('signal', (signal) => {
      const webRTCSignal: WebRTCSignal = {
        from: this.getCurrentUserId(),
        to: participantId,
        signal,
        type: signal.type as 'offer' | 'answer' | 'ice-candidate',
      };
      WebSocketService.sendWebRTCSignal(webRTCSignal);
    });

    peer.on('stream', (remoteStream) => {
      console.log('Received remote stream from:', participantId);
      this.remoteStreams.set(participantId, remoteStream);
      this.notifyStreamHandlers(participantId, remoteStream);
    });

    peer.on('error', (error) => {
      console.error('Peer error:', participantId, error);
      this.removePeer(participantId);
    });

    peer.on('close', () => {
      console.log('Peer connection closed:', participantId);
      this.removePeer(participantId);
    });
  }

  public async handleSignal(signal: WebRTCSignal): Promise<void> {
    const peer = this.peers.get(signal.from);
    if (peer) {
      peer.signal(signal.signal);
    } else {
      // Create peer connection if it doesn't exist
      await this.createPeerConnection(signal.from, false);
      const newPeer = this.peers.get(signal.from);
      if (newPeer) {
        newPeer.signal(signal.signal);
      }
    }
  }

  public removePeer(participantId: string): void {
    const peer = this.peers.get(participantId);
    if (peer) {
      peer.destroy();
      this.peers.delete(participantId);
    }
    this.remoteStreams.delete(participantId);
  }

  public toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  public toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  public muteLocalAudio(): void {
    this.toggleAudio(false);
  }

  public unmuteLocalAudio(): void {
    this.toggleAudio(true);
  }

  public stopLocalVideo(): void {
    this.toggleVideo(false);
  }

  public startLocalVideo(): void {
    this.toggleVideo(true);
  }

  public getRemoteStream(participantId: string): MediaStream | undefined {
    return this.remoteStreams.get(participantId);
  }

  public getAllRemoteStreams(): Map<string, MediaStream> {
    return this.remoteStreams;
  }

  public onStream(handler: (participantId: string, stream: MediaStream) => void): void {
    this.streamHandlers.add(handler);
  }

  public offStream(handler: (participantId: string, stream: MediaStream) => void): void {
    this.streamHandlers.delete(handler);
  }

  private notifyStreamHandlers(participantId: string, stream: MediaStream): void {
    this.streamHandlers.forEach(handler => handler(participantId, stream));
  }

  public stopAllStreams(): void {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    this.peers.forEach((peer, participantId) => {
      peer.destroy();
    });
    this.peers.clear();

    // Clear remote streams
    this.remoteStreams.clear();
  }

  public replaceStream(newStream: MediaStream): void {
    this.localStream = newStream;
    this.peers.forEach((peer) => {
      const sender = (peer as any)._pc?.getSenders().find(
        (s: RTCRtpSender) => s.track?.kind === 'video'
      );
      if (sender) {
        const videoTrack = newStream.getVideoTracks()[0];
        if (videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
    });
  }

  private getCurrentUserId(): string {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return 'unknown';
  }

  public getPeerConnectionStats(participantId: string): Promise<RTCStatsReport | null> {
    const peer = this.peers.get(participantId);
    if (peer && (peer as any)._pc) {
      return (peer as any)._pc.getStats();
    }
    return Promise.resolve(null);
  }
}

export default WebRTCService.getInstance();
