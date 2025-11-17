import React from "react";
import Chatbot from "./components/Chatbot.jsx";
import "./App.css";
import logo from "./assets/faroze-logo.png";

function App() {
  return (
    <div className="app-wrapper">
      <div className="header">
        <img src={logo} alt="FAROZE Chatbot Logo" className="logo" />
        <h1 className="title">FAROZE CHATBOT</h1>
        <p className="subtitle">Your AI Assistant for Style & Elegance</p>
      </div>

      <Chatbot />
    </div>
  );
}

export default App;
