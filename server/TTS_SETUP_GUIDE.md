# Text-to-Speech (TTS) Backend Setup Guide

## 📦 Installation

### 1. Install Google Cloud Text-to-Speech Package

```bash
cd server
npm install @google-cloud/text-to-speech
```

---

## 🔑 Google Cloud Setup

### 2. Create Google Cloud Project and Enable TTS API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Text-to-Speech API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Text-to-Speech API"
   - Click "Enable"

### 3. Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details and click "Create"
4. Grant the role: "Cloud Text-to-Speech User"
5. Click "Done"
6. Click on the created service account
7. Go to "Keys" tab > "Add Key" > "Create New Key"
8. Choose "JSON" format
9. Download the JSON key file

### 4. Configure Credentials in Your Backend

**Option A: Environment Variable (Recommended for Production)**

1. Create a `config` folder in your server directory:
   ```bash
   mkdir server/config
   ```

2. Move your downloaded JSON key file to `server/config/google-cloud-tts-key.json`

3. Add to your `.env` file:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json
   ```

**Option B: System Environment Variable**

Set the environment variable in your system:

**Windows PowerShell:**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="D:\Codes\Kodikon 5.0\Mimic\Kodikon5.0_Mimic\server\config\google-cloud-tts-key.json"
```

**Linux/Mac:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"
```

### 5. Add config folder to .gitignore

```
# Add to .gitignore
server/config/
*.json
!package.json
!package-lock.json
```

---

## 🚀 Usage

### Start the Server

```bash
cd server
npm start
# or
node src/index.js
```

---

## 📡 API Endpoints

### 1. **POST /api/tts** - Generate Speech from Text

**Request:**
```javascript
fetch('http://localhost:5001/api/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: "Welcome to Mimic! This is a test of the text-to-speech system.",
    options: { // Optional
      languageCode: "en-US",
      voiceName: "en-US-Neural2-C", // Natural female voice
      gender: "FEMALE",
      speakingRate: 1.0, // 0.25 to 4.0
      pitch: 0.0, // -20.0 to 20.0
    }
  })
})
.then(response => response.blob())
.then(blob => {
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
});
```

**Response:** `audio/mpeg` file

---

### 2. **GET /api/tts/voices** - List Available Voices

**Request:**
```javascript
fetch('http://localhost:5001/api/tts/voices?languageCode=en-US')
  .then(res => res.json())
  .then(data => console.log(data.voices));
```

**Response:**
```json
{
  "success": true,
  "languageCode": "en-US",
  "voices": [
    {
      "name": "en-US-Neural2-C",
      "gender": "FEMALE",
      "naturalSampleRateHertz": 24000
    },
    ...
  ]
}
```

---

### 3. **GET /api/tts/health** - Check TTS Service Health

**Request:**
```javascript
fetch('http://localhost:5001/api/tts/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response:**
```json
{
  "success": true,
  "message": "TTS service is operational",
  "status": "healthy"
}
```

---

## 🎨 Frontend Integration

### React Component Example

```jsx
import React, { useState } from 'react';

function TTSPlayer({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handlePlayTTS = async () => {
    try {
      setIsPlaying(true);

      const response = await fetch('http://localhost:5001/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          options: {
            languageCode: 'en-US',
            voiceName: 'en-US-Neural2-C',
            speakingRate: 1.0,
          }
        })
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      alert('Failed to generate speech');
    }
  };

  return (
    <button 
      onClick={handlePlayTTS} 
      disabled={isPlaying}
      style={{
        padding: '10px 20px',
        background: isPlaying ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isPlaying ? 'not-allowed' : 'pointer'
      }}
    >
      {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
    </button>
  );
}

export default TTSPlayer;
```

### Advanced: Audio Player with Controls

```jsx
import React, { useState, useRef } from 'react';

function AdvancedTTSPlayer({ text }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const fetchAndPlayAudio = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:5001/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsLoading(false);
      alert('Failed to generate speech');
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <button onClick={fetchAndPlayAudio} disabled={isLoading}>
        {isLoading ? 'Generating...' : '🎵 Generate Audio'}
      </button>
      
      <button onClick={togglePlayPause} disabled={!audioRef.current?.src}>
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default AdvancedTTSPlayer;
```

---

## 🎙️ Voice Options

### Popular English Voices

| Voice Name | Gender | Language | Quality |
|------------|--------|----------|---------|
| `en-US-Neural2-A` | Male | US English | Neural (High) |
| `en-US-Neural2-C` | Female | US English | Neural (High) |
| `en-US-Neural2-D` | Male | US English | Neural (High) |
| `en-US-Neural2-F` | Female | US English | Neural (High) |
| `en-GB-Neural2-A` | Female | British English | Neural (High) |
| `en-GB-Neural2-B` | Male | British English | Neural (High) |

### Customize Voice Parameters

```javascript
{
  languageCode: "en-US",
  voiceName: "en-US-Neural2-C",
  gender: "FEMALE",
  speakingRate: 1.2, // Speak 20% faster
  pitch: -2.0, // Slightly deeper voice
  volumeGainDb: 3.0 // Increase volume by 3dB
}
```

---

## 💰 Pricing

Google Cloud Text-to-Speech pricing (as of 2025):
- **Standard voices**: $4 per 1 million characters
- **WaveNet/Neural voices**: $16 per 1 million characters
- **Free tier**: 1 million characters per month for standard voices

[View Latest Pricing](https://cloud.google.com/text-to-speech/pricing)

---

## 🐛 Troubleshooting

### Error: "Could not load the default credentials"

**Solution:** Make sure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly in your `.env` file or system environment.

### Error: "API has not been enabled"

**Solution:** Enable the Cloud Text-to-Speech API in your Google Cloud Console.

### Error: "Permission denied"

**Solution:** Ensure your service account has the "Cloud Text-to-Speech User" role.

### Audio not playing in browser

**Solution:** Check browser console for errors. Some browsers require user interaction before playing audio. Wrap the play() call in a user-initiated event (button click).

---

## 🔒 Security Best Practices

1. ✅ **Never commit** your `google-cloud-tts-key.json` file to version control
2. ✅ Add `config/` and `*.json` (except package files) to `.gitignore`
3. ✅ Use environment variables for sensitive data
4. ✅ Implement rate limiting on the TTS endpoint to prevent abuse
5. ✅ Validate and sanitize text input (max 5000 characters enforced)
6. ✅ Use HTTPS in production
7. ✅ Consider caching frequently requested audio

---

## 📝 Testing

Test the endpoint using curl:

```bash
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test"}' \
  --output test-audio.mp3

# Play the audio
start test-audio.mp3  # Windows
open test-audio.mp3   # Mac
xdg-open test-audio.mp3  # Linux
```

---

## 🎯 Summary

✅ **Backend Files Created:**
- `/server/src/routes/tts.js` - TTS API routes
- `/server/src/services/ttsService.js` - TTS business logic
- `/server/src/index.js` - Updated with TTS routes

✅ **Setup Steps:**
1. Install `@google-cloud/text-to-speech` package
2. Create Google Cloud project and enable TTS API
3. Download service account JSON key
4. Set `GOOGLE_APPLICATION_CREDENTIALS` in `.env`
5. Start server and test endpoints

✅ **Frontend Usage:**
```javascript
fetch('/api/tts', {
  method: 'POST',
  body: JSON.stringify({ text: "Your text here" })
})
.then(res => res.blob())
.then(blob => new Audio(URL.createObjectURL(blob)).play());
```

Your TTS backend is ready! 🎉
