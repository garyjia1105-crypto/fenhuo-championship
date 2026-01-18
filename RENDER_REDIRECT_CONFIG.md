# Render 重定向规则正确配置

## 问题
访问 `/admin/login` 时，路由变成了 `/index.html`，然后被重定向到 `/`

## 解决方案

### 在 Render Dashboard 中配置：

1. 打开前端服务（Static Site）
2. 进入 **Settings** 标签页
3. 找到 **"Redirects / Rewrites"** 部分
4. **删除现有的 Redirect 规则**（如果有）
5. **添加新的 Rewrite 规则**（不是 Redirect！）：
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite` ⚠️ **必须是 Rewrite，不是 Redirect！**

### 关键区别

- **Redirect**：会改变浏览器的 URL（这就是为什么你看到 `/index.html`）
- **Rewrite**：保持原始 URL 不变，只返回 `/index.html` 的内容（这是 SPA 需要的）

### 如果只有 Redirect 选项

如果 Render 只提供 Redirect 选项，没有 Rewrite：

1. 检查是否有 "SPA Mode" 或 "Single Page App" 选项
2. 如果有，启用它
3. 如果没有，尝试：
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Redirect`（但可能需要特殊的状态码）

### 验证

配置正确后：
1. 保存设置
2. 重新部署服务（如果需要）
3. 访问 `https://fenhuo-championship-frontend.onrender.com/admin/login`
4. URL 应该保持为 `/admin/login`（不会变成 `/index.html`）
5. 应该显示登录页面
