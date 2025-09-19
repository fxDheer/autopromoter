# 🚀 **RAILWAY DEPLOYMENT - STEP BY STEP**

## **✅ CODE IS READY & PUSHED TO GITHUB!**

Your Auto-Promoter backend is now ready for Railway deployment!

---

## **🎯 STEP 1: Go to Railway Dashboard**

**Click:** [https://railway.app/dashboard](https://railway.app/dashboard)

---

## **🚀 STEP 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`fxDheer/autopromoter`**
4. Click **"Deploy Now"**

---

## **⚙️ STEP 3: Configure Backend Service**

### **Service Settings:**
- **Service Name**: `auto-promoter-backend`
- **Root Directory**: `backend` ← **IMPORTANT!**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

---

## **🔑 STEP 4: Set Environment Variables**

**Copy these EXACT values to Railway:**

```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://autopromoter-frontend.up.railway.app

# Facebook (YOUR ACCOUNT: Ap Guru / AutopromoterGuru)
FACEBOOK_APP_ID=1690881632315694
FACEBOOK_APP_SECRET=168a3e46abd67e5b23c75e5b64d8ec2a
FACEBOOK_ACCESS_TOKEN=EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX
FACEBOOK_PAGE_ID=762573416941160

# Instagram (YOUR ACCOUNT: autopromoter9)
INSTAGRAM_APP_ID=1690881632315694
INSTAGRAM_APP_SECRET=168a3e46abd67e5b23c75e5b64d8ec2a
INSTAGRAM_ACCESS_TOKEN=EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841477101741686

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CLIENT_ID=36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_CHANNEL_ID=UCJTizV4ZC08VoalBEMf9MIg

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Security
SESSION_SECRET=auto-promoter-prod-secret-2024
JWT_SECRET=auto-promoter-jwt-prod-2024
```

---

## **🎉 STEP 5: Deploy!**

1. Click **"Deploy"**
2. Wait for build to complete
3. Your backend will be live! 🚀

---

## **🔍 STEP 6: Test Your Live Backend**

Once deployed, test with:

```bash
curl https://your-backend-service.railway.app/api/health
```

---

## **📱 STEP 7: Deploy Frontend (Optional)**

### **Option A: Railway Frontend Service**
- Create another service
- Root Directory: `.` (root)
- Build Command: `npm run build`

- Start Command: `npm run preview`

### **Option B: Vercel (Recommended)**
- Go to [vercel.com](https://vercel.com)
- Connect GitHub repo
- Deploy automatically

---

## **🎯 YOUR BACKEND IS READY!**

**Repository**: `fxDheer/autopromoter`
**Backend Directory**: `backend`
**Status**: ✅ Ready for Railway deployment

**Just follow the steps above and your Auto-Promoter will be live! 🚀**

---

## **📋 ACCOUNT VERIFICATION CHECKLIST**

### **Facebook Setup:**
- ✅ **App Name**: `autopromoter`
- ✅ **Account Name**: `Ap Guru`
- ✅ **Page Name**: `AutopromoterGuru`
- ✅ **Page ID**: `762573416941160`
- ✅ **App ID**: `1690881632315694`

### **Instagram Setup:**
- ✅ **Account Name**: `autopromoter9`
- ✅ **Business Account ID**: `17841476820732929`
- ✅ **Connected to Facebook App**: `autopromoter`

### **Next Steps:**
1. **Complete Facebook App Review** (if not already done)
2. **Verify Instagram Business Account** permissions
3. **Test posting to both platforms**
4. **Monitor webhook functionality**
