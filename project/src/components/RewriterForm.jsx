import React, { useState } from "react";
import { Button, Input, Select, Card, message, Space } from "antd";
import emailAPI from "../services/emailAPI";
import FileUploader from "./FileUploader";

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
      // Replace all literal \n (escaped or double-escaped) with real line breaks
      const cleanedText = res.data.rewrittenText.replace(/\\n|\\\\n/g, "\n");
      setRewrittenText(cleanedText);
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

  const handleFileUploaded = ({ originalText, rewrittenText }) => {
    setText(originalText);
    // Replace all literal \n (escaped or double-escaped) with real line breaks
    const cleanedText = rewrittenText.replace(/\\n|\\\\n/g, "\n");
    setRewrittenText(cleanedText);
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
        <Space>
          <Select value={tone} onChange={setTone} style={{ width: 150 }}>
            <Select.Option value="formal">Formal</Select.Option>
            <Select.Option value="casual">Casual</Select.Option>
            <Select.Option value="polite">Polite</Select.Option>
            <Select.Option value="professional">Professional</Select.Option>
          </Select>
          <FileUploader tone={tone} onFileUpload={handleFileUploaded} />
        </Space>

        <Button type="primary" onClick={handleRewrite} loading={loading}>
          Rewrite Text
        </Button>
      </div>

      {rewrittenText && (
        <Card title="Rewritten Email" className="mt-4 bg-gray-50" bordered={false}>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {rewrittenText}
          </div>
        </Card>
      )}
    </Card>
  );
};

export default RewriterForm;
