// Import necessary modules
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Fallback messages
const FALLBACK_MESSAGES = [
  "Hi! I'm currently busy. Try asking me again in a few seconds.",
  "Sorry, I'm a bit overloaded right now. Can you try again shortly?",
  "Hello! I cannot respond at the moment, but I'm ready soon!"
];

// --- Helper: Call Gemini API with retry for 503 ---
async function callGeminiAPI(message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Gemini API Error (Status: ${response.status}):`, errorData);

        // Retry only on 503
        if (response.status === 503 && i < retries - 1) {
          console.warn(`Gemini overloaded. Retrying ${i + 1}...`);
          await new Promise(res => setTimeout(res, 2000));
          continue;
        }

        // Handle invalid API key
        if (errorData.error?.message?.includes("API key not valid")) {
          throw new Error("Invalid Gemini API key. Check your .env file.");
        }

        throw new Error(errorData.error?.message || "Unknown Gemini API error");
      }

      const data = await response.json();
      console.log("Full Gemini response:", JSON.stringify(data, null, 2));
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    "No coherent response from Gemini.";
      return reply;

    } catch (err) {
      if (i < retries - 1 && err.message.includes("503")) {
        continue; // retry on overload
      }
      throw err; // otherwise propagate error
    }
  }
}

// --- Routes ---
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "Message is required." });
  if (!GEMINI_API_KEY) return res.status(500).json({ reply: "Server configuration error: Gemini API key missing." });

  try {
    const reply = await callGeminiAPI(message, 3);
    res.json({ reply });
  } catch (err) {
    console.error("Error in /api/chat:", err.message);
    const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    res.json({ reply: fallback });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server running on port ${5000}`);
});
