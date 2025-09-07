import React, { useRef } from "react";
import { Button, message, Space, Typography } from "antd";
import { PaperClipOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const FileUploader = ({ selectedFile, onFileSelect, onClearFile, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target?.files?.[0];

    // Reset the input value so selecting the same file again still triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    if (!file) {
      onFileSelect(null); // Notify parent that selection was cancelled
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }

    message.success(`File "${file.name}" selected.`);
    onFileSelect(file); // Pass the newly selected file up to the parent
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
            icon={<CloseCircleOutlined />}
            onClick={onClearFile} // Use the clear function from the parent
            disabled={disabled}
            danger
          />
        </Space>
      ) : (
        <Button
          icon={<PaperClipOutlined />}
          onClick={handleFileClick}
          disabled={disabled}
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
        disabled={disabled}
      />
    </>
  );
};

export default FileUploader;