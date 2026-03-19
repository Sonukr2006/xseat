const TOKEN_KEY = 'xseat_token';
const PHONE_KEY = 'xseat_phone';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
};

export const getPhone = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(PHONE_KEY);
};

export const setPhone = (phone: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PHONE_KEY, phone);
};

export const clearPhone = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PHONE_KEY);
};
