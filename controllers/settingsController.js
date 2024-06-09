import Account from "../model/Account.js";

const updateSettingsAccount = async (req, res) => {
  const { email, fullName, phoneNumber, photoURL } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Account.findOne({ email }).exec();
    if (fullName) account.fullName = fullName;
    if (photoURL) account.photoURL = photoURL;
    if (phoneNumber) account.phoneNumber = phoneNumber;
    await account.save();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating info:", error);
    return res.sendStatus(400);
  }
};
export { updateSettingsAccount };
