/**
 * OAuth & Real Authentication Utilities
 * Handles Google Identity Services (GIS) and Platform OAuth 2.0 flows.
 */

// Decode JWT token from Google Identity Services
export function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode Google JWT token", err);
    return null;
  }
}

// OAuth Configuration with default demo/sandbox client IDs and environment overrides
export const OAUTH_CONFIG = {
  google: {
    clientId:
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      // Fallback Google OAuth Client ID for testing
      "1029384756-testclientid.apps.googleusercontent.com",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "email profile openid",
  },
  youtube: {
    clientId:
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "1029384756-testclientid.apps.googleusercontent.com",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/youtube.readonly email profile",
  },
  discord: {
    clientId:
      import.meta.env.VITE_DISCORD_CLIENT_ID ||
      "123456789012345678", // Replace with real Discord Application ID
    authUrl: "https://discord.com/api/oauth2/authorize",
    scope: "identify email",
  },
  instagram: {
    clientId:
      import.meta.env.VITE_INSTAGRAM_CLIENT_ID ||
      "123456789012345", // Replace with Meta App ID
    authUrl: "https://api.instagram.com/oauth/authorize",
    scope: "user_profile,user_media",
  },
  facebook: {
    clientId:
      import.meta.env.VITE_FACEBOOK_CLIENT_ID ||
      "123456789012345", // Replace with Facebook App ID
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    scope: "public_profile,email",
  },
};

/**
 * Open a real popup window for OAuth 2.0 authentication
 */
export function openOAuthPopup(url, title = "OAuth Login", width = 550, height = 650) {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  return window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
  );
}
