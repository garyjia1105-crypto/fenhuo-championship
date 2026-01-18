# Render 部署详细步骤

## 重要：前端使用 Static Site，后端使用 Web Service

### 第一步：部署后端（Web Service）

1. 访问 https://dashboard.render.com/
2. 点击 **"New +"** → **"Web Service"**（重要：选择 Web Service）
3. 连接 GitHub 仓库：选择 `garyjia1105-crypto/fenhuo-championship`
4. 配置服务：
   - **Name**: `fenguo-championship-api`
   - **Environment**: `Node`
   - **Region**: 选择离您最近的区域
   - **Branch**: `main`
   - **Root Directory**: 留空（使用项目根目录）
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

5. **添加环境变量**（点击 "Add Environment Variable"）：
   - `MONGODB_URI` = `mongodb+srv://garyjia1105:4vWXPXeLreqC2xOn@cluster0.v2uqxq9.mongodb.net/fenguo-championship?retryWrites=true&w=majority`
   - `SESSION_SECRET` = 生成随机字符串（或点击 "Generate"）
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `FRONTEND_URL` = 暂时留空，部署前端后再填

6. 点击 **"Create Web Service"**
7. 等待部署完成，记录后端 URL（例如：`https://fenguo-championship-api.onrender.com`）

---

### 第二步：部署前端（Static Site）

1. 在 Render Dashboard 点击 **"New +"** → **"Static Site"**（重要：选择 Static Site，不是 Web Service）
2. 连接同一个 GitHub 仓库：`garyjia1105-crypto/fenhuo-championship`
3. 配置服务：
   - **Name**: `fenguo-championship-frontend`
   - **Branch**: `main`
   - **Root Directory**: 留空
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: `Free`

4. **添加环境变量**：
   - `REACT_APP_API_URL` = 你的后端URL + `/api`（例如：`https://fenguo-championship-api.onrender.com/api`）

5. 点击 **"Create Static Site"**
6. 等待部署完成，记录前端 URL（例如：`https://fenguo-championship-frontend.onrender.com`）

---

### 第三步：更新后端配置

1. 在 Render Dashboard 打开后端服务（fenguo-championship-api）
2. 进入 **Environment** 标签页
3. 更新 `FRONTEND_URL` 环境变量为前端实际 URL（例如：`https://fenguo-championship-frontend.onrender.com`）
4. 点击 **"Save Changes"**（会自动重新部署）

---

### 验证部署

1. 访问前端 URL
2. 测试功能：
   - 查看排行榜
   - 测试登录（用户名：QingXiang，密码：deltaforce123）
   - 添加/编辑选手

---

## 关键区别

| 服务类型 | 创建方式 | 说明 |
|---------|---------|------|
| **后端** | New + → **Web Service** | 运行 Node.js 服务器 |
| **前端** | New + → **Static Site** | 部署静态文件，不需要服务器 |

## 常见错误

- ❌ 错误：前端选择 "Web Service" → 会导致找不到 package.json 的错误
- ✅ 正确：前端选择 **"Static Site"**

## 故障排查

如果前端构建失败：
1. 检查 Build Command 是否为：`cd frontend && npm install && npm run build`
2. 检查 Publish Directory 是否为：`frontend/build`
3. 确认 GitHub 仓库中 `frontend/package.json` 存在
