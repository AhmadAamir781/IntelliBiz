// OAuth Configuration and Utilities

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id'

const GOOGLE_REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/auth/google/callback`
  : 'http://localhost:3000/auth/google/callback'

// Facebook OAuth Configuration
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'your-facebook-app-id'
const FACEBOOK_REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/facebook/callback`
  : 'http://localhost:3000/auth/facebook/callback'

let googleScriptLoaded = false;
let googleScriptLoadingPromise: Promise<void> | null = null;

// Google OAuth Functions
export const googleOAuth = {
  // Initialize Google OAuth
  init: () => {
    if (typeof window === 'undefined') return;

    if (googleScriptLoaded) return;

    if (!googleScriptLoadingPromise) {
      googleScriptLoadingPromise = new Promise((resolve, reject) => {
        if (window.google) {
          googleScriptLoaded = true;
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          googleScriptLoaded = true;
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google OAuth script'));
        };
        document.head.appendChild(script);
      });
    }
    return googleScriptLoadingPromise;
  },

  // Sign in with Google
  signIn: async (): Promise<string> => {
    console.log("signIn called");
    if (typeof window === 'undefined') {
      throw new Error('Google OAuth is not available on server side');
    }
    await googleOAuth.init();
    if (!window.google) {
      throw new Error('Google OAuth not loaded. Please call googleOAuth.init() first');
    }

    return new Promise((resolve, reject) => {
      console.log("Inside Promise before initTokenClient");
      try {
        const client = window.google!.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile',
          callback: (response: any) => {
            console.log("Google callback response", response);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response.access_token);
            }
          },
        });
        client.requestAccessToken();
      } catch (error) {
        reject(new Error('Failed to initialize Google OAuth client'));
      }
    });
  },

  // Get user info from Google
  getUserInfo: async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch user information from Google');
    }
  }
};

// Facebook OAuth Functions
export const facebookOAuth = {
  // Initialize Facebook OAuth
  init: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // If FB is already loaded and initialized, resolve immediately
      if (window.FB) {
        resolve();
        return;
      }

      // Load Facebook SDK if not already loaded
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          resolve();
        } else {
          reject(new Error('Facebook SDK failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK'));
      };
      
      document.head.appendChild(script);
    });
  },

  // Sign in with Facebook
  signIn: async (): Promise<string> => {
    if (typeof window === 'undefined') {
      throw new Error('Facebook OAuth is not available on server side');
    }

    // Check if we're in development mode (HTTP)
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      throw new Error('Facebook OAuth requires HTTPS. Please use HTTPS in production or localhost in development.');
    }

    // Ensure Facebook SDK is initialized
    await facebookOAuth.init();

    // Check if Facebook SDK is loaded
    if (!window.FB) {
      throw new Error('Facebook SDK not loaded');
    }

    return new Promise((resolve, reject) => {
      try {
        const fb = window.FB;
        if (!fb) {
          reject(new Error('Facebook SDK not available'));
          return;
        }
        
        fb.login((response: any) => {
          if (response.authResponse) {
            resolve(response.authResponse.accessToken);
          } else {
            reject(new Error('Facebook login failed'));
          }
        }, {
          scope: 'email,public_profile'
        });
      } catch (error) {
        reject(new Error('Failed to initialize Facebook login'));
      }
    });
  },

  // Get user info from Facebook
  getUserInfo: async (accessToken: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Facebook OAuth is not available on server side');
    }

    // Ensure Facebook SDK is initialized
    await facebookOAuth.init();

    if (!window.FB) {
      throw new Error('Facebook SDK not loaded');
    }

    return new Promise((resolve, reject) => {
      try {
        const fb = window.FB;
        if (!fb) {
          reject(new Error('Facebook SDK not available'));
          return;
        }
        
        fb.api('/me', {
          fields: 'id,name,email,picture',
          access_token: accessToken
        }, (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        reject(new Error('Failed to fetch user information from Facebook'));
      }
    });
  }
}

// Type declarations for global objects
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void
          }
        }
      }
    }
    FB?: {
      init: (config: any) => void
      login: (callback: (response: any) => void, options?: any) => void
      api: (path: string, params: any, callback: (response: any) => void) => void
    }
  }
} 