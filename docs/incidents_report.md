# Báo cáo Sự cố (Incident Report) - QA/SRE Role

Dưới đây là 3 sự cố thực tế thường gặp trong quá trình triển khai hệ thống này, cùng với phân tích và cách khắc phục theo tư duy Layer Thinking.

---

## Incident 1: Backend không kết nối được Database
- **Hiện tượng**: Log backend báo lỗi "Could not connect to MongoDB". Endpoint `/api/health` trả về `database: DISCONNECTED`.
- **Layer lỗi**: L2 (External - DB).
- **Nguyên nhân**: Container Database chưa khởi động xong hoặc sai chuỗi kết nối (`MONGODB_URI`).
- **Cách fix**:
    - Kiểm tra trạng thái container: `docker ps`.
    - Đảm bảo service `database` trong `docker-compose.yml` đã chạy.
    - Sử dụng tên service (`database`) thay vì `localhost` khi chạy trong Docker.
- **Cách phòng tránh**: Sử dụng cơ chế `healthcheck` và `depends_on` (condition: service_healthy) trong Docker Compose.

---

## Incident 2: Lỗi 404 / Không gọi được API từ Frontend
- **Hiện tượng**: Frontend load được giao diện nhưng không hiển thị dữ liệu chi tiêu. Console báo lỗi `GET http://localhost:5000/api/transactions net::ERR_CONNECTION_REFUSED`.
- **Layer lỗi**: L3 (Backend) hoặc L4 (Frontend config).
- **Nguyên nhân**: Biến môi trường `VITE_API_URL` bị cấu hình sai (ví dụ: vẫn để localhost khi deploy lên production).
- **Cách fix**:
    - Kiểm tra file `.env` hoặc cấu hình Docker Compose.
    - Đảm bảo Frontend gọi đúng URL của API container hoặc domain production.
- **Cách phòng tránh**: Luôn có file `.env.example` chuẩn và kiểm tra config trong pipeline CI.

---

## Incident 3: Lỗi CORS (Cross-Origin Resource Sharing)
- **Hiện tượng**: Browser báo lỗi "Access to fetch at ... has been blocked by CORS policy".
- **Layer lỗi**: L3 (Backend API).
- **Nguyên nhân**: Backend chưa cấu hình cho phép domain của Frontend truy cập (thường xảy ra khi deploy lên URL khác nhau).
- **Cách fix**:
    - Trong `server.js`, cấu hình middleware `cors` để cho phép origin cụ thể.
    - `app.use(cors({ origin: process.env.FRONTEND_URL }));`
- **Cách phòng tránh**: Thiết lập biến môi trường `ALLOWED_ORIGINS` rõ ràng cho từng môi trường (dev/prod).
