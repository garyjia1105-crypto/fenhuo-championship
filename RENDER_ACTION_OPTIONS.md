# Render Action 选项说明

## 当前问题
浏览器 URL 变成了 `/index.html`，说明重定向规则配置不正确。

## 解决方案

### 在 Render Dashboard 中：

1. 打开前端服务（Static Site）
2. 进入 **Settings** → **Redirects / Rewrites**
3. 检查现有的规则：
   - **Source**: 应该是什么？
   - **Destination**: 应该是什么？
   - **Action**: 当前选择的是什么？

### Action 选项说明

请告诉我 Action 下拉菜单中有哪些选项。常见选项包括：

- **Redirect** - 会改变浏览器 URL（导致 `/index.html` 问题）
- **Rewrite** - 保持原始 URL 不变（这是正确的选项）
- **Proxy** - 代理请求
- **其他选项** - 请告诉我具体是什么

### 正确的配置

如果 Action 中有 **"Rewrite"** 选项：
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: `Rewrite` ✅

如果 Action 中**没有 "Rewrite"** 选项：
1. 检查是否有 "SPA Mode" 或 "Single Page App" 选项（在 Settings 的其他地方）
2. 或者告诉我 Action 中有哪些选项，我会提供替代方案

## 临时解决方案

如果无法配置 Rewrite，我可以将应用改为使用 HashRouter（URL 会变成 `/#/admin/login`），但这不是最佳方案。

## 请告诉我

1. Action 下拉菜单中有哪些选项？
2. 当前配置的 Action 是什么？
3. 是否有 "SPA Mode" 或类似选项？
