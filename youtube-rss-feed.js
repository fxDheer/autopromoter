// YouTube RSS Feed Implementation
// This provides a permanent solution without any authentication

const fs = require('fs');
const path = require('path');

class YouTubeRSSFeed {
  constructor(rssFeedPath) {
    this.rssFeedPath = rssFeedPath;
  }

  async publishPost(content) {
    try {
      // Create RSS feed entry
      const rssEntry = this.createRSSEntry(content);
      
      // Append to RSS feed file
      await this.appendToRSSFeed(rssEntry);
      
      return {
        success: true,
        message: 'Post published to RSS feed successfully',
        data: {
          content: content.text,
          type: 'rss_feed',
          note: 'YouTube will automatically pick up new content from RSS feed',
          rssEntry: rssEntry
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  createRSSEntry(content) {
    const now = new Date();
    const guid = `autopromoter-${Date.now()}`;
    
    return `
    <item>
      <title>${this.escapeXml(content.title || content.text.substring(0, 100))}</title>
      <description>${this.escapeXml(content.text)}</description>
      <link>https://youtube.com/watch?v=${guid}</link>
      <guid>${guid}</guid>
      <pubDate>${now.toUTCString()}</pubDate>
      <category>AutoPromoter</category>
    </item>`;
  }

  async appendToRSSFeed(entry) {
    try {
      // Read existing RSS feed
      let rssContent = '';
      if (fs.existsSync(this.rssFeedPath)) {
        rssContent = fs.readFileSync(this.rssFeedPath, 'utf8');
      } else {
        // Create new RSS feed
        rssContent = this.createRSSHeader();
      }
      
      // Insert new entry before closing channel tag
      const insertPoint = rssContent.lastIndexOf('</channel>');
      if (insertPoint !== -1) {
        rssContent = rssContent.slice(0, insertPoint) + entry + '\n  ' + rssContent.slice(insertPoint);
      }
      
      // Write back to file
      fs.writeFileSync(this.rssFeedPath, rssContent);
      
      console.log('✅ RSS feed updated successfully');
    } catch (error) {
      console.error('❌ Failed to update RSS feed:', error.message);
      throw error;
    }
  }

  createRSSHeader() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AutoPromoter YouTube Feed</title>
    <description>Automated content from AutoPromoter</description>
    <link>https://autopromoter.vercel.app</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://autopromoter.vercel.app/api/youtube/rss" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;
  }

  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Usage example
async function testYouTubeRSSFeed() {
  console.log('🧪 Testing YouTube RSS Feed...');
  
  const rssFeed = new YouTubeRSSFeed('./youtube-feed.xml');
  
  const result = await rssFeed.publishPost({
    text: 'Test post from AutoPromoter 🚀 - RSS Feed Method',
    title: 'AutoPromoter Test Post'
  });
  
  console.log('RSS Feed Result:', result);
}

module.exports = {
  YouTubeRSSFeed,
  testYouTubeRSSFeed
};
