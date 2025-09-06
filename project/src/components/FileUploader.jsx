import React, { useState, useRef } from "react";
import { Button, message, Space, Spin, Typography } from "antd";
import { PaperClipOutlined, CloseCircleOutlined, SendOutlined } from "@ant-design/icons";
import emailAPI from "../services/emailAPI";

const { Text } = Typography;

const FileUploader = ({ onFileUpload, tone }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // allow re-selecting same file
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    message.success(`File "${file.name}" selected. Now click Send to process.`);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("Please select a file first!");
      return;
    }

    setLoading(true);
    try {
      const originalText = await selectedFile.text();
      const response = await emailAPI.uploadFile(selectedFile, tone);

      message.success(`File "${selectedFile.name}" processed successfully`);

      if (onFileUpload) {
        onFileUpload({
          originalText,
          rewrittenText: response.data.rewrittenText,
          file: selectedFile,
        });
      }

      // ✅ Do NOT clear file after upload anymore
      // handleClearFile();
    } catch (error) {
      console.error("File upload error:", error);
      message.error("Failed to process file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {selectedFile ? (
        <Space>
          <PaperClipOutlined />
          <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: selectedFile.name }}>
            {selectedFile.name}
          </Text>
          <Button
            type="text"
            icon={loading ? <Spin size="small" /> : <CloseCircleOutlined />}
            onClick={handleClearFile}
            disabled={loading}
            danger
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleUpload}
            loading={loading}
            disabled={!selectedFile}
          >
            Send
          </Button>
        </Space>
      ) : (
        <Button
          icon={<PaperClipOutlined />}
          onClick={handleFileClick}
          loading={loading}
        >
          Attach File
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx,.pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={loading}
      />
    </>
  );
};

export default FileUploader;
