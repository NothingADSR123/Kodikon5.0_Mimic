# Vercel Deployment Guide for Mimic Project

## 📋 Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. Vercel CLI installed (optional but recommended)
3. Your Firebase credentials configured
4. Google Gemini API key

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (already done ✅)
   
2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New Project"**

4. **Import your GitHub repository:**
   - Select "Import Git Repository"
   - Choose your repository: `NothingADSR123/Kodikon5.0_Mimic`
   - Click "Import"

5. **Configure Project Settings:**
   - Framework Preset: **Other**
   - Root Directory: Leave as `.` (root)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

6. **Add Environment Variables:**
   Click "Environment Variables" and add these:
   
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

7. **Click "Deploy"**

8. **Update Firebase Auth Domain:**
   - Once deployed, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain to "Authorized domains"

9. **Update API URL in your app:**
   - After deployment, note your Vercel URL
   - Update `client/.env.production` with your actual Vercel URL

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to project root:**
   ```bash
   cd C:\Users\Admin\Desktop\mimi\Kodikon5.0_Mimic
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - What's your project's name? `mimic-3d-copilot` (or your choice)
   - In which directory is your code located? `./`

6. **Add environment variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add NODE_ENV
   ```

7. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables Needed

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your API key | Google Gemini AI API key |
| `NODE_ENV` | `production` | Environment mode |

## 📱 Post-Deployment Steps

### 1. Update Firebase Configuration

In Firebase Console:
- Go to Authentication → Settings → Authorized domains
- Add your Vercel domain (e.g., `your-app.vercel.app`)

### 2. Test Your Deployment

- Visit your Vercel URL
- Try logging in/signing up
- Test the 3D scene generation
- Check that TTS works

### 3. Update API Endpoint (if needed)

If your API calls fail, update the API URL in your client code:
```javascript
// In components that call the API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### Firebase Auth Doesn't Work
- Verify authorized domains in Firebase Console
- Check that Firebase config is correct
- Make sure environment variables are set

### API Calls Fail
- Check that CORS is configured in server
- Verify API routes are correct
- Check server logs in Vercel dashboard

### 404 Errors on Routes
- The vercel.json routing is already configured
- Make sure all routes are defined in your React Router

## 📊 Monitoring

- **View Logs:** Vercel Dashboard → Your Project → Logs
- **View Analytics:** Vercel Dashboard → Your Project → Analytics
- **View Deployments:** Vercel Dashboard → Your Project → Deployments

## 🔄 Redeploying

Every time you push to GitHub main branch, Vercel will automatically redeploy!

Or manually:
```bash
git push origin main
```

Or via CLI:
```bash
vercel --prod
```

## 🎯 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update Firebase authorized domains with your custom domain

## ✅ Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] Firebase configuration is correct
- [ ] Gemini API key is ready
- [ ] Vercel account is created
- [ ] Environment variables are set
- [ ] Project deployed successfully
- [ ] Firebase authorized domains updated
- [ ] Login/signup tested
- [ ] 3D scene generation tested
- [ ] All routes work correctly

## 🎉 Success!

Your Mimic 3D Visual Copilot is now live on Vercel!

**Your deployment URL:** `https://your-app.vercel.app`

Share it with the world! 🚀
