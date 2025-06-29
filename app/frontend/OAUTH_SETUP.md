# OAuth Setup Guide

This guide will help you set up Google and Facebook OAuth for the IntelliBiz application.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5075/api
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized JavaScript origins to:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Set the authorized redirect URIs to:
   - `http://localhost:3000/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Copy the Client ID and add it to your `.env.local` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the Facebook Login product to your app
4. Configure the Facebook Login settings:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/auth/facebook/callback` (for development)
     - `https://yourdomain.com/auth/facebook/callback` (for production)
5. Copy the App ID and add it to your `.env.local` file

## Backend API Endpoints

Make sure your backend API has the following endpoints:

- `POST /api/auth/google` - Handle Google OAuth login
- `POST /api/auth/facebook` - Handle Facebook OAuth login

These endpoints should:
1. Verify the OAuth token with Google/Facebook
2. Get user information from the OAuth provider
3. Create or update the user in your database
4. Return a JWT token for your application

## Testing

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click on either the Google or Facebook button
4. Complete the OAuth flow
5. You should be redirected to the appropriate dashboard based on your user role

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that your OAuth app configurations match your domain
- Verify that your backend API endpoints are working
- Check the browser console for any JavaScript errors
- Ensure your backend can handle the OAuth token verification 