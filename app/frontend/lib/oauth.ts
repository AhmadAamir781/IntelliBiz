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
  init: () => {
    if (typeof window === 'undefined') return

    // Load Facebook SDK if not already loaded
    if (!window.FB) {
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.onerror = () => {
        console.error('Failed to load Facebook SDK')
      }
      document.head.appendChild(script)

      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          })
        }
      }
    }
  },

  // Sign in with Facebook
  signIn: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Facebook OAuth is not available on server side'))
        return
      }

      // Check if Facebook SDK is loaded
      if (!window.FB) {
        reject(new Error('Facebook SDK not loaded. Please call facebookOAuth.init() first'))
        return
      }

      try {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            resolve(response.authResponse.accessToken)
          } else {
            reject(new Error('Facebook login failed'))
          }
        }, {
          scope: 'email,public_profile'
        })
      } catch (error) {
        reject(new Error('Failed to initialize Facebook login'))
      }
    })
  },

  // Get user info from Facebook
  getUserInfo: async (accessToken: string) => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Facebook OAuth is not available on server side'))
        return
      }

      if (!window.FB) {
        reject(new Error('Facebook SDK not loaded'))
        return
      }

      try {
        window.FB.api('/me', {
          fields: 'id,name,email,picture',
          access_token: accessToken
        }, (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message))
          } else {
            resolve(response)
          }
        })
      } catch (error) {
        reject(new Error('Failed to fetch user information from Facebook'))
      }
    })
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