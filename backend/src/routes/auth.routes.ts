import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.use(authRateLimiter);
router.post("/register", register);

export default router;
