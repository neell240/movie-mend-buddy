export function safeJsonParse<T>(
  raw: string | null,
  fallback: T,
  opts?: { storageKey?: string; clearOnError?: boolean }
): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    if (opts?.storageKey && opts.clearOnError !== false) {
      try {
        localStorage.removeItem(opts.storageKey);
      } catch {
        // ignore
      }
    }
    return fallback;
  }
}
