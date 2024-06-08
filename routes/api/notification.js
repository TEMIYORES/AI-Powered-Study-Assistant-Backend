import express from "express";
import {
  cancelNotification,
  deleteNotifications,
  getNotifications,
} from "../../controllers/NotificationController.js";

const router = express.Router();
router.route("/:email").get(getNotifications);
router.route("/delete").delete(deleteNotifications);
// router.route("/schedule").post(scheduleNotification);
router.route("/cancel").post(cancelNotification);

export default router;
