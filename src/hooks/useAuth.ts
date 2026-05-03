import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const utils = trpc.useUtils();

  // Try OAuth auth first
  const {
    data: oauthUser,
    isLoading: oauthLoading,
    error: oauthError,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!import.meta.env.VITE_KIMI_AUTH_URL,
  });

  // Fallback to demo auth
  const {
    data: demoUser,
    isLoading: demoLoading,
  } = trpc.demoAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !oauthUser && !import.meta.env.VITE_KIMI_AUTH_URL,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(redirectPath);
    },
  });

  const logout = useCallback(() => {
    // Clear demo auth
    localStorage.removeItem("demo_auth_token");
    localStorage.removeItem("demo_user");
    // Also try OAuth logout
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  // Determine which user to use
  const user = oauthUser ?? demoUser ?? null;
  const isLoading = oauthLoading || demoLoading;
  const error = oauthError ?? null;

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
