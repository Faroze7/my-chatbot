import React from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";
import logo from "./assets/4.png";

function App() {
  return (
    <div className="app-container">
      <div className="header">
        <img src={logo} alt="FAROZE Chatbot Logo" className="logo" />
        <h1>FAROZE CHATBOT</h1>
        <p className="subtitle">Your AI Assistant for Style & Elegance</p>
      </div>

      <Chatbot />
    </div>
  );
}

export default App;

