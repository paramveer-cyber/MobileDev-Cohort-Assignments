import { useCallback, useEffect, useState } from "react";
import * as db from "../database/snippets";
import { CreateSnippetInput, Snippet, UpdateSnippetInput } from "../types";

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await db.getAllSnippets();
      setSnippets(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createSnippet = useCallback(async (input: CreateSnippetInput) => {
    const snippet = await db.createSnippet(input);
    setSnippets((prev) => [snippet, ...prev]);
    return snippet;
  }, []);

  const updateSnippet = useCallback(
    async (id: string, input: UpdateSnippetInput) => {
      const updated = await db.updateSnippet(id, input);
      if (updated) {
        setSnippets((prev) => prev.map((s) => (s.id === id ? updated : s)));
      }
      return updated;
    },
    [],
  );

  const deleteSnippet = useCallback(async (id: string) => {
    await db.deleteSnippet(id);
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const newVal = await db.toggleFavorite(id);
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: newVal } : s)),
    );
    return newVal;
  }, []);

  const searchSnippets = useCallback(
    async (query: string): Promise<Snippet[]> => {
      if (!query.trim()) return snippets;
      return db.searchSnippets(query);
    },
    [snippets],
  );

  const getFavorites = useCallback(() => {
    return snippets.filter((s) => s.isFavorite);
  }, [snippets]);

  return {
    snippets,
    loading,
    error,
    reload: load,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    searchSnippets,
    getFavorites,
  };
}

export function useSnippet(id: string) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    db.getSnippetById(id).then((s) => {
      if (!cancelled) {
        setSnippet(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = useCallback(async () => {
    const s = await db.getSnippetById(id);
    setSnippet(s);
  }, [id]);

  return { snippet, loading, refresh, setSnippet };
}
