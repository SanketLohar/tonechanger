import React, { useRef } from "react";
import { Button, message } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import emailAPI from "../services/emailAPI"; // ✅ import API

const FileUploader = ({ onFileSelect, tone }) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // ✅ Validate file type and size
      const allowedTypes = [".txt", ".doc", ".docx", ".pdf"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        message.error("Please select a text, Word, or PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        message.error("File size must be less than 5MB");
        return;
      }

      // ✅ Protected file upload with JWT
      try {
        const response = await emailAPI.uploadFile(file, tone);

        message.success(`File "${file.name}" uploaded successfully`);

        // Pass extracted text back to parent
        if (onFileSelect) {
          onFileSelect({
            file,
            extractedText: response.data.extractedText,
          });
        }
      } catch (error) {
        console.error("File upload error:", error);

        if (error.response?.status === 401) {
          message.error("Unauthorized! Please log in again.");
        } else {
          message.error("Failed to upload file. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={handleFileClick}
        style={{
          border: "none",
          boxShadow: "none",
          padding: "4px 8px",
          color: "#666",
        }}
        title="Attach file"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx,.pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default FileUploader;
