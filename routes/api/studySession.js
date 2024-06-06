import express from "express";
import {
  getStudyMins,
  getStudySessions,
  logSession,
} from "../../controllers/studySessionController.js";

const router = express.Router();
router.route("/progress/:email").get(getStudyMins);
router.route("/").post(logSession);
router.route("/:email").get(getStudySessions);

export default router;
