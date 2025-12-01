import { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  content?: any;
  sender?: string;
  timestamp?: string;
  [key: string]: any;
}

type WebSocketContextType = {
  sendMessage: (message: WebSocketMessage) => void;
  addMessageListener: (listener: (message: WebSocketMessage) => void) => () => void;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const WebSocketProvider = ({ 
  children, 
  url, 
  onConnect, 
  onDisconnect, 
  onError 
}: WebSocketProviderProps) => {
  const ws = useRef<WebSocket | null>(null);
  const messageListeners = useRef<((message: WebSocketMessage) => void)[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      if (onConnect) onConnect();
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        messageListeners.current.forEach(listener => listener(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      if (onDisconnect) onDisconnect();
      
      // Attempt to reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Max 30s delay
        console.log(`Attempting to reconnect in ${delay}ms...`);
        
        setTimeout(() => {
          reconnectAttempts.current++;
          if (ws.current?.readyState === WebSocket.CLOSED) {
            ws.current = new WebSocket(url);
          }
        }, delay);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Add timestamp if not provided
      const messageToSend = {
        ...message,
        timestamp: message.timestamp || new Date().toISOString()
      };
      ws.current.send(JSON.stringify(messageToSend));
    } else {
      console.error('WebSocket is not connected');
      throw new Error('WebSocket is not connected');
    }
  };

  const addMessageListener = (listener: (message: WebSocketMessage) => void) => {
    messageListeners.current.push(listener);
    return () => {
      messageListeners.current = messageListeners.current.filter(l => l !== listener);
    };
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, addMessageListener, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
