import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin credentials (client-side check; real auth would be server-side)
export const ADMIN_CREDENTIALS = {
  username: 'evaadmin',
  password: 'Eva@dmin@123456',
};

export const SESSION_KEY = 'evaqueen_admin_session';
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function generateToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
}

export async function adminLogin(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return false;
  }

  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION);

  // Persist session in DB
  await supabase.from('admin_sessions').insert({
    token,
    username,
    expires_at: expiresAt.toISOString(),
    ip_address: 'client',
    user_agent: navigator.userAgent,
  });

  // Log activity
  await supabase.from('admin_logs').insert({ action: 'login', entity: 'admin', details: 'ورود موفق ادمین' });

  // Store in localStorage
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, expires_at: expiresAt.getTime() }));
  return true;
}

export function isAdminLoggedIn(): boolean {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw);
    if (Date.now() > session.expires_at) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function adminLogout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function logAdminAction(action: string, entity: string, details: string): Promise<void> {
  await supabase.from('admin_logs').insert({ action, entity, details });
}
