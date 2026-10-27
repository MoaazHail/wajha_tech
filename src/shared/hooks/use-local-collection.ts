"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * A list kept in localStorage until a backend exists. The first render always
 * uses `seed` so server and client markup match; stored data swaps in after mount.
 */
export function useLocalCollection<T extends { id: string }>(
  storageKey: string,
  seed: ReadonlyArray<T>,
  idPrefix: string,
) {
  const [items, setItems] = useState<ReadonlyArray<T>>(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw) as T[]);
    } catch {
      // Unreadable storage: keep the seed data.
    }
    setLoaded(true);
  }, [storageKey]);

  // Don't write before the stored copy has been read, or the seed would overwrite it.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Storage full or blocked: changes last for this session only.
    }
  }, [items, loaded, storageKey]);

  const add = useCallback(
    (data: Omit<T, "id">) => {
      setItems((current) => [{ ...data, id: `${idPrefix}-${Date.now()}` } as T, ...current]);
    },
    [idPrefix],
  );

  const update = useCallback((id: string, data: Omit<T, "id">) => {
    setItems((current) => current.map((item) => (item.id === id ? ({ ...data, id } as T) : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return { items, add, update, remove };
}
