import { useCallback, useEffect, useMemo } from 'react';
import { useWebSocket, type WebSocketMessage } from '../contexts/WebSocketContext';

type MessageHandler<T = any> = (data: T, message: WebSocketMessage) => void;

interface UseWebSocketHandlerOptions<T = any> {
  onMessage?: MessageHandler<T>;
  onError?: (error: Error) => void;
  autoReconnect?: boolean;
}

export const useWebSocketHandler = <T = any>(
  messageType: string, 
  options: UseWebSocketHandlerOptions<T> = {}
) => {
  const { sendMessage, addMessageListener, isConnected } = useWebSocket();
  const { onMessage, onError, autoReconnect = true } = options;

  // Handle incoming messages
  useEffect(() => {
    if (!onMessage) return undefined;

    const handleIncomingMessage = (message: WebSocketMessage) => {
      if (message.type === messageType) {
        try {
          onMessage(message.content, message);
        } catch (error) {
          console.error(`Error handling message of type ${messageType}:`, error);
          if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)));
          }
        }
      }
    };

    // Add the listener and get the cleanup function
    const cleanup = addMessageListener(handleIncomingMessage);

    // Return cleanup function to remove the listener when component unmounts
    return cleanup;
  }, [addMessageListener, messageType, onMessage, onError]);

  // Function to send messages
  const send = useCallback((data: any) => {
    if (!isConnected) {
      const error = new Error('WebSocket is not connected');
      if (onError) onError(error);
      throw error;
    }

    const message: WebSocketMessage = {
      type: messageType,
      content: data,
      timestamp: new Date().toISOString()
    };

    try {
      sendMessage(message);
    } catch (error) {
      console.error(`Error sending message of type ${messageType}:`, error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }, [sendMessage, messageType, isConnected, onError]);

  // Return the send function and connection status
  return useMemo(() => ({
    send,
    isConnected
  }), [send, isConnected]);
};
