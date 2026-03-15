# MC-Verify - Minecraft 服务器审核系统

## 功能
- 200 道题库，随机抽取 50 道
- 10 分钟答题时间
- 80% 通过率
- 通过后显示固定密码
- 像素字体 + 打字机动画

## 自定义配置
通过环境变量 `CONFIG` 设置：
```json
{
  "title": "你的标题",
  "password": "自定义密码",
  "quiz": { "count": 50, "passRate": 80, "timeLimit": 600 },
  "style": { "background": "背景图URL", "primaryColor": "#00ff88" }
}
```

## 部署
Cloudflare Workers → Create Worker → 粘贴代码 → Deploy

MIT License
