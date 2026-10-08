---
layout: post
title: "[专题调研] 渐进镜（Progressive Addition Lens）研究综述"
date: 2026-06-01 11:32:28 +0800
categories: Project
mathjax: true
---

# [专题调研] 渐进镜（Progressive Addition Lens）研究综述

> 调研日期：2026-05-31

---

## 目录

1. [渐进镜设计方法](#一渐进镜设计方法)
2. [佩戴不适症状及影响因素](#二佩戴不适症状及影响因素)
3. [视觉眩晕耐受与飞行员选拔的类比](#三视觉眩晕耐受与飞行员选拔的类比分析)
4. [机器学习在渐进镜设计与推荐中的应用](#四机器学习在渐进镜设计与推荐中的应用)
5. [参考文献汇总](#参考文献汇总)

---

## 一、渐进镜设计方法

### 1.1 设计问题概述

渐进多焦点镜片（Progressive Addition Lens, PAL）的核心设计挑战在于：在同一个自由曲面上实现从远用光区到近用光区（add power）的连续光度过渡，同时最小化周边散光（unwanted peripheral astigmatism）和像畸变（distortion）。这本质上是一个**非线性偏微分方程（PDE）约束下的自由曲面优化问题**。

### 1.2 经典设计方法

#### 1.2.1 直接法（Direct Method）

直接法以 Winthrop 工作为代表，直接求解描述镜面曲率分布的变分问题。核心思路是：将 PAL 表面建模为满足特定边界条件（远用区、近用区指定屈光度）的**最小化Dirichlet积分曲面**，得到一个椭圆型 PDE。

- **数学模型**：镜面矢高 $z(x,y)$ 满足：
  $$ \frac{\partial^2 z}{\partial x^2} + \frac{\partial^2 z}{\partial y^2} = f(x,y) $$
  其中 $f(x,y)$ 由目标平均球面度（mean power）分布确定。

- **优点**：数学优雅，自动保证曲面连续性。
- **缺点**：对像散分布的控制能力有限，难以实现局部精细化调控。

#### 1.2.2 间接法（Indirect Method）

间接法通过叠加基函数或分段曲面构造再整体平滑化来构建 PAL 表面。包括：
- 宏曲面与微曲面的叠加（superposition of base surface and correction）
- 双曲正切函数（tanh）控制通道渐变
- 多光学轴系统（multi-optical-axis）
- 八阶多项式像散推离（8th-order polynomial astigmatism push-off）

**软设计 vs 硬设计**：这是两类经典的折中策略——

| 特性 | 软设计（Soft Design） | 硬设计（Hard Design） |
|------|---------------------|---------------------|
| 像散分布 | 平缓渐变，大面积低度像散 | 集中压缩至小面积，周边区域清晰 |
| 清晰远用区 | 较窄 | 较宽 |
| 通道宽度 | 较宽，过渡自然 | 较窄 |
| 适应难度 | 较低，适合首戴者 | 较高 |
| 泳动感 | 较弱 | 较强 |

### 1.3 现代自由曲面优化方法

#### 1.3.1 局域精度优化（Localized Precision Optimization）

Yin 等人（2025, *Optics Express*）提出了一种**定制化自由曲面 PAL 设计方法**，其核心创新在于：
- 对镜面不同功能区域分别设置不同的优化权重和目标
- 在远用区、近用区和中间通道分别施加局域精度约束
- 采用直接法初算 + 局部精修的两阶段策略
- 实验验证表明，该方法在保持通道宽度的同时显著降低了周边畸变

#### 1.3.2 权重分布重合度优化

Xiang 等人（2024, *Frontiers in Physics*）提出基于**权重分布重合度**（Coincident Degree of Weight Distributions）的优化方法：
- 将光焦度偏差（power deviation）和像散（astigmatism）各自建立权重分布函数
- 通过最大化两个分布函数的重合度来确定最优的折中参数
- 有效避免了传统单目标优化中"一优一劣"的困境

#### 1.3.3 分段自由曲面（Segmented Freeform Surface, SFS）

将 PAL 表面划分为多个子区域，各自独立设计后再进行光滑拼接。优势在于可以针对不同区域实现差异化的像散管理策略。

#### 1.3.4 NURBS 可微优化

利用 NURBS（非均匀有理B样条）参数化镜面，并借助自动微分（automatic differentiation）直接优化曲面控制点。这使得像差梯度可以被精确计算并用于梯度下降优化。

### 1.4 光学性能量化指标

Leung 等人（2021, *Scientific Reports*, 香港理工大学）提出了四类定量评价指标：

| 指标 | 定义 | 物理意义 |
|------|------|---------|
| **ΔM** | $\Delta M = M_{actual} - M_{target}$ | 球面离焦偏差：远/中/近距离分别计算 |
| **ΔJα** | 柱镜度大小偏差 | 基本像散误差度量（忽略轴向） |
| **ΔJv** | $\Delta J_v = \sqrt{\Delta J_0^2 + \Delta J_{45}^2}$ | 矢量柱镜误差（考虑轴向），临床相关性更强 |
| **ΔL** | $\Delta L = \sqrt{\Delta M^2 + \Delta J_0^2 + \Delta J_{45}^2}$ | 综合模糊度量，解释 >90% 视觉锐度方差 |

关键发现：
- ΔJv 比 ΔJα 更有临床意义：当柱镜轴不同时，ΔJα 会错误地返回相同值
- ×90° 散光处方在近用区表现最差
- 制造商选择对散光患者更为关键（处方×制造商交互效应显著）

---

## 二、佩戴不适症状及影响因素

### 2.1 主要不适症状

渐进镜佩戴不适主要包括三大类：

| 症状类别 | 临床表现 | 生理机制 |
|---------|---------|---------|
| **头晕/眩晕** | 头部运动时感到天旋地转、失去平衡感 | 视觉-前庭信息冲突（visual-vestibular mismatch） |
| **泳动感（Swim Effect）** | 移动头部时物体看起来在"漂浮"或扭曲运动 | 周边区域的光学畸变产生的异常光流（optic flow） |
| **周边视物变形/模糊** | 镜片边缘区域图像扭曲、拉伸或模糊 | 周边像散导致的局部非均匀放大率 |

### 2.2 不适的客观量化

Lubos 等人（2024, *Scientific Reports*）首次提出了基于**VR 心理物理实验**的 PAL 畸变感知客观测量方法：

- **方法**：在 XTAL VR 头显中渲染精确的 PAL 光学畸变，受试者进行三选二比较判别（Triplet Paradigm），采用 Soft Ordinal Embedding (SOE) 将序数数据转换为 1D 心理物理量尺
- **关键发现**：
  - 人眼对镜片畸变的感知是**一维的**（尽管光学畸变是多维的），可以被映射为单一的感知量表
  - 感知畸变随球面度呈**指数增长**（正向+球面度比负向增长更快）
  - 近视患者（负 Sph）：增加 add power 反而**降低**感知畸变
  - 远视患者（正 Sph）：增加 add power 使畸变加剧
  - 动态/静态观察策略不影响最终的感知量尺（游泳感与静态畸变共享同一底层机制）

### 2.3 适应不良的影响因素（基于 Alvarez et al. 2017, *Scientific Reports*）

该研究系统考察了 PAL 适应能力的预测因子，发现约 **10-30% 的新佩戴者无法适应**。

#### 2.3.1 客观生理因素

| 因素 | 影响方向 | 机制 |
|------|---------|------|
| **辐辏（Vergence）功能** | 辐辏功能好 → 适应好 | 辐辏异常是最强预测因子，辐辏峰值速度降低直接关联适应失败 |
| **隐斜（Phoria）** | 隐斜大 → 适应难 | 静息状态下眼位偏差越大，PAL 的双眼视差容忍度越低 |
| **AC/A 比率** | 异常 → 适应难 | 调节性辐辏与调节的耦合异常导致视觉系统无法协调远近切换 |
| **Add 度数** | 度数高 → 畸变大 | 更高的加光意味着更大的曲面梯度，产生更强的周边像散 |
| **年龄** | 年龄大 → 适应更难 | 神经可塑性下降，动眼系统的灵活性随着年龄增长而降低 |

#### 2.3.2 主观/心理因素

| 因素 | 说明 |
|------|------|
| **先前的眼镜佩戴经验** | 初次佩戴者适应难度更高，有 PAL 佩戴史者适应更快 |
| **人格特质（焦虑/神经质）** | 高焦虑水平者对视觉异常的感知更为敏感，容易放大不适体验 |
| **视觉依赖度（Visual Dependence）** | 高度依赖视觉信息进行空间定位者，对光学畸变的干扰更为敏感 |
| **运动病易感性（Motion Sickness Susceptibility）** | 易晕车/晕船者在使用 PAL 时更容易产生头晕和泳动感 |

#### 2.3.3 镜片设计因素

- **硬 vs 软设计**：硬设计像散集中但清晰区大，适合有经验的佩戴者；软设计过渡平缓但牺牲清晰区面积
- **通道宽度**：窄通道使眼球扫视时更容易进入畸变区
- **像散压缩比**：像散被压缩至的面积越小，单位面积的像散梯度越大，泳动感越强
- **镜框参数匹配**：镜片铺设高度、前倾角、镜面角的测量误差会显著影响光学中心对准

### 2.4 神经网络模拟预测 PAL 视觉性能

Leube 等人（2021, arXiv:2103.10842）提出了一种基于 **CNN（两层隐藏层）** 的 PAL 视觉性能预测框架：

- **任务**：CNN 被训练识别 Landolt C 环开口方向
- **光学输入**：±1.5D 范围内的离焦 + 低阶/高阶像差
- **验证**：39 只真实眼睛的临床 VA 测量 vs 模拟 VA
- **一致性**：系统偏置 +0.20 logMAR ± 0.035，Bland-Altman 一致限 -0.08 至 +0.07 logMAR（与临床重测信度相当）
- **应用**：定量比较了硬设计和软设计 PAL 在远、中、近各区的视觉锐度分布，发现**硬设计在远用区确实更宽**，但中近距离两种设计无显著差异

---

## 三、视觉眩晕耐受与飞行员选拔的类比分析

### 3.1 核心类比论点

用户提出的类比特具洞察力：**渐进镜引起的视觉不适（头晕、泳动感）与飞行员所面临的"空间定向障碍（Spatial Disorientation, SD）"在底层神经机制上高度同源——两者都源于视觉信息与前庭/本体感觉信息的冲突**。

### 3.2 感觉冲突理论（Sensory Conflict Theory）

无论是 PAL 泳动还是飞行晕动症，其生理根源均为：
- **视觉通道**传达了运动信息（PAL 周边畸变的异常光流 / 飞行中看到的虚假地平线）
- **前庭通道**未检测到对应的真实身体运动
- **中枢神经系统**收到矛盾的信号，触发了包括恶心、眩晕、失去平衡等自卫性自主神经反应

这是一种**跨场景的通用机制**：PAL 佩戴、VR 晕动症（VIMS）、晕船/晕车、飞行员 SD 都可以在这一理论框架下统一理解。

### 3.3 运动病易感性评估工具

#### MSSQ（Motion Sickness Susceptibility Questionnaire）

由 Reason & Brand 最初开发，Golding（1998）修订，是目前最广泛使用的运动病易感性标准化量表：

- **内容**：评价个体在儿童期和成年期在各种交通工具（汽车、巴士、火车、飞机、小船、游乐设施等）中经历恶心的频率和程度
- **计分方式**：儿童部分（12岁前）+ 成人部分的加权总分
- **信度**：MSSQ-Short 中文版的 Cronbach's α = 0.877（MDPI 2026 研究验证）
- **在飞行员选拔中的应用**：中国空军航空医学研究广泛使用 MSSQ 作为初筛工具评估飞行学员的运动病易感性（参考文献：航空医学杂志，2024–2025 多篇研究）

#### VVAS（Visual Vertigo Analogue Scale）

专门评估**视觉诱发性眩晕（Visual Vertigo）** 的量表：
- 评估 9 种典型视觉运动场景下的眩晕程度（如：乘坐自动扶梯、走过超市货架走廊、观看流动的河水等）
- 采用 0-10 视觉模拟标度
- 已有中文版信效度验证（2024 年发表）

#### VIMS 个体差异研究

近期研究发现，以下因素与视觉诱发运动病的易感性显著相关：

| 因素 | 研究证据 |
|------|---------|
| **场依赖性（Field Dependence）** | 场依赖型个体（参照外部视觉框架判断方向）比场独立型个体更易发生 VIMS |
| **性别** | 女性 VIMS 发生率显著高于男性（效应量中等） |
| **年龄** | 青年（20-25岁）比中老年人更易感 |
| **脑功能连接** | 易感个体的默认模式网络与前庭皮层间的静息态功能连接存在差异（fMRI 证据） |

### 3.4 双眼视功能与运动病易感性的直接关联

MDPI *J. Clin. Med.* 2026 年发表的一项研究（n=54）首次系统考察了双眼视功能与运动病易感性之间的关联：

**ST（Sick Tendency）组 vs Normal 组的显著差异：**

| 测量指标 | ST 组表现 | 效应量（Cohen's d） |
|---------|----------|-------------------|
| 远距负融合辐辏恢复（NFV recovery） | ↑ 更差 | 0.52 |
| 远距垂直融合辐辏断裂/恢复（VFV break & recovery） | ↑ 更差 | 0.50 / 0.52 |
| 近距正融合辐辏断裂（PFV break） | ↑ 更差 | 0.47 |
| 调节近点（NPA） | 后退（更差） | 0.57 |
| 立体视锐度（Stereopsis） | 更差 | 0.47 |
| 身体平衡（COP椭圆面积） | 稳定性更差 | 0.40 |

该研究的**分层因果模型**揭示了从基础动眼功能到高级空间定位能力的级联关系：
```
调节 & 辐辏 → 双眼融合 → 立体视 → 空间定位 → 身体平衡
```

**关键启示**：这一级联模型的任何环节受损都会增加运动病（包括 PAL 引起的视觉眩晕）的易感性。这为"PAL 适应前预筛查"提供了坚实的生理基础。

### 3.5 飞行员选拔与 PAL 适应的异同

| 维度 | 飞行员 SD 筛选 | PAL 适应力预测 |
|------|--------------|---------------|
| **核心机制** | 视觉-前庭冲突 | 视觉-前庭冲突（同源） |
| **评估工具** | MSSQ、前庭功能测试、旋转椅、倾斜台 | （尚未标准化）潜在可用 MSSQ + VVAS |
| **关键生理指标** | 前庭眼动反射（VOR）增益、半规管敏感性 | 辐辏功能、隐斜、AC/A 比、立体视锐度 |
| **主观评估** | 自我报告运动病史、飞行模拟器暴露 | 运动病史 + VR PAL 模拟暴露 |
| **干预方向** | 前庭适应性训练、去敏感化训练 | 视觉治疗（VT）—扩大融合范围、调节训练 |
| **不可改变因素** | 神经可塑性差异、遗传易感性 | 年龄、人格特质、视觉依赖度 |

### 3.6 操作化建议

如果要在临床实践中预测 PAL 适应力，可借鉴飞行员医学选拔的多维评估框架：

1. **初筛问卷**：MSSQ（运动病史）+ VVAS（视觉眩晕）+ 人格量表（焦虑维度）
2. **客观测量**：隐斜（Howell 卡）、辐辏范围（聚散破裂/恢复点）、AC/A 比率、调节幅度、立体视锐度
3. **模拟暴露**：VR PAL 畸变模拟任务（参考 Lubos 2024 的 Triplet Paradigm）
4. **决策模型**：将上述多维特征输入 ML 分类器（如 logistic regression / random forest / XGBoost），输出适应力概率评分

---

## 四、机器学习在渐进镜设计与推荐中的应用

### 4.1 现状总览

ML/DL 在光学镜片设计中的应用仍处于**早期探索阶段**，但已有多个方向显示出显著潜力。以下是系统性梳理：

### 4.2 设计辅助：PINN 解 PAL 表面 PDE

**核心论文**：*Designing Progressive Lenses Using Physics-Informed Neural Network*（中国期刊，researching.cn）

- **方法**：使用 PINN（Physics-Informed Neural Network）替代传统数值方法（FDM/FEM）求解控制 PAL 表面形状的非线性 PDE
- **优势**：
  - 无需网格划分，可处理任意复杂边界条件
  - 训练完成后可**实时计算**任意镜面点处的矢高和局部曲率
  - 可直接将优化目标嵌入物理约束，实现端到端设计
- **PINN 损失函数结构**：
  $$ \mathcal{L} = \mathcal{L}_{\text{PDE}} + \mathcal{L}_{\text{BC}} + \mathcal{L}_{\text{data}} $$
  其中 $\mathcal{L}_{\text{PDE}}$ 是偏微分方程残差，$\mathcal{L}_{\text{BC}}$ 是边界条件约束（远用区/近用区屈光度），$\mathcal{L}_{\text{data}}$ 是实测数据约束

**未来方向**：将 PINN 与参数化优化结合，直接在 PINN 框架内搜索最优的光度分布参数。

### 4.3 设计辅助：DL 自动生成光学设计起点

Yow 等人（2024, *Artificial Intelligence Review*）的系统综述总结了 DL 在**光学镜片起始点设计（Starting-Point Design, SPD）** 中的应用：

| 方法 | 代表工作 | 特点 |
|------|---------|------|
| **监督学习 DNN** | Côté et al. (2019–2022) | 输入规格参数（焦距、FOV、F/#）→ 输出镜面曲率/厚度/材料；混合监督+无监督训练 |
| **RNN 序列推断** | Côté et al. (2019b) | 利用 RNN 顺序推断多镜片系统参数；迁移学习提升泛化能力 |
| **无监督 DNN** | Nie et al. (2023) | 20 层堆叠 DNN 生成非球面目镜设计；2625 个训练样本；96.5% 设计满足 RMS 点斑 < 50μm |
| **强化学习** | Yang et al. (2020) | 无需参考设计数据库，RL agent 通过光线追迹奖励信号自主学习 |

**局限性**：
- 依赖大量高质量设计数据库（PAL 领域尤为稀缺）
- 输出去多样性受限于训练数据
- 缺乏公开的标准化评测基准

### 4.4 视觉性能预测：CNN 模拟人眼 PAL 视觉体验

Leube 等人（2021, arXiv:2103.10842）的工作已在第 2.4 节详述。这里补充其**个性化推荐潜力**：

- 如果将该 CNN 框架扩展，输入**个体化的眼像差数据**（从波前传感器获取），可预测该特定人眼通过不同 PAL 设计看到的视觉质量
- 进而可以在**配镜前**虚拟试戴多种 PAL 设计，选择预测 VA 最好的方案
- 这本质上是一种**基于物理模拟 + 神经网络的镜片推荐系统**

### 4.5 个性化推荐：可行的 ML 框架建议

基于上述文献调研，以下是一个完整的、技术上可行的 ML 驱动 PAL 推荐流水线方案：

```
┌──────────────────────────────────────────────────────────────────┐
│                     ML-driven PAL Recommendation Pipeline         │
├───────────────┬──────────────────┬────────────────┬──────────────┤
│  1.数据采集    │  2.特征工程       │  3.预测模型     │  4.输出决策   │
├───────────────┼──────────────────┼────────────────┼──────────────┤
│ · 验光处方     │ · 球镜度(Sph)    │  多任务学习:     │ · 推荐镜片类型 │
│   (Sph/Cyl/Ax)│ · 柱镜度(Cyl)    │                 │   (硬/软设计)  │
│ · Add 度数    │ · 散光轴(Ax)     │  Task A:        │ · 预测适应周期 │
│ · 双眼视功能  │ · Add 值         │  适应力分类    │ · 视觉治疗建议 │
│   (辐辏/隐斜/ │ · 辐辏断裂/恢复  │  (适应/不适应)  │ · 不适风险预警 │
│    AC/A等)    │ · 隐斜量          │                 │               │
│ · MSSQ 评分   │ · AC/A 比率      │  Task B:        │               │
│ · VVAS 评分   │ · 立体视锐度      │  最佳设计回归  │               │
│ · 年龄/性别   │ · 调节幅度        │  (设计参数空间) │               │
│ · 佩戴史      │ · MSSQ total      │                 │               │
│               │ · VVAS score      │  Task C:        │               │
│               │ · 年龄/性别/经验  │  不适风险评分  │               │
│               │                  │  (regression)   │               │
├───────────────┴──────────────────┴────────────────┴──────────────┤
│  模型选择：XGBoost (表格特征，可解释) / 小样本场景                  │
│           TabNet / FT-Transformer (大样本，自动特征交互)           │
│           Bayesian Neural Network (不确定性量化，风险评估)         │
└──────────────────────────────────────────────────────────────────┘
```

### 4.6 各模块详细说明

#### 模块 1：数据采集

| 数据项 | 获取方式 | 临床难度 |
|--------|---------|---------|
| 验光处方 | 电脑验光 + 主觉验光 | 极低（常规） |
| 隐斜 | Howell 隐斜卡 / Maddox 杆 | 低（常规） |
| 辐辏范围（破裂/恢复） | 综合验光仪（phoropter） | 低 |
| AC/A 比率 | ±1.00D 梯度法 | 低–中 |
| 立体视锐度 | Frisby / Randot 立体测试 | 低 |
| 调节幅度 | RAF 尺 / 负镜片法 | 低 |
| MSSQ / VVAS | 自填问卷（10 min） | 低 |
| 波前像差（可选） | Hartmann-Shack 波前传感器 | 中（有设备要求） |

#### 模块 2：特征工程

关键特征组：
- **光学组**：Sph, Cyl, Ax（转换为 J0/J45 功率矢量）, Add
- **双眼视组**：PFV/NFV/VFV 断裂与恢复值（12 个参数）, 远近隐斜, AC/A, 立体视
- **主观组**：MSSQ 总分/分项分, VVAS 分项分
- **人口学组**：年龄、性别、先前的 PAL 佩戴经验

潜在的**交互特征**：Sph × 立体视（近视患者畸变感知更低）、Add × 辐辏（高 Add + 低辐辏 = 极高风险）

#### 模块 3：模型选择

| 场景 | 推荐模型 | 理由 |
|------|---------|------|
| 小样本（n < 500） | XGBoost / LightGBM | 对表格数据表现优异，可解释性强（SHAP feature importance） |
| 大样本（n > 5000） | TabNet / FT-Transformer | 自动学习特征交互，无需手动设计交叉项 |
| 需要不确定性估计 | Bayesian Neural Network / Gaussian Process | 输出预测置信区间，帮助临床医生做出"暂缓配镜"等风险控制决策 |
| 需要规则解释 | Logistic Regression (L1正则) | 系数可直接解释为风险因子的 odds ratio（Alvarez 2017 即用此方法） |

#### 模块 4：输出决策

- **Adaptability Score**（0–1 连续值）：预测患者成功适应 PAL 的概率
- **Risk Stratification**（三级）：低风险（直接配镜）、中风险（建议软设计 + 随访）、高风险（建议先进行视觉治疗再配镜）
- **Design Recommendation**：基于回归模型输出最优的软硬设计比、通道宽度、像散压缩比等设计参数

### 4.7 生成式 AI 的远期潜力

随着扩散模型、神经辐射场（NeRF）和 3D 生成式模型的发展，未来可能出现：

- **给定患者参数 → 直接生成最优 PAL 自由曲面**：将设计问题转化为 conditional generation，以光学性能指标为引导（classifier guidance）
- **扩散模型 + 光线追迹评分**：DiffMeta（Cell Rep. Phys. Sci. 2026，超材料中的应用）的同类型思路可迁移至 PAL 设计
- **RL-based 自由曲面探索**：强化学习 agent 在无参考数据库的情况下，通过光线追迹奖励信号自主发现新型 PAL 设计范式

### 4.8 当前研究空白

| 空白领域 | 说明 |
|---------|------|
| **PAL 适应预测模型** | 尚无公开发表的 ML 模型预测 PAL 适应力（概念验证阶段） |
| **ML + PAL 设计联合优化** | PINN 和 DL 用于镜头设计的工作多为通用光学设计，专门针对 PAL 的工作极少 |
| **跨模态数据融合** | 双眼视功能 + 人格/运动病数据 + 光学处方 + 佩戴行为数据的多模态融合尚未被探索 |
| **大规模 PAL 佩戴数据集** | 缺乏公开的 PAL 佩戴者标注数据（处方+设计参数+适应结局），制约了监督学习的发展 |
| **个性化仿真验证** | 尚未在临床中部署 CNN 模拟人眼 PAL 视觉以辅助镜片选择的流程 |

---

## 参考文献汇总

### 渐进镜设计

1. **Yin Z, Wang L, Zhang X, et al.** Design of customized freeform progressive addition lens based on localized precision optimization. *Optics Express*, 2025, 33(11).
2. **Xiang H, Ma L, Zhang X, et al.** Research on the design of progressive addition multifocal defocused freeform lenses. *Frontiers in Physics*, 2024, 12: 1481543.
3. **Various authors.** Optimization Design of Progressive Corridor of Freeform PALs. *Optics and Precision Engineering*, 2025(6).
4. [A systematic review of PAL design 2015–2025.] *Discover Electro-Optics*, 2026. DOI: 10.1007/s44402-026-00056-w.

### 光学性能量化

5. **Leung TW, et al.** Optical performance of progressive addition lenses with astigmatic prescription. *Scientific Reports*, 2021, 11: 2984. DOI: 10.1038/s41598-021-82697-0.

### PAL 适应与不适

6. **Alvarez TL, Kim EH, Granger-Donetti B.** Adaptation to Progressive Additive Lenses: Potential Factors to Consider. *Scientific Reports*, 2017, 7: 2529. DOI: 10.1038/s41598-017-02851-5.
7. **Lubos P, et al.** An objective measurement approach to quantify the perceived distortion of spectacle lenses. *Scientific Reports*, 2024, 14: 3943. DOI: 10.1038/s41598-024-54368-3.

### ML 预测 PAL 性能

8. **Leube A, et al.** Prediction of progressive lens performance from neural network simulations. *arXiv:2103.10842*, 2021.
9. **Designing Progressive Lenses Using Physics-Informed Neural Network.** [中国光学期刊网], 2024.
10. **Yow AP, Wong D, Zhang Y, et al.** Artificial intelligence in optical lens design. *Artificial Intelligence Review*, 2024, 57: 193. DOI: 10.1007/s10462-024-10842-y.

### 运动病与视觉功能

11. **Golding JF.** Motion sickness susceptibility questionnaire revised and its relationship to other forms of sickness. *Brain Research Bulletin*, 1998, 47(5): 507-516.
12. [双眼视功能与运动病易感性.] *Journal of Clinical Medicine*, 2026, 15(4): 1529. (PMC12942577)
13. [运动病易感性评价方法的研究进展.] *航空医学杂志*, 2025(2).
14. **Visual Vertigo Analogue Scale (VVAS).** *Journal of Vestibular Research*, 2011, 21(3): 153-159.
15. **Yardley L, et al.** Individual-difference factors in visually induced motion sickness. *Perception*, 2025. DOI: 10.1177/09574271251388971.

### 飞行空间定向与视觉前庭

16. [Development and validation of spatial disorientation scenarios.] *Applied Ergonomics*, 2025.
17. **FAA.** Pilot's Handbook of Aeronautical Knowledge, Chapter 16: Aeromedical Factors.
18. **CFI Notebook.** Spatial Disorientation & Illusions in Flight.

---

> **总结**：渐进镜设计正在从经验驱动转向计算驱动，PINN、CNN 和自由曲面优化方法正在重塑设计范式。在"谁适合佩戴渐进镜"这一问题上，双眼视功能、运动病易感性和视觉依赖度是三大关键个体差异维度——这与飞行员空间定向能力评估共享底层神经机制。将多维患者特征输入 ML 分类/回归模型，实现个性化适应力预测和镜片推荐，是一个技术上完全可行且临床价值显著的方向，但当前仍处于概念验证阶段，亟需大规模标注数据和跨学科验证研究。

---

## 五、渐进镜智能设计方法专题调研

> **核心问题**：能否将机器学习、深度学习、符号回归和优化算法等方法引入渐进镜的自由曲面设计过程，实现快速、智能、自动的镜面参数求解？本章从"设计一个曲面使其光学响应与目标特性一致"这一核心问题出发，系统梳理现有工作和潜在技术路径。

### 5.1 问题形式化

PAL 曲面设计可以抽象为以下**逆问题**：

- **前向模型**：$\mathcal{F}: \mathbf{p} \mapsto \mathbf{y}$，其中 $\mathbf{p}$ 是镜面参数（曲率分布、NURBS控制点、多项式系数等），$\mathbf{y}$ 是光学响应（光焦度分布、像散分布、畸变图等）
- **逆问题**：给定目标光学响应 $\mathbf{y}^*$，求解 $\mathbf{p}^* = \mathcal{F}^{-1}(\mathbf{y}^*)$
- **核心困难**：(1) $\mathcal{F}$ 通常是隐式的（需光线追迹），(2) 映射是非线性和病态的（一对多），(3) 参数空间是高维的，(4) 评估成本高昂（每次完整光线追迹需要数秒至数分钟）

### 5.2 已应用于 PAL/眼镜镜片设计的 ML/DL 方法

#### 5.2.1 可微光线追迹 + NURBS 参数化（最直接相关）

**Pan et al., OE 2025** — *Differentiable design of progressive-addition lens using NURBS surface*
DOI: 10.1364/OE.551518

这是目前唯一一篇**直接面向 PAL 的深度学习辅助设计论文**。

- **方法核心**：
  - 用 NURBS 曲面参数化 PAL 表面（控制点坐标 $P_{ij}$、权重 $w_{ij}$ 和节点向量作为可微参数）
  - 初始估值由改进的**变分差分法**（modified variational-difference numerical method）提供
  - 构建整个光线追迹链（镜面 → 折射 → 离焦/像散计算）为**全可微计算图**
  - 使用自动微分（automatic differentiation, AD）计算 merit function 对 NURBS 控制点的梯度
  - 迭代梯度下降更新控制点直至收敛

- **Merit function**：非线性误差函数，无需局部近似（直接处理原始像散/光焦度偏差），避免了传统方法中用二次型逼近带来的精度损失

- **关键结果**：两个设计实例中，中间过渡区附近的高像散区域被成功**推挤至镜片边缘**，验证了可微方法在 PAL 设计中的有效性

- **技术意义**：将 PAL 设计从"求解 PDE + 试错优化"的双阶段流程统一为**端到端的梯度下降优化**，这是根本性的范式转变

#### 5.2.2 同系列扩展工作

**Pan et al., AO 2025** — *Spectacle lens design with double aspheric surfaces using differentiable ray tracing*

- 将 DRT 应用于双非球面眼镜片设计（−12 D 至 +6 D 全覆盖）
- 与传统方法（SA/PSO/GA）的**定量对比**是本系列工作中最重要的基准测试：

| 方法 | 最大OAE(D) | 最大MOE(D) | 最大畸变(%) | 边厚(mm) | 耗时(min) | 总评价函数 |
|------|-----------|-----------|------------|---------|----------|-----------|
| **DRT** | 0.611 | 0.341 | 13.82 | **12.94** | **2.83** | **1.072** |
| SA | 0.892 | **0.236** | 13.91 | 14.45 | 2.97 | 1.128 |
| PSO | 0.607 | 0.488 | 14.04 | 14.26 | 27.23 | 1.113 |
| GA | 0.883 | 0.289 | **13.39** | 13.25 | 24.32 | 1.138 |

- **核心发现**：DRT 取得了最优的综合评价函数（1.072），且耗时仅为 PSO/GA 的 ~1/10

**Pan et al., OL 2026** — *Differentiable ray tracing optimization of freeform spectacle lens for astigmatism correction*

- 将 DRT 进一步推广至自由曲面（非旋转对称），专门面向散光矫正的单光镜设计
- 突破了传统球柱面镜无法解决眼球运动中光轴偏移的限制

#### 5.2.3 PINN 解 PAL 曲面偏微分方程

**论文** — *Designing Progressive Lenses Using Physics-Informed Neural Network*（中国光学期刊网, 2024）

- **基本思路**：将 PAL 设计的 PDE 约束（即控制镜面矢高分布的 Possion 型方程）嵌入神经网络的损失函数
- **损失函数结构**：
  $$ \mathcal{L}_{\text{PINN}} = \mathcal{L}_{\text{PDE}} + \mathcal{L}_{\text{BC}} + \mathcal{L}_{\text{Data}} $$
  - $\mathcal{L}_{\text{PDE}}$：PDE 残差项，保证曲面满足物理方程
  - $\mathcal{L}_{\text{BC}}$：边界条件约束（远用区光焦度 = 处方球镜；近用区 = 球镜 + Add）
  - $\mathcal{L}_{\text{Data}}$：可选实测数据约束
- **优势**：无需网格划分（mesh-free），可处理任意复杂边界条件；训练完成后可实时计算任意点的矢高和局部曲率
- **与 DRT 方法的区别**：PINN 直接求解 PDE（物理先验驱动），DRT 通过光线追迹优化（光学响应驱动）。两者在 PAL 设计中互补——PINN 适合初始曲面生成，DRT 适合精细优化

#### 5.2.4 CNN 模拟人眼 PAL 视觉体验

**Leube et al., arXiv:2103.10842（2021）** 

- 两层 CNN 预测人眼通过 PAL 不同区域观察 Landolt C 环的视觉锐度
- 在硬/软设计对比中识别出**PAL 中间区域存在水平向高 VA 带**，这是在纯几何光学分析中被忽略的现象
- 详见第四节 Section 4.4

### 5.3 来自通用光学设计的可迁移方法

以下方法虽非专门针对 PAL，但其方法论可直接迁移至 PAL 曲面设计。

#### 5.3.1 Glow 可逆神经网络（INN）逆设计

**Luo & Lee, SciRep 2023** — *Inverse design of optical lenses enabled by generative flow networks*  
DOI: 10.1038/s41598-023-43698-3

| 要素 | 实现 |
|------|------|
| **架构** | Glow（基于Normalizing Flow的可逆神经网络），多个耦合块 + 随机置换 |
| **核心创新** | 引入隐变量 $Z$（标准高斯分布）补偿"性能低维 → 结构高维"的信息丢失 |
| **训练** | 双向交替训练（前向预测 + 逆向重建）；损失 = $\lambda_y \text{MSE}_y + \lambda_z \text{MMD}_z + \lambda_x \text{MMD}_x$ |
| **速度** | 推理 < 200 ms（传统优化需数十分钟至数小时） |
| **精度** | MAPE：2.63–10.73%（不同性能指标） |

**对 PAL 设计的启示**：如果训练 "NURBS控制点 ↔ 像散/光焦度分布" 的 INN 映射，可实现**亚秒级**的 PAL 逆设计——输入目标光学响应，直接输出镜面控制点。

#### 5.3.2 可微光线追迹通用框架

**DiffOptics (dO)** — KAUST, Wang Chen & Heidrich, *IEEE TCI 2022*

- 纯 PyTorch 实现的可微光线追迹引擎
- 关键技术创新：
  - **智能求根**：在无梯度模式下找到交点，再重新激活 AD（→ 6倍内存节省）
  - **伴随反向传播**：近似梯度检查点，支持百万级光线
- 已验证应用：自由曲面焦散设计、球差优化、Nikon 镜头优化、EDoF（扩展景深）波前编码
- 与 Zemax 一致性验证通过

**Gradient descent-based freeform optics design** — de Koning et al., arXiv:2302.12031

- 利用算法的可微性计算**非序列光线追迹**的梯度（可处理多次反射/折射）
- MLP 作为镜面形状参数化器（而非直接优化表面点坐标）
- 设计结果经 LightTools 验证

**DiffRayFlow** — MDPI Photonics, 2025

- 组合离散最优传输（OT）+ 端到端 DRT + 可微求解器
- 面向自由曲面照明设计

#### 5.3.3 Lens-Descriptor 引导进化算法（多模态全局搜索）

**arxiv:2601.22075（2026）** — *Lens-descriptor guided evolutionary algorithm*

- **核心思路**：不追求单一最优解，而是系统性地发现大量**可行替代方案**
- **Lens Descriptor** = 曲率符号模式（curvature-sign pattern）+ 材料指数，将设计空间划分为 636 个行为描述符
- **两阶段搜索**：(1) 概率模型分配计算资源 → (2) Hill-Valley EA + 协方差自适应 → 梯度精细精修
- **测试**：24 变量、6 片式 Double-Gauss 镜头：
  - 生成 ~14,500 个候选极小值，跨越 636 个描述符（比 CMA-ES 高一个数量级）
  - 最佳设计与精调参考设计处于同一性能级别
  - 全程控制在 1 小时量级

**对 PAL 设计的启示**：PAL 设计中存在大量局部极小值（"硬设计"与"软设计"是其中之一），进化算法的多模态能力非常适合**系统性地探索 PAL 设计空间**，帮助设计师发现"非直觉"的新型通道/像散分布方案。

#### 5.3.4 符号回归（Symbolic Regression）

目前尚无符号回归直接应用于光学镜面设计的已发表工作，但这是一个有前景的方向：

| 潜在应用 | 说明 |
|---------|------|
| **发现 PAL 最优像散分布函数** | 用 PySR 从大量 PAL 设计中回归出最优像散分布的闭式解析表达式 |
| **发现 merit function 加权的最优组合规则** | 自动找到球面偏差、像散、畸变等各项加权系数与处方参数间的函数关系 |
| **替代 FDM 求解 PDE** | 符号回归发现的解析解可替代数值方法计算镜面矢高，大幅加速设计迭代 |

推荐工具：**PySR**（基于 Julia 后端的高性能符号回归，支持进化算法 + 复杂度 Pareto 前沿搜索）

#### 5.3.5 强化学习（RL）

| 工作 | 应用场景 | 方法 | 特点 |
|------|---------|------|------|
| **Yang et al. (2020)** | 自由曲面成像系统 | RL agent + 光线追迹奖励 | 无需参考数据库，自主探索 |
| **Fu et al. (2021–2022)** | 基础镜片参数优化 | RL 自学习 | 可迁移至 PAL |
| **Yow et al. (2024)** 综述 | 预测 RL 为"最有前景的未来方向" | — | 突破了 DL 对训练数据的依赖 |

**对 PAL 设计的启示**：RL 尤其适合"无标注数据集"场景——PAL 领域恰好缺乏大规模标注设计数据，RL agent 可以通过与光线追迹环境的交互自主学习 PAL 设计策略。关键挑战在于奖励函数的设计（如何将像散分布、通道宽度、边缘厚度等多目标折中编码为标量奖励信号）。

#### 5.3.6 贝叶斯优化（Bayesian Optimization）

| 优势 | PAL 设计中体现 |
|------|-------------|
| **样本效率高** | 每次完整光线追迹 + 光学评估成本高，BO 可用远少于 GA/PSO 的评估次数找到满意解 |
| **不确定性建模** | 可量化设计空间的未探索区域，引导搜索最不确定的有潜力区域 |
| **多保真度** | 可用低精度代理模型（快速粗评）引导高精度光线追迹（精评），进一步降低总评估成本 |

SVD + BO + ML 的联合框架（arxiv:2411.05496 中提及）代表了光学设计的"少样本高效优化"方向，但在 PAL 中尚属空白。

### 5.4 PAL 智能设计方法汇总对比

| 方法 | 技术核心 | 优势 | 局限 | PAL 成熟度 | 代表性工作 |
|------|---------|------|------|-----------|-----------|
| **DRT + NURBS** | 可微光线追迹 + 梯度下降 | 端到端优化、速度快、不依赖启发式 | 需初始估值、可能陷入局部极小 | ★★★☆☆ 概念验证 | Pan OE 2025 |
| **PINN** | 物理约束嵌入 NN 损失函数 | 无网格、解析连续解 | 训练不稳定、精度有限 | ★★★☆☆ 概念验证 | researching.cn 2024 |
| **INN 逆设计** | Normalizing Flow 可逆映射 | 亚秒级推理、处理一对多映射 | 需训练数据、精度受数据限制 | ★★☆☆☆ 邻域可迁移 | Luo SciRep 2023 |
| **进化算法（EA）** | 种群搜索 + 自然选择 | 全局优化、发现大量替代方案 | 评估次数多、速度慢 | ★★☆☆☆ 镜片设计已应用 | arxiv:2601.22075 |
| **强化学习（RL）** | Agent + 环境交互 + 策略梯度 | 无需标注数据、自主探索 | 奖励函数设计困难 | ★☆☆☆☆ 间接相关 | Yang 2020 |
| **贝叶斯优化（BO）** | 高斯过程代理 + 采集函数 | 样本效率极高 | 高维空间下代理建模困难 | ★☆☆☆☆ 光学领域有应用 | arxiv:2411.05496 |
| **符号回归（SR）** | 进化算法发现解析表达式 | 可解释性强、可发现新公式 | 表达能力有限 | ☆☆☆☆☆ 尚无 | — |

### 5.5 推荐的 PAL 智能设计全流水线

将上述方法组合，可构建以下**多层智能 PAL 设计流水线**：

```
                     ┌──────────────────┐
                     │   1. PINN 初始解   │  ← 给定处方(Sph/Add)，快速生成符合 PDE
                     │   (mesh-free PDE   │    约束的初始 NURBS 控制点
                     │    solver)         │
                     └────────┬─────────┘
                              ↓
                     ┌──────────────────┐
                     │   2. DRT 梯度优化  │  ← 以 PINN 初解为起点，利用自动微分
                     │   (NURBS + AD)    │    直接优化像散/光焦度/畸变 merit
                     └────────┬─────────┘
                              ↓
                     ┌──────────────────┐
                     │   3. EA 多模态搜索 │  ← 从梯度最优解出发，用进化算法探索
                     │   (Descriptor-    │    设计空间中的其他有潜力区域
                     │    guided)        │
                     └────────┬─────────┘
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
   ┌──────────────────────┐      ┌──────────────────────┐
   │  4a. INN 快速逆设计   │      │  4b. BO 精细调优      │
   │  (给定目标光学响应 →  │      │  (不确定性引导的      │
   │   近实时输出镜面参数)  │      │   高精度局部搜索)     │
   └──────────────────────┘      └──────────────────────┘
              ↓                               ↓
                     ┌──────────────────┐
                     │  5. SR 表达式提炼  │  ← 从大量优化结果中回归最优像散
                     │  (PySR 解释性      │    分布/通道宽度的解析规律
                     │   规律发现)         │
                     └──────────────────┘
```

### 5.6 关键挑战与研究空白

| 挑战 | 当前状态 | 潜在突破口 |
|------|---------|-----------|
| **缺乏公开 PAL 设计数据集** | 所有 DL 方法都需要大量训练数据 | 用 Zemax/LightTools 自动生成合成数据集？或与镜片厂商合作获取脱敏设计数据 |
| **DRT 对非序列光线的处理** | 目前 PAL 光线追迹多为序列模式 | DiffOptics 和 de Koning 2023 提供了可行路径 |
| **多点评估成本** | 每次评估需计算整面像散/光焦度图（数千采样点） | PINN 替代光线追迹作代理模型（surrogate model） |
| **制造约束嵌入** | 现有方法未考虑加工可行性 | 在 merit function 中添加曲率连续性、梯度约束等惩罚项 |
| **个性化优化目标** | 通用 merit function 无法体现个体差异 | 结合第四章的 ML 推荐系统 → 设计目标因人而异 |

### 5.7 新增参考文献

19. **Pan X, Tang H, Feng Z, Xiang H.** Differentiable design of progressive-addition lens using NURBS surface. *Optics Express*, 2025, 33(5): 10485–10497. DOI: 10.1364/OE.551518.
20. **Pan X, Tang H, Feng Z, Xiang H.** Spectacle lens design with double aspheric surfaces using differentiable ray tracing. *Applied Optics*, 2025, 64(26): 7611–7617. DOI: 10.1364/AO.569087.
21. **Pan X, Tang H, Feng Z, Xiang H.** Differentiable ray tracing optimization of freeform spectacle lens for astigmatism correction. *Optics Letters*, 2026, 51(2): 265–268.
22. **Luo M, Lee S-S.** Inverse design of optical lenses enabled by generative flow networks. *Scientific Reports*, 2023, 13: 16416. DOI: 10.1038/s41598-023-43698-3.
23. **Wang C, Chen N, Heidrich W.** dO: A differentiable engine for deep lens design of computational imaging systems. *IEEE Transactions on Computational Imaging*, 2022.
24. **de Koning B, Heemels A, Adam A, Möller M.** Gradient descent-based freeform optics design using algorithmic differentiable non-sequential ray tracing. *arXiv:2302.12031*, 2023.
25. [Lens-descriptor guided evolutionary algorithm for optical lens design.] *arXiv:2601.22075*, 2026.
26. **Yang et al.** Designing freeform imaging systems based on reinforcement learning. *Optics Express*, 2020, 28(20): 30309–30323.
27. **Cranmer M, et al.** Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. *arXiv:2305.01582*, 2023.
28. **DiffRayFlow** — A differentiable freeform optical design framework. *Photonics*, 2025, 12(12): 1243.
