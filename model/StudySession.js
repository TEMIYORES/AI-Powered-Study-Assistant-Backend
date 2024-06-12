import mongoose from "mongoose";
const Schema = mongoose.Schema;
const studySessionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    sessions: {
      type: Array,
    },
    missedSessions: {
      type: Array,
    },
    date: {
      type: Date,
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
  return studySession;
};

export default mongoose.model("studySession", studySessionSchema);
