import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WebSocketProvider } from './contexts/WebSocketContext';

// WebSocket endpoint for Spring Boot backend
// For development: 'ws://localhost:8080/ws' (adjust port if needed)
// For production: 'wss://your-spring-boot-server.com/ws'
const WEBSOCKET_URL = 'ws://localhost:8080/ws';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider url={WEBSOCKET_URL}>
      <App />
    </WebSocketProvider>
  </StrictMode>
);