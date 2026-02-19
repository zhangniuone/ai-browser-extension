# AI Browser Extension - AI 浏览器插件

> 浏览器扩展形式的AI助手，支持网页内容分析和智能操作

## 📋 介绍

AI 浏览器插件 是一个基于 Productivity 场景的 AI 智能工具。

### ✨ 核心功能

- ✅ **网页内容摘要**
- ✅ **智能翻译**
- ✅ **内容提取**
- ✅ **快速AI交互**

## 🚀 快速开始

### 环境要求
- Python 3.11+
- OpenAI API Key


### Chrome 浏览器
1. 访问 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `dist` 目录

### Firefox 浏览器
1. 访问 `about:debugging`
2. 点击「此 Firefox」→「临时载入附加组件」
3. 选择 `manifest.json` 文件


## 📖 使用示例

```python
import requests

API_URL = "http://localhost:8000/api/process"
payload = {"input": "您的输入内容"}

response = requests.post(API_URL, json=payload)
result = response.json()
print(result)
```

## 📚 API 文档

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/` | 健康检查 |
| POST | `/api/process` | 主要处理接口 |

## 🚀 部署指南

支持 Vercel、Railway、Render、Heroku、Docker 等平台部署。

## 📁 项目结构

```
├── app.py              # 主应用入口
├── requirements.txt    # Python 依赖
├── Dockerfile          # Docker 配置
├── .gitignore         # Git 忽略配置
└── README.md          # 项目文档
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License

---

**Made with ❤️ by AI Team**
