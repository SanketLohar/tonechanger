import React, { useState } from "react";
import axios from "axios";

export default function RewriterForm() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Polite");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   if (!text.trim() && !selectedFile) return;


    // Add user's message to chat
   const newUserMessage = {
  type: "user",
  content:
    (text ? text : "") +
    (selectedFile ? ` (attached: ${selectedFile.name})` : ""),
};

    setMessages((prev) => [...prev, newUserMessage]);
    setText("");

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
      setSelectedFile(null); // Clear file after send
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-success text-white rounded-top">
        <h5 className="m-0">✍️ Email Tone Rewriter</h5>
      </div>

      {/* Chat Area */}
      <div
        className="p-3 overflow-auto flex-grow-1"
        style={{ height: "70vh" }}
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
        </div>
      </div>

      {/* Input Bar */}
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
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileUpload"
          className="btn btn-outline-secondary btn-sm"
        >
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
