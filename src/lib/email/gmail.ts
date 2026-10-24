/**
 * Gmail Email Integration
 * 
 * Supports:
 * 1. Google OAuth 2.0 (client_id, client_secret, refresh_token) via Gmail REST API
 * 2. Gmail App Password via Nodemailer SMTP (smtp.gmail.com)
 */

import nodemailer from 'nodemailer';
import fs from 'fs';

export interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userEmail: string;
  appPassword?: string;
}

const PERSISTENCE_FILE = '/tmp/ashk_email_config.json';

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

// Dynamic memory storage for updated tokens
let liveRefreshToken: string = process.env.GMAIL_REFRESH_TOKEN || '';
let liveAppPassword: string = process.env.GMAIL_APP_PASSWORD || '';

// Load any previously saved config on disk
try {
  if (fs.existsSync(PERSISTENCE_FILE)) {
    const raw = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.appPassword) liveAppPassword = parsed.appPassword;
    if (parsed.refreshToken) liveRefreshToken = parsed.refreshToken;
  }
} catch (e) {
  // Ignore disk read error
}

function persistConfig() {
  try {
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify({
      appPassword: liveAppPassword,
      refreshToken: liveRefreshToken,
      updatedAt: new Date().toISOString()
    }, null, 2));
  } catch (e) {
    // Ignore disk write error
  }
}

export function setLiveRefreshToken(token: string) {
  liveRefreshToken = token.trim();
  cachedAccessToken = null;
  tokenExpiresAt = 0;
  persistConfig();
}

export function setLiveAppPassword(password: string) {
  liveAppPassword = password.trim().replace(/\s+/g, '');
  persistConfig();
}

export function getGmailCredentials(): GmailCredentials {
  return {
    clientId: (process.env.GMAIL_CLIENT_ID || '').trim(),
    clientSecret: (process.env.GMAIL_CLIENT_SECRET || '').trim(),
    refreshToken: liveRefreshToken,
    userEmail: (process.env.GMAIL_USER_EMAIL || process.env.OWNER_EMAIL || '').trim(),
    appPassword: liveAppPassword
  };
}

export function isAppPasswordConfigured(): boolean {
  const creds = getGmailCredentials();
  return Boolean(creds.appPassword && creds.appPassword.replace(/\s+/g, '').length >= 8);
}

export function isGmailConfigured(): boolean {
  return isAppPasswordConfigured() || isOAuthCandidate();
}

export function isOAuthCandidate(): boolean {
  const creds = getGmailCredentials();
  return Boolean(
    creds.clientId &&
    creds.clientSecret &&
    creds.refreshToken &&
    creds.refreshToken.startsWith('1//')
  );
}

/**
 * Exchanges the refresh token for a fresh access token from Google OAuth endpoint
 */
export async function getGmailAccessToken(): Promise<{ token: string | null; error?: string; rawError?: any }> {
  if (!isOAuthCandidate()) {
    return { token: null, error: 'Gmail OAuth credentials not configured in environment' };
  }

  const creds = getGmailCredentials();

  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt - 60000) {
    return { token: cachedAccessToken };
  }

  try {
    const params = new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = data.error_description || data.error || 'Google token exchange rejected';
      if (data.error === 'unauthorized_client') {
        errorMsg = "Google OAuth 'unauthorized_client': The refresh token was issued for Google's default Playground client ID instead of your custom Client ID. In Playground settings, check 'Use your own OAuth credentials' or use a 16-character Gmail App Password.";
      }
      return { token: null, error: errorMsg, rawError: data };
    }

    cachedAccessToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

    return { token: cachedAccessToken };
  } catch (err: any) {
    return { token: null, error: err.message || 'Network error contacting Google OAuth' };
  }
}

/**
 * Exchanges an OAuth authorization code for tokens
 */
export async function exchangeAuthCodeForTokens(code: string, redirectUri: string): Promise<{ success: boolean; refreshToken?: string; error?: string }> {
  const creds = getGmailCredentials();
  try {
    const params = new URLSearchParams({
      code,
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error_description || data.error || 'Failed to exchange authorization code' };
    }

    if (data.refresh_token) {
      setLiveRefreshToken(data.refresh_token);
    }
    if (data.access_token) {
      cachedAccessToken = data.access_token;
      tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    }

    return { success: true, refreshToken: data.refresh_token };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error exchanging authorization code' };
  }
}

/**
 * Generates the Google OAuth authorization URL
 */
export function getGoogleOAuthUrl(redirectUri: string): string {
  const creds = getGmailCredentials();
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    client_id: creds.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
    access_type: 'offline',
    prompt: 'consent'
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  replyTo?: string;
}

/**
 * Sends an email using Gmail:
 * - Method A: Gmail App Password (Nodemailer SMTP) if configured
 * - Method B: Google OAuth 2.0 (Gmail REST API)
 */
export async function sendGmailMessage(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; method?: string; error?: string }> {
  const creds = getGmailCredentials();

  // Method A: Gmail App Password SMTP (Most reliable if configured)
  if (isAppPasswordConfigured()) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: creds.userEmail,
          pass: creds.appPassword?.replace(/\s+/g, '')
        }
      });

      const info = await transporter.sendMail({
        from: `"${options.fromName || 'AShK Stays'}" <${creds.userEmail}>`,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html
      });

      console.log(`[Gmail SMTP] Email successfully sent to ${options.to} via App Password (ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, method: 'smtp_app_password' };
    } catch (err: any) {
      console.log('[Gmail SMTP] App password send error:', err.message);
      // Fall through to try OAuth
    }
  }

  // Method B: Google OAuth 2.0 Gmail REST API
  const tokenResult = await getGmailAccessToken();
  if (tokenResult.token) {
    const fromName = options.fromName || 'AShK Stays Hospitality';
    const fromHeader = `${fromName} <${creds.userEmail}>`;

    const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${fromHeader}`,
      `To: ${options.to}`,
      options.replyTo ? `Reply-To: ${options.replyTo}` : '',
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      options.html
    ].filter(line => line !== '');

    const rawMessage = messageParts.join('\r\n');
    const base64UrlMessage = toBase64Url(rawMessage);

    try {
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenResult.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64UrlMessage })
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[Gmail API] Email sent to ${options.to} via OAuth (ID: ${data.id})`);
        return { success: true, messageId: data.id, method: 'gmail_rest_api' };
      }
      return { success: false, error: data.error?.message || 'Gmail API rejected sending' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error on Gmail API' };
    }
  }

  return {
    success: false,
    error: tokenResult.error || 'Gmail OAuth token unavailable and no App Password provided'
  };
}
