# Render 配置检查清单 - 修复 ERR_NETWORK 错误

## 问题诊断

ERR_NETWORK 错误表示前端无法连接到后端 API。请按以下步骤检查：

## ✅ 步骤 1: 检查后端服务状态

在 Render Dashboard 中：

1. 打开后端服务（`fenguo-championship-api`）
2. **确认服务状态为 "Live"**（绿色）
   - 如果显示 "Sleeping"，点击服务唤醒它
   - 如果显示 "Build Failed"，检查构建日志
3. **记录后端服务 URL**（例如：`https://fenguo-championship-api.onrender.com`）

## ✅ 步骤 2: 检查后端环境变量

在后端服务的 **Environment** 标签页中，确认以下环境变量：

| 变量名 | 必须 | 示例值 |
|--------|------|--------|
| `MONGODB_URI` | ✅ 是 | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SESSION_SECRET` | ✅ 是 | 随机字符串（Render 可能已自动生成） |
| `NODE_ENV` | ✅ 是 | `production` |
| `PORT` | ⚠️ 可选 | `10000`（Render 会自动设置） |
| `FRONTEND_URL` | ✅ 是 | `https://fenhuo-championship-frontend.onrender.com` |

**重要**：`FRONTEND_URL` 必须设置为你的前端实际 URL（不带尾部斜杠）

## ✅ 步骤 3: 测试后端 API

在浏览器中访问：
```
https://你的后端URL.onrender.com/api/health
```

应该看到：
```json
{"status":"OK","message":"烽火冠军赛排行榜API运行正常"}
```

如果无法访问，后端服务可能未正确部署。

## ✅ 步骤 4: 检查前端环境变量

在前端服务的 **Environment** 标签页中，确认：

| 变量名 | 必须 | 示例值 |
|--------|------|--------|
| `REACT_APP_API_URL` | ✅ 是 | `https://fenguo-championship-api.onrender.com/api` |

**重要**：
- 必须以 `/api` 结尾
- 必须是完整的 HTTPS URL
- 必须与后端服务 URL 匹配

## ✅ 步骤 5: 重新部署前端

**环境变量更改后，必须重新部署前端才能生效！**

1. 在前端服务页面，点击 **"Manual Deploy"** → **"Deploy latest commit"**
2. 等待构建完成（通常需要 2-5 分钟）
3. 构建完成后，刷新前端页面

## ✅ 步骤 6: 验证配置

在浏览器控制台（F12）中，应该看到：
```
[DEBUG] API_URL: https://fenguo-championship-api.onrender.com/api
[DEBUG] REACT_APP_API_URL env: https://fenguo-championship-api.onrender.com/api
```

如果显示 `http://localhost:5000/api`，说明环境变量未正确设置。

## 🔧 常见问题

### 问题 1: 前端显示 `http://localhost:5000/api`

**原因**：`REACT_APP_API_URL` 环境变量未设置或未生效

**解决**：
1. 在 Render Dashboard 中检查前端环境变量
2. 确保 `REACT_APP_API_URL` 已设置
3. **重新部署前端服务**

### 问题 2: 后端服务显示 "Sleeping"

**原因**：免费版服务在 15 分钟无活动后休眠

**解决**：
1. 点击服务唤醒它
2. 等待 30-60 秒服务启动
3. 或者考虑升级到付费计划（始终在线）

### 问题 3: CORS 错误

**原因**：后端 `FRONTEND_URL` 环境变量与前端实际 URL 不匹配

**解决**：
1. 检查后端 `FRONTEND_URL` 环境变量
2. 确保与前端 URL 完全匹配（包括 `https://`）
3. 重新部署后端服务

### 问题 4: 构建失败

**原因**：代码错误或依赖问题

**解决**：
1. 查看构建日志
2. 检查 `package.json` 中的依赖
3. 确保所有文件已提交到 GitHub

## 📝 快速修复步骤

1. ✅ 确认后端服务为 "Live" 状态
2. ✅ 确认后端 `FRONTEND_URL` = 你的前端 URL
3. ✅ 确认前端 `REACT_APP_API_URL` = 你的后端 URL + `/api`
4. ✅ **重新部署前端服务**（环境变量更改后必须重新部署）
5. ✅ 等待构建完成
6. ✅ 刷新前端页面并检查控制台

## 🆘 如果问题仍然存在

1. 检查浏览器控制台的完整错误信息
2. 检查 Network 标签页中的请求详情
3. 检查 Render 服务日志（Logs 标签页）
4. 确认所有服务 URL 都是 HTTPS（不是 HTTP）
