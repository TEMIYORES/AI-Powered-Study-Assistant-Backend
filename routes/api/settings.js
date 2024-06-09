import express from "express";

import { updateSettingsAccount } from "../../controllers/settingsController.js";

const router = express.Router();
router.route("/account").post(updateSettingsAccount);
router.route("/profile").post(updateSettingsAccount);

export default router;
