export type LocalProfile = { name: string; email: string };

type LocalAccount = LocalProfile & { salt: string; passwordHash: string };

const accountsKey = 'smarttask.localAccounts.v1';
const sessionKey = 'smarttask.localSession.v1';
const hashIterations = 310_000;

function readAccounts(): LocalAccount[] {
  const stored = localStorage.getItem(accountsKey);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error('Saved account data could not be read.');
  return parsed as LocalAccount[];
}

function createSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  if (!crypto.subtle) throw new Error('Password hashing is unavailable in this browser context. Open the app on localhost or HTTPS.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const saltBytes = Uint8Array.from(salt.match(/.{2}/g) ?? [], byte => parseInt(byte, 16));
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: hashIterations, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}

function saveSession(profile: LocalProfile): LocalProfile {
  localStorage.setItem(sessionKey, JSON.stringify(profile));
  return profile;
}

export async function registerLocalAccount(name: string, email: string, password: string): Promise<LocalProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some(account => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists on this device. Sign in instead.');
  }

  const salt = createSalt();
  const account: LocalAccount = {
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]));
  return saveSession({ name: account.name, email: account.email });
}

export async function signInLocalAccount(email: string, password: string): Promise<LocalProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find(item => item.email === normalizedEmail);
  if (!account || await hashPassword(password, account.salt) !== account.passwordHash) {
    throw new Error('Email or password is incorrect for an account saved on this device.');
  }
  return saveSession({ name: account.name, email: account.email });
}

export function getLocalSession(): LocalProfile | null {
  try {
    const stored = localStorage.getItem(sessionKey);
    if (!stored) return null;
    const session: unknown = JSON.parse(stored);
    if (typeof session === 'object' && session !== null && 'name' in session && 'email' in session && typeof session.name === 'string' && typeof session.email === 'string') {
      return { name: session.name, email: session.email };
    }
  } catch {
    localStorage.removeItem(sessionKey);
  }
  return null;
}

export function clearLocalSession(): void {
  localStorage.removeItem(sessionKey);
}