import rateLimit from "express-rate-limit";

// Limit repeated login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per IP
  message: { message: "Too many login attempts, please try again later." },
});

export { loginLimiter };
