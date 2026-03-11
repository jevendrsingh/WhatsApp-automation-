import { Router } from "express";
import { login, register, resetPassword } from "../controllers/authController";
import { chat } from "../controllers/chatController";
import { createChatbot, listChatbots } from "../controllers/chatbotController";
import { requireAuth } from "../middleware/auth";
import { getOverview } from "../controllers/dashboardController";

const router = Router();

router.post("/auth/signup", register);
router.post("/auth/login", login);
router.post("/auth/reset-password", resetPassword);

router.get("/dashboard/overview", requireAuth, getOverview);
router.get("/chatbots", requireAuth, listChatbots);
router.post("/chatbots", requireAuth, createChatbot);

router.post("/chat", chat);

export default router;
