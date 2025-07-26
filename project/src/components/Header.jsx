import React from 'react';
import { Layout, Typography, Space, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  const handleLogout = () => {
    // Placeholder logout function
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const userMenuItems = [
    {
      key: '1',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader 
      style={{ 
        backgroundColor: '#fefdf6', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        height: 'auto',
        lineHeight: 'normal',
        paddingTop: '16px',
        paddingBottom: '16px'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#52c41a', fontWeight: 700 }}>
            ReTone
          </Title>
          <Text style={{ fontSize: '14px', color: '#666', display: 'block' }}>
            Rewrite Emails in the Right Tone
          </Text>
          <Text style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            Shift the tone, not the message
          </Text>
        </div>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button 
            type="text" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              height: 'auto',
              padding: '8px 12px'
            }}
          >
            <Avatar size="small" icon={<UserOutlined />} />
            <Text>User</Text>
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;