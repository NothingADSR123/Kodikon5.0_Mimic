# Text-to-Speech Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MIMIC PLATFORM                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────────┐
│                          │         │                              │
│   FRONTEND (React)       │◄────────┤    BACKEND (Node.js)         │
│   Port: 5173 (Vite)      │   HTTP  │    Port: 5001 (Express)      │
│                          │         │                              │
└──────────────────────────┘         └──────────────────────────────┘
         │                                      │
         │                                      │
         │                            ┌─────────▼─────────┐
         │                            │                   │
         │                            │  Google Cloud TTS │
         │                            │  API Service      │
         │                            │                   │
         │                            └───────────────────┘
         │
         │
         ▼
┌─────────────────────────┐
│                         │
│   TTSPlayer Component   │
│   - Generate button     │
│   - Play/Pause controls │
│   - Audio management    │
│                         │
└─────────────────────────┘
```

---

## Request Flow

```
USER CLICKS "LISTEN" BUTTON
         │
         ▼
┌────────────────────────────┐
│  TTSPlayer Component       │
│  - Sends text to backend   │
│  - POST /api/tts           │
└────────────────────────────┘
         │
         │ HTTP POST
         │ { text: "..." }
         ▼
┌────────────────────────────┐
│  Express Route             │
│  /src/routes/tts.js        │
│  - Validates input         │
│  - Calls service           │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│  TTS Service               │
│  /src/services/ttsService  │
│  - Connects to Google TTS  │
│  - Synthesizes speech      │
└────────────────────────────┘
         │
         │ API Call
         ▼
┌────────────────────────────┐
│  Google Cloud TTS API      │
│  - Neural voice synthesis  │
│  - Returns MP3 buffer      │
└────────────────────────────┘
         │
         │ MP3 Audio Buffer
         ▼
┌────────────────────────────┐
│  Express Response          │
│  - Content-Type: audio/mpeg│
│  - Sends audio buffer      │
└────────────────────────────┘
         │
         │ Audio Stream
         ▼
┌────────────────────────────┐
│  Frontend                  │
│  - Creates Blob            │
│  - Creates Audio object    │
│  - Plays audio             │
└────────────────────────────┘
         │
         ▼
    🔊 USER HEARS AUDIO
```

---

## File Structure

```
Mimic Project Root
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── TTSPlayer.jsx       ← Reusable TTS component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── TTSExample.jsx      ← Demo/test page
│   │   └── main.jsx
│   └── package.json
│
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.js                ← Main server file
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   └── tts.js              ← TTS API endpoints
│   │   └── services/
│   │       └── ttsService.js       ← Google TTS logic
│   ├── config/
│   │   └── google-cloud-tts-key.json  ← Add your credentials here
│   ├── test-tts.js                 ← Test suite
│   ├── .env                        ← Environment config (create this)
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── Documentation/
    ├── TTS_SETUP_GUIDE.md          ← Complete setup guide
    ├── QUICKSTART_TTS.md           ← Quick reference
    └── TTS_IMPLEMENTATION_SUMMARY.md  ← What was built
```

---

## API Endpoints Detail

```
BASE URL: http://localhost:5001

