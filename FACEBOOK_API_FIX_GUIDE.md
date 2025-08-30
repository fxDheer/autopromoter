# 🔧 **FACEBOOK API FIX GUIDE**

## **🚨 Issues Identified from Graph API Explorer**

### **1. App Secret Proof Error**
```
"API calls from the server require an appsecret_proof argument"
```

### **2. Missing Permissions**
All permissions showing red X marks:
- ❌ `instagram_basic`
- ❌ `instagram_content_publish` 
- ❌ `pages_read_engagement`
- ❌ `pages_read_user_content`

---

## **✅ SOLUTIONS IMPLEMENTED**

### **Fix 1: App Secret Proof Generation**
- ✅ Added `crypto` module import
- ✅ Created `generateAppSecretProof()` function
- ✅ Updated Facebook service to include `appsecret_proof` in all API calls
- ✅ Updated Instagram service to use app secret proof

### **Fix 2: Backend API Updates**
- ✅ Facebook posting now includes app secret proof
- ✅ Instagram posting now includes app secret proof
- ✅ All API calls properly validate required fields

---

## **🔧 HOW TO TEST THE FIXES**

### **Step 1: Test App Secret Proof Generation**
```bash
cd backend
node test-app-secret-proof.js
```

**Expected Output:**
```
🔑 Testing App Secret Proof Generation
Access Token: EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX...
App Secret: 42e1ab2b4d01e0de329f7dc8f60c2d44

✅ Generated App Secret Proof: [64-character hex string]
Length: 64 characters
```

### **Step 2: Test Facebook API Call**
```bash
curl -X POST "https://graph.facebook.com/v18.0/762573416941160/feed" \
  -d "message=Test post from AutoPromoter" \
  -d "access_token=EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYJzQ8GMNHYbawmEtVYjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX" \
  -d "appsecret_proof=[GENERATED_PROOF]"
```

---

## **🔑 PERMISSIONS FIX**

### **Required Facebook App Permissions**
1. **Go to:** [Facebook Developers](https://developers.facebook.com/apps/1690881632315694)
2. **Select:** `autopromoter` app
3. **Navigate:** App Review → Permissions and Features

### **Add These Permissions:**
- ✅ `pages_manage_posts` - Post to Facebook Pages
- ✅ `pages_read_engagement` - Read page engagement data
- ✅ `instagram_basic` - Access Instagram basic data
- ✅ `instagram_content_publish` - Publish to Instagram

### **Permission Status Check:**
- **Development Mode:** Permissions work immediately
- **Production Mode:** Requires Facebook App Review

---

## **🚀 TESTING STEPS**

### **1. Local Testing**
```bash
# Start backend
cd backend
npm start

# Test app secret proof
node test-app-secret-proof.js
```

### **2. Railway Deployment**
```bash
# Deploy backend with updated code
git add .
git commit -m "Fix Facebook API app secret proof"
git push origin main
```

### **3. Verify Fixes**
- ✅ App secret proof generates correctly
- ✅ Facebook API calls include `appsecret_proof`
- ✅ Instagram API calls include `appsecret_proof`
- ✅ No more "appsecret_proof required" errors

---

## **📋 CHECKLIST**

### **Backend Code:**
- [ ] `crypto` module imported
- [ ] `generateAppSecretProof()` function added
- [ ] Facebook service updated with app secret proof
- [ ] Instagram service updated with app secret proof
- [ ] All API calls pass `appSecret` parameter

### **Facebook App:**
- [ ] App in development mode (for testing)
- [ ] Required permissions added
- [ ] Access token valid and not expired
- [ ] Page ID correct (762573416941160)

### **Testing:**
- [ ] App secret proof generates correctly
- [ ] Facebook API call succeeds
- [ ] Instagram API call succeeds
- [ ] No more permission errors

---

## **🎯 EXPECTED RESULTS**

After implementing these fixes:

1. **App Secret Proof Error** → ✅ **RESOLVED**
2. **Missing Permissions** → ✅ **RESOLVED** (in development mode)
3. **Facebook Posting** → ✅ **WORKING**
4. **Instagram Posting** → ✅ **WORKING**
5. **API Status Display** → ✅ **SHOWS CORRECT STATUS**

---

## **🚨 IF ISSUES PERSIST**

### **Check These:**
1. **Access Token Expiry** - Generate new token if needed
2. **App Mode** - Ensure app is in development mode for testing
3. **Page Permissions** - Verify page admin access
4. **Instagram Business Account** - Confirm connection to Facebook app

### **Debug Commands:**
```bash
# Test app secret proof generation
node test-app-secret-proof.js

# Test Facebook API directly
curl -X GET "https://graph.facebook.com/v23.0/me?access_token=[TOKEN]&appsecret_proof=[PROOF]"

# Check backend logs
cd backend
npm start
```

---

## **🎉 SUCCESS INDICATORS**

- ✅ App secret proof generates without errors
- ✅ Facebook API calls return success responses
- ✅ Instagram API calls return success responses
- ✅ AutoPromoter shows correct API status
- ✅ Content can be posted to both platforms

**Your AutoPromoter will be fully functional! 🚀**
