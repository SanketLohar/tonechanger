import React from 'react';
import { Layout, Typography, Button, Space, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { MailOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fefdf6' }}>
      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fefdf6 0%, #f6f9f6 100%)',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={1} style={{ 
              color: '#52c41a', 
              fontSize: '48px', 
              fontWeight: 700,
              marginBottom: 0 
            }}>
              ReTone
            </Title>
            
            <Title level={2} style={{ 
              color: '#333', 
              fontSize: '32px',
              fontWeight: 500,
              marginBottom: 0 
            }}>
              Rewrite Emails in the Right Tone
            </Title>
            
            <Text style={{ 
              fontSize: '18px', 
              color: '#666',
              fontStyle: 'italic',
              display: 'block',
              marginBottom: '32px'
            }}>
              Shift the tone, not the message
            </Text>

            <Paragraph style={{ 
              fontSize: '16px', 
              color: '#555',
              maxWidth: '600px',
              margin: '0 auto 40px auto',
              lineHeight: '1.6'
            }}>
              Transform your emails with AI-powered tone adjustment. Whether you need to sound more professional, 
              friendly, or assertive, ReTone helps you communicate with the perfect tone while preserving your message.
            </Paragraph>

            <Space size="large">
              <Link to="/register">
                <Button 
                  type="primary" 
                  size="large"
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              
              <Link to="/login">
                <Button 
                  size="large"
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </Space>
          </Space>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2} style={{ 
              textAlign: 'center', 
              marginBottom: '48px',
              color: '#333'
            }}>
              How ReTone Works
            </Title>
            
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} md={8}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <MailOutlined style={{ 
                    fontSize: '48px', 
                    color: '#52c41a',
                    marginBottom: '16px'
                  }} />
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    Paste Your Email
                  </Title>
                  <Text style={{ color: '#666', lineHeight: '1.6' }}>
                    Simply paste your email content or upload a document. 
                    ReTone will analyze your message and prepare it for tone adjustment.
                  </Text>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <EditOutlined style={{ 
                    fontSize: '48px', 
                    color: '#52c41a',
                    marginBottom: '16px'
                  }} />
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    Choose Your Tone
                  </Title>
                  <Text style={{ color: '#666', lineHeight: '1.6' }}>
                    Select from various tones like Professional, Friendly, Formal, 
                    Assertive, or Apologetic to match your communication needs.
                  </Text>
                </Card>
              </Col>
              
              <Col xs={24} md={8}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <SendOutlined style={{ 
                    fontSize: '48px', 
                    color: '#52c41a',
                    marginBottom: '16px'
                  }} />
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    Get Perfect Results
                  </Title>
                  <Text style={{ color: '#666', lineHeight: '1.6' }}>
                    Receive your rewritten email with the perfect tone while 
                    maintaining your original message and intent.
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2} style={{ 
              color: 'white',
              marginBottom: 0
            }}>
              Ready to Transform Your Emails?
            </Title>
            
            <Text style={{ 
              fontSize: '16px', 
              color: 'rgba(255,255,255,0.9)',
              display: 'block'
            }}>
              Join thousands of professionals who trust ReTone for perfect email communication.
            </Text>

            <Link to="/register">
              <Button 
                size="large"
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#52c41a',
                  border: 'none'
                }}
              >
                Start Free Today
              </Button>
            </Link>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;