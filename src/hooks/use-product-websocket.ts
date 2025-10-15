import { useEffect, useRef, useState } from 'react';
import { socketService } from '@/services/socket';

type WebSocketState = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseProductWebSocketProps {
  productId: string | undefined;
  onProductUpdate: (product: any) => void;
  enabled?: boolean;
}

export function useProductDirectWebSocket({ 
  productId, 
  onProductUpdate, 
  enabled = true 
}: UseProductWebSocketProps) {
  const [wsState, setWsState] = useState<WebSocketState>('disconnected');
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!productId || !enabled) {
      setWsState('disconnected');
      return;
    }

    setWsState('connecting');

    // Use direct WebSocket connection for product updates
    socketService.connectToProductWebSocket(productId, onProductUpdate)
      .then((cleanup) => {
        cleanupRef.current = cleanup;
        setWsState('connected');
      })
      .catch((error) => {
        console.error('Failed to connect to product WebSocket:', error);
        setWsState('error');
      });

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      setWsState('disconnected');
    };
  }, [productId, onProductUpdate, enabled]);

  return { wsState };
}