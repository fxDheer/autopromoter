const { processInstagramTokenWorkflow } = require('./utils/instagram-token-helper');

/**
 * Demo script for Instagram Token Helper
 * Usage: node demo-instagram-token.js <short_lived_token>
 */

async function main() {
    // Check if short-lived token is provided as command line argument
    const shortLivedToken = process.argv[2];
    
    if (!shortLivedToken) {
        console.log('❌ Usage: node demo-instagram-token.js <short_lived_token>');
        console.log('');
        console.log('📋 To get a short-lived token:');
        console.log('1. Go to: https://developers.facebook.com/tools/explorer/');
        console.log('2. Select your app');
        console.log('3. Add permissions: pages_show_list, pages_read_engagement, instagram_basic, instagram_content_publish');
        console.log('4. Generate Access Token');
        console.log('5. Copy the token and use it as an argument');
        console.log('');
        console.log('🔑 Example: node demo-instagram-token.js EAABwzLixnjYBO...');
        process.exit(1);
    }

    console.log('🎯 Instagram Token Helper Demo');
    console.log('================================');
    console.log('');

    try {
        // Process the Instagram token workflow
        const result = await processInstagramTokenWorkflow(shortLivedToken);
        
        if (result.success) {
            console.log('');
            console.log('🎉 Workflow completed successfully!');
            console.log('=====================================');
            console.log(`🔑 Long-lived token: ${result.longLivedToken.substring(0, 20)}...`);
            console.log(`⏰ Token expires in: ${result.tokenExpiresIn} seconds`);
            console.log(`📱 Number of pages: ${result.pages.length}`);
            console.log('');
            
            console.log('📄 Pages and Instagram accounts:');
            console.log('================================');
            result.pages.forEach((page, index) => {
                console.log(`\n${index + 1}. Page: ${page.pageName} (ID: ${page.pageId})`);
                console.log(`   Access Token: ${page.pageAccessToken.substring(0, 20)}...`);
                
                if (page.instagramBusinessAccount) {
                    console.log(`   📸 Instagram Business Account ID: ${page.instagramBusinessAccount.id}`);
                    console.log(`   📸 Instagram Username: ${page.instagramBusinessAccount.username || 'N/A'}`);
                } else if (page.error) {
                    console.log(`   ⚠️  Error: ${page.error}`);
                } else {
                    console.log(`   ❌ No Instagram business account connected`);
                }
            });
            
            console.log('');
            console.log('💡 Next steps:');
            console.log('1. Save the long-lived token securely');
            console.log('2. Use the Instagram business account ID for API calls');
            console.log('3. The token will be valid for about 60 days');
            
        } else {
            console.log('❌ Workflow failed:', result.error);
        }
        
    } catch (error) {
        console.error('💥 Unexpected error:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the demo
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };

