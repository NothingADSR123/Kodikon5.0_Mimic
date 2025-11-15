# 🎯 TTS Implementation Checklist

Use this checklist to set up and verify your Text-to-Speech feature.

---

## ✅ Phase 1: Installation (5 minutes)

- [ ] Navigate to server directory
  ```bash
  cd server
  ```

- [ ] Install Google Cloud TTS package
  ```bash
  npm install @google-cloud/text-to-speech
  ```

- [ ] Verify package.json includes the dependency
  ```json
  "@google-cloud/text-to-speech": "^5.7.0"
  ```

---

## ✅ Phase 2: Google Cloud Setup (10 minutes)

### Create Project & Enable API

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing one
- [ ] Navigate to: **APIs & Services > Library**
- [ ] Search for: **"Cloud Text-to-Speech API"**
- [ ] Click: **Enable**

### Create Service Account

- [ ] Navigate to: **APIs & Services > Credentials**
- [ ] Click: **Create Credentials > Service Account**
- [ ] Enter name: `mimic-tts-service`
- [ ] Click: **Create and Continue**
- [ ] Add role: **Cloud Text-to-Speech User**
- [ ] Click: **Done**

### Download Credentials

- [ ] Click on the created service account
- [ ] Go to: **Keys** tab
- [ ] Click: **Add Key > Create New Key**
- [ ] Select: **JSON** format
- [ ] Click: **Create** (file downloads automatically)

---

## ✅ Phase 3: Backend Configuration (3 minutes)

### Setup Credentials

- [ ] Create config folder
  ```bash
  mkdir server/config
  ```

- [ ] Move downloaded JSON key to `server/config/`
  ```bash
  # Move and rename the downloaded file
  mv ~/Downloads/your-project-xxxxx.json server/config/google-cloud-tts-key.json
  ```

### Configure Environment

- [ ] Create `.env` file in server directory
  ```bash
  cd server
  touch .env  # or manually create the file
  ```

- [ ] Add environment variable to `.env`
  ```env
  PORT=5001
  GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-tts-key.json
  ```

- [ ] Verify `.gitignore` includes security rules
  ```gitignore
  # Should already be there
  config/
  *.json
  !package.json
  !package-lock.json
  .env
  ```

---

## ✅ Phase 4: Verify Files Created (1 minute)

Backend files (should already exist from implementation):

- [ ] `server/src/routes/tts.js` exists
- [ ] `server/src/services/ttsService.js` exists
- [ ] `server/src/index.js` imports TTS routes
- [ ] `server/test-tts.js` exists

Frontend files (should already exist):

- [ ] `client/src/components/TTSPlayer.jsx` exists
- [ ] `client/src/pages/TTSExample.jsx` exists

Documentation (should already exist):

- [ ] `TTS_SETUP_GUIDE.md` exists
- [ ] `QUICKSTART_TTS.md` exists
- [ ] `TTS_IMPLEMENTATION_SUMMARY.md` exists
- [ ] `TTS_ARCHITECTURE.md` exists

---

## ✅ Phase 5: Start & Test (5 minutes)

### Start Server

- [ ] Start the backend server
  ```bash
  cd server
  npm start
  ```

- [ ] Verify server is running
  - Should see: `Server is running on port 5001`

### Run Test Suite

- [ ] Open new terminal and run tests
  ```bash
  cd server
  npm test
  ```

- [ ] Verify all 5 tests pass:
  - [ ] ✅ Health check
  - [ ] ✅ Generate audio
  - [ ] ✅ List voices
  - [ ] ✅ Error handling
  - [ ] ✅ Voice options

- [ ] Check test output file
  ```bash
  # File should be created
  ls server/test-output.mp3
  
  # Play the audio (Windows)
  start server/test-output.mp3
  ```

### Manual API Testing

- [ ] Test health endpoint
  ```bash
  curl http://localhost:5001/api/tts/health
  ```
  Expected: `{"success":true,"status":"healthy"}`

- [ ] Test TTS generation
  ```bash
  curl -X POST http://localhost:5001/api/tts \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"Hello from Mimic!\"}" \
    --output manual-test.mp3
  ```
  Expected: `manual-test.mp3` file created

- [ ] Play generated audio
  ```bash
  start manual-test.mp3  # Windows
  open manual-test.mp3   # Mac
  xdg-open manual-test.mp3  # Linux
  ```

---

## ✅ Phase 6: Frontend Integration (10 minutes)

### Test TTSPlayer Component

- [ ] Start frontend dev server
  ```bash
  cd client
  npm run dev
  ```

- [ ] Import TTSPlayer in a test page
  ```jsx
  import TTSPlayer from './components/TTSPlayer';
  
  function TestPage() {
    return (
      <div>
        <h1>TTS Test</h1>
        <TTSPlayer 
          text="This is a test of the text-to-speech system." 
        />
      </div>
    );
  }
  ```

