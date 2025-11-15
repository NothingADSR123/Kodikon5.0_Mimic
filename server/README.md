# Mimic Backend Server

Node.js + Express backend for the Mimic neurodivergent thinking platform.

## 🚀 Features

- **AI Integration**: Google Generative AI for concept processing
- **Text-to-Speech**: Google Cloud TTS for natural voice explanations
- **CORS Enabled**: Ready for frontend integration
- **Environment Config**: Secure credential management

## 📦 Installation

```bash
cd server
npm install
```

## 🔧 Configuration

1. Create a `.env` file:
```env
PORT=5001
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json
```

2. Add your Google Cloud TTS credentials:
   - Download JSON key from Google Cloud Console
   - Place in `server/config/google-cloud-tts-key.json`
   - See `TTS_SETUP_GUIDE.md` for detailed instructions

## ▶️ Running the Server

```bash
# Start server
npm start

# or
node src/index.js
```

Server runs on: `http://localhost:5001`

## 🧪 Testing

```bash
# Run TTS test suite
npm test

# or
npm run test-tts
```

## 📡 API Endpoints

### AI Routes
- `POST /api/ai/*` - AI concept processing

### TTS Routes
- `POST /api/tts` - Generate speech from text
- `GET /api/tts/voices` - List available voices
- `GET /api/tts/health` - Check TTS service health

## 📁 Project Structure

```
server/
├── src/
│   ├── index.js              # Main server file
│   ├── routes/
│   │   ├── aiRoutes.js       # AI endpoints
│   │   └── tts.js            # TTS endpoints
│   ├── services/
│   │   └── ttsService.js     # TTS business logic
│   ├── controllers/
│   └── models/
├── config/
│   └── google-cloud-tts-key.json  # Google credentials (add this)
├── test-tts.js               # TTS test suite
├── package.json
├── .env                      # Environment variables (create this)
└── .env.example              # Environment template
```

## 🔒 Security

- Never commit `.env` or credential files
- All sensitive files are in `.gitignore`
- Use environment variables for configuration

## 📚 Documentation

- **TTS Setup**: See `TTS_SETUP_GUIDE.md`
- **Quick Start**: See `../QUICKSTART_TTS.md`
- **Implementation Details**: See `../TTS_IMPLEMENTATION_SUMMARY.md`

## 🐛 Troubleshooting

### Server won't start
- Check if port 5001 is available
- Verify all dependencies are installed: `npm install`

### TTS not working
- Run test suite: `npm test`
- Check credentials: `ls config/google-cloud-tts-key.json`
- Verify `.env` file exists with correct path
- Enable Text-to-Speech API in Google Cloud Console

### CORS errors
- CORS is already enabled for all origins in development
- In production, configure CORS for your specific domain

## 💡 Usage Examples

### Generate Speech
```javascript
// JavaScript/Frontend
const response = await fetch('http://localhost:5001/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Hello from Mimic!",
    options: { voiceName: "en-US-Neural2-C" }
  })
});

const audioBlob = await response.blob();
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();
```

### Using cURL
```bash
# Generate audio
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Test message"}' \
  --output audio.mp3

# Check health
curl http://localhost:5001/api/tts/health
```

## 🔄 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

## 📊 Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment configuration
- `@google/generative-ai` - AI integration
- `@google-cloud/text-to-speech` - TTS service

## 📝 License

ISC

---

**For detailed TTS setup instructions, see `TTS_SETUP_GUIDE.md`**
