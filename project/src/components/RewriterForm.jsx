import React, { useState } from "react";
import { Button, Input, Select, Card, message, Space } from "antd";
import emailAPI from "../api/emailAPI";
import FileUploader from "./FileUploader"; // Import the FileUploader

const { TextArea } = Input;

const RewriterForm = () => {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [rewrittenText, setRewrittenText] = useState("");

  const handleRewrite = async () => {
    if (!text.trim()) {
      message.error("Please enter some text to rewrite.");
      return;
    }

    setLoading(true);
    try {
      const res = await emailAPI.rewriteEmail(text, tone);
      // The API now returns a JSON object, so we access `rewrittenText`
      setRewrittenText(res.data.rewrittenText || "No response from server");
      message.success("Text rewritten successfully!");
    } catch (error) {
      console.error("Rewrite error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error("Authentication failed. Please log in again.");
      } else {
        message.error("Failed to rewrite email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // This function will be called by the FileUploader when a file is processed
  const handleFileUploaded = ({ originalText, rewrittenText }) => {
    setText(originalText); // Update the text area with the file's content
    setRewrittenText(rewrittenText); // Display the rewritten text from the file
  };

  return (
    <Card title="Rewrite Your Email" className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <TextArea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your email text here, or upload a file below..."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
        {/* We use Ant Design's Space component for better alignment */}
        <Space>
          <Select value={tone} onChange={setTone} style={{ width: 150 }}>
            <Select.Option value="formal">Formal</Select.Option>
            <Select.Option value="casual">Casual</Select.Option>
            <Select.Option value="polite">Polite</Select.Option>
            <Select.Option value="professional">Professional</Select.Option>
          </Select>
          {/* This is where the FileUploader component is now being rendered.
            We pass it the current `tone` and the `handleFileUploaded` function
            so it can communicate back to this form.
          */}
          <FileUploader tone={tone} onFileUpload={handleFileUploaded} />
        </Space>

        <Button type="primary" onClick={handleRewrite} loading={loading}>
          Rewrite Text
        </Button>
      </div>

      {rewrittenText && (
        <Card title="Rewritten Email" className="mt-4 bg-gray-50" bordered={false}>
          <p style={{ whiteSpace: "pre-wrap" }}>{rewrittenText}</p>
        </Card>
      )}
    </Card>
  );
};

export default RewriterForm;

