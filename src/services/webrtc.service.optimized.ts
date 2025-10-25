import SimplePeer from 'simple-peer';
import { WebRTCSignal } from '@/types/classroom.types';
import WebSocketService from './websocket.service';

/**
 * OPTIMIZED WebRTC Service
 * 
 * Improvements:
 * - Connection quality monitoring
 * - Automatic bitrate adaptation
 * - Better peer lifecycle management
 * - Stream cleanup and memory management
 * - Connection state tracking
 * - Bandwidth optimization
 */

interface PeerConnection {
  peer: SimplePeer.Instance;
  state: 'connecting' | 'connected' | 'failed' | 'closed';
  quality: 'excellent' | 'good' | 'poor' | 'unknown';
  lastActivity: number;
}

interface StreamConstraints {
  video: {
    width: number;
    height: number;
    frameRate: number;
  };
  audio: boolean;
}

export class WebRTCService {
  private static instance: WebRTCService;
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private streamHandlers: Set<(participantId: string, stream: MediaStream) => void> = new Set();
  
  // Quality monitoring
  private qualityCheckInterval: NodeJS.Timeout | null = null;
  private currentQuality: 'high' | 'medium' | 'low' = 'high';

  // ICE servers with fallbacks
  private readonly iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ];

  // Stream quality presets
  private readonly qualityPresets: Record<'high' | 'medium' | 'low', StreamConstraints> = {
    high: {
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: true,
    },
    medium: {
      video: { width: 640, height: 480, frameRate: 24 },
      audio: true,
    },
    low: {
      video: { width: 320, height: 240, frameRate: 15 },
      audio: true,
    },
  };

  private constructor() {}

  public static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }

  public async initializeLocalStream(
    audioEnabled: boolean = true,
    videoEnabled: boolean = true,
    quality: 'high' | 'medium' | 'low' = 'high'
  ): Promise<MediaStream> {
    try {
      // Stop existing stream if any
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      const preset = this.qualityPresets[quality];
      this.currentQuality = quality;

      const constraints: MediaStreamConstraints = {
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1, // Mono for bandwidth savings
        } : false,
        video: videoEnabled ? {
          width: { ideal: preset.video.width, max: preset.video.width },
          height: { ideal: preset.video.height, max: preset.video.height },
          frameRate: { ideal: preset.video.frameRate, max: preset.video.frameRate },
          facingMode: 'user',
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Start quality monitoring
      this.startQualityMonitoring();
      
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // Fallback to lower quality if high quality fails
      if (quality === 'high') {
        console.log('Falling back to medium quality');
        return this.initializeLocalStream(audioEnabled, videoEnabled, 'medium');
      } else if (quality === 'medium') {
        console.log('Falling back to low quality');
        return this.initializeLocalStream(audioEnabled, videoEnabled, 'low');
      }
      
      throw error;
    }
  }

  public async createPeerConnection(
    participantId: string,
    isInitiator: boolean,
    stream?: MediaStream
  ): Promise<void> {
    // Check if peer already exists
    if (this.peers.has(participantId)) {
      console.log('Peer connection already exists for:', participantId);
      return;
    }

    try {
      const peer = new SimplePeer({
        initiator: isInitiator,
        stream: stream || this.localStream || undefined,
        trickle: true,
        config: {
          iceServers: this.iceServers,
          // Optimize for better performance
          iceCandidatePoolSize: 10,
        },
      });

      const peerConnection: PeerConnection = {
        peer,
        state: 'connecting',
        quality: 'unknown',
        lastActivity: Date.now(),
      };

      this.peers.set(participantId, peerConnection);

      // Handle signals
      peer.on('signal', (signal) => {
        const webRTCSignal: WebRTCSignal = {
          from: this.getCurrentUserId(),
          to: participantId,
          signal,
          type: signal.type as 'offer' | 'answer' | 'ice-candidate',
        };
        WebSocketService.sendWebRTCSignal(webRTCSignal);
      });

      // Handle remote stream
      peer.on('stream', (remoteStream) => {
        console.log('Received remote stream from:', participantId);
        peerConnection.state = 'connected';
        peerConnection.lastActivity = Date.now();
        this.remoteStreams.set(participantId, remoteStream);
        this.notifyStreamHandlers(participantId, remoteStream);
      });

      // Handle connection state
      peer.on('connect', () => {
        console.log('Peer connected:', participantId);
        peerConnection.state = 'connected';
        peerConnection.lastActivity = Date.now();
      });

      // Handle errors
      peer.on('error', (error) => {
        console.error('Peer error:', participantId, error);
        peerConnection.state = 'failed';
        
        // Attempt reconnection after a delay
        setTimeout(() => {
          if (this.peers.has(participantId)) {
            this.reconnectPeer(participantId, isInitiator);
          }
        }, 3000);
      });

      // Handle close
      peer.on('close', () => {
        console.log('Peer connection closed:', participantId);
        peerConnection.state = 'closed';
        this.removePeer(participantId);
      });

    } catch (error) {
      console.error('Error creating peer connection:', error);
      this.peers.delete(participantId);
      throw error;
    }
  }

  private async reconnectPeer(participantId: string, wasInitiator: boolean): Promise<void> {
    console.log('Attempting to reconnect peer:', participantId);
    this.removePeer(participantId);
    await this.createPeerConnection(participantId, wasInitiator);
  }

  public async handleSignal(signal: WebRTCSignal): Promise<void> {
    const peerConnection = this.peers.get(signal.from);
    
    if (peerConnection) {
      try {
        peerConnection.peer.signal(signal.signal);
        peerConnection.lastActivity = Date.now();
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    } else {
      // Create peer connection if it doesn't exist (someone initiated connection)
      await this.createPeerConnection(signal.from, false);
      const newPeerConnection = this.peers.get(signal.from);
      if (newPeerConnection) {
        try {
          newPeerConnection.peer.signal(signal.signal);
        } catch (error) {
          console.error('Error handling signal for new peer:', error);
        }
      }
    }
  }

  public removePeer(participantId: string): void {
    const peerConnection = this.peers.get(participantId);
    if (peerConnection) {
      try {
        peerConnection.peer.destroy();
      } catch (error) {
        console.error('Error destroying peer:', error);
      }
      this.peers.delete(participantId);
    }
    
    // Clean up remote stream
    const remoteStream = this.remoteStreams.get(participantId);
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStreams.delete(participantId);
    }
  }

  // Quality monitoring
  private startQualityMonitoring(): void {
    if (this.qualityCheckInterval) {
      clearInterval(this.qualityCheckInterval);
    }

    this.qualityCheckInterval = setInterval(() => {
      this.checkConnectionQuality();
    }, 5000); // Check every 5 seconds
  }

  private async checkConnectionQuality(): Promise<void> {
    for (const [participantId, peerConnection] of this.peers.entries()) {
      if (peerConnection.state !== 'connected') continue;

      try {
        const stats = await this.getPeerConnectionStats(participantId);
        if (stats) {
          const quality = this.analyzeConnectionQuality(stats);
          peerConnection.quality = quality;
          
          // Adapt quality if needed
          if (quality === 'poor' && this.currentQuality !== 'low') {
            console.log('Poor connection detected, reducing quality');
            this.adaptQuality('down');
          }
        }
      } catch (error) {
        console.error('Error checking connection quality:', error);
      }
    }
  }

  private analyzeConnectionQuality(stats: RTCStatsReport): 'excellent' | 'good' | 'poor' | 'unknown' {
    let packetsLost = 0;
    let packetsReceived = 0;
    let bytesReceived = 0;

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        packetsLost = report.packetsLost || 0;
        packetsReceived = report.packetsReceived || 0;
        bytesReceived = report.bytesReceived || 0;
      }
    });

    if (packetsReceived === 0) return 'unknown';

    const packetLossRate = packetsLost / (packetsLost + packetsReceived);

    if (packetLossRate < 0.02 && bytesReceived > 0) return 'excellent';
    if (packetLossRate < 0.05) return 'good';
    return 'poor';
  }

  private async adaptQuality(direction: 'up' | 'down'): Promise<void> {
    const qualityLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
    const currentIndex = qualityLevels.indexOf(this.currentQuality);
    
    let newIndex = currentIndex;
    if (direction === 'down' && currentIndex < qualityLevels.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex !== currentIndex) {
      const newQuality = qualityLevels[newIndex];
      console.log(`Adapting quality from ${this.currentQuality} to ${newQuality}`);
      
      try {
        await this.initializeLocalStream(true, true, newQuality);
        // Restart peer connections with new stream
        this.restartAllPeers();
      } catch (error) {
        console.error('Error adapting quality:', error);
      }
    }
  }

  private restartAllPeers(): void {
    const peerIds = Array.from(this.peers.keys());
    peerIds.forEach(async (participantId) => {
      const wasInitiator = this.peers.get(participantId)?.state === 'connected';
      await this.reconnectPeer(participantId, wasInitiator);
    });
  }

  // Audio/Video controls
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

  // Getters
  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(participantId: string): MediaStream | undefined {
    return this.remoteStreams.get(participantId);
  }

  public getAllRemoteStreams(): Map<string, MediaStream> {
    return new Map(this.remoteStreams);
  }

  public getPeerState(participantId: string): string | undefined {
    return this.peers.get(participantId)?.state;
  }

  public getPeerQuality(participantId: string): string | undefined {
    return this.peers.get(participantId)?.quality;
  }

  // Stream handlers
  public onStream(handler: (participantId: string, stream: MediaStream) => void): void {
    this.streamHandlers.add(handler);
  }

  public offStream(handler: (participantId: string, stream: MediaStream) => void): void {
    this.streamHandlers.delete(handler);
  }

  private notifyStreamHandlers(participantId: string, stream: MediaStream): void {
    // Use setTimeout to avoid blocking the event loop
    setTimeout(() => {
      this.streamHandlers.forEach(handler => {
        try {
          handler(participantId, stream);
        } catch (error) {
          console.error('Error in stream handler:', error);
        }
      });
    }, 0);
  }

  // Cleanup
  public stopAllStreams(): void {
    // Stop quality monitoring
    if (this.qualityCheckInterval) {
      clearInterval(this.qualityCheckInterval);
      this.qualityCheckInterval = null;
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    this.peers.forEach((peerConnection) => {
      try {
        peerConnection.peer.destroy();
      } catch (error) {
        console.error('Error destroying peer:', error);
      }
    });
    this.peers.clear();

    // Clean up remote streams
    this.remoteStreams.forEach((stream) => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.remoteStreams.clear();

    // Clear handlers
    this.streamHandlers.clear();
  }

  public replaceStream(newStream: MediaStream): void {
    this.localStream = newStream;
    
    this.peers.forEach((peerConnection) => {
      const peer = peerConnection.peer;
      try {
        const sender = (peer as any)._pc?.getSenders().find(
          (s: RTCRtpSender) => s.track?.kind === 'video'
        );
        if (sender) {
          const videoTrack = newStream.getVideoTracks()[0];
          if (videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        }
      } catch (error) {
        console.error('Error replacing track:', error);
      }
    });
  }

  public async getPeerConnectionStats(participantId: string): Promise<RTCStatsReport | null> {
    const peerConnection = this.peers.get(participantId);
    if (peerConnection && (peerConnection.peer as any)._pc) {
      try {
        return await (peerConnection.peer as any)._pc.getStats();
      } catch (error) {
        console.error('Error getting stats:', error);
        return null;
      }
    }
    return null;
  }

  private getCurrentUserId(): string {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return 'unknown';
  }

  // Diagnostics
  public getConnectionStats(): {
    totalPeers: number;
    connectedPeers: number;
    qualitySummary: Record<string, number>;
  } {
    const stats = {
      totalPeers: this.peers.size,
      connectedPeers: 0,
      qualitySummary: {
        excellent: 0,
        good: 0,
        poor: 0,
        unknown: 0,
      },
    };

    this.peers.forEach((peerConnection) => {
      if (peerConnection.state === 'connected') {
        stats.connectedPeers++;
      }
      stats.qualitySummary[peerConnection.quality]++;
    });

    return stats;
  }
}

export default WebRTCService.getInstance();
