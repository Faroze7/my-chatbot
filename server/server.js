import express from "express";
import cors from "cors";
import chatRoute from "./chat.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoute);

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Message required" });

  // For now, just echo the message back
  res.json({ reply: `You said: ${message}` });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));