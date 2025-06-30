import React, { useState } from "react";
import axios from "axios";

export default function RewriterForm() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Polite");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      e.target.value = null; // Allow same file reselect
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    const newUserMessage = {
      type: "user",
      content:
        (text ? text : "") +
        (selectedFile ? ` (attached: ${selectedFile.name})` : ""),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setText("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:8080/api/rewrite", {
        text,
        tone,
      });

      const newAIMessage = { type: "ai", content: res.data.rewritten };
      setMessages((prev) => [...prev, newAIMessage]);
    } catch (error) {
      const fallbackMsg = { type: "ai", content: "⚠️ Failed to get response." };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setSelectedFile(null);
    }
  };

  return (
    <div
      className="container py-4 position-relative"
      style={{
        background: "#fefdf6",
        height: "90vh",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Roboto', sans-serif",
        overflow: "hidden", // important
      }}
    >
      {/* ✅ Fixed Watermark (doesn't scroll) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "6rem",
          fontWeight: 900,
          fontFamily: "'Montserrat', sans-serif",
          color: "rgba(0,0,0,0.05)",
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        ReTone
      </div>

      {/* Header */}
      <div
        className="text-center py-3 px-2"
        style={{
          background: "linear-gradient(135deg, #198754 0%, #28a745 100%)",
          color: "#fff",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          zIndex: 1,
        }}
      >
        <h3
          className="mb-0"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "1.75rem",
          }}
        >
          ✨ ReTone
        </h3>
        <small>Email Tone Rewriter</small><br />
        <small className="fst-italic" style={{ fontSize: '0.8rem' }}>Shift the tone, not the message.</small>
      </div>

      {/* ✅ Scrollable Chat Area */}
      <div
        className="p-3 overflow-auto flex-grow-1"
        style={{ height: "70vh", zIndex: 1 }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.type === "user"
                  ? "align-self-end bg-success text-white"
                  : "align-self-start bg-light text-dark"
              } px-3 py-2 rounded-pill`}
            >
              {msg.content}
            </div>
          ))}

          {/* Loading dots */}
          {isTyping && (
            <div className="align-self-start bg-light text-dark px-3 py-2 rounded-pill">
              <span className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="d-flex align-items-center gap-2 px-3 py-2 border-top"
        style={{ zIndex: 1 }}
      >
        <select
          className="form-select form-select-sm w-auto"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Polite</option>
          <option>Formal</option>
          <option>Friendly</option>
          <option>Assertive</option>
          <option>Apologetic</option>
        </select>

        <input type="file" id="fileUpload" hidden onChange={handleFileChange} />
        <label htmlFor="fileUpload" className="btn btn-outline-secondary btn-sm">
          📎
        </label>

        {selectedFile && (
          <small className="text-muted">{selectedFile.name}</small>
        )}

        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit" className="btn btn-success rounded-pill px-3">
          ➤
        </button>
      </form>
    </div>
  );
}
