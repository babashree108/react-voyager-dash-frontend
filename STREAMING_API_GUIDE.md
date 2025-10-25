# 📡 Streaming API Complete Guide

A comprehensive guide to WebRTC, WebSocket, and Media Streaming APIs used in the Virtual Classroom.

---

## Table of Contents
1. [WebRTC API](#webrtc-api)
2. [WebSocket API](#websocket-api)
3. [MediaStream API](#mediastream-api)
4. [Canvas Streaming](#canvas-streaming)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🎥 WebRTC API

### Overview
WebRTC (Web Real-Time Communication) enables peer-to-peer audio/video streaming in the browser.

### Core Concepts

#### 1. **RTCPeerConnection**
The main WebRTC API for peer-to-peer connections.

```typescript
// Create peer connection
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:turn.example.com:3478',
      username: 'user',
      credential: 'pass'
    }
  ]
});

// Add local stream
localStream.getTracks().forEach(track => {
  peerConnection.addTrack(track, localStream);
});

// Handle remote stream
peerConnection.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

#### 2. **ICE (Interactive Connectivity Establishment)**
Process of finding the best path to connect peers.

```typescript
// ICE Candidate Types (in order of preference):
// 1. host - Direct local IP (fastest)
// 2. srflx - Server reflexive (through STUN)
// 3. relay - Relayed (through TURN, slowest but most reliable)

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Send to remote peer via signaling server
    signalingServer.send({
      type: 'ice-candidate',
      candidate: event.candidate
    });
  }
};
```

#### 3. **SDP (Session Description Protocol)**
Describes media capabilities and connection information.

```typescript
// Create offer (initiator)
const offer = await peerConnection.createOffer({
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
});
await peerConnection.setLocalDescription(offer);

// Send offer to remote peer
signalingServer.send({ type: 'offer', sdp: offer });

// On remote peer: create answer
await peerConnection.setRemoteDescription(remoteOffer);
const answer = await peerConnection.createAnswer();
await peerConnection.setLocalDescription(answer);

// Send answer back
signalingServer.send({ type: 'answer', sdp: answer });
```

### SimplePeer Library
Higher-level abstraction over WebRTC.

```typescript
import SimplePeer from 'simple-peer';

// Initiator
const peer1 = new SimplePeer({
  initiator: true,
  stream: localStream,
  trickle: true
});

peer1.on('signal', data => {
  // Send signal to other peer
  sendToOtherPeer(data);
});

peer1.on('stream', remoteStream => {
  // Got remote stream
  remoteVideo.srcObject = remoteStream;
});

// Responder
const peer2 = new SimplePeer({
  initiator: false,
  stream: localStream
});

// Signal from peer1
peer2.signal(signalDataFromPeer1);
```

### Connection States

```typescript
peerConnection.onconnectionstatechange = () => {
  switch (peerConnection.connectionState) {
    case 'new':
      console.log('Starting connection');
      break;
    case 'connecting':
      console.log('Connecting...');
      break;
    case 'connected':
      console.log('Connected!');
      break;
    case 'disconnected':
      console.log('Disconnected');
      // Attempt reconnection
      break;
    case 'failed':
      console.log('Connection failed');
      // Create new connection
      break;
    case 'closed':
      console.log('Connection closed');
      break;
  }
};
```

### Media Constraints

```typescript
// High quality
const highQuality = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 2
  },
  video: {
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
    frameRate: { ideal: 30, max: 30 },
    facingMode: 'user'
  }
};

// Medium quality (recommended)
const mediumQuality = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 1 // Mono saves bandwidth
  },
  video: {
    width: { ideal: 1280, max: 1280 },
    height: { ideal: 720, max: 720 },
    frameRate: { ideal: 24, max: 30 }
  }
};

// Low quality (poor connections)
const lowQuality = {
  audio: true,
  video: {
    width: { ideal: 640, max: 640 },
    height: { ideal: 480, max: 480 },
    frameRate: { ideal: 15, max: 20 }
  }
};
```

### Bandwidth Management

```typescript
// Get video sender
const sender = peerConnection
  .getSenders()
  .find(s => s.track?.kind === 'video');

