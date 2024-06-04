import express from "express";

import {
  getSubjects,
  saveProfile,
} from "../../controllers/ProfileController.js";
import { generateStudyPlan } from "../../controllers/studyPlanController.js";

const router = express.Router();
router.route("/").post(saveProfile);
router.route("/generatestudyplan").post(generateStudyPlan);
router.route("/subjects/:email").get(getSubjects);

export default router;
