import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, Feroze! Suggest a sophisticated outfit for a gala." },
    { sender: "user", text: "Ask about fashion, beauty & lifestyle..." }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
  if (!input.trim()) return;

  // Add user message to chat
  const newMessages = [...messages, { sender: "user", text: input }];
  setMessages(newMessages);

  const userMessage = input;
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    // Add the bot's reply
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: data.reply || "No reply received." },
    ]);

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Error connecting to chatbot API." },
    ]);
  }
};


  return (
    <div className="chat-container">

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-bar">
        <input
          type="text"
          placeholder="Ask about fashion, beauty & lifestyle..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="send-btn" onClick={sendMessage}>
          ✈️
        </button>
      </div>
    </div>
  );
}
