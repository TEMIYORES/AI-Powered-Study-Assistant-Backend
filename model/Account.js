import mongoose from "mongoose";
const Schema = mongoose.Schema;
const accountSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Method to exclude the password
accountSchema.methods.toJSON = function () {
  const account = this.toObject();
  delete account.password;
  delete account._id;
  delete account.createdAt;
  delete account.updatedAt;
  return account;
};

export default mongoose.model("Account", accountSchema);
