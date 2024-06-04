import express from "express";

import { saveProfile } from "../../controllers/ProfileController.js";
import { generateStudySession } from "../../controllers/studySessionController.js";

const router = express.Router();
router.route("/").post(saveProfile);
router.route("/generatestudySession").post(generateStudySession);
router.route("/generatestudySession").post(generateStudySession);

export default router;
