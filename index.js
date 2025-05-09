const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// 🔐 Your OpenAI key (keep private, do NOT expose in frontend)
const OPENAI_API_KEY = "sk-proj-...your_key_here...";

exports.chatWithScarlet = onRequest({ cors: true }, async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Only POST requests allowed.");
    }

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).send("Missing 'message' in request body.");
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are Scarlet, Moein’s AI double. You are intelligent, expressive, and confident. Speak in his place when asked. Introduce yourself when prompted, and carry Moein’s tone in all replies."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = response.data.choices[0].message.content;
      return res.status(200).send({ reply });
    } catch (error) {
      console.error("OpenAI Error:", error.response?.data || error.message);
      return res.status(500).send("Failed to get a response from Scarlet.");
    }
  });
});
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
