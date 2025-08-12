# Kéo image node
FROM node:20-alpine AS build

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và tsconfig.json vào /app
COPY package*.json ./
COPY tsconfig*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào /app
COPY . .

# Build ứng dụng
RUN npm run build

# Kéo image nginx
FROM nginx:stable-alpine

# Copy file đã build vào thư mục phục vụ của nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở port 80 để truy cập
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]
