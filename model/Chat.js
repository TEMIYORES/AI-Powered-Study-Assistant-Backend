import mongoose from "mongoose";
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    chats: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

// Method to exclude the password
chatSchema.methods.toJSON = function () {
  const chat = this.toObject();
  delete chat._id;
  delete chat.createdAt;
  delete chat.updatedAt;
  return chat;
};
export default mongoose.model("Chat", chatSchema);
