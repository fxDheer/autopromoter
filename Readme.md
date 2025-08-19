# Save the README.md content to a file for user download

readme_content = """# 🤖 Auto-Promoter: AI-Powered Business Marketing Tool

## 🚀 Project Goal
This is a fully automatic AI-powered tool that promotes your business (website, app, or service) by generating and scheduling digital marketing content.

## 🌐 Platform Purpose
This is a **personal business marketing assistant**. It works like this:
1. You enter your business details.
2. The system generates promotional content using OpenAI (e.g., Instagram/Facebook posts).
3. It auto-schedules and posts them using Zapier or Buffer API.
4. Everything is automated — no manual steps after input.

## 🧰 Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Firebase (Firestore)
- **AI**: OpenAI GPT-4 API
- **Deployment**: Vite + Firebase Hosting or Vercel
- **Optional Automation**: Zapier or Buffer API

## 📁 Folder Structure
auto-promoter/
├── public/
├── src/
│ ├── components/
│ │ └── BusinessForm.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ └── GeneratePosts.jsx
│ ├── utils/
│ │ └── openaiService.js
│ └── firebase.js
├── .env
├── package.json
└── vite.config.js

## 🔑 Features

### Business Input Form
- Fields:
  - Business Name
  - Description
  - Website
  - Audience
  - Keywords
- Saves data to Firestore (document ID: `demo-business`)

### AI Post Generator
- Loads business info from Firestore
- Sends it to OpenAI GPT-4
- Returns **3 marketing posts**
- Displays each post with:
  - Emojis 🎯
  - Call-to-Action 💡
  - Hashtags 🔥

### Auto Posting (Coming Soon)
- Integrate with Buffer or Zapier to auto-schedule posts

## 🧠 GPT Prompt Used
You are an expert digital marketer. Generate 3 social media posts for this business:

Business Name: {name}
Description: {description}
Website: {url}
Audience: {audience}
Keywords: {keywords}

Each post should be short (max 280 chars), include emojis, a strong CTA, and hashtags.
Return as a JSON array like: [{text, platform}]

markdown
Copy
Edit
..

## ✅ Modules Already Built
- `src/utils/openaiService.js`: GPT-4 integration
- `src/pages/GeneratePosts.jsx`: AI post generation UI

## 📌 Next Steps
- Build `BusinessForm.jsx` UI
- Add routing between `/` and `/generate-posts`
- Connect with Buffer or Zapier to auto-post content
- Deploy to Firebase Hosting or Vercel