┌─────────────────────────────────────────────────────────────────┐
│  POST /api/tts                                                  │
│  Generate speech from text                                      │
│                                                                 │
│  Request Body:                                                  │
│  {                                                              │
│    "text": "Your text here",                                    │
│    "options": {                                                 │
│      "voiceName": "en-US-Neural2-C",  // Optional              │
│      "speakingRate": 1.0,              // Optional             │
│      "pitch": 0.0                      // Optional             │
│    }                                                            │
│  }                                                              │
│                                                                 │
│  Response: audio/mpeg (MP3 file)                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GET /api/tts/voices?languageCode=en-US                        │
│  List available voices                                          │
│                                                                 │
│  Response:                                                      │
│  {                                                              │
│    "success": true,                                             │
│    "languageCode": "en-US",                                     │
│    "voices": [                                                  │
│      {                                                          │
│        "name": "en-US-Neural2-C",                               │
│        "gender": "FEMALE",                                      │
│        "naturalSampleRateHertz": 24000                          │
│      }                                                          │
│    ]                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GET /api/tts/health                                           │
│  Check TTS service health                                       │
│                                                                 │
│  Response:                                                      │
│  {                                                              │
│    "success": true,                                             │
│    "status": "healthy",                                         │
│    "message": "TTS service is operational"                      │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
TTSPlayer Component
┌─────────────────────────────────────────────────────┐
│  Props:                                             │
│  - text: string (required)                          │
│  - autoPlay: boolean (optional)                     │
│  - voiceOptions: object (optional)                  │
│                                                     │
│  State:                                             │
│  - isLoading: boolean                               │
│  - isPlaying: boolean                               │
│  - error: string | null                             │
│  - audioUrl: string | null                          │
│                                                     │
│  Methods:                                           │
│  - handleGenerateAudio()                            │
│  - handleTogglePlay()                               │
│  - handleStop()                                     │
│                                                     │
│  UI:                                                │
│  ┌───────────────┬──────────┬────────┐             │
│  │ Generate Audio│   Play   │  Stop  │             │
│  └───────────────┴──────────┴────────┘             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ Clicks "Generate Audio"
       │
       ▼
┌──────────────────┐
│  TTSPlayer.jsx   │
│  React Component │
└──────┬───────────┘
       │ fetch('/api/tts', {
       │   method: 'POST',
       │   body: { text: "..." }
       │ })
       │
       ▼
┌──────────────────┐
│  Express Server  │
│  Port 5001       │
└──────┬───────────┘
       │ app.use('/api/tts', ttsRoutes)
       │
       ▼
┌──────────────────┐
│  tts.js Route    │
│  POST handler    │
└──────┬───────────┘
       │ ttsService.synthesizeSpeech(text, options)
       │
       ▼
┌──────────────────────┐
│  ttsService.js       │
│  Business Logic      │
└──────┬───────────────┘
       │ client.synthesizeSpeech(request)
       │
       ▼
┌──────────────────────────┐
│  @google-cloud/          │
│  text-to-speech          │
│  Node.js Client Library  │
└──────┬───────────────────┘
       │ HTTPS API Call
       │ + Service Account Auth
       │
       ▼
┌────────────────────────────┐
│  Google Cloud Platform     │
│  Text-to-Speech API        │
│  Neural Voice Synthesis    │
└──────┬─────────────────────┘
       │ Returns: MP3 Audio Buffer
       │
       ▼
┌────────────────────────────┐
│  Express Response          │
│  res.send(audioBuffer)     │
│  Content-Type: audio/mpeg  │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Frontend                  │
│  response.blob()           │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Create Audio Object       │
│  new Audio(URL.create...   │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  Browser Audio API         │
│  audio.play()              │
└──────┬─────────────────────┘
       │
       ▼
    🔊 Audio Output
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│  Error Handling at Each Layer                           │
└─────────────────────────────────────────────────────────┘

Frontend (TTSPlayer.jsx)
├─ try/catch blocks
├─ Error state management
├─ User-friendly error messages
└─ Loading states

Backend Route (tts.js)
├─ Request validation (text required)
├─ try/catch around service calls
├─ HTTP status codes (400, 500)
└─ JSON error responses

TTS Service (ttsService.js)
├─ Input validation (length, type)
├─ Google API error handling
├─ Meaningful error messages
└─ Logging for debugging

Google Cloud TTS
├─ Authentication errors
├─ API quota errors
├─ Network errors
└─ Invalid parameter errors
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Security Implementation                                 │
└─────────────────────────────────────────────────────────┘

1. Credential Protection
   ├─ Service account JSON in /config (gitignored)
   ├─ Environment variables for paths
   ├─ Never hardcoded in code
   └─ .gitignore prevents commits

2. Input Validation
   ├─ Text length limit (5000 chars)
   ├─ Type checking (string required)
   ├─ Sanitization in service layer
   └─ Request body validation

3. API Security
   ├─ CORS enabled for frontend domain
   ├─ Rate limiting (optional, recommended)
   ├─ HTTPS in production
   └─ Service account with minimal permissions

4. Error Handling
   ├─ Don't expose internal errors
   ├─ Generic user-facing messages
   ├─ Detailed logging for debugging
   └─ Proper HTTP status codes
```

---

## Deployment Considerations

```
Development:
├─ Server: localhost:5001
├─ Client: localhost:5173
├─ CORS: Enabled for all origins
└─ Credentials: Local file path

Production:
├─ Server: Your production URL
├─ Client: Your domain
├─ CORS: Specific domain only
├─ Credentials: Environment variable or secret manager
├─ HTTPS: Required
├─ Rate limiting: Enabled
└─ Monitoring: Error tracking, usage metrics
```

---

## Cost Optimization

```
Strategies to Minimize TTS Costs:

1. Caching
   ├─ Cache frequently used phrases
   ├─ Store generated audio files
   └─ Implement cache invalidation

2. Client-Side
   ├─ Don't regenerate on replay
   ├─ Store audio URL in state
   └─ Download option for users

3. Server-Side
   ├─ Implement response caching
   ├─ Use CDN for audio files
   └─ Database storage for common phrases

4. Smart Features
   ├─ Text compression before sending
   ├─ Batch requests when possible
   └─ User preference for auto-play
```

---

This architecture provides a scalable, secure, and user-friendly text-to-speech system for the Mimic platform.
