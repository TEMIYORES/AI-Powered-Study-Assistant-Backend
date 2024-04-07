import express from "express";
import handleLogout from "../../controllers/logoutController.js";
const router = express.Router();

router.route("/").post(handleLogout);

export default router;
