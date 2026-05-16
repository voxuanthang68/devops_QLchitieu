# Hướng dẫn hoàn thành Đồ án DevOps: Expense Tracker

Dự án đã được thiết lập đầy đủ theo các yêu cầu bắt buộc. Dưới đây là hướng dẫn để bạn chạy và demo.

## 1. Cấu trúc thư mục
- `backend/`: Node.js Express API & MongoDB Model.
- `frontend/`: React (Vite) UI với thiết kế Premium.
- `.github/workflows/`: Quy trình CI/CD tự động.
- `docker-compose.yml`: File chạy hệ thống tập trung.

## 2. Cách chạy hệ thống (Demo Docker)
Bạn chỉ cần chạy một lệnh duy nhất tại thư mục gốc:

```powershell
docker compose up -d --build
```

Sau khi chạy xong, hãy kiểm tra:
- **Frontend**: Truy cập `http://localhost:80`
- **Backend Health**: Truy cập `http://localhost:5000/api/health`
- **Logs**: Chạy `docker compose logs -f` để xem log container.

## 3. Quy trình CI/CD
Khi bạn push code lên GitHub:
1. GitHub Actions sẽ tự động chạy.
2. Kiểm tra lỗi code (Lint).
3. Chạy test (Test).
4. Build thử Docker images (Build).

## 4. Phân vai trong nhóm (Roles)
- **Backend Engineer**: Phụ trách `backend/server.js`, `/api/health`.
- **Frontend Engineer**: Phụ trách `frontend/src/*`, biến `VITE_API_URL`.
- **DevOps Engineer**: Phụ trách `.github/workflows/main.yml`.
- **Infrastructure Engineer**: Phụ trách `Dockerfile` và `docker-compose.yml`.
- **QA/SRE Engineer**: Phụ trách file `incidents_report.md` và kiểm thử.

## 6. Chứng minh yêu cầu hoàn thành (Kết Luận)

Dự án này thỏa mãn 100% điều kiện hoàn thành nhờ các công cụ sau:

### 🚀 1. Hệ thống chạy trên Production
- **Frontend** được build thành mã máy (`npm run build`) và phục vụ bởi **Nginx**, không phải server dev.
- **Backend** chạy độc lập, kết nối DB qua Network nội bộ của Docker.
- Toàn bộ bí mật và config nằm trong `.env`.

### 🔄 2. Có thể Deploy lại (Redeploy)
Tôi đã tạo sẵn script: `.\redeploy.ps1`.
- Khi bạn thay đổi code, chỉ cần chạy lệnh này. Hệ thống sẽ tự động dọn dẹp, build lại và khởi động lại mà không cần can thiệp thủ công.
- **Lợi ích**: Đảm bảo tính nhất quán (Consistency) giữa các lần deploy.

### 🛠️ 3. Có thể Debug khi lỗi (System Thinking)
Tôi đã tạo sẵn script: `.\debug-system.ps1`.
- Script này thực hiện kiểm tra 4 lớp (Layers) ngay lập tức.
- Giúp xác định lỗi nhanh chóng: Do Docker sập (L1), DB mất kết nối (L2), API lỗi code (L3) hay Frontend sai config (L4).
- **Lợi ích**: Loại bỏ việc "đoán mò", debug theo phương pháp khoa học.

---
**Lưu ý**: Hãy chạy terminal với quyền Administrator nếu gặp lỗi phân quyền khi chạy các script `.ps1`.
