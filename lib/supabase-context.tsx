import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";

export type SupabaseContextType = {
  supabase: typeof supabase;
  session: Session | null;
  isAuthenticated: boolean;
  user: User | null;
  signout: () => Promise<void>;
};

export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined,
);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session !== null) {
      setAuthenticated(true);
    }
  }, [session, authenticated]);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        isAuthenticated: authenticated,
        session,
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
    throw new Error("useSupabase must be used inside SupabaseContextProvider");
  }
  return context;
}
