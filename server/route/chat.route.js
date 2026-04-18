import { Router } from "express";
import {
  deleteChatSession,
  getChatHistory,
  getChatSessions,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/sessions", getChatSessions);
chatRouter.get("/:sessionId", getChatHistory);
chatRouter.delete("/:sessionId", deleteChatSession);

export default chatRouter;
