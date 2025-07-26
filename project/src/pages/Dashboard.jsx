import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, Space, message, Row, Col } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import ToneSelector from '../components/ToneSelector';
import FileUploader from '../components/FileUploader';
import { emailAPI } from '../services/api';

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
  const [selectedTone, setSelectedTone] = useState('polite');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) {
      message.warning('Please enter some text to rewrite');
      return;
    }

    if (!selectedTone) {
      message.warning('Please select a tone');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Real API call to rewrite email
      const response = await emailAPI.rewriteEmail({
        originalText: inputText,
        tone: selectedTone,
        userId: JSON.parse(localStorage.getItem('user') || '{}').id
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.rewrittenText || `Here's your email rewritten in a ${selectedTone} tone:\n\n"${response.data.result}"\n\nWould you like me to try a different tone?`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Email rewrite error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to rewrite email. Please try again.';
      message.error(errorMessage);
      
      // Remove user message if API call failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    // Placeholder file handling
    message.info(`File "${file.name}" will be processed once backend is connected`);
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
      
      {/* Watermark */}
      <div className="watermark">
        Shift the tone, not the message
      </div>

      <Content style={{ padding: '0', display: 'flex', flexDirection: 'column', backgroundColor: '#fefdf6' }}>
        {/* Tone Selector Bar */}
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <ToneSelector 
                value={selectedTone} 
                onChange={setSelectedTone}
              />
            </Col>
          </Row>
        </div>

        {/* Chat Messages Area */}
        <div 
          className="chat-container"
          style={{ 
            flex: 1, 
            padding: '24px', 
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 300px)',
            minHeight: '400px'
          }}
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {loading && (
            <ChatBubble
              message="✍️ Rewriting your email..."
              isUser={false}
              timestamp=""
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          backgroundColor: 'white', 
          borderTop: '1px solid #f0f0f0',
          padding: '16px 24px'
        }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              ref={textAreaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Paste your email here to rewrite it..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ 
                flex: 1,
                borderRadius: '12px 0 0 12px',
                fontSize: '14px',
                resize: 'none'
              }}
              disabled={loading}
            />
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              border: '1px solid #d9d9d9',
              borderLeft: 'none',
              borderRadius: '0 12px 12px 0',
              padding: '8px'
            }}>
              <FileUploader onFileSelect={handleFileSelect} />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                disabled={!inputText.trim()}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: '#52c41a',
                  borderRadius: '8px',
                  height: '36px',
                  width: '36px',
                  minWidth: '36px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
          </Space.Compact>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;