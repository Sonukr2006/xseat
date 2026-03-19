const SESSION_KEY = 'xseat_session';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export const hasSessionClient = (): boolean => {
  if (typeof document === 'undefined') return false;
  const cookieHasSession = document.cookie.includes('connect.sid=');
  const sessionFlag = typeof window !== 'undefined' ? window.localStorage.getItem(SESSION_KEY) : null;
  return cookieHasSession || Boolean(sessionFlag);
};

export const setSessionClient = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, '1');
};

export const clearSessionClient = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
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
