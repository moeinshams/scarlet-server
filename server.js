const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!OPENAI_API_KEY) {
    console.error("🚨 OPENAI_API_KEY is missing.");
    return res.status(500).send("Server error: Missing OpenAI API key.");
  }

  if (!userMessage) {
    console.error("⚠️ No user message provided.");
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
            content: "You are Scarlet, Moein’s AI double. Speak on his behalf with intelligence and style."
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

    console.log("✅ OpenAI API response:", JSON.stringify(response.data, null, 2));

    res.send({ reply: response.data.choices[0].message.content });
  } catch (err) {
    const errorData = err.response?.data || err.message;
    console.error("❌ OpenAI API Error:", errorData);
    res.status(500).send("Error connecting to OpenAI");
  }
});

app.listen(PORT, () => console.log(`🚀 Scarlet server running on port ${PORT}`));
