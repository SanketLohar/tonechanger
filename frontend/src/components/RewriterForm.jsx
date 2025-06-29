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
      e.target.value = null; // allow re-select
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
    setIsTyping(true); // Start typing animation

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
      setSelectedFile(null);
      setIsTyping(false); // Stop typing animation
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type;

    if (fileType.startsWith("text/") || fileType === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        const textPreview = reader.result.slice(0, 200); // Limit preview size
        alert("📄 File Preview:\n\n" + textPreview);
      };
      reader.readAsText(selectedFile);
    } else if (fileType === "application/pdf") {
      alert("📎 PDF File Selected: " + selectedFile.name);
    } else {
      alert("📁 File Selected: " + selectedFile.name);
    }
  };

  return (
    <div
      className="container py-4"
      style={{
        background: "#fefdf6",
        height: "90vh",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔰 Modern Header */}
      <div
        className="text-center py-4 bg-success text-white rounded-top d-flex flex-column align-items-center"
        style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
      >
        <div style={{ fontSize: "2.2rem" }}>💡</div>
        <h1
          className="fw-bold"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "2rem",
            marginBottom: "0.3rem",
          }}
        >
          ReTone
        </h1>
        <div
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1.05rem",
            letterSpacing: "0.5px",
            marginBottom: "0.2rem",
          }}
        >
          — Email Tone Rewriter —
        </div>
        <div
          className="fst-italic"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "0.85rem",
            opacity: 0.9,
          }}
        >
          “Shift the tone, not the message.”
        </div>
      </div>

      {/* 💬 Chat Area */}
      <div className="p-3 overflow-auto flex-grow-1" style={{ height: "70vh" }}>
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.type === "user"
                  ? "align-self-end bg-success text-white"
                  : "align-self-start bg-light text-dark"
              } px-3 py-2 rounded-pill`}
              style={{ maxWidth: "75%" }}
            >
              {msg.content}
            </div>
          ))}

          {isTyping && (
            <div
              className="align-self-start bg-light text-dark px-3 py-2 rounded-pill"
              style={{ fontStyle: "italic", opacity: 0.8 }}
            >
              ✍️ Typing...
            </div>
          )}
        </div>
      </div>

      {/* ⌨️ Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="d-flex align-items-center gap-2 px-3 py-2 border-top"
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

        <input
          type="file"
          id="fileUpload"
          hidden
          onChange={(e) => {
            handleFileChange(e);
            renderFilePreview();
          }}
        />
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
