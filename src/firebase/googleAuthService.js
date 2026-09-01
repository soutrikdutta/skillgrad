const STORAGE_USER_KEY = 'skillgrad_auth_user';
const STORAGE_CLIENT_ID_KEY = 'skillgrad_google_client_id';

const DEFAULT_CLIENT_ID = '123857226981-vhh84h5okpt21t6r14nj75b4pb3d0ln0.apps.googleusercontent.com';

export const googleCloudAuth = {
  getClientId() {
    return localStorage.getItem(STORAGE_CLIENT_ID_KEY) || import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID;
  },

  setClientId(clientId) {
    if (clientId) {
      localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId.trim());
    }
  },

  signInWithGoogleCloud(customClientId = null) {
    return new Promise((resolve, reject) => {
      const clientId = customClientId || this.getClientId();

      if (!clientId) {
        reject(new Error('Google Client ID is missing.'));
        return;
      }

      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              if (tokenResponse && tokenResponse.access_token) {
                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                      Authorization: 'Bearer ' + tokenResponse.access_token
                    }
                  });
                  const profile = await res.json();
                  const userObj = {
                    uid: profile.sub,
                    displayName: profile.name || profile.given_name || 'Google User',
                    email: profile.email,
                    photoURL: profile.picture,
                    provider: 'google.com'
                  };
                  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
                  resolve({ success: true, user: userObj });
                } catch (fetchErr) {
                  reject(fetchErr);
                }
              } else {
                reject(new Error('Google sign-in was closed.'));
              }
            },
            error_callback: (err) => {
              console.error('Google OAuth error:', err);
              reject(new Error(err.message || 'Google OAuth error'));
            }
          });

          client.requestAccessToken();
          return;
        } catch (e) {
          console.error('Google Identity Services error:', e);
          reject(e);
        }
      } else {
        reject(new Error('Google Identity Services SDK is loading. Please try again in 1 second.'));
      }
    });
  }
};