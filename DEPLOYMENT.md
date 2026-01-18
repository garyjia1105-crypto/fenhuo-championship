# 部署指南

本文档说明如何将烽火冠军赛排行榜部署到Render和MongoDB。

## 前置要求

1. GitHub账户
2. Render账户（免费版即可）
3. MongoDB Atlas账户（免费版即可）或MongoDB本地实例

## 部署步骤

### 1. 准备MongoDB数据库

#### 选项A：使用MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群
3. 创建数据库用户
4. 配置网络访问（添加IP白名单或允许所有IP）
5. 获取连接字符串，格式如下：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fenguo-championship?retryWrites=true&w=majority
   ```

#### 选项B：使用MongoDB本地实例

仅适用于本地开发。

### 2. 推送代码到GitHub

1. 在GitHub创建新仓库
2. 将代码推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### 3. 在Render部署后端服务

1. 访问 [Render Dashboard](https://dashboard.render.com/)
2. 点击 "New +" -> "Web Service"
3. 连接你的GitHub仓库
4. 配置服务：
   - **Name**: `fenguo-championship-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

5. 添加环境变量：
   - `MONGODB_URI`: 你的MongoDB连接字符串
   - `SESSION_SECRET`: 生成一个随机密钥（可以使用 `openssl rand -hex 32`）
   - `NODE_ENV`: `production`
   - `PORT`: `10000`（Render会自动设置，但可以明确指定）
   - `FRONTEND_URL`: 你的前端URL（部署前端后更新）

6. 点击 "Create Web Service"
7. 等待部署完成，记录后端服务URL（如：`https://fenguo-championship-api.onrender.com`）

### 4. 在Render部署前端服务

1. 在Render Dashboard点击 "New +" -> "Static Site"
2. 连接你的GitHub仓库
3. 配置服务：
   - **Name**: `fenguo-championship-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. 添加环境变量：
   - `REACT_APP_API_URL`: 你的后端API URL（如：`https://fenguo-championship-api.onrender.com/api`）

5. 点击 "Create Static Site"
6. 等待部署完成，记录前端URL（如：`https://fenguo-championship.onrender.com`）

### 5. 更新配置

1. 更新后端的 `FRONTEND_URL` 环境变量为前端URL
2. 重新部署后端服务（如果需要）
3. 访问前端URL，测试应用

## 环境变量说明

### 后端环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SESSION_SECRET` | Session加密密钥 | 随机字符串 |
| `PORT` | 服务器端口 | `10000` |
| `FRONTEND_URL` | 前端URL（用于CORS） | `https://fenguo-championship.onrender.com` |
| `NODE_ENV` | 环境模式 | `production` |

### 前端环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `REACT_APP_API_URL` | 后端API URL | `https://fenguo-championship-api.onrender.com/api` |

## 使用render.yaml自动部署

如果你使用 `render.yaml` 文件，可以在Render Dashboard中：

1. 点击 "New +" -> "Blueprint"
2. 连接GitHub仓库
3. Render会自动读取 `render.yaml` 并创建所有服务
4. 在服务创建后，手动添加 `MONGODB_URI` 环境变量

## 故障排查

### 后端无法连接MongoDB

- 检查 `MONGODB_URI` 是否正确
- 检查MongoDB Atlas的网络访问设置
- 检查MongoDB用户权限

### CORS错误

- 确保后端的 `FRONTEND_URL` 环境变量指向正确的前端URL
- 检查前端请求URL是否正确

### Session无法保存

- 确保 `SESSION_SECRET` 已设置
- 在生产环境中，确保使用HTTPS（Render自动提供）

## 维护

- 代码更新会自动触发重新部署
- 可以在Render Dashboard查看日志
- 免费版服务在15分钟无活动后会自动休眠，首次访问需要等待几秒唤醒
