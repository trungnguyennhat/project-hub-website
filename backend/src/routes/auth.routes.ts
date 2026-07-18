import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.use(authRateLimiter);
router.post("/register", register);
router.post("/login", login);

export default router;
