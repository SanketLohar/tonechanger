import React from 'react';
import { Card, Typography, Space, Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChatBubble = ({ message, isUser, timestamp }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        alignItems: 'flex-end',
        gap: '8px',
      }}
    >
      {!isUser && (
        <Avatar 
          size="small" 
          icon={<RobotOutlined />} 
          style={{ backgroundColor: '#52c41a' }}
        />
      )}
      
      <Card
        className={isUser ? 'user-bubble' : 'ai-bubble'}
        style={{
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '70%',
          wordWrap: 'break-word',
        }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text
            style={{
              color: isUser ? 'white' : '#333',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            {message}
          </Text>
          {timestamp && (
            <Text
              style={{
                fontSize: '11px',
                color: isUser ? 'rgba(255,255,255,0.8)' : '#999',
                textAlign: 'right',
                display: 'block',
              }}
            >
              {timestamp}
            </Text>
          )}
        </Space>
      </Card>
      
      {isUser && (
        <Avatar 
          size="small" 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#1890ff' }}
        />
      )}
    </div>
  );
};

export default ChatBubble;