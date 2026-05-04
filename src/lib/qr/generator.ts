import crypto from 'crypto';

export function generateDailyToken(staticToken: string): string {
  const dateStr = new Date().toISOString().split('T')[0];
  return crypto.createHash('sha256').update(`${staticToken}-${dateStr}`).digest('hex');
}

export function validateDailyToken(staticToken: string, submittedToken: string): boolean {
  return generateDailyToken(staticToken) === submittedToken;
}

export function encodeQRPayload(householdId: string, token: string): string {
  return JSON.stringify({ hid: householdId, t: token });
}

export function decodeQRPayload(raw: string): { hid: string, t: string } {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid QR payload');
  }
}
