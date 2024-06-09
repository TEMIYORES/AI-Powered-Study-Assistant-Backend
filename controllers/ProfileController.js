import Account from "../model/Account.js";
import Profile from "../model/Profile.js";

const saveProfile = async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  //   Check for duplicate users in the database
  const duplicate = await Profile.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    const account = await Account.findOne({ email }).exec();
    account.profileSetup = true;
    await account.save();
    return res.status(409).json({ message: "profile already exists!" });
  }

  try {
    const response = await Profile.create({
      ...req.body,
    });
    console.log({ response });
    const account = await Account.findOne({ email }).exec();
    account.profileSetup = true;
    await account.save();
    res.status(201).json({ message: `${name} profile saved successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getSubjects = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const profile = await Profile.findOne({ email }).exec();
    if (!profile) {
      return res.status(400).json({ message: "No profile found." });
    }
    return res.status(200).json(profile.subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getProfile = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const profile = await Profile.findOne({ email }).exec();
    if (!profile) {
      return res.status(400).json({ message: "No profile found." });
    }
    return res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export { saveProfile, getSubjects, getProfile };
