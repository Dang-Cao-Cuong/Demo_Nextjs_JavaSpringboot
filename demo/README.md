================================================================================

&nbsp;            HƯỚNG DẪN KẾT NỐI BACKEND (REST API \& WEBSOCKET)

================================================================================



1\. THÔNG TIN SERVER (BASE CONFIG)

---------------------------------

\- Host: localhost

\- Port: 8080

\- Context Path (Prefix bắt buộc): /cnc/v1



=> BASE URL CỦA API: http://localhost:8080/cnc/v1



2\. REST API - AUTHENTICATION

---------------------------------

Vì server sử dụng Stateless JWT, Frontend cần gửi Token trong Header cho các request bảo mật.



A. Đăng nhập (Lấy Token)

\- URL: POST http://localhost:8080/cnc/v1/auth/login

\- Body (JSON):

&nbsp; {

&nbsp;   "username": "...",

&nbsp;   "password": "..."

&nbsp; }

\- Response: Sẽ trả về JWT Token (accessToken).



B. Gọi API bảo mật

\- Với mọi request (trừ /auth/\*\* và /ws/\*\*), cần đính kèm Header:

&nbsp; Authorization: Bearer <YOUR\_ACCESS\_TOKEN>



3\. WEBSOCKET (STOMP over SockJS)

---------------------------------

Server sử dụng Spring Boot WebSocket với STOMP.



A. Cài đặt thư viện (nếu dùng React/Vue/Angular)

&nbsp;  npm install sockjs-client @stomp/stompjs



B. Thông tin kết nối

\- Endpoint kết nối (Handshake): http://localhost:8080/cnc/v1/ws

&nbsp; (LƯU Ý: Phải có /cnc/v1 ở giữa)



\- Subscribe Prefix (Nhận tin): /topic

\- Send Prefix (Gửi tin): /app



C. Code mẫu (React/JS)

---------------------------------

import SockJS from 'sockjs-client';

import { Stomp } from '@stomp/stompjs';



const connectWebSocket = () => {

&nbsp;   // 1. Tạo kết nối SockJS

&nbsp;   // Lưu ý: Dùng đúng URL có context-path

&nbsp;   const socket = new SockJS('http://localhost:8080/cnc/v1/ws');

&nbsp;   

&nbsp;   // 2. Khởi tạo Stomp Client

&nbsp;   const stompClient = Stomp.over(socket);



&nbsp;   // Tắt log debug nếu muốn console gọn

&nbsp;   // stompClient.debug = () => {};



&nbsp;   stompClient.connect({}, (frame) => {

&nbsp;       console.log('Connected: ' + frame);



&nbsp;       // 3. Lắng nghe (Subscribe) tin nhắn từ Server

&nbsp;       // Ví dụ: Lắng nghe topic lỗi chung

&nbsp;       stompClient.subscribe('/topic/errors', (message) => {

&nbsp;           if (message.body) {

&nbsp;               console.log("Nhận được tin nhắn: ", message.body);

&nbsp;               // Xử lý JSON: JSON.parse(message.body)

&nbsp;           }

&nbsp;       });



&nbsp;       // Ví dụ: Lắng nghe thông báo khác

&nbsp;       stompClient.subscribe('/topic/notifications', (msg) => {

&nbsp;            // Logic update UI...

&nbsp;       });



&nbsp;   }, (error) => {

&nbsp;       console.error('Lỗi kết nối WebSocket: ', error);

&nbsp;       // Có thể thêm logic reconnect sau 5s tại đây

&nbsp;   });



&nbsp;   return stompClient;

};



4\. LƯU Ý QUAN TRỌNG (TROUBLESHOOTING)

---------------------------------

1\. Lỗi 404 Not Found khi connect WebSocket:

&nbsp;  -> Kiểm tra kỹ URL xem đã có "/cnc/v1" chưa.

&nbsp;  -> Đúng: http://localhost:8080/cnc/v1/ws

&nbsp;  -> Sai:  http://localhost:8080/ws



2\. Lỗi CORS:

&nbsp;  -> Hiện tại Backend đã mở Allow-Origin: "\*" và Allow-Credentials: true.

&nbsp;  -> Nếu vẫn lỗi, hãy kiểm tra lại network tab trên trình duyệt xem header gửi đi đúng chưa.



3\. Authentication WebSocket:

&nbsp;  -> Hiện tại endpoint /ws được "permitAll", client có thể kết nối mà không cần Token.

