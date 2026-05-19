import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import { getWallet, withdrawFromWallet } from "../../controllers/wallet.controller.js";

const router = Router();

router.get("/", authenticate, getWallet);
router.post("/withdraw", authenticate, strictLimiter, withdrawFromWallet);

export default router;
