# Git 配置检查命令

请执行以下命令检查 Git 配置：

```powershell
# 检查代理设置
git config --global --get http.proxy
git config --global --get https.proxy

# 检查所有配置
git config --global --list
```

如果发现有代理设置，可以取消：

```powershell
# 取消 HTTP 代理
git config --global --unset http.proxy
git config --global --unset https.proxy

# 或者取消所有代理设置
git config --global --remove-section http
```
