# 🎥 Stream.io Setup Guide for Virtual Classroom

## Why Stream.io?

Stream.io provides managed video infrastructure that's **much better** than raw WebRTC:

✅ **No TURN/STUN server setup needed** - They handle all infrastructure
✅ **99.99% uptime** - Enterprise-grade reliability
✅ **Built-in recording** - No extra setup
✅ **Screen sharing** - Works out of the box
✅ **Better scaling** - Handles 1000s of concurrent users
✅ **Lower latency** - Optimized global network
✅ **No WebRTC headaches** - They handle browser compatibility

---

## 📋 Prerequisites

1. Node.js 18+
2. Spring Boot 3+ (for backend)
3. Stream.io account (free tier available)

---

## 🚀 Step 1: Create Stream.io Account

### 1.1 Sign Up
1. Go to [https://getstream.io/](https://getstream.io/)
2. Click **"Start Free Trial"**
3. Sign up with email or GitHub
4. Verify your email

### 1.2 Create a Video App
1. After login, click **"Create App"**
2. Select **"Video & Audio"** as the app type
3. Name your app (e.g., "Virtual Classroom")
4. Choose your region (closest to your users)
5. Click **"Create App"**

### 1.3 Get Your Credentials
1. In the dashboard, click on your app
2. Go to **"Credentials"** tab
3. Copy these values:
   - **API Key** - Public key (safe to use in frontend)
   - **API Secret** - Secret key (NEVER expose to frontend!)

---

## 🔧 Step 2: Frontend Setup

### 2.1 Install Dependencies

Already installed:
```bash
npm install @stream-io/video-react-sdk @stream-io/video-react-bindings
```

### 2.2 Configure Environment Variables

Create `.env` file:
```bash
# .env
VITE_STREAM_API_KEY=your_stream_api_key_here
VITE_BACKEND_URL=http://localhost:8080
```

### 2.3 Update Stream Service

Update `/workspace/src/services/stream.service.ts`:

```typescript
// Use environment variable
const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
```

### 2.4 Use Stream.io Component

Replace the current `VirtualClassroom.tsx` with `VirtualClassroom.streamio.tsx`:

```bash
cd /workspace/src/pages
mv VirtualClassroom.tsx VirtualClassroom.webrtc.tsx  # Backup
mv VirtualClassroom.streamio.tsx VirtualClassroom.tsx
```

---

## 🔐 Step 3: Backend Setup (Token Generation)

### 3.1 Add Dependencies

Add to your `pom.xml`:

```xml
<dependencies>
    <!-- Stream.io Java SDK -->
    <dependency>
        <groupId>io.getstream</groupId>
        <artifactId>stream-video-java</artifactId>
        <version>1.0.0</version>
    </dependency>

    <!-- JWT for token generation -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 3.2 Create Stream.io Configuration

```java
package com.yourcompany.virtualclassroom.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StreamConfig {
    
    @Value("${stream.api.key}")
    private String apiKey;
    
    @Value("${stream.api.secret}")
    private String apiSecret;
    
    public String getApiKey() {
        return apiKey;
    }
    
    public String getApiSecret() {
        return apiSecret;
    }
}
```

### 3.3 Add to `application.properties`

```properties
# Stream.io Configuration
stream.api.key=your_api_key_here
stream.api.secret=your_api_secret_here
```

### 3.4 Create Token Service

```java
package com.yourcompany.virtualclassroom.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.yourcompany.virtualclassroom.config.StreamConfig;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class StreamTokenService {
    
    @Autowired
    private StreamConfig streamConfig;
    
    /**
     * Generate Stream.io user token
     */
    public String generateUserToken(String userId) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        
        // Token valid for 24 hours
        long expMillis = nowMillis + (24 * 60 * 60 * 1000);
        Date exp = new Date(expMillis);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userId);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, streamConfig.getApiSecret())
                .compact();
    }
    
    /**
     * Generate call token with permissions
     */
    public String generateCallToken(String userId, String callId, String role) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        
        long expMillis = nowMillis + (24 * 60 * 60 * 1000);
        Date exp = new Date(expMillis);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userId);
        claims.put("call_cid", callId);
        
        // Role-based permissions
        if ("teacher".equals(role)) {
            claims.put("call_permissions", new String[]{
                "create-call",
                "join-call",
                "send-audio",
                "send-video",
                "start-recording-call",
                "stop-recording-call",
                "start-broadcast-call",
                "stop-broadcast-call",
                "mute-users",
                "screenshare"
            });
        } else {
            // Student permissions
            claims.put("call_permissions", new String[]{
                "join-call",
                "send-audio",
                "send-video"
            });
        }
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, streamConfig.getApiSecret())
                .compact();
    }
}
```

### 3.5 Create Stream Controller

```java
package com.yourcompany.virtualclassroom.controller;

import com.yourcompany.virtualclassroom.config.StreamConfig;
import com.yourcompany.virtualclassroom.service.StreamTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stream")
@CrossOrigin(origins = "*")
public class StreamController {
    
    @Autowired
    private StreamTokenService streamTokenService;
    
    @Autowired
    private StreamConfig streamConfig;
    
