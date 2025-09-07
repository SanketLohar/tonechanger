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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTone, setSelectedTone] = useState('polite');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
    setSelectedFile(null);

    try {
      let response;
      if (selectedFile) {
        response = await emailAPI.uploadFile(selectedFile, selectedTone);
      } else {
        response = await emailAPI.rewriteEmail({ text: inputText, tone: selectedTone });
      }

      // ✅ --- NEW: Robust response parsing logic --- ✅
      let aiText;
      const responseData = response.data;

      if (responseData.rewrittenText) {
        // Handles format: { "rewrittenText": "..." }
        aiText = responseData.rewrittenText;
      } else if (responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        // Handles raw Gemini API format
        aiText = responseData.candidates[0].content.parts[0].text;
      } else if (typeof responseData === 'string') {
        // Handles if the backend sends just a plain string
        aiText = responseData;
      } else {
        // Fallback for any other unexpected format
        aiText = `Sorry, the response was in an unexpected format. Raw data: ${JSON.stringify(responseData)}`;
      }
      
      const cleanedText = aiText.replace(/\\n|\\\\n/g, "\n");
      // ✅ --- End of new logic --- ✅

      const aiResponse = {
        id: Date.now() + 1,
        text: cleanedText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Email rewrite error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to rewrite. Please try again.';
      message.error(errorMessage);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      setInputText('');
    }
  };
  
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
                  setSelectedFile(null);
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
                disabled={isSendDisabled || loading}
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