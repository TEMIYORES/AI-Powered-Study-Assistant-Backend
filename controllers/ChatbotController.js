import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../model/Chat.js";
import Profile from "../model/Profile.js";
import axios from "axios";
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
  let { email, message } = req.body;
  if (!message.includes("?")) message = message + "?";
  if (!email || !message) {
    return res.sendStatus(400);
  }
  try {
    const user = await Profile.findOne({ email }).exec();
    const prompt = `Provide a concise, well-explained, and easy-to-understand answer to the following question from a ${user.age}-year-old: ${message}. After your response, if a video was requested or if you think a video is needed for further explanation, write 'video-required=true'. If no video is needed, write 'video-required=false'. The user prefers to learn by ${user.learningStyle}. Do not reveal that you were asked a question indirectly. For example, if you receive a compliment instead of a question, respond kindly to the compliment and encourage them to ask educational questions.`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Extract generated chat from the response
    let chatResponse = response.text();
    let videoResult = [];
    if (chatResponse.includes("video-required=true")) {
      await axios
        .get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            q: message,
            key: process.env.GOOGLE_API_KEY,
            type: "video",
            part: "snippet",
            maxResults: "5",
            videoSyndicated: "true",
            videoEmbeddable: "true",
          },
        })
        .then((response) => {
          videoResult = response.data.items.map((item) => ({
            id: item.id.videoId,
            date: item.snippet.publishedAt,
            title: item.snippet.title,
            url: "https://youtu.be/" + item.id.videoId,
            thumbnail: item.snippet.thumbnails.high.url,
          }));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //  Substrings to remove
    const substrings_to_remove = [
      "\n**video-required=true** \n",
      "\n**video-required=false** \n",
      "\nvideo-required=true \n",
      "\nvideo-required=false \n",
    ];
    for (let substring of substrings_to_remove) {
      chatResponse = chatResponse.replaceAll(substring, "");
    }

    // store the chat in db
    const previousChats = await Chat.findOne({ email }).exec();
    if (previousChats) {
      previousChats.chats = [
        ...previousChats.chats,
        ["outgoing", { message, videos: [] }],
        ["incoming", { message: chatResponse, videos: videoResult }],
      ];
      await previousChats.save();
    } else {
      await Chat.create({
        email,
        chats: [
          [
            "incoming",
            {
              message: `Hi there 👋🏽,
        How can I help you today?`,
              videos: [],
            },
          ],
          ["outgoing", { message, videos: [] }],
          ["incoming", { message: chatResponse, videos: videoResult }],
        ],
      });
    }
    // Respond with the generated response
    res.status(200).json({ message: chatResponse, videos: videoResult });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getChats, chatbotResponse };
