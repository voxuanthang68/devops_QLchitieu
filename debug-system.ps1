# Script kiểm tra và Debug hệ thống (Layer Thinking)
Write-Host "🔍 Đang kiểm tra hệ thống theo mô hình Layer Thinking..." -ForegroundColor Magenta

# Layer 1: Infrastructure (Docker)
Write-Host "`n[L1: Infrastructure] Kiểm tra Containers:" -ForegroundColor Cyan
docker ps -a --filter "name=expense-tracker"

# Layer 2: External (Database)
Write-Host "`n[L2: Database] Kiểm tra kết nối MongoDB:" -ForegroundColor Cyan
$dbStatus = docker exec expense-tracker-api node -e "require('mongoose').connect('mongodb://database:27017/expense-tracker').then(() => { console.log('OK'); process.exit(0); }).catch(err => { console.error(err); process.exit(1); })" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database: CONNECTED" -ForegroundColor Green
} else {
    Write-Host "❌ Database: DISCONNECTED" -ForegroundColor Red
}

# Layer 3: Backend (API Health)
Write-Host "`n[L3: Backend] Kiểm tra Healthcheck Endpoint:" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ API Status: $($health.status)" -ForegroundColor Green
    Write-Host "✅ DB inside API: $($health.database)" -ForegroundColor Green
} catch {
    Write-Host "❌ API is UNREACHABLE" -ForegroundColor Red
}

# Layer 4: Frontend (Web)
Write-Host "`n[L4: Frontend] Kiểm tra Web UI:" -ForegroundColor Cyan
try {
    $web = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head
    Write-Host "✅ Web UI: UP (Status: $($web.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Web UI is DOWN" -ForegroundColor Red
}

# Logs: Kiểm tra 10 dòng lỗi gần nhất
Write-Host "`n[Logs] 10 dòng log gần nhất của Backend:" -ForegroundColor Cyan
docker logs --tail 10 expense-tracker-api

Write-Host "`n🏁 Kết thúc kiểm tra." -ForegroundColor Magenta
