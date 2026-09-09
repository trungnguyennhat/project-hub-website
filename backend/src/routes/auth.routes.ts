import { Router } from "express";
import { register, login, refresh } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.use(authRateLimiter);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
