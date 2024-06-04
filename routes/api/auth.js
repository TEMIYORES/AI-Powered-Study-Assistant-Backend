import express from "express";

import {
  loginAccount,
  registerAccount,
  updateAccount,
} from "../../controllers/authController.js";

const router = express.Router();
router.route("/").put(updateAccount);
router.route("/register").post(registerAccount);
router.route("/login").post(loginAccount);

export default router;
