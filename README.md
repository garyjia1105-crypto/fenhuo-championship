# 烽火冠军赛排行榜

一个用于管理烽火冠军赛排行榜的Web应用，支持选手查看排行榜和主办方管理选手数据。

## 功能特性

- **公共排行榜**：选手无需登录即可查看排行榜和倒计时
- **主办方管理**：登录后可以添加、编辑和删除选手数据
- **实时更新**：排行榜数据实时同步
- **倒计时功能**：显示比赛结束倒计时（2024年2月8日23:59 UTC）

## 技术栈

- **前端**：React, React Router, Axios
- **后端**：Node.js, Express, MongoDB (Mongoose)
- **认证**：Express Session
- **部署**：Render + GitHub

## 安装与运行

### 后端

```bash
cd backend
npm install
npm start
```

后端默认运行在 `http://localhost:5000`

### 前端

```bash
cd frontend
npm install
npm start
```

前端默认运行在 `http://localhost:3000`

## 环境变量

在 `backend/` 目录创建 `.env` 文件：

```
MONGODB_URI=mongodb://localhost:27017/fenguo-championship
SESSION_SECRET=your-secret-key-here
PORT=5000
```

## 部署

1. 将代码推送到GitHub仓库
2. 在Render创建后端Web服务，连接MongoDB数据库
3. 在Render创建前端静态站点，构建目录为 `frontend/build`
4. 配置环境变量

## 主办方凭据

- 用户名：QingXiang
- 密码：deltaforce123
