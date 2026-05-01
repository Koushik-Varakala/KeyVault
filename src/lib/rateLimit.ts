// Basic In-Memory Rate Limiter using a Map.
// In a real production distributed system, you would swap this for Redis.

interface RateLimitData {
  count: number;
  resetAt: number; // timestamp in MS
}

const store = new Map<string, RateLimitData>();

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

export async function rateLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  let record = store.get(identifier);

  if (!record || now > record.resetAt) {
    // New window
    record = { count: 0, resetAt: now + WINDOW_SIZE_MS };
  }

  record.count += 1;
  store.set(identifier, record);

  const remaining = Math.max(0, MAX_REQUESTS - record.count);
  const success = record.count <= MAX_REQUESTS;

  // Cleanup old entries randomly to prevent memory leaks in this simple implementation
  if (Math.random() < 0.01) {
    for (const [key, val] of store.entries()) {
      if (now > val.resetAt) store.delete(key);
    }
  }

  return {
    success,
    limit: MAX_REQUESTS,
    remaining,
    reset: record.resetAt,
  };
}
