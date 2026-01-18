# 修复 Render 重定向规则配置

## 问题
访问 `/admin/login` 时，路由变成了 `/index.html`，然后被重定向到 `/`

## 原因
Render 的重定向规则配置不正确。重定向规则应该**保持原始 URL 不变**，只返回 `index.html` 的内容。

## 解决方案

### 在 Render Dashboard 中修复重定向规则

1. 打开 Render Dashboard
2. 找到前端服务（Static Site）：`fenguo-championship-frontend`
3. 进入 **Settings** 标签页
4. 找到 **"Redirects / Rewrites"** 部分
5. **删除或修改现有的重定向规则**
6. 添加新的重定向规则：
   - **From**: `/*`
   - **To**: `/index.html`
   - **Status Code**: `200` ⚠️ **必须是 200，不是 301 或 302！**
7. 保存设置
8. 重新部署服务（如果需要）

### 关键点

- **Status Code 必须是 200**：这样浏览器会加载 `index.html` 的内容，但 URL 保持为原始路径（如 `/admin/login`）
- **不要使用 301 或 302**：这些状态码会导致浏览器实际跳转到 `/index.html`，URL 会改变

### 验证

配置正确后：
1. 访问 `https://fenhuo-championship-frontend.onrender.com/admin/login`
2. URL 应该保持为 `/admin/login`（不会变成 `/index.html`）
3. 应该显示登录页面

## 如果 Render 不支持 200 状态码的重定向

有些静态站点服务不支持 200 状态码的重定向。在这种情况下：

1. 检查 Render 是否有 "SPA Mode" 或 "Single Page App" 选项
2. 启用该选项（这会自动处理所有路由）
3. 或者联系 Render 支持，询问如何配置 SPA 路由
