import Profile from "../model/Profile.js";
import StudySession from "../model/StudySession.js";


const generateStudySession = async (req, res) => {
  const { email } = req.body;
  try {
    const foundStudySession = await StudySession.findOne({ email }).exec();
    // Generate prompt based on user profile data
    if (foundStudySession) return res.status(200).json(foundStudySession.studySession);

    const profileData = await Profile.findOne({ email }).exec();
    if (!profileData)
      return res.status(400).json({ message: "Profile not filled yet." });
    const subjects = profileData.subjects.map((subject) => subject.value);
    const preferredTimes = profileData.preferredStudyTimes.map(
      (time) => time.value
    );
    const availableDays = profileData.availableStudyDays.map(
      (day) => day.value
    );
    const timeAvailability = Object.entries(profileData.timeAvailability).map(
      (key) => `${key[0]}: ${key[1].join("-")}`
    );
    const prompt = `
Generate a personalized study Session for the following user:
- Subjects: ${subjects.join(", ")}
- short-term Goals: ${profileData.shortTermGoals}
- long-term Goals: ${profileData.longTermGoals}
- Preferred Study Times: ${preferredTimes.join(", ")}
- study session duration: ${profileData.studySessionDuration}
- study session break frequency: ${profileData.breakFrequency}
- Learning Style: ${profileData.learningStyle}
- days available for study: ${availableDays.join(", ")}
- time available for each study day: ${timeAvailability.join(", ")}

Provide a detailed study Session for one week, including study sessions, breaks, and tips.
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Extract generated study Session from the response
    const studySession = response.text();
    // store the studySession in db
    await StudySession.create({
      email,
      studySession,
    });
    // Respond with the generated study Session
    res.status(200).json(studySession);
  } catch (error) {
    console.error("Error generating study Session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { generateStudySession };

// const prompt = `
// Generate a personalized study Session for the following user:
// - Subjects: ${subjects.join(", ")}
// - short-term Goals: ${profileData.shortTermGoals}
// - long-term Goals: ${profileData.longTermGoals}
// - Preferred Study Times: ${preferredTimes.join(", ")}
// - study session duration: ${profileData.studySessionDuration}
// - study session break frequency: ${profileData.breakFrequency}
// - Learning Style: ${profileData.learningStyle}
// - days available for study: ${availableDays.join(", ")}
// - time available for each study day: ${timeAvailability.join(", ")}

// Provide a detailed study Session for one week, including study sessions, breaks, and tips.
// `;
