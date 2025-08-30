import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// ✅ FIX: Import the Ant Design App provider
import { ConfigProvider, App as AntApp } from 'antd';

const theme = {
  token: {
    fontFamily: "'Inter', sans-serif",
    colorPrimary: '#52c41a',
    colorBgContainer: '#fefdf6',
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      {/* ✅ FIX: Wrap your App component with Ant Design's App provider */}
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
