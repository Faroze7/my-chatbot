import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const [botTypingText, setBotTypingText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chatLog, typing, botTypingText]);

  // Send user message to backend
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChatLog(prev => [...prev, userMessage]);
    setMessage("");
    setTyping(true);
    setBotTypingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      await typeBotMessage(data.reply); // Animate bot typing
    } catch (err) {
      console.error(err);
      await typeBotMessage("Cannot connect to server right now.");
    } finally {
      setTyping(false);
    }
  };

  // Animate bot typing with blinking cursor
  const typeBotMessage = async (text) => {
    let displayed = "";
    for (let char of text) {
      displayed += char;
      setBotTypingText(displayed);
      await new Promise(res => setTimeout(res, 25)); // typing speed
    }
    setChatLog(prev => [...prev, { role: "bot", content: text }]);
    setBotTypingText("");
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") sendMessage(); };

  // Voice input using Web Speech API
  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return alert("Voice not supported");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => setMessage(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="flex flex-col max-w-md mx-auto mt-10 p-4 border rounded-3xl shadow-xl bg-white md:max-w-lg lg:max-w-xl h-[90vh]">
      
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/logo.png" alt="Chatbot Logo" className="h-14 w-14 md:h-16 md:w-16" />
      </div>

      {/* Chat window */}
      <div className="flex-1 space-y-3 mb-4 h-full overflow-y-auto border rounded-2xl p-4 bg-gray-50">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-[75%] break-words
                ${msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && botTypingText && (
          <div className="flex justify-start">
            <div className="inline-block px-4 py-2 rounded-2xl bg-gray-200 text-gray-700">
              {botTypingText}
              <span className="typing-cursor">|</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
        <button
          onClick={handleVoiceInput}
          className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition"
        >
          🎤
        </button>
      </div>
    </div>
  );
}
