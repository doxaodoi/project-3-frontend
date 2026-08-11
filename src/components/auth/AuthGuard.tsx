"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Redirects unauthenticated users to /login.
 * Wrap any page that requires auth with this component.
 * Shows nothing while checking auth state (loading.tsx handles the UI).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While loading or if not authenticated, render nothing (loading.tsx shows skeleton)
  if (loading || !user) return null;

  return <>{children}</>;
}
