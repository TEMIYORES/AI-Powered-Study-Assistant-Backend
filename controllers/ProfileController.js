import Account from "../model/Account.js";
import Profile from "../model/Profile.js";

const saveProfile = async (req, res) => {
  const {
    email,
    name,
    type,
    age,
    educationLevel,
    subjects,
    shortTermGoals,
    longTermGoals,
    preferredStudyTimes,
    studySessionDuration,
    breakFrequency,
    learningStyle,
    availableStudyDays,
    timeAvailability,
  } = req.body;
  console.log("saving...");
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  if (type === "update") {
    try {
      let profile = await Profile.findOne({ email }).exec();
      if (age) profile.age = age;
      if (educationLevel) profile.educationLevel = educationLevel;
      if (subjects) profile.subjects = subjects;
      if (shortTermGoals) profile.shortTermGoals = shortTermGoals;
      if (longTermGoals) profile.longTermGoals = longTermGoals;
      if (preferredStudyTimes)
        profile.preferredStudyTimes = preferredStudyTimes;
      if (studySessionDuration)
        profile.studySessionDuration = studySessionDuration;
      if (breakFrequency) profile.breakFrequency = breakFrequency;
      if (learningStyle) profile.learningStyle = learningStyle;
      if (availableStudyDays) profile.availableStudyDays = availableStudyDays;
      if (timeAvailability) profile.timeAvailability = timeAvailability;
      await profile.save();
      const account = await Account.findOne({ email }).exec();
      account.profileSetup = true;
      account.studyPlanSetup = false;
      await account.save();
      return res
        .status(201)
        .json({ message: `${name} profile saved successfully!` });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  } else {
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
    console.log("subjects", profile.subjects);
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
