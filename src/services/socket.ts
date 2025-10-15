import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, WEBSOCKET_ENDPOINTS } from '@/constants/routes';

class SocketService {
  private socket: Socket | null = null;

  connectToProductWebSocket(productId: string, onUpdate: (product: any) => void) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const baseUrl = protocol === "wss" ? "wss://127.0.0.1:8000" : "ws://127.0.0.1:8000";
    const endpoint = WEBSOCKET_ENDPOINTS.PRODUCT_UPDATE(productId);
    const url = `${baseUrl}${endpoint}`;
    
    const ws = new WebSocket(url);
    
    return new Promise<() => void>((resolve, reject) => {
      ws.onopen = () => {
        console.log(`Connected to product ${productId} WebSocket`);
        // resolve(() => ws.close());
      };
      
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onUpdate(payload.product?.product || payload.product);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log(`Product ${productId} WebSocket closed`);
      };
      
      ws.onerror = (error) => {
        console.error(`Product ${productId} WebSocket error:`, error);
        reject(error);
      };
    });
  }
}

export const socketService = new SocketService();