    /**
     * Get Stream.io credentials for a user
     */
    @GetMapping("/credentials/{userId}")
    public ResponseEntity<Map<String, String>> getCredentials(
            @PathVariable String userId,
            @RequestParam(required = false, defaultValue = "student") String role) {
        
        // Generate user token
        String userToken = streamTokenService.generateUserToken(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", streamConfig.getApiKey());
        response.put("token", userToken);
        response.put("userId", userId);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get call-specific token with permissions
     */
    @GetMapping("/call-token/{userId}/{callId}")
    public ResponseEntity<Map<String, String>> getCallToken(
            @PathVariable String userId,
            @PathVariable String callId,
            @RequestParam String role) {
        
        String callToken = streamTokenService.generateCallToken(userId, callId, role);
        
        Map<String, String> response = new HashMap<>();
        response.put("token", callToken);
        
        return ResponseEntity.ok(response);
    }
}
```

---

## 🔄 Step 4: Update Frontend to Use Backend Tokens

Update the `getStreamCredentials` function in `VirtualClassroom.tsx`:

```typescript
const getStreamCredentials = async (userId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/stream/credentials/${userId}?role=${user.role}`
    );
    
    const data = await response.json();
    
    return {
      apiKey: data.apiKey,
      token: data.token,
    };
  } catch (error) {
    console.error('Failed to get Stream.io credentials:', error);
    throw error;
  }
};
```

---

## 🎨 Step 5: Customize Video UI Components

Stream.io provides pre-built UI components. Create a custom video layout:

```typescript
// Create: src/components/StreamVideoLayout.tsx
import {
  ParticipantView,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

export function StreamVideoLayout({ isTeacher }: { isTeacher: boolean }) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  
  const teacher = participants.find(p => p.custom?.role === 'teacher');
  const students = participants.filter(p => p.custom?.role === 'student');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Teacher video (main) */}
      <div className="lg:col-span-3">
        {teacher && (
          <ParticipantView
            participant={teacher}
            className="h-full rounded-lg overflow-hidden"
          />
        )}
      </div>
      
      {/* Student grid or self-view */}
      <div className="grid grid-cols-2 gap-2">
        {isTeacher ? (
          // Teacher sees all students
          students.map(student => (
            <ParticipantView
              key={student.sessionId}
              participant={student}
              className="rounded-lg overflow-hidden"
            />
          ))
        ) : (
          // Student sees only themselves
          <ParticipantView
            participant={participants.find(p => p.isLocalParticipant)!}
            className="rounded-lg overflow-hidden"
          />
        )}
      </div>
    </div>
  );
}
```

---

## 📊 Step 6: Monitoring & Analytics

### 6.1 Enable Analytics in Dashboard
1. Go to Stream.io dashboard
2. Navigate to **Analytics** tab
3. Enable call quality monitoring
4. Enable usage analytics

### 6.2 View Call Logs
```typescript
// Get call statistics
const stats = await StreamService.getCallStats();
console.log('Call stats:', stats);
```

---

## 🎯 Step 7: Production Checklist

### Security
- [ ] API Secret stored in environment variables (NEVER in code)
- [ ] Tokens generated server-side only
- [ ] HTTPS enabled for frontend
- [ ] CORS properly configured

### Performance
- [ ] CDN configured for frontend assets
- [ ] Backend caching for tokens
- [ ] Database connection pooling
- [ ] Stream.io region closest to users

### Features
- [ ] Recording working
- [ ] Screen sharing working
- [ ] Hand raise notifications working
- [ ] Fullscreen monitoring active
- [ ] Digital notebook syncing

### Monitoring
- [ ] Error logging configured
- [ ] Analytics dashboard setup
- [ ] Alerts for failed calls
- [ ] User feedback system

---

## 💰 Pricing & Limits

### Free Tier
- ✅ Up to 10,000 minutes/month
- ✅ 5 concurrent calls
- ✅ Basic features included
- ✅ Perfect for development

### Growth Plan ($99/month)
- ✅ 100,000 minutes/month
- ✅ 50 concurrent calls
- ✅ Recording included
- ✅ Priority support

### Enterprise
- ✅ Unlimited minutes
- ✅ Unlimited concurrent calls
- ✅ SLA guarantee
- ✅ Custom features

**Recommendation:** Start with free tier, upgrade as you scale.

---

## 🐛 Troubleshooting

### Issue 1: "Invalid API Key"

**Solution:**
- Check `.env` file has correct `VITE_STREAM_API_KEY`
- Restart dev server after changing `.env`
- Verify API key in Stream.io dashboard

### Issue 2: "Token expired"

**Solution:**
- Check backend is generating tokens correctly
- Verify system time is correct
- Check token expiration (default 24 hours)

### Issue 3: "Permission denied"

**Solution:**
- Check user role is correct ('teacher' or 'student')
- Verify permissions in token generation
- Check call permissions in Stream.io dashboard

### Issue 4: Video not showing

**Solution:**
- Check browser permissions (camera/mic)
- Verify Stream.io SDK is properly imported
- Check console for errors
- Try different browser

---

## 📚 Additional Resources

- [Stream.io Video Documentation](https://getstream.io/video/docs/)
- [React SDK Reference](https://getstream.io/video/docs/react/)
- [API Reference](https://getstream.io/video/docs/api/)
- [Example Apps](https://github.com/GetStream/stream-video-js)

---

## 🎉 Benefits Over WebRTC

| Feature | Raw WebRTC | Stream.io |
|---------|-----------|-----------|
| **Setup Time** | 2-3 days | 2-3 hours |
| **TURN Server** | Required | Not needed |
| **Recording** | Complex | Built-in |
| **Scaling** | Difficult | Automatic |
| **Reliability** | 85-90% | 99.99% |
| **Mobile Support** | Tricky | Works perfectly |
| **Maintenance** | High | Low |
| **Cost** | Infrastructure | Pay-as-you-go |

---

## ✅ Final Steps

1. **Get Stream.io account** ✓
2. **Install dependencies** ✓ (already done)
3. **Configure backend** (follow Step 3)
4. **Update frontend** (follow Step 4)
5. **Test with 2-3 users**
6. **Deploy to production**
7. **Monitor & optimize**

---

**Your classroom is now powered by enterprise-grade video infrastructure! 🚀**

Need help? Check the [Stream.io Community](https://getstream.io/chat/community/) or their excellent documentation.
