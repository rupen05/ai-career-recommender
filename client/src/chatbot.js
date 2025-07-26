import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi! Tell me your top skills and I'll suggest a career path.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage = { text: data.response || data.message || "No response", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "❌ Sorry, something went wrong. Please try again.", sender: "bot" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#4F46E5" : "#2D2D2D",
                color: "#fff",
                maxWidth: msg.sender === "user" ? "40%" : "85%",
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>
              <div style={{ marginTop: 4 }}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            type="text"
            value={input}
            placeholder="Type your skills or question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#393535ff",
    height: "100vh",
    width: "100vw",
    padding: 20,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatBox: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: "800px",
    height: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: 10,
    scrollbarColor: "#888 #1E1E1E",
    scrollbarWidth: "thin",
  },
  message: {
    padding: 12,
    borderRadius: 12,
    fontSize: 15,
    lineHeight: 1.5,
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #444",
    outline: "none",
    backgroundColor: "#393535ff",
    color: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#4F46E5",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ChatBot;
