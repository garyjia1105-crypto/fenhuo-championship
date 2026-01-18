# Render 部署快速指南

## 部署步骤

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 推送代码到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### 2. 部署后端服务

1. 访问 [Render Dashboard](https://dashboard.render.com/)
2. 点击 "New +" -> "Web Service"
3. 连接你的 GitHub 仓库
4. 配置服务：
   - **Name**: `fenguo-championship-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

5. 添加环境变量（在 Environment 标签页）：
   - `MONGODB_URI`: 你的 MongoDB Atlas 连接字符串
     ```
     mongodb+srv://garyjia1105:4vWXPXeLreqC2xOn@cluster0.v2uqxq9.mongodb.net/fenguo-championship?retryWrites=true&w=majority
     ```
   - `SESSION_SECRET`: 生成一个随机密钥（可以使用 `openssl rand -hex 32`）
   - `NODE_ENV`: `production`
   - `PORT`: `10000`（Render 会自动设置，但可以明确指定）
   - `FRONTEND_URL`: 暂时留空，部署前端后再更新

6. 点击 "Create Web Service"
7. 等待部署完成，记录后端服务 URL（例如：`https://fenguo-championship-api.onrender.com`）

### 3. 部署前端服务

1. 在 Render Dashboard 点击 "New +" -> "Static Site"
2. 连接你的 GitHub 仓库
3. 配置服务：
   - **Name**: `fenguo-championship-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. 添加环境变量：
   - `REACT_APP_API_URL`: 你的后端 API URL（例如：`https://fenguo-championship-api.onrender.com/api`）

5. 点击 "Create Static Site"
6. 等待部署完成，记录前端 URL（例如：`https://fenguo-championship-frontend.onrender.com`）

### 4. 更新配置

1. **更新后端的 FRONTEND_URL**：
   - 在 Render Dashboard 中打开后端服务
   - 进入 Environment 标签页
   - 更新 `FRONTEND_URL` 为前端实际 URL
   - 保存并重新部署

2. **验证部署**：
   - 访问前端 URL，测试应用是否正常工作
   - 测试登录功能（用户名：QingXiang，密码：deltaforce123）

## 重要提示

- **免费版限制**：Render 免费版服务在 15 分钟无活动后会自动休眠，首次访问需要等待几秒唤醒
- **环境变量**：确保所有环境变量都已正确设置
- **CORS**：后端已配置 CORS，允许前端域名访问
- **Session**：生产环境使用 HTTPS，session cookie 会自动设置为 secure

## 故障排查

### 后端无法连接 MongoDB
- 检查 `MONGODB_URI` 是否正确
- 检查 MongoDB Atlas 的网络访问设置（允许所有 IP 或添加 Render IP）
- 检查 MongoDB 用户权限

### CORS 错误
- 确保后端的 `FRONTEND_URL` 环境变量指向正确的前端 URL
- 检查前端请求 URL 是否正确

### 前端无法连接后端
- 检查 `REACT_APP_API_URL` 环境变量是否正确
- 确保后端服务正在运行
- 检查浏览器控制台的错误信息
