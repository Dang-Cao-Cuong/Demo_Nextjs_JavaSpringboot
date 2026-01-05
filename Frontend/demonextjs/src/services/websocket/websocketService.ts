import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  private client: Client | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds

  // Lấy base URL từ biến môi trường hoặc dùng mặc định
  private getWebSocketUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.60.243.54:8080/cnc/v1';
    // WebSocket endpoint: /cnc/v1/ws (trong context-path)
    return `${apiUrl}/ws`;
  }

  /**
   * Khởi tạo kết nối WebSocket
   * @param token - JWT Access Token
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.getWebSocketUrl();
        console.log(' WebSocket connecting to:', wsUrl);

        // Tạo STOMP client
        this.client = new Client({
          // Dùng SockJS vì backend có config .withSockJS()
          webSocketFactory: () => new SockJS(wsUrl),

          // Nếu muốn dùng WebSocket thuần, dùng endpoint /ws-raw:
          // brokerURL: wsUrl.replace('/ws', '/ws-raw').replace(/^http/, 'ws'),

          // Thêm JWT Token vào header
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },

          // Debug logs
          debug: (str) => {
            console.log('[STOMP Debug]:', str);
          },

          // Heartbeat (giữ kết nối sống)
          heartbeatIncoming: 10000, // 10s
          heartbeatOutgoing: 10000, // 10s

          // Auto reconnect
          reconnectDelay: this.reconnectDelay,

          // Callback khi kết nối thành công
          onConnect: () => {
            console.log(' WebSocket connected successfully');
            this.reconnectAttempts = 0;
            resolve();
          },

          // Callback khi mất kết nối
          onDisconnect: () => {
            console.warn(' WebSocket disconnected');

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              console.log(` Đang thử kết nối lại (lần ${this.reconnectAttempts})...`);

              setTimeout(() => {
                this.client?.activate();
              }, this.reconnectDelay * this.reconnectAttempts);
            } else {
              console.error(' Đã đạt số lần kết nối lại tối đa');
              // Có thể hiển thị thông báo cho user
            }
          },

          // Callback khi có lỗi
          onStompError: (frame) => {
            console.error(' STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
            reject(new Error(frame.headers['message']));
          },

          // Callback khi có lỗi WebSocket
          onWebSocketError: (event) => {
            console.error(' WebSocket error:', event);
            reject(event);
          },
        });

        // Kích hoạt kết nối
        this.client.activate();
      } catch (error) {
        console.error(' Failed to create WebSocket client:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe vào một topic
   * @param topic - Tên topic (vd: '/topic/errors')
   * @param callback - Hàm xử lý khi nhận message
   */
  subscribe(topic: string, callback: (message: any) => void) {
    if (!this.client?.connected) {
      console.error(' WebSocket chưa kết nối. Gọi connect() trước.');
      return null;
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error(' Error parsing message:', error);
      }
    });

    console.log(` Subscribed to topic: ${topic}`);
    return subscription;
  }

  /**
   * Gửi message tới server
   * @param destination - Đường dẫn endpoint (vd: '/app/machine/update')
   * @param body - Dữ liệu gửi đi
   */
  send(destination: string, body: any) {
    if (!this.client?.connected) {
      console.error(' WebSocket chưa kết nối.');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });

    console.log(` Sent message to ${destination}:`, body);
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log(' WebSocket disconnected');
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();