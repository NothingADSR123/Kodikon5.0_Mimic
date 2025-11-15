# 🎯 Quick Start - Text-to-Speech Integration

## 1️⃣ Install Dependencies

```bash
cd server
npm install @google-cloud/text-to-speech
```

## 2️⃣ Setup Google Cloud (5 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Cloud Text-to-Speech API**
3. Create **Service Account** → Download JSON key
4. Save key as: `server/config/google-cloud-tts-key.json`
5. Add to `server/.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json
   ```

## 3️⃣ Start Server

```bash
cd server
node src/index.js
```

## 4️⃣ Test API

```bash
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Mimic!"}' \
  --output test.mp3
```

## 5️⃣ Use in React

```jsx
import TTSPlayer from './components/TTSPlayer';

function App() {
  return (
    <TTSPlayer 
      text="Welcome to Mimic! This is your AI assistant." 
      autoPlay={false}
    />
  );
}
```

---

## 📡 API Endpoints

### POST /api/tts
Generate speech from text

**Request:**
```javascript
fetch('http://localhost:5001/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Your explanation here",
    options: {
      voiceName: "en-US-Neural2-C", // Optional
      speakingRate: 1.0 // Optional
    }
  })
})
.then(res => res.blob())
.then(blob => {
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
});
```

### GET /api/tts/health
Check if TTS service is working

```javascript
fetch('http://localhost:5001/api/tts/health')
  .then(res => res.json())
  .then(data => console.log(data.status));
```

### GET /api/tts/voices
Get available voices

```javascript
fetch('http://localhost:5001/api/tts/voices?languageCode=en-US')
  .then(res => res.json())
  .then(data => console.log(data.voices));
```

---

## 🎙️ Voice Options

| Voice | Gender | Style |
|-------|--------|-------|
| `en-US-Neural2-A` | Male | Professional |
| `en-US-Neural2-C` | **Female** | **Warm (Default)** |
| `en-US-Neural2-D` | Male | Deep |
| `en-US-Neural2-F` | Female | Energetic |

Customize:
```javascript
{
  voiceName: "en-US-Neural2-C",
  speakingRate: 1.2, // 20% faster
  pitch: -2.0, // Deeper voice
  volumeGainDb: 3.0 // Louder
}
```

---

## ⚡ Frontend Examples

### Minimal (1 line)

```javascript
fetch('/api/tts', {
  method: 'POST',
  body: JSON.stringify({ text: "Hello!" })
}).then(r => r.blob()).then(b => new Audio(URL.createObjectURL(b)).play());
```

### With Controls

```jsx
<TTSPlayer 
  text={explanationText} 
  voiceOptions={{ speakingRate: 1.1 }}
/>
```

### Custom Button

```jsx
const speak = async (text) => {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const blob = await res.blob();
  new Audio(URL.createObjectURL(blob)).play();
};

<button onClick={() => speak("Explanation text")}>
  🔊 Listen
</button>
```

---

## 🔒 Security Checklist

- ✅ Add `config/` to `.gitignore`
- ✅ Never commit JSON key files
- ✅ Use environment variables
- ✅ Enable CORS only for your frontend domain in production
- ✅ Add rate limiting (optional)

---

## 🐛 Troubleshooting

**Error: "Could not load credentials"**
→ Check `GOOGLE_APPLICATION_CREDENTIALS` path in `.env`

**Error: "API not enabled"**
→ Enable Cloud Text-to-Speech API in Google Cloud Console

**Audio not playing**
→ Wrap `audio.play()` in a user-initiated event (button click)

---

## 💰 Cost

- **Free Tier**: 1 million characters/month (standard voices)
- **Neural Voices**: $16 per 1M characters
- Average sentence (50 chars) = $0.0008

**Estimate:**
- 1000 explanations/month = ~50,000 chars = **$0.80/month**

---

## 📚 Full Documentation

See `TTS_SETUP_GUIDE.md` for complete setup instructions and advanced features.

---

## ✅ Files Created

```
server/
├── src/
│   ├── routes/tts.js          ✅ API routes
│   ├── services/ttsService.js ✅ TTS logic
│   └── index.js               ✅ Updated with TTS routes
├── config/
│   └── google-cloud-tts-key.json  📝 Add your key here
├── .env.example               ✅ Environment template
└── TTS_SETUP_GUIDE.md        ✅ Complete guide

client/
└── src/
    └── components/
        └── TTSPlayer.jsx      ✅ Reusable React component
```

---

**🚀 Ready to use! Start your server and test the `/api/tts` endpoint.**