- [ ] Open browser to test page
- [ ] Click "Generate Audio" button
- [ ] Verify audio plays successfully
- [ ] Test Play/Pause controls
- [ ] Test Stop button

### Test TTSExample Page

- [ ] Navigate to TTSExample page
- [ ] Test all example explanations
- [ ] Test custom text input
- [ ] Test different voice styles

---

## ✅ Phase 7: Production Readiness (Optional)

### Security Audit

- [ ] Verify no credentials in git
  ```bash
  git status
  # Should NOT see config/ or .env files
  ```

- [ ] Confirm `.gitignore` is working
  ```bash
  cat .gitignore | grep config
  cat .gitignore | grep .env
  ```

### Performance Optimization

- [ ] Consider implementing caching
- [ ] Add rate limiting (optional)
  ```bash
  npm install express-rate-limit
  ```

- [ ] Set up error monitoring (optional)
- [ ] Configure CORS for production domain

### Documentation Review

- [ ] Read `TTS_SETUP_GUIDE.md` for advanced features
- [ ] Review `TTS_ARCHITECTURE.md` for system overview
- [ ] Check `QUICKSTART_TTS.md` for quick reference

---

## ✅ Phase 8: Integration into Mimic App

### Identify Integration Points

- [ ] List pages/components that need TTS
  - [ ] Explanation modals
  - [ ] Tutorial steps
  - [ ] 3D scene descriptions
  - [ ] Help sections
  - [ ] Other: _______________

### Implement TTS in Target Components

- [ ] Import TTSPlayer component
  ```jsx
  import TTSPlayer from './components/TTSPlayer';
  ```

- [ ] Add to render method
  ```jsx
  <TTSPlayer 
    text={explanationText}
    voiceOptions={{ speakingRate: 1.0 }}
  />
  ```

- [ ] Style to match Mimic design
- [ ] Test on all target pages

### User Experience Enhancements

- [ ] Add "Listen" icons next to explanations
- [ ] Implement keyboard shortcuts (optional)
- [ ] Add user preference for auto-play (optional)
- [ ] Consider voice speed settings (optional)

---

## 🎉 Completion Checklist

### All Systems Go

- [ ] ✅ Backend TTS API running (port 5001)
- [ ] ✅ All tests passing (npm test)
- [ ] ✅ Audio generates successfully
- [ ] ✅ Frontend component works
- [ ] ✅ No errors in console
- [ ] ✅ Audio quality is good
- [ ] ✅ Response time is acceptable (< 3 seconds)
- [ ] ✅ Credentials are secure (not in git)
- [ ] ✅ Documentation is accessible
- [ ] ✅ Team knows how to use the feature

### Ready for Users

- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari (if applicable)
- [ ] Tested on mobile (if applicable)
- [ ] Error messages are user-friendly
- [ ] Loading states are clear
- [ ] Audio controls are intuitive

---

## 📊 Success Metrics

After implementation, track:

- [ ] TTS API response time (target: < 2 seconds)
- [ ] Daily API calls (for cost estimation)
- [ ] Error rate (target: < 1%)
- [ ] User engagement with audio feature
- [ ] Monthly Google Cloud TTS costs

---

## 🆘 Troubleshooting Quick Reference

### Issue: Tests failing

**Solution:**
```bash
# Check server is running
curl http://localhost:5001/api/tts/health

# Check credentials
ls server/config/google-cloud-tts-key.json

# Check environment variable
cat server/.env | grep GOOGLE_APPLICATION_CREDENTIALS
```

### Issue: Audio not playing in browser

**Solution:**
- Check browser console for errors
- Ensure user clicked a button (browsers block auto-play)
- Verify Content-Type is `audio/mpeg`
- Try in incognito mode (extensions can block)

### Issue: "Could not load credentials"

**Solution:**
```bash
# Verify .env file
cat server/.env

# Check file path is correct
ls -la server/config/google-cloud-tts-key.json

# Restart server after .env changes
```

### Issue: High latency (slow response)

**Possible causes:**
- Network latency to Google Cloud
- Large text (> 1000 characters)
- Server overload

**Solutions:**
- Implement caching for common phrases
- Split large texts into chunks
- Use faster voice models

---

## 📞 Support Resources

- **Full Setup Guide**: `server/TTS_SETUP_GUIDE.md`
- **Quick Reference**: `QUICKSTART_TTS.md`
- **Architecture**: `TTS_ARCHITECTURE.md`
- **Google Cloud Docs**: https://cloud.google.com/text-to-speech/docs
- **GitHub Issues**: (your repo issues page)

---

## ✅ Final Sign-Off

Date completed: ________________

Completed by: ________________

**System Status:**
- [ ] Backend: ✅ Operational
- [ ] Frontend: ✅ Integrated
- [ ] Tests: ✅ Passing
- [ ] Security: ✅ Verified
- [ ] Documentation: ✅ Complete

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**🎊 Congratulations! Your TTS feature is production-ready!**
