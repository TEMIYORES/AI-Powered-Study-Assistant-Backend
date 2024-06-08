import mongoose from "mongoose";
const Schema = mongoose.Schema;
const notificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    notifications: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Method to exclude the password
notificationSchema.methods.toJSON = function () {
  const notification = this.toObject();
  delete notification._id;
  delete notification.createdAt;
  delete notification.updatedAt;
  return notification;
};
export default mongoose.model("Notification", notificationSchema);
