import Profile from "../model/Profile.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import StudyPlan from "../model/StudyPlan.js";
import Account from "../model/Account.js";
import fetch from "node-fetch";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAFG0VZGbfseglWD3XMSxVLelAq63AS2yk");
// ...

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getStudyPlan = async (req, res) => {
  const { email } = req.params;
  try {
    const foundStudyPlan = await StudyPlan.findOne({ email }).exec();

    if (foundStudyPlan) return res.status(200).json(foundStudyPlan.studyPlan);
  } catch (error) {
    console.error("Error fetching study plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const generateStudyPlan = async (req, res) => {
  const { email } = req.body;
  try {
    const foundStudyPlan = await StudyPlan.findOne({ email }).exec();
    // Generate prompt based on user profile data

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
    console.log({ availableDays });
    const timeAvailability = [];
    Object.entries(profileData.timeAvailability).forEach((key) => {
      if (key[1]?.length) {
        console.log(key);
        timeAvailability.push(`${key[0]}: ${key[1].join("-")}`);
      }
    });
    console.log({ timeAvailability });
    const prompt = `
    Create a personalized study plan for the following user in JSON format:
    Subjects: ${subjects.join(", ")}
    Short-term Goals: ${profileData.shortTermGoals}
    Long-term Goals: ${profileData.longTermGoals}
    Preferred Study Times: ${preferredTimes.join(", ")}
    Maximum Time for each Study Session Duration: ${
      profileData.studySessionDuration
    }
    Study Session Break Frequency: ${profileData.breakFrequency}
    Learning Style: ${profileData.learningStyle}
    Days Available for Study: ${availableDays.join(
      ", "
    )} and Time Available for Each Study Day: ${timeAvailability.join(
      ", "
    )} respectively.
    Generate a detailed study plan for one week, including study sessions, breaks, and study tips. The study plan should be provided in the following JSON format:
    {"studyPlan": {"week": [{"day": "","availableTime": "","sessions": [{"subject": "","startTime": "","endTime": "","breaks": [{"startTime": "","endTime": ""}],"tips": []}]},]}}
    Please stick strictly to constraints provided. Make sure to include study sessions, breaks, and tips for each day based on the provided information. Do not add an explanation for the studyplan just the json
`;
    const result = await model.generateContent(prompt, { fetch });
    const response = await result.response;
    // Extract generated study plan from the response
    const studyPlan = JSON.parse(
      response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
    );
    console.log({ studyPlan: studyPlan.studyPlan });
    // store the studyPlan in db
    if (foundStudyPlan && studyPlan.studyPlan) {
      console.log("saving..study");
      const studyPlanAccount = await StudyPlan.findOne({ email }).exec();
      studyPlanAccount.studyPlan = {};
      studyPlanAccount.studyPlan = { ...studyPlan.studyPlan };
      await studyPlanAccount.save();
      const account = await Account.findOne({ email }).exec();
      account.studyPlanSetup = true;
      await account.save();

      // Respond with the generated study plan
      return res.status(200).json({ studyPlan: studyPlan.studyPlan });
    } else {
      if (studyPlan.studyPlan) {
        await StudyPlan.create({
          email,
          studyPlan: studyPlan.studyPlan,
        });
        const account = await Account.findOne({ email }).exec();
        account.studyPlanSetup = true;
        await account.save();

        // Respond with the generated study plan
        return res.status(200).json(studyPlan.studyPlan);
      }
    }
  } catch (error) {
    console.error("Error generating study plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { generateStudyPlan, getStudyPlan };
