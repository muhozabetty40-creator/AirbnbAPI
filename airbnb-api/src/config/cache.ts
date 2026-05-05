interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

export const getCache = (key: string): unknown | null => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
};

export const setCache = (key: string, data: unknown, ttlSeconds: number): void => {
  store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
};

export const deleteCache = (...keys: string[]): void => {
  keys.forEach((k) => store.delete(k));
};
