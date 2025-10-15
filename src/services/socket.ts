import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, WEBSOCKET_ENDPOINTS } from '@/constants/routes';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit('join_room', room);
    }
  }

  leaveRoom(room: string) {
    if (this.socket) {
      this.socket.emit('leave_room', room);
    }
  }

  getSocket() {
    return this.socket;
  }

  // Product-specific socket methods
  connectToProductUpdates(productId: string, onUpdate: (product: any) => void) {
    if (!this.socket) {
      this.connect();
    }
    
    const event = `product_update_${productId}`;
    this.joinRoom(`product_${productId}`);
    this.on(event, onUpdate);
    
    return () => {
      this.off(event, onUpdate);
      this.leaveRoom(`product_${productId}`);
    };
  }

  // WebSocket connection for direct product updates (if needed)
  connectToProductWebSocket(productId: string, onUpdate: (product: any) => void) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const baseUrl = protocol === "wss" ? "wss://127.0.0.1:8000" : "ws://127.0.0.1:8000";
    const endpoint = WEBSOCKET_ENDPOINTS.PRODUCT_UPDATE(productId);
    const url = `${baseUrl}${endpoint}`;
    
    const ws = new WebSocket(url);
    
    return new Promise<() => void>((resolve, reject) => {
      ws.onopen = () => {
        console.log(`Connected to product ${productId} WebSocket`);
        resolve(() => ws.close());
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
