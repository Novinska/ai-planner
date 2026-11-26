import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiSendPromptRequest } from "../Actions";
import { ChatMessage } from "./ChatMessage";
import "../styles/chatwindow.scss";

const ChatWindow = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { messages, loading, error } = useSelector((state) => state.ai);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    dispatch(aiSendPromptRequest(text));
    setText("");
  };

  return (
    <div className="chatwindow">
      {/* <h1>Good morning, Anastasia</h1> */}
      <div className="chatwindow-body">
        <div className="chat-body-wrapper">
          {messages.map((msg, index) => (
            <ChatMessage key={index} msg={msg} />
          ))}
        </div>
        {loading && (
          <div className="chatwindow-ai-thinking">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}

        {error && <div className="ai-status-error">Помилка: {error}</div>}

        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatwindow-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введіть задачу..."
          disabled={loading}
          className="chatwindow-input"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn submit-btn"
        >
          {loading ? "..." : <span className="icon icon-send" />}
        </button>
        <div className="btn-group"></div>
      </form>
    </div>
  );
};

export default ChatWindow;
