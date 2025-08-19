# 🚀 Auto-Promoter Backend Server

A powerful Node.js/Express backend server that powers the Auto-Promoter social media automation platform.

## ✨ Features

- **Social Media API Integration**: Facebook, Instagram, YouTube, LinkedIn, TikTok
- **AI Content Generation**: Dynamic content creation based on business profiles
- **Business Management**: CRUD operations for business profiles
- **Real-time Posting**: Direct posting to social media platforms
- **API Testing**: Built-in testing endpoints for API configurations
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Comprehensive request logging with Morgan

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## 📁 Project Structure

```
backend/
├── routes/
│   ├── socialMedia.js    # Social media posting endpoints
│   ├── content.js        # Content generation endpoints
│   └── business.js       # Business management endpoints
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── env.template          # Environment variables template
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy the template and fill in your values
cp env.template .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server status and version

### Social Media
- `POST /api/social-media/post` - Post content to social media
- `POST /api/social-media/test-config` - Test API configurations

### Content Generation
- `POST /api/content/generate` - Generate AI content
- `POST /api/content/generate/:type` - Generate specific content type
- `GET /api/content/templates` - Get content templates
- `POST /api/content/analyze` - Analyze content performance

### Business Management
- `GET /api/business` - Get all businesses
- `GET /api/business/:id` - Get business by ID
- `POST /api/business` - Create new business
- `PUT /api/business/:id` - Update business
- `DELETE /api/business/:id` - Delete business
- `GET /api/business/:id/analytics` - Get business analytics
- `GET /api/business/search/:query` - Search businesses

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `FACEBOOK_RATE_LIMIT` | Facebook API rate limit | `200` |
| `INSTAGRAM_RATE_LIMIT` | Instagram API rate limit | `100` |
| `YOUTUBE_RATE_LIMIT` | YouTube API rate limit | `10000` |
| `LINKEDIN_RATE_LIMIT` | LinkedIn API rate limit | `100` |

## 📱 Social Media Integration

### Facebook
- **Endpoint**: `https://graph.facebook.com/v18.0/{pageId}/feed`
- **Features**: Text posts, image posts, page management
- **Required**: Access Token, Page ID

### Instagram
- **Endpoint**: `https://graph.facebook.com/v18.0/{businessAccountId}/media`
- **Features**: Photo posts, video posts, stories
- **Required**: Access Token, Business Account ID

### YouTube
- **Endpoint**: `https://www.googleapis.com/youtube/v3/`
- **Features**: Video uploads, channel management
- **Required**: API Key, Channel ID

### LinkedIn
- **Endpoint**: `https://api.linkedin.com/v2/ugcPosts`
- **Features**: Company posts, article sharing
- **Required**: Access Token, Organization ID

### TikTok
- **Endpoint**: TikTok Business API (requires approval)
- **Features**: Video posts, business insights
- **Required**: Business Account, API Access

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request body validation
- **Rate Limiting**: API rate limiting (configurable)
- **Error Handling**: Comprehensive error handling

## 📊 Logging

The server uses Morgan for HTTP request logging:

```bash
# Development
npm run dev  # Detailed logging

# Production
npm start    # Combined logging
```

## 🧪 Testing

### Test API Configuration
```bash
curl -X POST http://localhost:5000/api/social-media/test-config \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": {
      "facebook": {
        "enabled": true,
        "accessToken": "your-token",
        "pageId": "your-page-id"
      }
    }
  }'
```

### Test Content Generation
```bash
curl -X POST http://localhost:5000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "name": "Test Business",
      "industry": "Technology"
    },
    "contentType": "text",
    "count": 3
  }'
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Future)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] OAuth2 flows for social media
- [ ] Content scheduling
- [ ] Analytics dashboard
- [ ] Webhook support
- [ ] Rate limiting middleware
- [ ] Caching layer (Redis)
- [ ] File upload support
- [ ] Multi-tenant architecture

## 📝 License

This project is part of the Auto-Promoter platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please refer to the main Auto-Promoter documentation.

