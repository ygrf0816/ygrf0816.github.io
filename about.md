---
layout: page
title: 关于
permalink: /about/
description: 张晨晖的个人科研博客：光学薄膜与光学常数反演、椭偏与光谱表征、相变材料与热辐射调控、机器学习辅助设计。
---

## 你好，我是张晨晖

在苏州大学做光学与薄膜相关的研究。日常打交道的东西很具体：一层几十纳米的膜、一条透射谱曲线、一个反演出来总是差一点的折射率、一次镀膜后不均匀的样品。

开这个博客的起因很朴素——**记性不够用**。同一个公式推导过三遍，第三次还是要翻旧笔记；一个软件的操作步骤隔半年就忘；读完一篇论文时的判断，过两个月只剩下"好像看过"。写下来之后，这些就不用再重新想一遍，别人问起来也只需要发一个链接。

另一个原因是不想被平台绑住。CSDN 的会员机制、公众号的实名与审核，都不太适合放这种"写给自己看、顺便给别人看"的内容，于是干脆自己搭了一个。

<small>初稿 2026/01/08，苏州</small>

---

## 我在研究什么

博客里的文章基本围绕这几条线，点标签可以直接看对应内容：

- **[光学常数反演](/tags/#optical-constants-inversion)** —— 从反射/透射/椭偏数据反推薄膜的 n、k、d。包络线法、Swanepoel、Minkov、CMA-ES，以及最麻烦的那部分：多解与可辨识性。
- **[光谱表征](/tags/#spectrophotometry) / [椭偏测量](/tags/#ellipsometry)** —— 分光光度计、角度分辨反射、旋转检偏器椭偏仪的测量原理与装置配置。
- **[色散模型](/tags/#dispersion-model)** —— Tauc-Lorentz、Forouhi-Bloomer、Urbach 尾，以及各种"通用色散模型"到底能不能通用。
- **[相变材料](/tags/#phase-change-materials) / [热辐射调控](/tags/#thermal-radiation)** —— VO₂、GST 的光学性质与相变调控，发射率工程、辐射制冷、动态热辐射。
- **[超表面与超材料](/tags/#metasurface)** —— 超表面、频率选择表面、MIM 腔、滤光片结构。
- **[机器学习设计](/tags/#ml-for-design)** —— 深度学习、生成模型、PINN、LLM/VLM 在光学与器件逆向设计里的用法（以及什么时候不该用）。
- **[CAD 生成](/tags/#cad-generation)** —— 图纸到参数化 CAD 的序列生成，属于最近在跟的一条支线。

## 这个博客写什么

文章分四类，标题前的方括号就是分类标记：

| 类型 | 内容 |
|---|---|
| 论文阅读 | 单篇精读：创新点、方法、我的判断（包括"哪里可以改进"） |
| 专题调研 / 专题综述 | 一个问题的多篇文献横向对比，通常带着自己的结论 |
| 项目研究 | 自己课题里的技术方案、可行性分析、实验记录 |
| 操作笔记 / 原理学习 / 课程笔记 | 软件与设备怎么用、原理怎么推、课上讲了什么 |

**怎么找内容**：分类页适合按主题翻；[标签页](/tags/)适合按研究关键词找；[知识图谱](/graph/)适合看"哪些主题互相连着、一个主题底下压了哪些文章"；[站内搜索](/search/)适合直接搜材料名、方法名或软件名（支持空格分词）。

## 工具与环境

- 光学仿真：Ansys Lumerical（FDTD / RCWA）、LightTools
- 器件仿真：Silvaco Atlas（TCAD）
- 数据处理：Python（numpy / scipy / matplotlib）、MATLAB
- 薄膜制备与表征：电子束蒸发、分光光度计、椭偏仪
- 写代码和跑仿真主要靠 SSH + 远程工作站

## 联系

- 邮箱：[sudazhangchenhui@163.com](mailto:sudazhangchenhui@163.com)
- GitHub：[@ygrf0816](https://github.com/ygrf0816)
- 订阅：[RSS](/feed.xml)

文章里的结论多半带着个人理解，如果有写错的地方，欢迎直接指出来。

---

## 关于本站

用 Jekyll 构建，托管在 GitHub Pages，主题是仓库里自己写的一套（不依赖外部主题 gem，只用 GitHub Pages 白名单插件：`jekyll-feed`、`jekyll-seo-tag`、`jekyll-sitemap`）。公式由 MathJax 渲染，图片放在 `assets/posts_figs/` 下按文章分目录。源码在 [ygrf0816.github.io](https://github.com/ygrf0816/ygrf0816.github.io)。
