const express = require('express');
const router = express.Router();

// Instagram webhook verification
router.get('/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Your verify token (you can set this to anything)
  const VERIFY_TOKEN = 'AUTO_PROMOTER_VERIFY_TOKEN_2024';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Instagram webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Instagram webhook verification failed');
    res.sendStatus(403);
  }
});

// Instagram webhook notifications
router.post('/instagram', (req, res) => {
  console.log('📱 Instagram webhook notification received:', req.body);
  
  // Handle different types of notifications
  if (req.body.object === 'instagram') {
    req.body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        console.log('🔄 Instagram change:', change);
        
        // Handle different change types
        switch (change.field) {
          case 'mentions':
            console.log('👥 New mention received');
            break;
          case 'comments':
            console.log('💬 New comment received');
            break;
          case 'messages':
            console.log('💌 New message received');
            break;
          default:
            console.log('📝 Other change:', change.field);
        }
      });
    });
  }
  
  res.status(200).send('OK');
});

// Facebook webhook verification
router.get('/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = 'AUTO_PROMOTER_VERIFY_TOKEN_2024';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Facebook webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Facebook webhook verification failed');
    res.sendStatus(403);
  }
});

// Facebook webhook notifications
router.post('/facebook', (req, res) => {
  console.log('📘 Facebook webhook notification received:', req.body);
  res.status(200).send('OK');
});

module.exports = router;
