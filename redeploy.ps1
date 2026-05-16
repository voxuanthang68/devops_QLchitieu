# Script tự động Deploy lại hệ thống (Redeploy)
Write-Host "🔄 Đang bắt đầu quy trình Redeploy..." -ForegroundColor Cyan

# 1. Dừng và xóa các container cũ
Write-Host "Step 1: Stopping old containers..." -ForegroundColor Yellow
docker compose down

# 2. Xây dựng lại Image (không dùng cache để đảm bảo code mới nhất)
Write-Host "Step 2: Rebuilding images (no-cache)..." -ForegroundColor Yellow
docker compose build --no-cache

# 3. Khởi động lại hệ thống ở chế độ background
Write-Host "Step 3: Starting services..." -ForegroundColor Yellow
docker compose up -d

# 4. Kiểm tra trạng thái cuối cùng
Write-Host "Step 4: Verifying status..." -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "✅ Redeploy hoàn tất! Truy cập http://localhost:3000" -ForegroundColor Green
