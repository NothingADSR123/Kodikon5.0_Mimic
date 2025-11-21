# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is now **ready for Vercel deployment**! Here's what has been configured:

### Files Created/Updated:
- ✅ `vercel.json` - Vercel configuration for full-stack deployment
- ✅ `api/index.js` - Serverless API handler
- ✅ `api/package.json` - API dependencies
- ✅ Root `package.json` - Build scripts
- ✅ `.gitignore` - Ignore node_modules and .env files
- ✅ API URLs updated to work in both dev and production
- ✅ Environment variable support added

---

## 📋 Required Environment Variables

You'll need to add these in Vercel Dashboard:

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `GEMINI_API_KEY` | Your API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `NODE_ENV` | `production` | (Just type this) |

---

## 🎯 Deploy to Vercel (Dashboard Method - Recommended)

### Step 1: Push to GitHub

```powershell
cd "C:\Users\Admin\Desktop\mimi - Copy\Kodikon5.0_Mimic"
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"**
3. Import your GitHub repository: `NothingADSR123/Kodikon5.0_Mimic`
4. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:** Other (Vite)

**Build & Development Settings:**
- Build Command: `npm run build`
- Output Directory: `client/dist`
- Install Command: `npm install`

**Root Directory:** `./` (leave as root)

### Step 4: Add Environment Variables

Click **"Environment Variables"** tab and add:

```
GEMINI_API_KEY = your_actual_api_key_here
NODE_ENV = production
```

### Step 5: Deploy!

Click **"Deploy"** and wait 2-3 minutes.

---

## 🌐 Post-Deployment Steps

### 1. Update Firebase Authorized Domains

After deployment, you'll get a URL like: `https://your-app.vercel.app`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mimic---3d-visual-copilot**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Vercel domain: `your-app.vercel.app`
6. Click **Save**

### 2. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Login/Signup works
- ✅ 3D scene generation works
- ✅ TTS (Text-to-Speech) works
- ✅ Chat functionality works

---

## 🔧 Vercel CLI Method (Alternative)

If you prefer using the command line:

### Install Vercel CLI:
```powershell
npm install -g vercel
```

### Login:
```powershell
vercel login
```

### Deploy:
```powershell
cd "C:\Users\Admin\Desktop\mimi - Copy\Kodikon5.0_Mimic"
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name: **mimic-3d-copilot** (or your choice)
- In which directory is your code? **./`

### Add Environment Variables:
```powershell
vercel env add GEMINI_API_KEY
# Paste your API key when prompted

vercel env add NODE_ENV
# Type: production
```

### Deploy to Production:
```powershell
vercel --prod
```

---

## 🔍 Troubleshooting

### Build Fails
- Check Vercel build logs in dashboard
- Ensure all dependencies are in package.json files
- Verify Node version (Vercel uses Node 18+ by default)

### API Calls Return 404
- Check that `api/index.js` is being deployed
- Verify environment variables are set in Vercel
- Check browser console for actual API URLs being called

### Firebase Auth Doesn't Work
- Ensure Vercel domain is in Firebase Authorized Domains
- Check that Firebase config in `client/src/firebase/config.js` is correct
- Verify browser console for Firebase errors

### TTS Doesn't Work
- The `gtts` package may have limitations on serverless
- Check Vercel function logs for errors
- Consider switching to Google Cloud TTS API for production

---

## 📱 How It Works

### Architecture:

```
User → Vercel CDN → 
  ├─ Static Files (React App) → client/dist/
  └─ API Requests (/api/*) → api/index.js (Serverless Functions)
       ├─ /api/ai/* → AI Scene Generation (Gemini)
       └─ /api/tts → Text-to-Speech (gTTS)
```

### Development vs Production:

**Local Development:**
- Client: `http://localhost:5173` (Vite dev server)
- Server: `http://localhost:5001` (Express server)

**Production (Vercel):**
- Client: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/*`

---

## 🎉 Auto-Deploy

Every time you push to the `main` branch, Vercel will automatically redeploy!

```powershell
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will detect the push and start deploying within seconds.

---

## 📊 Monitoring

### View Logs:
- Go to Vercel Dashboard
- Select your project
- Click **"Logs"** tab
- See real-time function executions and errors

### View Analytics:
- Dashboard → Your Project → **Analytics**
- See visitor stats, page views, etc.

### View Deployments:
- Dashboard → Your Project → **Deployments**
- See all deployment history
- Rollback to previous versions if needed

---

## 🎯 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `mimic.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update Firebase authorized domains with your custom domain

---

## 💡 Tips

- **Preview Deployments:** Every branch push creates a preview URL
- **Environment Variables:** Can be set per environment (Production, Preview, Development)
- **Function Logs:** Check logs if API calls fail
- **Gemini API Limits:** Monitor your Google AI Studio usage
- **Firebase Quotas:** Check Firebase usage in console

---

## 🆘 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- Check Vercel function logs for errors
- Verify environment variables are set correctly

---

## ✨ You're All Set!

Your project is configured and ready to deploy to Vercel. Just follow the steps above and you'll be live in minutes! 🚀
