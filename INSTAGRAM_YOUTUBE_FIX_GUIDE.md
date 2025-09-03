# 🔧 Instagram & YouTube Fix Guide

## 🎥 **Where to Find Your YouTube Posts**

### YouTube Community Posts:
1. **Go to your YouTube channel**: `https://youtube.com/@yourchannelname`
2. **Click the "Community" tab** (next to Videos, Shorts, Playlists)
3. **This is where text posts appear** (like the one being prepared in AutoPromoter)

### YouTube Videos:
1. **Go to your channel's "Videos" tab**
2. **This is where actual video uploads would appear**

**Note**: Currently, AutoPromoter prepares YouTube community posts, but actual posting requires OAuth authentication.

---

## 📸 **Instagram "Invalid appsecret_proof" Fix**

### The Problem:
Your Instagram API is rejecting the `appsecret_proof` parameter, which means either:
1. **App Secret is incorrect/expired**
2. **Access Token is invalid**
3. **App Secret doesn't match your Facebook App**

### How to Fix:

#### Step 1: Verify Your Instagram App Secret
1. **Go to**: [Facebook Developers Console](https://developers.facebook.com/)
2. **Select your app**: "AutoPromoter" or your app name
3. **Go to**: Settings → Basic
4. **Copy the "App Secret"** (not the App ID)
5. **Update in AutoPromoter**: API Configuration → Instagram → App Secret

#### Step 2: Get a Fresh Instagram Access Token
1. **Go to**: [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. **Select your app**: "AutoPromoter"
3. **Generate Token** with these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
4. **Copy the new access token**
5. **Update in AutoPromoter**: API Configuration → Instagram → Access Token

#### Step 3: Verify Instagram Business Account ID
Your current ID: `17841477101741686`
- **This should be correct** based on our previous testing
- **If still having issues**, get a fresh one from Graph API Explorer

#### Step 4: Test the Connection
1. **In AutoPromoter**: Click "🧪 Test Instagram & YouTube"
2. **Check the console** for detailed error messages
3. **If still failing**, the issue is likely with the App Secret

---

## 🔍 **Debugging Steps**

### Check Your Current Instagram Configuration:
1. **Open AutoPromoter**
2. **Click "API Configuration"**
3. **Go to Instagram tab**
4. **Verify these fields are filled correctly**:
   - ✅ Access Token (long string starting with letters/numbers)
   - ✅ Business Account ID: `17841477101741686`
   - ✅ App ID (your Facebook App ID)
   - ✅ App Secret (your Facebook App Secret - NOT the App ID)

### Common Issues:
1. **App Secret vs App ID**: Make sure you're using the App Secret, not the App ID
2. **Expired Token**: Instagram tokens can expire - get a fresh one
3. **Wrong Permissions**: Make sure your token has the right permissions
4. **App Mismatch**: App Secret must match the App ID

---

## 🎯 **Expected Results After Fix**

### Instagram:
- ✅ **Test should pass**: "Instagram API connection successful"
- ✅ **Posts should work**: "Posted successfully to Instagram"
- ✅ **No more appsecret_proof errors**

### YouTube:
- ✅ **Currently working as expected**: "YouTube community post prepared (authentication pending)"
- 🔐 **To enable actual posting**: Click "🔐 Authenticate with YouTube" in API Configuration

### Facebook:
- ✅ **Already working perfectly**: "Posted successfully to Facebook page"

---

## 🚀 **Quick Fix Checklist**

- [ ] **Instagram App Secret**: Get fresh one from Facebook Developers Console
- [ ] **Instagram Access Token**: Generate new one with correct permissions
- [ ] **Test Instagram**: Use "🧪 Test Instagram & YouTube" button
- [ ] **YouTube Authentication**: Click "🔐 Authenticate with YouTube" (optional)
- [ ] **Test All Platforms**: Try posting to all platforms

---

## 🆘 **Still Having Issues?**

If Instagram still fails after following these steps:

1. **Check the browser console** for detailed error messages
2. **Verify your Facebook App is in "Live" mode** (not Development)
3. **Make sure your Instagram account is connected to a Facebook Page**
4. **Try generating a completely new App Secret** from Facebook Developers Console

The most common issue is using the **App ID instead of the App Secret** in the App Secret field.
