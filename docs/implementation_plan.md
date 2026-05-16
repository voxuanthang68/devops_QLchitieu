# Đồ Án DevOps: Expense Tracker (Quản lý chi tiêu)

Dự án này nhằm xây dựng một hệ thống quản lý chi tiêu hoàn chỉnh, đáp ứng các tiêu chuẩn DevOps: Đóng gói Docker, quy trình CI/CD tự động, và triển khai thực tế.

## Thành phần hệ thống
- **Frontend**: React (Vite) - Giao diện người dùng.
- **Backend**: Node.js (Express) - API xử lý logic và kết nối DB.
- **Database**: MongoDB - Lưu trữ dữ liệu giao dịch.
- **Infrastructure**: Docker & Docker Compose.
- **CI/CD**: GitHub Actions (Lint, Test, Build).

## Các giai đoạn thực hiện

### 1. Khởi tạo cấu trúc dự án [NEW]
Thiết lập thư mục gốc và các nhánh Git cơ bản.
- `backend/`: Mã nguồn server.
- `frontend/`: Giao diện người dùng.
- `.github/workflows/`: Cấu hình CI/CD.
- `docker-compose.yml`: Chạy toàn bộ hệ thống.

### 2. Backend Development (Backend Engineer)
Xây dựng API đáp ứng các yêu cầu:
- [ ] Endpoint `/api/health` (Healthcheck).
- [ ] API `POST /api/transactions`: Thêm khoản chi tiêu.
- [ ] API `GET /api/transactions`: Xem danh sách.
- [ ] API `GET /api/transactions/summary`: Tính tổng chi tiêu.
- [ ] Kết nối MongoDB và Logging (Winston/Morgan).

### 3. Frontend Development (Frontend Engineer)
Xây dựng UI đẹp và tối ưu:
- [ ] Form thêm chi tiêu.
- [ ] Danh sách chi tiêu (Table/Cards).
- [ ] Dashboard hiển thị tổng chi tiêu.
- [ ] Sử dụng `VITE_API_URL` từ biến môi trường.
- [ ] Đảm bảo không lỗi console.

### 4. Dockerization (Infrastructure Engineer)
- [ ] `backend/Dockerfile`: Optimize size.
- [ ] `frontend/Dockerfile`: Multi-stage build (build with Node, serve with Nginx).
- [ ] `docker-compose.yml`: Kết nối FE, BE và MongoDB.

### 5. CI/CD Pipeline (DevOps Engineer)
Thiết lập GitHub Actions:
- [ ] Job: **Lint** (Check code style).
- [ ] Job: **Test** (Unit test cho backend).
- [ ] Job: **Build** (Build Docker images).

### 6. QA & SRE (QA/SRE Engineer)
- [ ] Giả lập 3 sự cố (Incident) thực tế:
    - Incident 1: Lỗi kết nối Database.
    - Incident 2: Sai biến môi trường (ENV).
    - Incident 3: Lỗi CORS.
- [ ] Viết báo cáo phân tích và cách fix.

## Kế hoạch kiểm tra (Verification Plan)
- Chạy `docker compose up -d` và truy cập ứng dụng.
- Kiểm tra log container bằng `docker logs`.
- Kiểm tra pipeline GitHub Actions.

## Câu hỏi cho người dùng
1. Bạn đã có sẵn Repository trên GitHub chưa? Nếu chưa tôi sẽ hướng dẫn bạn tạo.
2. Bạn muốn sử dụng MongoDB hay một cơ sở dữ liệu khác (như PostgreSQL)?