if (sender) {
  const parameters = sender.getParameters();
  
  if (!parameters.encodings) {
    parameters.encodings = [{}];
  }
  
  // Limit bitrate
  parameters.encodings[0].maxBitrate = 500000; // 500 kbps
  
  // Or set quality
  parameters.encodings[0].maxFramerate = 24;
  parameters.encodings[0].scaleResolutionDownBy = 2; // Half resolution
  
  await sender.setParameters(parameters);
}
```

### Stats Monitoring

```typescript
async function getConnectionStats(peerConnection: RTCPeerConnection) {
  const stats = await peerConnection.getStats();
  
  let report = {
    video: {
      bytesReceived: 0,
      packetsLost: 0,
      frameRate: 0
    },
    audio: {
      bytesReceived: 0,
      packetsLost: 0
    }
  };
  
  stats.forEach(stat => {
    if (stat.type === 'inbound-rtp') {
      if (stat.kind === 'video') {
        report.video.bytesReceived = stat.bytesReceived;
        report.video.packetsLost = stat.packetsLost;
        report.video.frameRate = stat.framesPerSecond;
      } else if (stat.kind === 'audio') {
        report.audio.bytesReceived = stat.bytesReceived;
        report.audio.packetsLost = stat.packetsLost;
      }
    }
  });
  
  return report;
}

// Use it
setInterval(async () => {
  const stats = await getConnectionStats(peerConnection);
  console.log('Connection quality:', stats);
  
  // Calculate packet loss
  const videoLossRate = stats.video.packetsLost / 
    (stats.video.packetsLost + stats.video.packetsReceived);
  
  if (videoLossRate > 0.05) {
    console.warn('High packet loss, reducing quality');
    // Reduce bitrate
  }
}, 5000);
```

---

## 🔌 WebSocket API

### Socket.IO Implementation

```typescript
import { io, Socket } from 'socket.io-client';

// Connect
const socket: Socket = io('http://localhost:8080', {
  // Connection options
  transports: ['websocket', 'polling'], // Try websocket first
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  
  // Authentication
  auth: {
    token: 'your-jwt-token'
  },
  
  // Query parameters
  query: {
    userId: 'user123',
    sessionId: 'session456'
  }
});

// Connection events
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  
  if (reason === 'io server disconnect') {
    // Server disconnected, reconnect manually
    socket.connect();
  }
  // Otherwise, will auto-reconnect
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

// Send messages
socket.emit('message', { type: 'chat', content: 'Hello!' });

// Receive messages
socket.on('message', (data) => {
  console.log('Received:', data);
});

// Request-response pattern
socket.emit('get-users', (response) => {
  console.log('Users:', response);
});

// Rooms
socket.emit('join-room', 'classroom-1');
socket.emit('leave-room', 'classroom-1');

// Cleanup
socket.disconnect();
```

### Message Throttling

```typescript
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

// Usage
const throttledUpdate = throttle((data) => {
  socket.emit('update', data);
}, 1000); // Max 1 update per second

// Call as often as needed, will throttle automatically
throttledUpdate({ x: 100, y: 200 });
throttledUpdate({ x: 110, y: 210 });
throttledUpdate({ x: 120, y: 220 });
```

### Message Queuing

```typescript
class MessageQueue {
  private queue: Array<{ event: string; data: any }> = [];
  private processing: boolean = false;

  add(event: string, data: any) {
    this.queue.push({ event, data });
    this.process();
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { event, data } = this.queue.shift()!;
      
      try {
        await this.send(event, data);
      } catch (error) {
        console.error('Failed to send:', error);
        // Re-queue on failure
        this.queue.unshift({ event, data });
        break;
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.processing = false;
  }

  private async send(event: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      socket.emit(event, data, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
  }
}
```

### Binary Data

```typescript
// Send binary data
const buffer = new ArrayBuffer(1024);
socket.emit('binary-data', buffer);

// Receive binary data
socket.on('binary-data', (buffer: ArrayBuffer) => {
  console.log('Received bytes:', buffer.byteLength);
});

// Or use Blob
canvas.toBlob(blob => {
  socket.emit('canvas-update', blob);
}, 'image/png', 0.8);
```

---

## 📹 MediaStream API

### Getting User Media

```typescript
// Basic
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
});

// Advanced constraints
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,
    sampleRate: 48000
  },
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: 'user', // or 'environment' for back camera
    aspectRatio: 16/9
  }
});

// Error handling
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  });
} catch (error) {
  if (error.name === 'NotAllowedError') {
    console.error('Permission denied');
  } else if (error.name === 'NotFoundError') {
    console.error('No camera/microphone found');
  } else if (error.name === 'NotReadableError') {
    console.error('Device is in use by another application');
  } else {
    console.error('Error:', error);
  }
}
```

### Display Media (Screen Sharing)

```typescript
// Capture screen
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: {
    cursor: 'always', // Show cursor
    displaySurface: 'monitor' // or 'window', 'application'
  },
  audio: false // Screen audio (browser support varies)
});

// Stop screen sharing
screenStream.getTracks().forEach(track => track.stop());

