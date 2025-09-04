import React, { useState, useRef } from "react";
import { Button, message, Space, Spin, Typography } from "antd";
import { PaperClipOutlined, CloseCircleOutlined } from "@ant-design/icons";
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
      fileInputRef.current.value = ""; // This is crucial to allow re-selecting the same file
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic file validation
    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setSelectedFile(file); // Show the file name in the UI immediately

    try {
      // Read the content of the file on the client-side
      const originalText = await file.text();
      // Send the file to the backend for processing
      const response = await emailAPI.uploadFile(file, tone);

      message.success(`File "${file.name}" processed successfully`);

      // Communicate back to the parent component (RewriterForm)
      if (onFileUpload) {
        onFileUpload({
          originalText,
          rewrittenText: response.data.rewrittenText,
          file,
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      message.error("Failed to process file. Please try again.");
      handleClearFile(); // Reset the UI if an error occurs
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Conditionally render the UI based on whether a file is selected */}
      {selectedFile ? (
        <Space>
          <PaperClipOutlined />
          <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: selectedFile.name }}>
            {selectedFile.name}
          </Text>
          <Butt
            type="text"
            icon={loading ? <Spin size="small" /> : <CloseCircleOutlined />}
            onClick={handleClearFile}
            disabled={loading}
            danger
          />
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

