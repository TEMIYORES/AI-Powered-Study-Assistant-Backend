import { response } from "express";
import Profile from "../model/Profile.js";
import StudySession from "../model/StudySession.js";

const logSession = async (req, res) => {
  const { email, subject, duration } = req.body;
  console.log(req.body);
  if (!email || !subject || !duration)
    return res
      .status(400)
      .json({ message: "email, subject and duration are required" });
  try {
    const previousSessions = await StudySession.findOne({ email }).exec();
    if (previousSessions) {
      previousSessions.sessions = [
        ...previousSessions.sessions,
        { subject, duration },
      ];
      previousSessions.save();
    } else {
      await StudySession.create({
        email,
        sessions: [{ subject, duration }],
      });
    }
    res.status(201).json({ message: "session saved successfully" });
  } catch (error) {
    console.error("Error generating study Session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudySessions = async (req, res) => {
  const { email } = req.params;
  console.log(req.body);
  if (!email) return res.status(400).json({ message: "email is required" });
  try {
    const studySession = await StudySession.findOne({ email }).exec();
    return res.status(201).json(studySession);
  } catch (error) {
    console.error("Error retrieving study sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudyMins = async (req, res) => {
  const { email } = req.params;
  console.log(req.params);
  if (!email) return res.status(400).json({ message: "email is required" });
  try {
    const profile = await Profile.findOne({ email }).exec();
    if (!profile) {
      return res.sendStatus(204);
    }
    const validSubjects = profile.subjects;
    const studySession = await StudySession.findOne({ email }).exec();
    // Group subjects and sum durations
    const groupedSubjects = studySession.sessions.reduce((acc, current) => {
      const { subject, duration } = current;
      if (!acc[subject]) {
        acc[subject] = { subject, duration: 0 };
      }
      acc[subject].duration += duration;
      return acc;
    }, {});
    validSubjects.forEach((subject) => {
      const { value } = subject;
      if (!groupedSubjects[value]) {
        groupedSubjects[value] = { subject: value, duration: 0 };
      }
    });
    console.log({ groupedSubjects });
    res.status(201).json(Object.values(groupedSubjects));
  } catch (error) {
    console.error("Error retrieving study sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { logSession, getStudySessions, getStudyMins };
