"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  auth as authApi,
  setTokens,
  clearTokens,
  getAccessToken,
  type UserDTO,
  type AuthResponse,
} from "./api";

interface AuthCtx {
  user: UserDTO | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  /** Refresh user object from /me. */
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(Ctx);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, if we have a token try to fetch the current user.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        clearTokens();
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = useCallback(
    (res: AuthResponse) => {
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      handleAuth(res);
      router.push("/dashboard");
    },
    [handleAuth, router],
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone?: string;
      password: string;
    }) => {
      const res = await authApi.register(data);
      handleAuth(res);
      router.push("/dashboard");
    },
    [handleAuth, router],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}
