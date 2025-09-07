import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, Space, message, Row, Col } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import ToneSelector from '../components/ToneSelector';
import FileUploader from '../components/FileUploader';
import { emailAPI } from '../services/api'; // Make sure this path is correct

const { Content } = Layout;
const { TextArea } = Input;

const Dashboard = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm ReTone, your email tone rewriter. Send me an email and choose a tone - I'll help you rewrite it perfectly!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for the uploaded file
  const [selectedTone, setSelectedTone] = useState('polite');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // The Send button is disabled only if there's no text AND no file
  const isSendDisabled = !inputText.trim() && !selectedFile;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (isSendDisabled) {
      message.warning('Please enter text or attach a file.');
      return;
    }

    setLoading(true);
    let userMessageText = inputText;

    // If a file is selected, read its content to display in the chat
    if (selectedFile) {
      try {
        userMessageText = await selectedFile.text();
      } catch (e) {
        message.error("Could not read the file content.");
        setLoading(false);
        return;
      }
    }

    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedFile(null); // Clear the file after preparing it for send

    try {
      let response;
      // Call the appropriate API based on whether a file or text is being sent
      if (selectedFile) {
        response = await emailAPI.uploadFile(selectedFile, selectedTone);
      } else {
        response = await emailAPI.rewriteEmail({ text: inputText, tone: selectedTone });
      }

      // Safely extract rewritten text from the API response
      const aiText = response.data.rewrittenText.replace(/\\n|\\\\n/g, "\n") 
        || "Sorry, I couldn't process that.";

      const aiResponse = {
        id: Date.now() + 1,
        text: aiText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Email rewrite error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to rewrite. Please try again.';
      message.error(errorMessage);
      setMessages(prev => prev.slice(0, -1)); // Rollback user message on failure
    } finally {
      setLoading(false);
    }
  };

  // When a file is selected, update the state and clear the text input
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      setInputText(''); // Prioritize file over text
    }
  };
  
  // When a file is cleared, update the state
  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fefdf6' }}>
      <Header />
      <div className="watermark">Shift the tone, not the message</div>
      <Content style={{ padding: '0', display: 'flex', flexDirection: 'column', backgroundColor: '#fefdf6' }}>
        {/* Tone Selector */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <ToneSelector value={selectedTone} onChange={setSelectedTone} />
            </Col>
          </Row>
        </div>

        {/* Messages */}
        <div className="chat-container" style={{ flex: 1, padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.timestamp} />
          ))}
          {loading && (
            <ChatBubble message="✍️ Rewriting your email..." isUser={false} timestamp="" />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ backgroundColor: 'white', borderTop: '1px solid #f0f0f0', padding: '16px 24px' }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (selectedFile) {
                  setSelectedFile(null); // If user types, clear the selected file
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Paste your email here, or attach a file..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ flex: 1, borderRadius: '12px 0 0 12px', fontSize: '14px', resize: 'none' }}
              disabled={loading}
            />
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa', border: '1px solid #d9d9d9', borderLeft: 'none', borderRadius: '0 12px 12px 0', padding: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
              <FileUploader
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onClearFile={handleClearFile}
                disabled={loading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                disabled={isSendDisabled || loading} // Ensure button is disabled while loading
                style={{ border: 'none', boxShadow: 'none', backgroundColor: '#52c41a', borderRadius: '8px', height: '36px', width: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}
              />
            </div>
          </Space.Compact>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;