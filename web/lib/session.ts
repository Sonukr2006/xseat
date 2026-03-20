const SESSION_KEY = 'xseat_session';
const AUTH_COOKIE = 'xseat_auth';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

const setAuthCookie = () => {
  if (typeof document === 'undefined') return;
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const maxAge = 7 * 24 * 60 * 60;
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
};

const clearAuthCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const hasSessionClient = (): boolean => {
  if (typeof document === 'undefined') return false;
  const cookieHasSession = document.cookie.includes('connect.sid=');
  const cookieHasAuth = document.cookie.includes(`${AUTH_COOKIE}=`);
  const sessionFlag = typeof window !== 'undefined' ? window.localStorage.getItem(SESSION_KEY) : null;
  return cookieHasSession || cookieHasAuth || Boolean(sessionFlag);
};

export const setSessionClient = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, '1');
  setAuthCookie();
};

export const clearSessionClient = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
  clearAuthCookie();
};

export const fetchSessionProfile = async (): Promise<{ name?: string } | null> => {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};
