import React, { useState } from "react";
import { Button, Input, Select, Card, message, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { emailAPI } from "../services/api";
import FileUploader from "./FileUploader";

const { TextArea } = Input;

const RewriterForm = () => {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [rewrittenText, setRewrittenText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // This logic remains the same and is correct.
  const isButtonDisabled = loading || (!text.trim() && !selectedFile);

  // Handler to set the file state from the child component
  const handleFileSelect = (file) => {
    if (file) {
      console.log("RewriterForm STATE: Setting selected file to ->", file.name);
      setSelectedFile(file);
      setText(""); // Clear text input to prioritize file
      setRewrittenText("");
    } else {
      console.log("RewriterForm STATE: No file selected, clearing state.");
      setSelectedFile(null);
    }
  };

  // Handler to clear the file state from the child component
  const handleClearFile = () => {
    console.log("RewriterForm STATE: Clearing selected file.");
    setSelectedFile(null);
  };

  const handleRewrite = async () => {
    if (!text.trim() && !selectedFile) {
      message.error("Please enter text or upload a file.");
      return;
    }

    setLoading(true);
    setRewrittenText("");

    try {
      let response;
      let originalContent = text;

      if (selectedFile) {
        response = await emailAPI.uploadFile(selectedFile, tone);
        originalContent = await selectedFile.text(); // Read text content for display
      } else {
        response = await emailAPI.rewriteEmail({ text, tone });
      }

      const cleanedText = response.data.rewrittenText.replace(/\\n|\\\\n/g, "\n");
      
      setText(originalContent);
      setRewrittenText(cleanedText);
      message.success("Text rewritten successfully!");

    } catch (error) {
      console.error("Rewrite error:", error);
      const errMsg = error.response?.data?.message || "Failed to rewrite. Please try again.";
      message.error(errMsg);
    } finally {
      setLoading(false);
      setSelectedFile(null); // Clear the file after submission
    }
  };

  return (
    <Card title="Rewrite Your Email" className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <TextArea
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // If user starts typing, deselect the file to avoid confusion
          if (selectedFile) {
            setSelectedFile(null);
          }
        }}
        placeholder="Paste your email text here, or upload a file below..."
        disabled={loading}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
        <Space>
          <Select value={tone} onChange={setTone} style={{ width: 150 }} disabled={loading}>
            <Select.Option value="formal">Formal</Select.Option>
            <Select.Option value="casual">Casual</Select.Option>
            <Select.Option value="polite">Polite</Select.Option>
            <Select.Option value="professional">Professional</Select.Option>
          </Select>

          {/* Pass state and handlers down to the controlled component */}
          <FileUploader
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
            disabled={loading}
          />
        </Space>

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleRewrite}
          loading={loading}
          disabled={isButtonDisabled}
        >
          Send
        </Button>
      </div>

      {rewrittenText && (
        <Card title="Rewritten Email" className="mt-4 bg-gray-50" bordered={false}>
          <div style={{ whiteSpace: "pre-wrap" }}>{rewrittenText}</div>
        </Card>
      )}
    </Card>
  );
};

export default RewriterForm;