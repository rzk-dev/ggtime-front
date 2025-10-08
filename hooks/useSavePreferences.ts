import { Preferences } from "@/domain/user/preferences";
import { useEffect, useState } from "react";
import axios from "axios";

export function useSavePreferences(id: number) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const host = process.env.EXPO_PUBLIC_HOST;
        const response = await axios.post(`http://${host}/api/user`, { });
        setPreferences(response.data as Preferences);
      } catch (err) {
        console.error(err);
        setError("Error sending data");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [ ]);

  return { preferences, loading, error };
}