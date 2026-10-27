# CHZhang's Blog

科研笔记与论文阅读记录站：光学薄膜与光学常数反演、椭偏与光谱表征、相变材料与热辐射调控、超表面、机器学习辅助设计、CAD 生成等。
基于 **Jekyll 3.10 + GitHub Pages**（用户站 `ygrf0816.github.io`），主题为仓库内自包含实现，**不依赖外部主题 gem**（仅 MathJax 走 CDN）。

## 站点结构

| 路径 | 内容 |
|---|---|
| `/` | 首页：简介、数据统计、最新文章、研究主题 |
| `/Learning/` `/Project/` `/Reading/` | 三个原有分类（URL 保持不变） |
| `/tags/` | 16 个一级标签的标签云 + 每标签文章列表 |
| `/graph/` | 交互式知识图谱（关键词节点默认收起，点击展开文章） |
| `/search/` | 站内搜索（标题/关键词/标签/摘要/正文，支持分类、类型、标签筛选） |
| `/archive/` | 按年份归档 |
| `/about/` | 关于 |

## 本地预览

```bash
bundle install            # 首次
bundle exec jekyll serve  # http://127.0.0.1:4000
```

> 构建依赖 `github-pages` gem，与 GitHub Pages 线上构建同一套版本；
> **只能用 GitHub Pages 白名单插件**，不要引入自定义 Ruby 插件。

## 新增一篇文章

在 `_posts/` 新建 `YYYY-MM-DD-slug.md`，front matter 至少包含：

```yaml
---
layout: post
title: "[论文阅读] 标题"     # 方括号前缀在展示层会被去掉，用于生成 type 徽章
date: 2026-04-07 19:10:37 +0800
categories: Learning         # Learning / Project / Reading 之一
mathjax: true                # 含公式时打开

# —— 分类与检索用的元数据 ——
type: 论文阅读               # 论文阅读 / 专题调研 / 专题综述 / 项目研究 / 操作笔记 / 原理学习 / 技术笔记 / 课程笔记 / 读书笔记 / 随笔
tags: [光学常数反演, 光谱表征]         # 2–4 个，必须来自 _data/taxonomy.yml 的 16 个一级标签
keywords: [Swanepoel, 透射谱, 包络线]  # 3–6 个自由关键词，用于搜索与图谱
summary: "一句话摘要，30–60 字"        # 卡片与搜索结果里显示
series: nk-inversion         # 可选：系列 slug
series_order: 7              # 可选：系列内序号
---
```

图片放在 `assets/posts_figs/<目录>/`，正文里用**站点绝对路径**引用：
`![说明](/assets/posts_figs/<目录>/<文件名>.png)`。

## 目录约定

```
_data/taxonomy.yml     一级标签字典（标签页 / 卡片 / 图谱共用的唯一来源）
_data/navigation.yml   顶部导航
_includes/             组件（head、header、footer、卡片、目录、标签 chip…）
_layouts/              布局（default / home / post / page / category / tags / archive）
_sass/base.scss        设计令牌与全站样式
_sass/search.scss      搜索页样式
_sass/graph.scss       知识图谱页样式
assets/css/main.scss   样式入口（只做 @import 组装）
assets/js/theme.js     主题切换、导航、目录、阅读进度、灯箱、复制代码
assets/js/search.js    站内搜索
assets/js/graph.js     知识图谱（canvas 力导向，无第三方依赖）
assets/data/site-index.json  构建期由 Liquid 生成的检索 / 图谱索引
```

## 已知限制

- 检索索引是单个全站 JSON（约 190 KB），首次搜索时加载，之后走浏览器缓存。
- 知识图谱首屏只渲染 16 个关键词节点；点开某个关键词才展开它的文章节点。
- 搜索、图谱、目录、灯箱依赖 JavaScript；禁用 JS 时降级为静态列表。
