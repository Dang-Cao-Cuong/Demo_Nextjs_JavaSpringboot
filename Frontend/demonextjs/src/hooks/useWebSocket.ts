import { useEffect, useRef, useCallback } from 'react';
import { websocketService } from '@/services/websocket/websocketService';
import { StompSubscription } from '@stomp/stompjs';

interface UseWebSocketOptions {
  topic: string;
  onMessage: (message: any) => void;
  enabled?: boolean;
}

export function useWebSocket({ topic, onMessage, enabled = true }: UseWebSocketOptions) {
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const subscribe = useCallback(() => {
    if (!websocketService.isConnected()) {
      console.warn(' WebSocket chưa kết nối, đang chờ...');
      return;
    }

    // Unsubscribe nếu đã subscribe trước đó
    if (subscriptionRef.current) {
      console.log(` Unsubscribing from topic: ${topic}`);
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Subscribe mới
    console.log(` Subscribing to topic: ${topic}`);
    subscriptionRef.current = websocketService.subscribe(topic, onMessage);
  }, [topic, onMessage]);

  useEffect(() => {
    if (!enabled) return;

    // Đợi 1s để đảm bảo WebSocket đã kết nối
    const timer = setTimeout(() => {
      subscribe();
    }, 1000);

    // Cleanup khi unmount
    return () => {
      clearTimeout(timer);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [enabled, subscribe]);

  return {
    isConnected: websocketService.isConnected(),
    send: websocketService.send.bind(websocketService),
  };
}