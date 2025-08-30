# Instagram Graph API Token Helper for AutoPromoter

A Node.js utility that simplifies the Instagram Graph API token management workflow for AutoPromoter.

## Features

- 🔄 Exchange short-lived tokens for long-lived tokens
- 🔐 Generate app secret proof for secure API requests
- 📄 Retrieve user's Facebook pages
- 📸 Get Instagram business account IDs from Facebook pages
- 🚀 Complete workflow automation
- 🛡️ Built-in error handling and logging

## Prerequisites

- Node.js 18+ 
- Facebook App with Instagram Basic permissions
- Short-lived access token from Facebook

## Installation

The utility is already included in the backend dependencies:
- `axios` - For HTTP requests
- `crypto` - For app secret proof generation
- `dotenv` - For environment variable management

## Environment Variables

Create a `.env` file in the backend directory with:

```env
VITE_FACEBOOK_APP_ID=1309434114303997
VITE_FACEBOOK_APP_SECRET=168a3e46abd67e5b23c75e5b64d8ec2a
VITE_FACEBOOK_PAGE_ID=768563439674289
```

## Usage

### 1. Basic Function Usage

```javascript
const { 
    generateAppSecretProof,
    exchangeForLongLivedToken,
    getUserPages,
    getInstagramBusinessAccount,
    processInstagramTokenWorkflow
} = require('./utils/instagram-token-helper');

// Generate app secret proof
const proof = generateAppSecretProof(accessToken, appSecret);

// Exchange token
const longLivedToken = await exchangeForLongLivedToken(shortToken, appId, appSecret);

// Get user pages
const pages = await getUserPages(longLivedToken, appSecret);

// Get Instagram business account
const instagramAccount = await getInstagramBusinessAccount(pageId, pageToken, appSecret);
```

### 2. Complete Workflow

```javascript
const result = await processInstagramTokenWorkflow(shortLivedToken);

if (result.success) {
    console.log('Long-lived token:', result.longLivedToken);
    console.log('Pages:', result.pages);
} else {
    console.error('Error:', result.error);
}
```

### 3. Command Line Demo

```bash
# Test individual functions
node test-token-functions.js

# Run complete workflow demo
node demo-instagram-token.js <your_short_lived_token>
```

## API Reference

### `generateAppSecretProof(accessToken, appSecret)`

Generates HMAC-SHA256 app secret proof for secure API requests.

**Parameters:**
- `accessToken` (string): The access token
- `appSecret` (string): The Facebook app secret

**Returns:** `string` - The generated app secret proof

### `exchangeForLongLivedToken(shortLivedToken, appId, appSecret)`

Exchanges a short-lived token for a long-lived token.

**Parameters:**
- `shortLivedToken` (string): The short-lived access token
- `appId` (string): The Facebook app ID
- `appSecret` (string): The Facebook app secret

**Returns:** `Promise<Object>` - Response with long-lived token data

### `getUserPages(longLivedToken, appSecret)`

Retrieves the user's Facebook pages using a long-lived token.

**Parameters:**
- `longLivedToken` (string): The long-lived access token
- `appSecret` (string): The Facebook app secret

**Returns:** `Promise<Object>` - Response with user's pages data

### `getInstagramBusinessAccount(pageId, pageAccessToken, appSecret)`

Gets Instagram business account information from a Facebook page.

**Parameters:**
- `pageId` (string): The Facebook page ID
- `pageAccessToken` (string): The page access token
- `appSecret` (string): The Facebook app secret

**Returns:** `Promise<Object>` - Response with Instagram business account data

### `processInstagramTokenWorkflow(shortLivedToken)`

Executes the complete Instagram token workflow.

**Parameters:**
- `shortLivedToken` (string): The short-lived access token

**Returns:** `Promise<Object>` - Complete workflow result

## Getting a Short-Lived Token

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Add required permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
4. Generate Access Token
5. Copy the token for use with this utility

## Error Handling

The utility includes comprehensive error handling:

- Network request failures
- Invalid tokens
- Missing permissions
- API rate limiting
- Environment variable validation

All errors are logged with descriptive messages and proper error objects are returned.

## Security Features

- **App Secret Proof**: All API requests include HMAC-SHA256 app secret proof
- **Environment Variables**: Sensitive data stored in `.env` files
- **Token Validation**: Automatic validation of token format and permissions
- **Secure Logging**: Sensitive data is masked in logs

## Example Output

```
🚀 Starting Instagram token workflow...
📱 App ID: 1309434114303997
🔐 App Secret: 168a3e4...
🔄 Exchanging short-lived token for long-lived token...
✅ Long-lived token obtained successfully
📄 Fetching user pages...
✅ User pages retrieved successfully
📸 Fetching Instagram business account for page 768563439674289...
✅ Instagram business account info retrieved successfully

🎉 Workflow completed successfully!
=====================================
🔑 Long-lived token: EAABwzLixnjYBO...
⏰ Token expires in: 5184000 seconds
📱 Number of pages: 1

📄 Pages and Instagram accounts:
================================

1. Page: Your Page Name (ID: 768563439674289)
   Access Token: EAABwzLixnjYBO...
   📸 Instagram Business Account ID: 17841405793087218
   📸 Instagram Username: your_instagram_handle
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure `.env` file exists in backend directory
   - Check variable names match exactly

2. **Invalid Token**
   - Verify token hasn't expired
   - Check required permissions are granted
   - Ensure token is for the correct app

3. **API Rate Limiting**
   - Wait before retrying requests
   - Check Facebook app status

4. **Permission Errors**
   - Verify Instagram Basic permissions are enabled
   - Check page is connected to Instagram business account

### Debug Mode

Enable detailed logging by setting:

```javascript
process.env.DEBUG = 'instagram-token-helper';
```

## Contributing

When modifying the utility:

1. Update JSDoc comments
2. Add error handling for new edge cases
3. Test with various token scenarios
4. Update this README if API changes

## License

MIT License - See main project license file.