// Handle user stopping share
screenStream.getVideoTracks()[0].onended = () => {
  console.log('User stopped screen sharing');
};
```

### Track Management

```typescript
// Get tracks
const audioTracks = stream.getAudioTracks();
const videoTracks = stream.getVideoTracks();

// Enable/disable
audioTracks[0].enabled = false; // Mute
videoTracks[0].enabled = false; // Stop video

// Stop track (cannot be restarted)
audioTracks[0].stop();

// Replace track
const newVideoTrack = await navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(s => s.getVideoTracks()[0]);

const sender = peerConnection
  .getSenders()
  .find(s => s.track?.kind === 'video');

if (sender) {
  await sender.replaceTrack(newVideoTrack);
}

// Clone stream (useful for recording)
const clonedStream = stream.clone();

// Add/remove tracks
stream.addTrack(newTrack);
stream.removeTrack(oldTrack);
```

### Audio Processing

```typescript
// Audio context for processing
const audioContext = new AudioContext();
const source = audioContext.createMediaStreamSource(stream);

// Add filters
const filter = audioContext.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 1000;

source.connect(filter);
filter.connect(audioContext.destination);

// Get processed stream
const destination = audioContext.createMediaStreamDestination();
filter.connect(destination);
const processedStream = destination.stream;
```

---

## 🎨 Canvas Streaming

### Capture Canvas Stream

```typescript
// Get stream from canvas
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const stream = canvas.captureStream(30); // 30 FPS

// Add to peer connection
stream.getTracks().forEach(track => {
  peerConnection.addTrack(track, stream);
});

// Or send as data
setInterval(() => {
  const dataURL = canvas.toDataURL('image/jpeg', 0.8);
  socket.emit('canvas-update', dataURL);
}, 1000);
```

### Optimized Canvas Drawing

```typescript
class OptimizedCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas?: OffscreenCanvas;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      alpha: false, // Opaque background (faster)
      desynchronized: true // Don't wait for vsync
    })!;

    // Use OffscreenCanvas for better performance
    if ('OffscreenCanvas' in window) {
      this.offscreenCanvas = new OffscreenCanvas(
        canvas.width,
        canvas.height
      );
    }
  }

  draw(callback: (ctx: CanvasRenderingContext2D) => void) {
    requestAnimationFrame(() => {
      if (this.offscreenCanvas) {
        const offCtx = this.offscreenCanvas.getContext('2d')!;
        callback(offCtx);
        
        // Copy to main canvas
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
      } else {
        callback(this.ctx);
      }
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
```

---

## ✅ Best Practices

### 1. Always Handle Errors

```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  });
} catch (error) {
  // Show user-friendly message
  showErrorMessage('Please allow camera and microphone access');
}
```

### 2. Clean Up Resources

```typescript
// Stop all tracks
stream.getTracks().forEach(track => track.stop());

// Close peer connection
peerConnection.close();

// Disconnect socket
socket.disconnect();
```

### 3. Use Feature Detection

```typescript
if ('mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices) {
  // WebRTC supported
} else {
  // Show fallback UI
}
```

### 4. Implement Reconnection Logic

```typescript
let reconnectAttempts = 0;
const maxAttempts = 5;

function reconnect() {
  if (reconnectAttempts >= maxAttempts) {
    showError('Unable to connect');
    return;
  }
  
  reconnectAttempts++;
  setTimeout(() => {
    connect();
  }, 1000 * reconnectAttempts);
}
```

### 5. Monitor Performance

```typescript
const performanceMonitor = {
  fps: 0,
  lastTime: performance.now(),
  frameCount: 0,

  update() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = now;
      
      console.log('FPS:', this.fps);
      
      if (this.fps < 20) {
        console.warn('Low FPS detected');
        // Reduce quality
      }
    }
  }
};

// In animation loop
function animate() {
  performanceMonitor.update();
  requestAnimationFrame(animate);
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Connection Fails
```typescript
// Add more STUN/TURN servers
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
  ]
};
```

#### 2. Poor Video Quality
```typescript
// Reduce bitrate
sender.setParameters({
  encodings: [{
    maxBitrate: 300000 // 300 kbps
  }]
});
```

#### 3. Audio Echo
```typescript
// Enable echo cancellation
const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};
```

#### 4. High Latency
```typescript
// Use lower buffer size
const audioContext = new AudioContext({
  latencyHint: 'interactive', // or 'balanced', 'playback'
  sampleRate: 48000
});
```

---

## 📚 References

- [WebRTC API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [MediaStream API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [SimplePeer Documentation](https://github.com/feross/simple-peer)

---

**Last Updated:** 2025-10-21
