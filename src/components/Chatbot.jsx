import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, Feroze! Suggest a sophisticated outfit for a gala." },
    { sender: "user", text: "Ask about fashion, beauty & lifestyle..." }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
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
