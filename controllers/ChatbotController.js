import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../model/Chat.js";
import Account from "../model/Account.js";
import Profile from "../model/Profile.js";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAFG0VZGbfseglWD3XMSxVLelAq63AS2yk");
// ...

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getChats = async (req, res) => {
  const { email } = req.params;
  console.log({ email });
  try {
    const chat = await Chat.findOne({ email }).exec();
    // Generate prompt based on user profile data
    if (chat) return res.status(200).json(chat.chats);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error generating study plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const chatbotResponse = async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.sendStatus(400);
  }
  try {
    const user = await Profile.findOne({ email }).exec();
    const prompt = `
Generate a concise, well-explained and easy to understand answer to the following question by a ${user.age}years old: ${message}.
note: do not reveal you are being asked a question indirectly. for example, if you receive a compliment instead of a question, probably you have responded to a question and the user was satisfied. so do respond kindly to the compliment also try to refer them to ask you educational questions.
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Extract generated chat from the response
    const chatResponse = response.text();
    // store the chat in db
    const previousChats = await Chat.findOne({ email }).exec();
    if (previousChats) {
      previousChats.chats = [
        ...previousChats.chats,
        ["outgoing", message],
        ["incoming", chatResponse],
      ];
      await previousChats.save();
    } else {
      await Chat.create({
        email,
        chats: [
          [
            "incoming",
            `Hi there 👋🏽,
        How can I help you today?`,
          ],
          ["outgoing", message],
          ["incoming", chatResponse],
        ],
      });
    }
    // Respond with the generated response
    res.status(200).json(chatResponse);
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getChats, chatbotResponse };
