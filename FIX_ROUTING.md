# 修复 React Router 路由问题

## 问题
访问 `https://fenhuo-championship-frontend.onrender.com/admin/login` 时显示 "Not Found"

## 原因
静态站点服务器不知道如何处理 React Router 的路由，需要将所有路由重定向到 `index.html`

## 解决方案

### 方案 1：在 Render Dashboard 中配置重定向（推荐）

1. 打开 Render Dashboard
2. 找到前端服务（Static Site）：`fenguo-championship-frontend`
3. 进入 **Settings** 标签页
4. 找到 **"Redirects / Rewrites"** 或 **"Custom 404"** 部分
5. 添加重定向规则：
   - **From**: `/*`
   - **To**: `/index.html`
   - **Status**: `200` (不是 301 或 302)
6. 保存设置
7. 重新部署服务（如果需要）

### 方案 2：使用 `_redirects` 文件（如果 Render 支持）

我已经创建了 `frontend/public/_redirects` 文件，内容为：
```
/*    /index.html   200
```

这个文件会在构建时自动复制到 `frontend/build/_redirects`。

**注意**：如果 Render 不支持 `_redirects` 文件，请使用方案 1。

## 验证

配置完成后：
1. 等待重新部署完成
2. 访问 `https://fenhuo-championship-frontend.onrender.com/admin/login`
3. 应该能正常显示登录页面

## 如果仍然不工作

1. 检查 Render Dashboard 中的构建日志，确认 `_redirects` 文件是否被复制
2. 尝试在 Render Dashboard 中手动配置重定向规则（方案 1）
3. 清除浏览器缓存后重试
