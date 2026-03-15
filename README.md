# 🎮 MC-Verify - Minecraft 服务器审核系统

一个基于 Cloudflare Workers 的 Minecraft 服务器入服审核系统，通过答题验证玩家对 Minecraft 的了解程度和服务器规则理解。

## ✨ 功能特点

- **智能题库系统**
  - 100 道基础选择题（中等难度）
  - 100 道规则理解与情景测试题
  - 1 道承诺题（不计分，自由发挥）
  - 随机抽题，每次答题体验不同

- **答题配置**
  - 基础题：20 道
  - 规则题：10 道
  - 承诺题：1 道
  - 时间限制：15 分钟
  - 通过率：70%（21/30 题正确）

- **用户信息收集**
  - 联系方式（QQ/微信/邮箱）
  - 游戏名（游戏ID）

- **结算界面**
  - 显示联系方式和游戏名
  - 显示正确率、通过率、答题时间、结束时间
  - 显示承诺题答案
  - 通过后显示固定密码

- **视觉效果**
  - 像素字体（Press Start 2P）
  - 标题淡入淡出动画
  - 响应式设计，支持移动端

## 🚀 部署方式

### Cloudflare Workers 部署

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Workers & Pages → Create Worker
3. 复制 `worker.js` 全部内容
4. 粘贴并点击 Deploy
5. 访问分配的 Workers URL

### 自定义配置

在 Cloudflare Workers 环境变量中设置 `CONFIG`：

```json
{
  "titles": ["标题1", "标题2", "标题3"],
  "password": "审核通过",
  "quiz": {
    "basicCount": 20,
    "ruleCount": 10,
    "passRate": 70,
    "timeLimit": 900
  },
  "style": {
    "background": "背景图片URL",
    "primaryColor": "#00ff88"
  }
}
```

## 📁 项目结构

```
mc-verify/
├── worker.js          # 主程序文件（包含所有代码）
├── questions.json     # 题库备份文件
├── wrangler.toml      # Wrangler 配置
├── README.md          # 项目说明
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions 自动部署
```

## 🛠️ 技术栈

- **前端**：HTML + CSS + JavaScript
- **后端**：Cloudflare Workers (Serverless)
- **字体**：Press Start 2P (Google Fonts)
- **部署**：Cloudflare Workers + GitHub Actions

## 📝 题库说明

### 基础选择题（100道）
涵盖 Minecraft 游戏机制的各个方面：
- 矿石分布与挖掘
- 生物特性与掉落物
- 合成配方与用途
- 红石机制
- 维度与结构
- 附魔与药水
- 等等...

### 规则理解题（100道）
测试玩家对服务器规则的理解：
- 物品归属与交易
- 漏洞报告与利用
- 玩家互动礼仪
- 公共设施使用
- 违规行为处理
- 等等...

### 承诺题（1道）
玩家自由发挥，写下对服务器的承诺，不计入评分。

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ for Minecraft Server
