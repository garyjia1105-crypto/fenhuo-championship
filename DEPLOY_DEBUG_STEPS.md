# 部署调试步骤 - 修复 ERR_NETWORK

## 问题：看不到 [DEBUG] 消息

这通常意味着：
1. 代码还没有推送到 GitHub
2. Render 还没有重新构建
3. 浏览器缓存了旧版本

## 步骤 1: 检查控制台中的错误信息

即使看不到 `[DEBUG]` 消息，请告诉我：
1. Console 标签页中是否有任何**红色错误**？
2. Network 标签页中，`/players` 请求的状态是什么？
   - 是红色（失败）还是其他颜色？
   - 状态码是什么？（200, 404, CORS error, 等）

## 步骤 2: 确保代码已提交到 GitHub

在本地终端运行：

```bash
git status
```

如果显示有未提交的文件，运行：

```bash
git add .
git commit -m "Add debug logging for API connection"
git push origin main
```

## 步骤 3: 在 Render 中触发重新构建

1. 打开 Render Dashboard
2. 找到前端服务（Static Site）
3. 点击 **"Manual Deploy"** → **"Deploy latest commit"**
4. 等待构建完成（查看构建日志）

## 步骤 4: 清除浏览器缓存

构建完成后：
1. 按 `Ctrl + Shift + Delete`（Windows）或 `Cmd + Shift + Delete`（Mac）
2. 选择 "缓存的图片和文件"
3. 点击 "清除数据"
4. 或者使用硬刷新：`Ctrl + Shift + R`（Windows）或 `Cmd + Shift + R`（Mac）

## 步骤 5: 检查环境变量

在 Render Dashboard 中，前端服务的 Environment 标签页：

**必须设置**：
- `REACT_APP_API_URL` = `https://fenhuo-championship.onrender.com/api`

**重要**：环境变量更改后，必须重新部署才能生效！

## 快速检查清单

- [ ] 代码已推送到 GitHub
- [ ] Render 前端服务已重新构建
- [ ] 浏览器缓存已清除
- [ ] `REACT_APP_API_URL` 环境变量已设置
- [ ] 环境变量设置后已重新部署

## 如果仍然看不到 DEBUG 消息

请告诉我：
1. Console 中的**所有错误信息**（即使不是 DEBUG）
2. Network 标签页中 `/players` 请求的详细信息
3. 是否已执行上述所有步骤
