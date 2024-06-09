import express from "express";

import {
  getAccount,
  loginAccount,
  registerAccount,
  updateAccount,
} from "../../controllers/authController.js";

const router = express.Router();
router.route("/:email").get(getAccount);
router.route("/").put(updateAccount);
router.route("/register").post(registerAccount);
router.route("/login").post(loginAccount);

export default router;
