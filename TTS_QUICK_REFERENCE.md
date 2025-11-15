# 🚀 TTS Quick Reference Card

## 🔧 Setup (One-Time Only)

```bash
# 1. Install package
cd server && npm install @google-cloud/text-to-speech

# 2. Get Google Cloud credentials (see TTS_SETUP_GUIDE.md)
# 3. Save JSON key as: server/config/google-cloud-tts-key.json

# 4. Create .env
echo "GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json" > server/.env

# 5. Start server
npm start

# 6. Test it works
npm test
```

---

## 📡 API Endpoints

### POST /api/tts - Generate Audio
```javascript
fetch('http://localhost:5001/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: "Your text here" })
})
.then(r => r.blob())
.then(b => new Audio(URL.createObjectURL(b)).play());
```

### GET /api/tts/health - Check Status
```bash
curl http://localhost:5001/api/tts/health
```

### GET /api/tts/voices - List Voices
```bash
curl http://localhost:5001/api/tts/voices?languageCode=en-US
```

---

## 🎙️ Voice Quick Pick

```javascript
// Default (Recommended)
{ voiceName: 'en-US-Neural2-C' }  // Female, warm

// Alternatives
{ voiceName: 'en-US-Neural2-A' }  // Male, professional
{ voiceName: 'en-US-Neural2-F' }  // Female, energetic
{ voiceName: 'en-US-Neural2-D' }  // Male, deep
```

---

## ⚡ Quick Integrations

### 1-Liner
```javascript
fetch('/api/tts', {method: 'POST', body: JSON.stringify({text: "Hi!"})})
  .then(r => r.blob()).then(b => new Audio(URL.createObjectURL(b)).play());
```

### With Component
```jsx
import TTSPlayer from './components/TTSPlayer';
<TTSPlayer text="Your explanation" />
```

### Custom Button
```jsx
const speak = async (text) => {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text})
  });
  new Audio(URL.createObjectURL(await res.blob())).play();
};

<button onClick={() => speak("Hello!")}>🔊 Listen</button>
```

---

## 🎚️ Customization

```javascript
// Full options
{
  text: "Your text",
  options: {
    voiceName: "en-US-Neural2-C",
    speakingRate: 1.2,    // 0.25 - 4.0 (1.0 = normal)
    pitch: -2.0,          // -20.0 - 20.0 (0 = normal)
    volumeGainDb: 3.0     // dB increase/decrease
  }
}
```

---

## 🐛 Troubleshooting

| Error | Fix |
|-------|-----|
| "Could not load credentials" | Check `.env` file path |
| "API not enabled" | Enable TTS API in Google Cloud |
| Audio won't play | Wrap in button click event |
| Tests failing | Check server is running |

---

## 💡 Pro Tips

- **Cache audio**: Don't regenerate on replay
- **Limit text**: Keep under 1000 chars for fast response
- **User control**: Let users enable/disable audio
- **Error handling**: Always wrap in try-catch

---

## 📚 Full Docs

- **Setup**: `TTS_SETUP_GUIDE.md`
- **Examples**: `TTS_IMPLEMENTATION_SUMMARY.md`
- **Checklist**: `TTS_CHECKLIST.md`
- **Architecture**: `TTS_ARCHITECTURE.md`

---

## 💰 Cost

~**$5/month** for typical usage (50 explanations/day)

---

## ✅ Test Commands

```bash
# Health check
curl http://localhost:5001/api/tts/health

# Generate test audio
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Test"}' --output test.mp3

# Full test suite
npm test
```

---

**Print this page for quick reference! 📄**
