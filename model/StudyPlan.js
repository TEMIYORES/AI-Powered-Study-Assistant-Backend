import mongoose from "mongoose";
const Schema = mongoose.Schema;
const studyPlanSchema = new Schema(
  {
    email: {
      type: String,
    },
    studyPlan: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
studyPlanSchema.methods.toJSON = function () {
  const studyplan = this.toObject();
  delete studyplan._id;
  delete studyplan.createdAt;
  delete studyplan.updatedAt;
  return studyplan;
};
export default mongoose.model("Studyplan", studyPlanSchema);
