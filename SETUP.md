# 🚀 Auto-Promoter Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory with the following content:

```env
# Firebase Configuration - Replace with your actual Firebase project values
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id_here

# OpenAI Configuration - Replace with your actual OpenAI API key
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get Your API Keys

#### Firebase Setup:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click "Add app" > Web app
6. Copy the config values to your `.env` file

#### OpenAI Setup:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login and go to API Keys
3. Create a new API key
4. Copy it to `VITE_OPENAI_API_KEY` in your `.env` file

### 4. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 How to Use

1. **Fill Business Form**: Enter your business details on the home page
2. **Generate Posts**: Click "Save & Generate AI Posts" to create marketing content
3. **Copy & Use**: Copy the generated posts and use them on your social media

## 🔧 Troubleshooting

- **Firebase errors**: Make sure your Firebase project has Firestore enabled
- **OpenAI errors**: Check your API key and billing status
- **Build errors**: Run `npm audit fix` to resolve dependency issues

## 📱 Features

- ✅ Beautiful, responsive UI
- ✅ AI-powered post generation
- ✅ Firebase data storage
- ✅ Copy-to-clipboard functionality
- ✅ Error handling and loading states 