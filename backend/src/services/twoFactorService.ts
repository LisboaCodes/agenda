import * as crypto from 'crypto';

/**
 * Two-Factor Authentication Service
 * Provides TOTP (Time-based One-Time Password) functionality
 */

const TOTP_WINDOW = 30; // 30 seconds
const TOTP_DIGITS = 6;

/**
 * Generate a random secret for 2FA
 */
export const generateSecret = (): string => {
  return crypto.randomBytes(20).toString('base64');
};

/**
 * Generate backup codes for account recovery
 */
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  return codes;
};

/**
 * Generate TOTP token from secret
 */
export const generateToken = (secret: string, window: number = 0): string => {
  const time = Math.floor(Date.now() / 1000 / TOTP_WINDOW) + window;
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(time));

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const token = (binary % Math.pow(10, TOTP_DIGITS)).toString().padStart(TOTP_DIGITS, '0');
  return token;
};

/**
 * Verify TOTP token
 * Checks current window and +/- 1 window for clock drift
 */
export const verifyToken = (token: string, secret: string): boolean => {
  // Check current window and 1 window before/after for clock drift
  for (let window = -1; window <= 1; window++) {
    const expectedToken = generateToken(secret, window);
    if (token === expectedToken) {
      return true;
    }
  }
  return false;
};

/**
 * Verify backup code
 */
export const verifyBackupCode = (code: string, backupCodes: string[]): boolean => {
  return backupCodes.includes(code.toUpperCase());
};

/**
 * Remove used backup code
 */
export const removeBackupCode = (code: string, backupCodes: string[]): string[] => {
  return backupCodes.filter((c) => c !== code.toUpperCase());
};

/**
 * Generate QR code data for authenticator apps
 */
export const generateQRCodeData = (secret: string, email: string, issuer: string = 'CONTROLE'): string => {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  const encodedSecret = encodeURIComponent(secret);

  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${encodedSecret}&issuer=${encodedIssuer}`;
};
