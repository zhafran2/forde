import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthResponse } from '@/types/api';

type LoginState = {
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loginState, setLoginState] = useState<LoginState>({ loading: false, error: null });

  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) setToken(stored);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoginState({ loading: true, error: null });
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.message || 'Login gagal');
      }
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      setLoginState({ loading: false, error: null });
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login gagal';
      setLoginState({ loading: false, error: message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
  }, []);

  const authHeader = useMemo<Record<string, string>>(() => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  return { token, isAuthenticated: !!token, login, logout, loginState, authHeader };
}


