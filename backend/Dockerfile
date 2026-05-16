# Sử dụng image Node.js nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy toàn bộ mã nguồn backend
COPY backend/ .

# Mở port 5000
EXPOSE 5000

# Chạy server
CMD ["node", "server.js"]
