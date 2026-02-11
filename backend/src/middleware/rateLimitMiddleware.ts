import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

/**
 * Rate limiting middleware
 * Limits the number of requests from a single IP/user within a time window
 */
export const rateLimit = (options: RateLimitOptions) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // 100 requests default
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = (req: Request) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip || 'unknown';
    },
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up expired entries
    Object.keys(store).forEach((k) => {
      if (store[k].resetAt < now) {
        delete store[k];
      }
    });

    // Get or create rate limit entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetAt: now + windowMs,
      };
    }

    const entry = store[key];

    // Reset if window has passed
    if (entry.resetAt < now) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    // Increment count
    entry.count++;

    // Set headers
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetAt).toISOString());

    // Check if limit exceeded
    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
    }

    // Skip counting successful requests if option is enabled
    if (skipSuccessfulRequests) {
      const originalJson = res.json.bind(res);
      res.json = function (body: any) {
        if (res.statusCode < 400) {
          entry.count--;
        }
        return originalJson(body);
      };
    }

    next();
  };
};

/**
 * Strict rate limiting for sensitive endpoints (login, password reset, etc.)
 */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: 'Too many attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
});

/**
 * Standard rate limiting for API endpoints
 */
export const standardRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
});

/**
 * Lenient rate limiting for read-only endpoints
 */
export const lenientRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
});
