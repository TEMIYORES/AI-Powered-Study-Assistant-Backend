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
        { subject, duration, date: new Date() },
      ];
      await previousSessions.save();
    } else {
      await StudySession.create({
        email,
        sessions: [{ subject, duration, date: new Date() }],
      });
    }
    res.status(201).json({ message: "session saved successfully" });
  } catch (error) {
    console.error("Error generating study Session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudySessions = async (req, res) => {
  const { email, timeRange } = req.params;
  if (!email) return res.status(400).json({ message: "email is required" });
  try {
    const studySession = await StudySession.findOne({ email }).exec();
    if (!studySession) {
      return res.sendStatus(204);
    }
    const sessions = filterDatesWithinRange(studySession.sessions, timeRange);

    return res.status(201).json(sessions);
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

    // Extract the valid subjects into a set for quick lookup
    const validSubjects = new Set(
      profile.subjects.map((subject) => subject.value)
    );

    const studySessions = await StudySession.findOne({ email }).exec();
    let sessions = [];
    if (studySessions) sessions = studySessions.sessions;

    const validSessions = sessions.filter((session) =>
      validSubjects.has(session.subject)
    );

    // Create a map of subjects from the validSessions
    const validSessionsSubjects = new Set(
      validSessions.map((session) => session.subject)
    );

    // Add default sessions for subjects that do not have corresponding sessions
    validSubjects.forEach((subject) => {
      if (!validSessionsSubjects.has(subject)) {
        validSessions.push({
          subject: subject,
          duration: 0,
        });
      }
    });
    const missedSessions = studySessions?.missedSessions.length || [].length;
    const groupedSubjects = validSessions.reduce((acc, current) => {
      const { subject, duration } = current;
      if (!acc[subject]) {
        acc[subject] = { subject, duration: 0 };
      }
      acc[subject].duration += duration;
      return acc;
    }, {});
    const { totalMinutes, averageDailyMinutes } =
      calculateTotalMinutesAndAverageDailyMinutes(validSessions);
    return res.status(201).json({
      totalMinutes,
      averageDailyMinutes,
      sessions: Object.values(Object.values(groupedSubjects)),
      loggedSessions: sessions?.length,
      missedSessions,
    });
  } catch (error) {
    console.error("Error retrieving study sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const calculateTotalMinutesAndAverageDailyMinutes = (sessions) => {
  if (sessions.length === 0) return { totalMinutes: 0, averageDailyMinutes: 0 };
  // Parse dates and sort sessions by date
  const dates = sessions.map((session) => new Date(session.date));
  const startDate = dates.reduce(
    (earliest, date) => (date < earliest ? date : earliest),
    dates[0]
  );
  const endDate = dates.reduce(
    (latest, date) => (date > latest ? date : latest),
    dates[0]
  );
  // Calculate the total number of days
  const timeDifference = endDate.getTime() - startDate.getTime();
  const numberOfDays = timeDifference / (1000 * 3600 * 24) + 1;
  // Sum the total study hours
  const totalMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  // Calculate the average daily hours
  return { totalMinutes, averageDailyMinutes: totalMinutes / numberOfDays };
};

function filterDatesWithinRange(data, range) {
  const now = new Date();
  let targetDate;

  switch (range) {
    case "day":
      targetDate = new Date(now);
      targetDate.setDate(now.getDate() - 1);
      break;
    case "week":
      targetDate = new Date(now);
      targetDate.setDate(now.getDate() - 7);
      break;
    case "month":
      targetDate = new Date(now);
      targetDate.setMonth(now.getMonth() - 1);
      break;
    default:
      targetDate = 0;
  }
  return data.filter((item) => new Date(item.date) > targetDate);
}

export { logSession, getStudySessions, getStudyMins };
