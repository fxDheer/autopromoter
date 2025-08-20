const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const socialMediaRoutes = require('./routes/socialMedia');
const contentRoutes = require('./routes/content');
const businessRoutes = require('./routes/business');

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://autopromoter-autopromoter.up.railway.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes (must come before static files)
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/business', businessRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auto-Promoter Backend Server Running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Static files (for production) - serve frontend FIRST
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist folder
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Root health check for Railway (only if not in production)
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Auto-Promoter Backend Server Running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        socialMedia: '/api/social-media',
        content: '/api/content',
        business: '/api/business'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Auto-Promoter Backend Server running on port ${PORT}`);
  console.log(`📱 Social Media APIs: Ready`);
  console.log(`🤖 AI Content Generation: Ready`);
  console.log(`🔑 API Endpoints: http://localhost:${PORT}/api`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

