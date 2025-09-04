# 🔧 Instagram Troubleshooting Guide

## Current Status
✅ **App Secret Updated**: `168a3e46abd67e5b23c75e5b64d8ec2a`  
❌ **Still Not Working**: Need to identify the specific issue

## Common Instagram Issues & Solutions

### 1. 🔑 **Access Token Issues**
**Problem**: Expired or invalid access token
**Solution**: 
- Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- Select your app
- Generate a new User Access Token
- Make sure it has these permissions:
  - `instagram_basic`
  - `pages_show_list`
  - `pages_read_engagement`

### 2. 🆔 **Wrong Business Account ID**
**Problem**: Using Facebook Page ID instead of Instagram Business Account ID
**Solution**:
- Go to your Facebook Page
- Go to Settings > Instagram
- Copy the **Instagram Business Account ID** (starts with 1784...)
- NOT the Facebook Page ID (starts with different numbers)

### 3. 🔗 **Instagram Not Connected to Facebook Page**
**Problem**: Instagram account not properly connected
**Solution**:
- Go to your Facebook Page
- Go to Settings > Instagram
- Connect your Instagram Business Account
- Make sure it's a Business Account, not Personal

### 4. 🔐 **App Secret Mismatch**
**Problem**: App secret doesn't match your Facebook App
**Solution**:
- Go to [Facebook Developers Console](https://developers.facebook.com/)
- Go to your App > Settings > Basic
- Copy the **App Secret** (should be `168a3e46abd67e5b23c75e5b64d8ec2a`)
- Update it in Railway environment variables

### 5. 📱 **Missing Permissions**
**Problem**: App doesn't have required permissions
**Solution**:
- Go to your Facebook App > Instagram Basic Display
- Make sure these permissions are approved:
  - `instagram_basic`
  - `pages_show_list`
  - `pages_read_engagement`

### 6. 🌐 **API Version Issues**
**Problem**: Using wrong API version
**Solution**: We're using v23.0 (latest), which should work

## 🧪 Testing Your Configuration

### Step 1: Test with Debug Script
```bash
node test-instagram-debug.js
```

### Step 2: Check Your Credentials
1. **Instagram Business Account ID**: 
   - Go to Facebook Page > Settings > Instagram
   - Copy the ID (starts with 1784...)

2. **Access Token**:
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your app
   - Generate token with required permissions

3. **App Secret**:
   - Should be: `168a3e46abd67e5b23c75e5b64d8ec2a`

### Step 3: Verify Connection
- Make sure your Instagram Business Account is connected to your Facebook Page
- Test posting manually from Facebook Page to Instagram

## 🚨 Common Error Messages & Solutions

### "Invalid OAuth access token"
- **Solution**: Generate a new access token

### "Unsupported get request"
- **Solution**: Check if you're using the correct Instagram Business Account ID

### "App secret proof validation failed"
- **Solution**: Verify the app secret matches your Facebook App

### "User does not have permission"
- **Solution**: Check Instagram account permissions and connection

### "Media creation failed"
- **Solution**: Check if the image URL is accessible and valid

## 🔍 Debug Steps

1. **Check Railway Environment Variables**:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID`
   - `FACEBOOK_APP_SECRET`
   - `FACEBOOK_APP_ID`

2. **Test API Connection**:
   ```bash
   node test-instagram-debug.js
   ```

3. **Check Instagram Account**:
   - Must be a Business Account
   - Must be connected to Facebook Page
   - Must have posting permissions

4. **Verify Facebook App**:
   - App must be approved for Instagram Basic Display
   - Must have correct permissions
   - App secret must match

## 📞 Need Help?

Please provide:
1. **Exact error message** you're seeing
2. **Your Instagram Business Account ID** (first few characters: 1784...)
3. **Whether Instagram is connected to Facebook Page**
4. **Screenshot of the error** (if possible)

## 🎯 Quick Fix Checklist

- [ ] Instagram Business Account ID is correct (starts with 1784...)
- [ ] Access token is fresh and has required permissions
- [ ] App secret is `168a3e46abd67e5b23c75e5b64d8ec2a`
- [ ] Instagram account is connected to Facebook Page
- [ ] Instagram account is a Business Account
- [ ] Facebook App has Instagram Basic Display permissions
- [ ] Railway environment variables are updated
