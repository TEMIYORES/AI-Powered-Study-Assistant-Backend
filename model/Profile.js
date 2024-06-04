import mongoose from "mongoose";
const Schema = mongoose.Schema;
const profileSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    educationLevel: {
      type: String,
    },
    subjects: {
      type: Array,
    },
    shortTermGoals: {
      type: String,
    },
    longTermGoals: {
      type: String,
    },
    preferredStudyTimes: {
      type: Array,
    },
    studySessionDuration: {
      type: String,
    },
    breakFrequency: {
      type: String,
    },
    learningStyle: {
      type: String,
    },
    availableStudyDays: {
      type: Array,
    },
    timeAvailability: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Method to exclude the password
profileSchema.methods.toJSON = function () {
  const profile = this.toObject();
  delete profile._id;
  delete profile.createdAt;
  delete profile.updatedAt;
  return profile;
};

export default mongoose.model("Profile", profileSchema);
