import mongoose from "mongoose";
const Schema = mongoose.Schema;
const studySessionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to exclude the password
studySessionSchema.methods.toJSON = function () {
  const studySession = this.toObject();
  delete studySession._id;
  delete studySession.createdAt;
  delete studySession.updatedAt;
  return studySession;
};

export default mongoose.model("studySession", studySessionSchema);
