const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

/**
 * Instagram Graph API Token Helper for AutoPromoter
 * Handles Facebook token exchange, app secret proof generation, and Instagram business account retrieval
 */

/**
 * Generate app secret proof for API requests
 * @param {string} accessToken - The access token
 * @param {string} appSecret - The Facebook app secret
 * @returns {string} - The generated app secret proof
 */
function generateAppSecretProof(accessToken, appSecret) {
    return crypto
        .createHmac('sha256', appSecret)
        .update(accessToken)
        .digest('hex');
}

/**
 * Exchange short-lived token for long-lived token
 * @param {string} shortLivedToken - The short-lived access token
 * @param {string} appId - The Facebook app ID
 * @param {string} appSecret - The Facebook app secret
 * @returns {Promise<Object>} - Response with long-lived token
 */
async function exchangeForLongLivedToken(shortLivedToken, appId, appSecret) {
    try {
        const url = 'https://graph.facebook.com/v23.0/oauth/access_token';
        const params = {
            grant_type: 'fb_exchange_token',
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortLivedToken
        };

        console.log('🔄 Exchanging short-lived token for long-lived token...');
        const response = await axios.get(url, { params });
        
        console.log('✅ Long-lived token obtained successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error exchanging token:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get user's Facebook pages using long-lived token
 * @param {string} longLivedToken - The long-lived access token
 * @param {string} appSecret - The Facebook app secret
 * @returns {Promise<Object>} - Response with user's pages
 */
async function getUserPages(longLivedToken, appSecret) {
    try {
        const url = 'https://graph.facebook.com/v23.0/me/accounts';
        const appSecretProof = generateAppSecretProof(longLivedToken, appSecret);
        
        const params = {
            access_token: longLivedToken,
            appsecret_proof: appSecretProof
        };

        console.log('📄 Fetching user pages...');
        const response = await axios.get(url, { params });
        
        console.log('✅ User pages retrieved successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching user pages:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get Instagram business account ID from a Facebook page
 * @param {string} pageId - The Facebook page ID
 * @param {string} pageAccessToken - The page access token
 * @param {string} appSecret - The Facebook app secret
 * @returns {Promise<Object>} - Response with Instagram business account info
 */
async function getInstagramBusinessAccount(pageId, pageAccessToken, appSecret) {
    try {
        const url = `https://graph.facebook.com/v23.0/${pageId}`;
        const appSecretProof = generateAppSecretProof(pageAccessToken, appSecret);
        
        const params = {
            fields: 'instagram_business_account',
            access_token: pageAccessToken,
            appsecret_proof: appSecretProof
        };

        console.log(`📸 Fetching Instagram business account for page ${pageId}...`);
        const response = await axios.get(url, { params });
        
        console.log('✅ Instagram business account info retrieved successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching Instagram business account:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Main function to process Instagram token workflow
 * @param {string} shortLivedToken - The short-lived access token
 * @returns {Promise<Object>} - Complete workflow result
 */
async function processInstagramTokenWorkflow(shortLivedToken) {
    try {
        const appId = process.env.VITE_FACEBOOK_APP_ID;
        const appSecret = process.env.VITE_FACEBOOK_APP_SECRET;

        if (!appId || !appSecret) {
            throw new Error('Missing VITE_FACEBOOK_APP_ID or VITE_FACEBOOK_APP_SECRET in environment variables');
        }

        console.log('🚀 Starting Instagram token workflow...');
        console.log(`📱 App ID: ${appId}`);
        console.log(`🔐 App Secret: ${appSecret.substring(0, 8)}...`);

        // Step 1: Exchange for long-lived token
        const longLivedTokenData = await exchangeForLongLivedToken(shortLivedToken, appId, appSecret);
        const longLivedToken = longLivedTokenData.access_token;

        // Step 2: Get user's pages
        const pagesData = await getUserPages(longLivedToken, appSecret);
        const pages = pagesData.data;

        // Step 3: Get Instagram business account for each page
        const results = [];
        for (const page of pages) {
            try {
                const instagramData = await getInstagramBusinessAccount(
                    page.id, 
                    page.access_token, 
                    appSecret
                );
                
                results.push({
                    pageId: page.id,
                    pageName: page.name,
                    pageAccessToken: page.access_token,
                    instagramBusinessAccount: instagramData.instagram_business_account
                });
            } catch (error) {
                console.warn(`⚠️ Warning: Could not fetch Instagram data for page ${page.id}:`, error.message);
                results.push({
                    pageId: page.id,
                    pageName: page.name,
                    pageAccessToken: page.access_token,
                    instagramBusinessAccount: null,
                    error: error.message
                });
            }
        }

        return {
            success: true,
            longLivedToken: longLivedToken,
            tokenExpiresIn: longLivedTokenData.expires_in,
            pages: results
        };

    } catch (error) {
        console.error('❌ Workflow failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    generateAppSecretProof,
    exchangeForLongLivedToken,
    getUserPages,
    getInstagramBusinessAccount,
    processInstagramTokenWorkflow
};

