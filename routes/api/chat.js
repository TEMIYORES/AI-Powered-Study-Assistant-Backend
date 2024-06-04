import express from "express";

import { saveProfile } from "../../controllers/ProfileController.js";
import { chatbotResponse, getChats } from "../../controllers/ChatbotController.js";


const router = express.Router();
router.route("/:email").get(getChats);
router.route("/").post(chatbotResponse);

export default router;
