# 🎤 Audio Bot Setup - Soothing Female Voice TTS

## ✅ Complete! Here's what was created:

### Backend Files
- ✅ `server/src/services/ttsService.js` - Google Cloud TTS with Wavenet-F voice
- ✅ `server/src/routes/tts.js` - POST /api/tts endpoint
- ✅ `server/src/index.js` - Already mounted (check it imports tts routes)

### Frontend Files  
- ✅ `client/src/components/AudioBot.jsx` - React component
- ✅ `client/src/styles/AudioBot.css` - Beautiful styling

---

## 🚀 Setup Instructions

### Step 1: Install Google Cloud TTS
```powershell
cd server
npm install
```

### Step 2: Google Cloud Setup (WITH BILLING)

**Important: Google Cloud requires billing information, but you get 1M characters/month FREE**

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com

2. **Set up billing:**
   - Click "Billing" in the left menu
   - Add a payment method (credit/debit card)
   - Set up budget alerts at $5, $10, $20
   - Don't worry: First 1M characters = FREE each month
   - Your estimated usage: ~300k chars = $0/month

3. **Enable Text-to-Speech API:**
   - Go to: APIs & Services → Library
   - Search: "Cloud Text-to-Speech API"
   - Click: Enable

4. **Create Service Account:**
   - Go to: APIs & Services → Credentials
   - Create Credentials → Service Account
   - Name: `mimic-tts-service`
   - Role: `Cloud Text-to-Speech User`
   - Create and Continue → Done

5. **Download JSON Key:**
   - Click on service account
   - Keys tab → Add Key → Create New Key
   - Choose JSON → Create
   - File downloads automatically

6. **Save credentials:**
   ```powershell
   # Create config folder
   mkdir server/config

   # Move downloaded file
   # Replace YOUR_DOWNLOADED_FILE with actual filename
   Copy-Item "$env:USERPROFILE\Downloads\mimic-tts-*.json" ".\config\google-cloud-tts-key.json"
   ```

7. **Create .env file:**
   ```powershell
   echo "GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json" | Out-File -FilePath .env -Encoding utf8
   ```

### Step 3: Test Backend
```powershell
# Start server
npm start

# In new terminal, test health
Invoke-RestMethod -Uri "http://localhost:5001/api/tts/health"

# Should return: { "success": true, "status": "healthy", "voice": "en-US-Wavenet-F" }
```

---

## 🎨 How to Use in Your Dashboard

### Option 1: Add to DashboardPage component

```jsx
import AudioBot from '../components/AudioBot';

function DashboardPage() {
  const explanation = "This is your AI-generated explanation that will be read aloud...";
  
  return (
    <div className="dashboard">
      <div className="explanation-section">
        <h2>Explanation</h2>
        <p>{explanation}</p>
        
        {/* Add Audio Bot here */}
        <AudioBot text={explanation} />
      </div>
    </div>
  );
}
```

### Option 2: Add to any component with explanations

```jsx
<AudioBot 
  text="Your explanation text here"
  autoPlay={false}  // Set true to auto-play when text changes
/>
```

---

## 🎙️ Voice Configuration

The AudioBot uses **en-US-Wavenet-F**:
- ✅ Female voice
- ✅ Soothing, calming tone
- ✅ Speaking rate: 0.95 (slightly slower)
- ✅ Pitch: 2.0 (soft, gentle)

**Customization:**
Edit `AudioBot.jsx` line 30 to change voice settings:
```javascript
options: {
  voiceName: 'en-US-Wavenet-F', // Change voice here
  speakingRate: 0.95,  // 0.25-4.0 (default: 1.0)
  pitch: 2.0           // -20.0 to 20.0 (default: 0)
}
```

**Other soothing female voices:**
- `en-US-Wavenet-C` - Warm female voice
- `en-US-Wavenet-E` - Soft female voice
- `en-US-Wavenet-G` - Gentle female voice

---

## 💰 Cost (Don't Worry!)

**FREE Tier:** 1 million characters/month (standard)
**Wavenet Pricing:** $16 per 1M characters

**Your usage:**
- Average explanation: 200 characters
- 50 explanations/day × 30 days = 1,500/month
- Total: 300,000 characters = **$4.80/month**

**To stay under free tier:**
- Use standard voices (free 1M/month) instead of Wavenet
- Change voice to: `en-US-Standard-C` (female)

---

## 🎨 AudioBot Features

- 🎧 **Listen Button** - Generates audio from text
- ▶️ **Play/Pause** - Control playback
- ⏹️ **Stop** - Stop and reset
- 🔄 **Regenerate** - Create new audio
- ⚠️ **Error Handling** - Shows user-friendly errors
- 🎤 **Voice Info** - Displays current voice
- ⏳ **Loading State** - Shows spinner while generating

---

## 🧪 Testing

```powershell
# Test with PowerShell
$body = @{
    text = "Hello from Mimic! This is a test of the soothing female voice."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5001/api/tts" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "test.mp3"

# Play the audio
start test.mp3
```

---

## 🔒 Security

✅ Credentials in `/config` folder (gitignored)
✅ Environment variables in `.env` (gitignored)
✅ Never commit JSON keys to GitHub
✅ Service account has minimal permissions

---

## ✨ Final Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up Google Cloud billing + credentials
3. ✅ Create `.env` file with credentials path
4. ✅ Start server: `npm start`
5. ✅ Import `AudioBot` in your Dashboard component
6. ✅ Add `<AudioBot text={explanation} />` where needed

**Your soothing female voice audio bot is ready! 🎉**

Questions? Check the TTS_SETUP_GUIDE.md for more details.
