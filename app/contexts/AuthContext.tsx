import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { createClient } from "../utils/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string, avatarUrl?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(accessToken: string) {
  const response = await fetch("/api/auth/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return (await response.json()) as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncServerSession = useCallback(async (session: Session | null) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (session?.access_token) {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ accessToken: session.access_token }),
        });

        if (!response.ok) {
          console.error("Failed syncing Supabase session to server", await response.text());
        }
      } else {
        const response = await fetch("/api/auth/session", {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed clearing server session", await response.text());
        }
      }
    } catch (error) {
      console.error("Error syncing session with server", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setSupabase((current) => current ?? createClient());
  }, []);

  const handleProfileLoad = useCallback(async (_sessionUser: User, accessToken: string) => {
    try {
      const data = await fetchProfile(accessToken);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;
    setLoading(true);

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user && session?.access_token) {
        void handleProfileLoad(session.user, session.access_token);
      }
      void syncServerSession(session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && session?.access_token) {
        void handleProfileLoad(session.user, session.access_token);
      } else {
        setProfile(null);
      }
      void syncServerSession(session ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [handleProfileLoad, supabase, syncServerSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase client is not available");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    if (data.session?.access_token && data.user) {
      await handleProfileLoad(data.user, data.session.access_token);
      await syncServerSession(data.session);
    }
  }, [handleProfileLoad, supabase, syncServerSession]);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (!supabase) {
        throw new Error("Supabase client is not available");
      }
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to sign up";
        try {
          const data = await response.json();
          errorMessage = data.error ?? errorMessage;
        } catch (_error) {
          // ignore parse errors
        }
        throw new Error(errorMessage);
      }

      await signIn(email, password);
    },
    [signIn, supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error("Supabase client is not available");
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
    setUser(null);
    await syncServerSession(null);
    // Redirect to home page after logout
    window.location.href = "/";
  }, [supabase, syncServerSession]);

  const updateProfile = useCallback(async (name: string, avatarUrl?: string) => {
    if (!supabase) {
      throw new Error("Supabase client is not available");
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token || !session.user) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, avatar_url: avatarUrl }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update profile";
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (_error) {
        // ignore parse errors
      }
      throw new Error(errorMessage);
    }

    await handleProfileLoad(session.user, session.access_token);
  }, [handleProfileLoad, supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      throw new Error("Supabase client is not available");
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user && session.access_token) {
      await handleProfileLoad(session.user, session.access_token);
    }
  }, [handleProfileLoad, supabase]);

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
    }),
    [loading, profile, refreshProfile, signIn, signOut, signUp, updateProfile, user],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
