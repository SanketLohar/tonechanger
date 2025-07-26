import React from 'react';
import { Select, Space, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const ToneSelector = ({ value, onChange, style }) => {
  const tones = [
    { value: 'polite', label: 'Polite' },
    { value: 'formal', label: 'Formal' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'assertive', label: 'Assertive' },
    { value: 'apologetic', label: 'Apologetic' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'persuasive', label: 'Persuasive' },
  ];

  return (
    <Space direction="vertical" size="small" style={{ width: '100%', ...style }}>
      <Space align="center">
        <SoundOutlined style={{ color: '#52c41a' }} />
        <Text strong style={{ fontSize: '14px' }}>
          Select Tone:
        </Text>
      </Space>
      <Select
        value={value}
        onChange={onChange}
        placeholder="Choose email tone"
        style={{ width: '100%', minWidth: '200px' }}
        size="large"
      >
        {tones.map((tone) => (
          <Option key={tone.value} value={tone.value}>
            {tone.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default ToneSelector;