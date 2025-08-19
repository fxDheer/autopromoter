# 🚀 Railway Deployment Guide for Auto-Promoter

## **Prerequisites**
- [Railway Account](https://railway.app/) (free tier available)
- [GitHub Account](https://github.com/) (for code hosting)
- Your API keys ready

## **Step 1: Prepare Your Code**

### **1.1 Push to GitHub**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Auto-Promoter ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/auto-promoter.git
git push -u origin main
```

### **1.2 Ensure Backend Structure**
```
backend/
├── server.js
├── package.json
├── routes/
│   ├── socialMedia.js
│   ├── content.js
│   └── business.js
└── .env (local development only)
```

## **Step 2: Deploy to Railway**

### **2.1 Create New Project**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `auto-promoter` repository

### **2.2 Configure Backend Service**
1. **Service Name**: `auto-promoter-backend`
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### **2.3 Set Environment Variables**
Copy these from your local `.env` file to Railway:

**Required Variables:**
```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-frontend-domain.railway.app

# Facebook
FACEBOOK_APP_ID=1690881632315694
FACEBOOK_APP_SECRET=42e1ab2b4d01e0de329f7dc8f60c2d44
FACEBOOK_ACCESS_TOKEN=EAAYB2Q8NKS4BPE6HglrvXJglqSZA9SPSZCRRJsKz5iJaGsNMH2uhokmh6NK5qxbnAeFZAFxZBQsgrIn4EzJeb3hbBGU10PD3AJzVsDRMFvce1SdiZC8Y6gIq54wYivLPvpmG4r5ZAJCfRmGAFWqa0qG8dHRa2mIeApsGijCLFNZCK1nsjSnT1TsTmVxLC51uWFRnZAEyaeGNvhPOEGVwZAUQZDZD
FACEBOOK_PAGE_ID=61579748484566

# Instagram
INSTAGRAM_APP_ID=1690881632315694
INSTAGRAM_APP_SECRET=42e1ab2b4d01e0de329f7dc8f60c2d44
INSTAGRAM_ACCESS_TOKEN=EAAYB2Q8NKS4BPE6HglrvXJglqSZA9SPSZCRRJsKz5iJaGsNMH2uhokmh6NK5qxbnAeFZAFxZBQsgrIn4EzJeb3hbBGU10PD3AJzVsDRMFvce1SdiZC8Y6gIq54wYivLPvpmG4r5ZAJCfRmGAFWqa0qG8dHRa2mIeApsGijCLFNZCK1nsjSnT1TsTmVxLC51uWFRnZAEyaeGNvhPOEGVwZAUQZDZD
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841476820732929

# YouTube
YOUTUBE_API_KEY=AIzaSyB06e-L3DSoXpR-hgkMr2S-YVIinNzU7Hc
YOUTUBE_CLIENT_ID=36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_CHANNEL_ID=UCJTizV4ZC08VoalBEMf9MIg

# OpenAI
OPENAI_API_KEY=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

# Security (generate new ones)
SESSION_SECRET=auto-promoter-prod-secret-2024-$(openssl rand -hex 32)
JWT_SECRET=auto-promoter-jwt-prod-2024-$(openssl rand -hex 32)
```

## **Step 3: Deploy Frontend (Optional)**

### **3.1 Build Frontend**
```bash
npm run build
```

### **3.2 Deploy to Railway or Vercel**
- **Railway**: Create another service for frontend
- **Vercel**: Connect GitHub repo and deploy automatically

## **Step 4: Update Frontend Configuration**

### **4.1 Update Backend URL**
In `src/utils/socialMediaService.js`:
```javascript
const BACKEND_URL = 'https://your-backend-service.railway.app/api';
```

### **4.2 Update CORS Origins**
In Railway backend environment:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.railway.app,https://yourdomain.com
```

## **Step 5: Test Deployment**

### **5.1 Health Check**
```bash
curl https://your-backend-service.railway.app/api/health
```

### **5.2 Test Social Media APIs**
Use your frontend to test posting to social media platforms.

## **Step 6: Custom Domain (Optional)**

1. Go to Railway project settings
2. Add custom domain
3. Update DNS records
4. Update `ALLOWED_ORIGINS` in environment variables

## **🚀 Deployment Complete!**

Your Auto-Promoter will now be:
- ✅ **Live on the internet**
- ✅ **Accessible from anywhere**
- ✅ **Ready for production use**
- ✅ **Scalable and reliable**

## **🔧 Troubleshooting**

### **Common Issues:**
1. **Build fails**: Check `package.json` and dependencies
2. **Environment variables**: Ensure all required vars are set
3. **CORS errors**: Update `ALLOWED_ORIGINS`
4. **Port issues**: Railway sets `PORT` automatically

### **Support:**
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)

## **🎉 Next Steps**

1. **Monitor**: Check Railway logs for any issues
2. **Scale**: Upgrade plan if needed
3. **Domain**: Add custom domain
4. **SSL**: Railway provides automatic SSL
5. **Backup**: Set up database backups (when you add a database)

**Your Auto-Promoter is now production-ready! 🚀**
