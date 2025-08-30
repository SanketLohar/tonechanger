import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        email: values.email,
        password: values.password
      });
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fefdf6 0%, #f6f9f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          border: 'none',
        }}
        // ✅ FIX: The deprecated `bodyStyle` prop has been removed.
        // The `styles` prop you added is correct.
        styles={{ body: { padding: '40px' } }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title level={1} style={{ color: '#52c41a', marginBottom: 8, fontSize: '32px' }}>
              ReTone
            </Title>
            <Text style={{ color: '#666', fontSize: '16px' }}>
              Rewrite Emails in the Right Tone
            </Text>
            <br />
            <Text style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
              Shift the tone, not the message
            </Text>
          </div>
          <Divider />
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            style={{ width: '100%' }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <Space direction="vertical" size="small">
            <Text style={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#52c41a', fontWeight: '600' }}>
                Sign up here
              </Link>
            </Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;
