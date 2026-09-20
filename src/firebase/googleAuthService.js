const STORAGE_USER_KEY = 'skillgrad_auth_user';
const STORAGE_CLIENT_ID_KEY = 'skillgrad_google_client_id';

export const DEFAULT_GOOGLE_CLIENT_ID = '213955093649-mgo0284fnlom7p26nqaftvptenhlk0oj.apps.googleusercontent.com';

function loadGoogleGsiScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      setTimeout(() => resolve(Boolean(window.google?.accounts?.oauth2)), 2000);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export const googleCloudAuth = {
  getClientId() {
    return (
      localStorage.getItem(STORAGE_CLIENT_ID_KEY) ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  },

  setClientId(clientId) {
    if (clientId) {
      localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId.trim());
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  signOut() {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch (e) {}
  },

  async signInWithGoogleCloud(customClientId = null) {
    const clientId = customClientId || this.getClientId();

    if (!clientId) {
      throw new Error('Google Client ID is missing. Please configure your client ID.');
    }

    // Ensure Google Identity Services SDK is loaded
    if (!window.google?.accounts?.oauth2) {
      await loadGoogleGsiScript();
    }

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services SDK could not be loaded. Please check your internet connection.');
    }

    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google Sign-In failed'));
              return;
            }

            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: 'Bearer ' + tokenResponse.access_token
                  }
                });

                if (!res.ok) {
                  throw new Error(`Failed to fetch Google profile: ${res.statusText}`);
                }

                const profile = await res.json();
                const userObj = {
                  uid: 'google-' + profile.sub,
                  displayName: profile.name || profile.given_name || 'Google User',
                  email: profile.email,
                  photoURL: profile.picture,
                  provider: 'google.com'
                };

                localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
                resolve({ success: true, user: userObj });
              } catch (fetchErr) {
                console.error('Error fetching Google profile:', fetchErr);
                reject(fetchErr);
              }
            } else {
              reject(new Error('Google sign-in popup was closed without authorization.'));
            }
          },
          error_callback: (err) => {
            console.error('Google OAuth error:', err);
            const msg = err?.message || err?.type || 'Google OAuth failed';
            if (msg.includes('origin') || msg.includes('whitelist') || msg.includes('unregistered')) {
              reject(new Error('Origin mismatch: Make sure your current URL is added to Authorized JavaScript Origins in Google Cloud Console.'));
            } else {
              reject(new Error(msg));
            }
          }
        });

        client.requestAccessToken();
      } catch (e) {
        console.error('Google Identity Services error:', e);
        reject(e);
      }
    });
  },

  // Alias for backward compatibility
  signInWithGoogle(customClientId = null) {
    return this.signInWithGoogleCloud(customClientId);
  }
};