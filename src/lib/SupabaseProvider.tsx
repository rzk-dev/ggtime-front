import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";

export type SupabaseContextType = {
  supabase: typeof supabase;
  session: Session | null | undefined;
  isAuthenticated: boolean;
  isReady: boolean;
  user: User | null;
  signout: () => Promise<void>;
};

export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null | undefined>(
    undefined
  );

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      setSession(data.session);
      setIsReady(true)
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsReady(true)
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        session,
        isAuthenticated: !!session,
        isReady: isReady,
        user: session?.user ?? null,
        signout: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
}
