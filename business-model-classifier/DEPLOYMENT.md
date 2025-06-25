# Deployment Guide for Business Model Classifier

## Current Setup
- **Frontend**: Deployed on Vercel
- **Backend**: Needs to be deployed separately

## Backend Deployment Options

### Option 1: Railway (Recommended - Easy & Free tier)

1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `revenue_DK` repository
   - Railway will auto-detect the Node.js app

3. **Set Environment Variables in Railway**:
   - Go to your project settings → Variables
   - Add these variables:
     ```
     VITE_GROQ_API_KEY=your-groq-api-key-here
     PORT=3001
     API_PROVIDER=groq
     ```

4. **Get your Railway backend URL**:
   - Once deployed, Railway will give you a URL like: `https://your-app.railway.app`

### Option 2: Render (Also free)

1. **Create account** at [render.com](https://render.com)
2. **New Web Service** → Connect your GitHub repo
3. **Build Command**: `npm install`
4. **Start Command**: `npm run dev:server`
5. **Add environment variables** (same as Railway)

## Connect Frontend to Backend

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app` (your Railway URL)
   - **Important**: No trailing slash!

2. **Redeploy on Vercel**:
   - Vercel will automatically redeploy when you add the environment variable
   - Or trigger manually: Deployments → Redeploy

## Testing

After both are deployed:
1. Visit your Vercel frontend URL
2. You should see "Backend Connected ✅"
3. Try classifying a business!

## Local Development

For local development, you can still use the proxy setup:
```bash
# Terminal 1 - Backend
cd business-model-classifier
npm run dev:server

# Terminal 2 - Frontend  
cd business-model-classifier
npm run dev:client
```

## Troubleshooting

- **CORS errors**: Make sure your frontend URL is allowed in the backend CORS config
- **"Backend Not Responding"**: Check that VITE_API_URL is set correctly in Vercel
- **500 errors**: Check your API keys are set in the backend deployment 