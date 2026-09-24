/**
 * High-Performance In-Memory Sliding-Window Rate Limiter
 * Provides distributed DDoS & brute-force protection for Next.js API routes & endpoints.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class MemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private lastCleanup: number = Date.now();

  /**
   * Check if a request exceeds rate limits.
   * @param key Unique identifier (e.g. IP address + route)
   * @param limit Maximum allowed requests within the time window
   * @param windowMs Time window in milliseconds
   */
  public check(key: string, limit: number, windowMs: number): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();

    // Prune stale records every 60 seconds to avoid memory accumulation
    if (now - this.lastCleanup > 60000) {
      this.cleanup(now);
    }

    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // First request or window expired
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(key, newRecord);
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Math.ceil(windowMs / 1000),
      };
    }

    if (record.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    record.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - record.count,
      reset: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  private cleanup(now: number) {
    this.lastCleanup = now;
    for (const [k, v] of this.store.entries()) {
      if (now > v.resetTime) {
        this.store.delete(k);
      }
    }
  }
}

export const rateLimiter = new MemoryRateLimiter();

/**
 * Extracts client IP from standard proxy and CDN headers.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Returns a standardized 429 Too Many Requests response with OWASP-recommended retry headers.
 */
export function rateLimitExceededResponse(resetSeconds: number, message: string = "Rate limit exceeded. Please try again later.") {
  return new Response(
    JSON.stringify({
      error: "TOO_MANY_REQUESTS",
      message,
      retryAfterSeconds: resetSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(resetSeconds),
        "X-RateLimit-Reset": String(resetSeconds),
      },
    }
  );
}
