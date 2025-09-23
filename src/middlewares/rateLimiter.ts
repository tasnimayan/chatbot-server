import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs?: number, max?: number) => {
  return rateLimit({
    windowMs: windowMs || 1000 * 60,
    max: max || 100,
    message: {
      success: false,
      message: "Too many requests, please try again later",
      error: "Rate limit exceeded",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
