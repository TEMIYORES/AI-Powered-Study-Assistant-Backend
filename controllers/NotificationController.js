import nodeCron from "node-cron";
import nodemailer from "nodemailer";
import Notification from "../model/Notification.js";
import Account from "../model/Account.js";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

const getNotifications = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.sendStat(400).json({ message: "Email is required" });
  }
  const notification = await Notification.findOne({ email }).exec();
  if (!notification) {
    return res.sendStatus(204);
  }
  return res.status(200).json(notification.notifications);
};

const scheduleNotification = async (req, res) => {
  const { email } = req.body;
  try {
    nodeCron.schedule("30 19 5 * * *", () => {
      // Do whatever you want in here. Send email, Make  database backup or download data.
      sendNotification(email, "Time to study Mathematics");
    });
    return res
      .status(200)
      .json({ message: "Notification scheduled successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNotifications = async (req, res) => {
  const { email } = req.body;
  const notification = await Notification.findOne({ email }).exec();
  if (!notification) {
    return res.sendStatus(204);
  }
  notification.notifications = [];
  await notification.save();
  return res
    .status(200)
    .json({ message: "Notification deleted successfully!" });
};

const cancelNotification = async (req, res) => {
  const { email } = req.body;
  // const studynotification = schedule.scheduledJobs[email];
  // if (studynotification) {
  //   studynotification.cancel();
  //   return res.status(200).send({ message: "Study notification cancelled" });
  // } else {
  //   return res.status(404).send({ message: "Study notification not found" });
  // }
};

const sendNotification = async (email, message) => {
  const accountUser = await Account.findOne({ email }).exec();

  // Fetch user details and send notification
  const recipientEmail = email;
  const subject = `${accountUser.fullName.split(" ")[0]} Time to study!`;
  const templateData = {
    name: accountUser.fullName,
    appLink: "",
    unsubscribeLink: "",
  };
  sendMail(recipientEmail, subject, templateData);
  // Example for in-app notification:
  addNotification(email, message);
};

const sendMail = async (to, subject, templateData) => {
  const templatePath = path.join(__dirname, "..", "views", "emailbody.ejs");
  // Read the EJS template file
  ejs.renderFile(templatePath, templateData, async (err, data) => {
    if (err) {
      console.log("Error rendering EJS template:", err);
      return;
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.USER_EMAIL, //send gmail address
        pass: process.env.USER_PWD, //app password from email account
      },
    });
    // Set up mail options
    const mailOptions = {
      from: {
        name: "AI-Powered Study Assistant",
        address: process.env.USER_EMAIL,
      },
      to: to,
      subject: subject,
      html: data,
    };

    // Send the email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
};

const addNotification = async (email, message) => {
  const previousNotifications = await Notification.findOne({ email }).exec();
  if (previousNotifications) {
    previousNotifications.notifications = [
      ...previousNotifications.notifications,
      message,
    ];
    await previousNotifications.save();
  } else {
    await Notification.create({
      email,
      notifications: [message],
    });
  }
};
export {
  scheduleNotification,
  cancelNotification,
  getNotifications,
  deleteNotifications,
};
