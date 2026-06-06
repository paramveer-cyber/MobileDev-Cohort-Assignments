import { useCallback, useEffect, useState } from "react";
import { loadAllSessions, deleteSession } from "@/db/sessions";
import type { DriveSession } from "@/utils/driveTypes";

export function useDriveHistory() {
  const [sessions, setSessions] = useState<DriveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadAllSessions();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeSession = useCallback(
    async (sessionId: string) => {
      await deleteSession(sessionId);
      await refresh();
    },
    [refresh]
  );

  return { sessions, loading, error, refresh, removeSession };
}
