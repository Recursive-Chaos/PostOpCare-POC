import { Router } from "express";
import rateLimit from "express-rate-limit";
import doctorAuthRouter from "./doctorAuth.js";
import patientAuthRouter from "./patientAuth.js";
import meRouter from "./me.js";

const router = Router();

// 10 incercari pe 5 min per IP pentru login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "prea multe cereri, incearca mai tarziu" },
});

// 5 request-uri OTP per 5 min per IP
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "prea multe request-uri, incearca mai tarziu" },
});

router.use("/doctor", loginLimiter, doctorAuthRouter);
router.use("/patient", otpLimiter, patientAuthRouter);
router.use("/me", meRouter);

export default router;
