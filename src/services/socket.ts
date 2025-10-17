import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, SOCKET_SECURE_URL, WEBSOCKET_ENDPOINTS } from '@/constants/routes';

class SocketService {
  connectToProductWebSocket(onUpdate: (product: any) => void) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const baseUrl = protocol === "wss" ? SOCKET_SECURE_URL : SOCKET_URL;
    const endpoint = WEBSOCKET_ENDPOINTS.PRODUCT_UPDATE;
    const url = `${baseUrl}${endpoint}`;
    console.log('Connecting to WebSocket URL:', url);
    const ws = new WebSocket(url);
    
    return new Promise<() => void>((resolve, reject) => {
      ws.onopen = () => {
        console.log(`Connected to product WebSocket`);
        resolve(() => ws.close());
      };
      
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onUpdate(payload.product?.product);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log(`Product WebSocket closed. Code: ${event.code}, Reason: ${event.reason || 'No specific reason provided'}`);
      };
      
      ws.onerror = (error) => {
        console.error(`Product WebSocket error:`, error);
        reject(error);
      };
    });
  }
}

export const socketService = new SocketService();
