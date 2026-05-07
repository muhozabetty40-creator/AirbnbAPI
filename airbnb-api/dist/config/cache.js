const store = new Map();
export const getCache = (key) => {
    const entry = store.get(key);
    if (!entry)
        return null;
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.data;
};
export const setCache = (key, data, ttlSeconds) => {
    store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
};
export const deleteCache = (...keys) => {
    keys.forEach((k) => store.delete(k));
};
