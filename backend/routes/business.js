const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (would be database in production)
let businesses = [
  {
    id: 'demo-business',
    name: 'Demo Business',
    url: 'https://demobusiness.com',
    description: 'A demonstration business for testing purposes',
    industry: 'Technology',
    audience: 'Young professionals',
    keywords: 'demo, business, test, technology',
    socialMedia: {
      instagram: '@demobusiness',
      facebook: 'demobusinesspage',
      linkedin: 'demobusiness',
      tiktok: '@demobusiness',
      youtube: 'Demo Business Channel'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all businesses
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Businesses retrieved successfully',
      data: businesses
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get business by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const business = businesses.find(b => b.id === id);
    
    if (!business) {
      return res.status(404).json({
        error: 'Business not found',
        message: `No business found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Business retrieved successfully',
      data: business
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create new business
router.post('/', (req, res) => {
  try {
    const { name, url, description, industry, audience, keywords, socialMedia } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name'],
        received: Object.keys(req.body)
      });
    }

    const newBusiness = {
      id: `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      url: url || '',
      description: description || '',
      industry: industry || 'General',
      audience: audience || 'General',
      keywords: keywords || '',
      socialMedia: socialMedia || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    businesses.push(newBusiness);

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: newBusiness
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update business
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const businessIndex = businesses.findIndex(b => b.id === id);
    
    if (businessIndex === -1) {
      return res.status(404).json({
        error: 'Business not found',
        message: `No business found with ID: ${id}`
      });
    }

    // Update business data
    businesses[businessIndex] = {
      ...businesses[businessIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Business updated successfully',
      data: businesses[businessIndex]
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete business
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const businessIndex = businesses.findIndex(b => b.id === id);
    
    if (businessIndex === -1) {
      return res.status(404).json({
        error: 'Business not found',
        message: `No business found with ID: ${id}`
      });
    }

    const deletedBusiness = businesses.splice(businessIndex, 1)[0];

    res.json({
      success: true,
      message: 'Business deleted successfully',
      data: deletedBusiness
    });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get business analytics (placeholder for future features)
router.get('/:id/analytics', (req, res) => {
  try {
    const { id } = req.params;
    const business = businesses.find(b => b.id === id);
    
    if (!business) {
      return res.status(404).json({
        error: 'Business not found',
        message: `No business found with ID: ${id}`
      });
    }

    // Mock analytics data (would be real data in production)
    const analytics = {
      businessId: id,
      totalPosts: Math.floor(Math.random() * 100) + 50,
      engagementRate: (Math.random() * 10 + 2).toFixed(2),
      followers: {
        instagram: Math.floor(Math.random() * 1000) + 500,
        facebook: Math.floor(Math.random() * 2000) + 1000,
        linkedin: Math.floor(Math.random() * 500) + 200,
        youtube: Math.floor(Math.random() * 500) + 100
      },
      topPerformingContent: [
        {
          type: 'text',
          platform: 'Instagram',
          engagement: Math.floor(Math.random() * 100) + 80
        },
        {
          type: 'image',
          platform: 'Facebook',
          engagement: Math.floor(Math.random() * 100) + 70
        },
        {
          type: 'video',
          platform: 'YouTube',
          engagement: Math.floor(Math.random() * 100) + 60
        }
      ],
      bestPostingTimes: {
        instagram: '2:00 PM - 4:00 PM',
        facebook: '9:00 AM - 11:00 AM',
        linkedin: '8:00 AM - 10:00 AM',
        youtube: '6:00 PM - 8:00 PM'
      }
    };

    res.json({
      success: true,
      message: 'Business analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Search businesses
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = businesses.filter(business => 
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      business.industry.toLowerCase().includes(query.toLowerCase()) ||
      business.keywords.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      message: `Found ${searchResults.length} businesses matching "${query}"`,
      data: searchResults
    });
  } catch (error) {
    console.error('Search businesses error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

