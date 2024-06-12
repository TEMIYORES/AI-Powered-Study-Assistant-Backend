import express from "express";

import { updateSettingsAccount } from "../../controllers/settingsController.js";
import fileUpload from "express-fileupload";

const router = express.Router();
router
  .route("/account")
  .post(fileUpload({ createParentPath: true }), updateSettingsAccount);
router.route("/profile").post(updateSettingsAccount);

export default router;
