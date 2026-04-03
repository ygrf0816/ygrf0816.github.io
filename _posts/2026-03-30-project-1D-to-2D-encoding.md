---
layout: post
title: "[项目研究] 序列数据升维技术调研——格拉姆角场（GASF/GADF）及其同类方法"
date: 2026-03-30 15:36:00 +0800
categories: Project
mathjax: true
---

# 时间序列数据升维技术研究笔记
## 格拉姆角场（GASF/GADF）及其同类方法

> **备注**：本笔记系统整理了将一维时间序列编码为二维图像的核心技术，重点介绍格拉姆角场方法，兼顾其他主流升维手段，并附高水平期刊应用案例及可逆性分析。
>
> **关键词**：GASF · GADF · 马尔可夫转移场 · 递归图 · 时频变换 · 1D→2D · 深度学习 · 时间序列

---

## 目录

1. [为什么要"升维"？](#1-为什么要升维)
2. [格拉姆角场（GAF）：GASF 与 GADF](#2-格拉姆角场gaf-gasf-与-gadf)
   - 2.1 直观理解
   - 2.2 数学原理
   - 2.3 完整计算流程
3. [可逆性分析：能从图像还原时间序列吗？](#3-可逆性分析能从图像还原时间序列吗)
4. [其他主流数据升维方法](#4-其他主流数据升维方法)
   - 4.1 马尔可夫转移场（MTF）
   - 4.2 递归图（Recurrence Plot, RP）
   - 4.3 短时傅里叶变换（STFT）/ 语谱图
   - 4.4 连续小波变换（CWT）/ 小波时频图
   - 4.5 TimesNet 周期重塑法
   - 4.6 对称点模式（SDP）
5. [方法横向对比](#5-方法横向对比)
6. [高水平期刊应用案例](#6-高水平期刊应用案例)
7. [代码速查：Python 实现](#7-代码速查python-实现)
8. [总结与选型建议](#8-总结与选型建议)

---

## 1. 为什么要"升维"？

### 1.1 问题背景

在机器学习领域，**图像识别技术（CNN）已经发展得相当成熟**——ResNet、EfficientNet、Vision Transformer 等架构在图像分类上能达到接近人类的水平。然而，大量现实数据是**一维时间序列**：心电图、振动信号、股价、地震波……

传统做法是用1D-CNN或RNN处理这些信号，但这样就"放弃"了图像领域几十年积累的强大预训练模型。

**核心动机**：如果我们能把时间序列"画"成一张图，就能直接套用图像识别领域的全部工具。

### 1.2 升维的本质

```
原始时间序列（长度 N）:
  [x₁, x₂, x₃, ..., xₙ]   ──→   N×N 的二维矩阵（图像）

每个像素点 (i, j) 编码了时刻 i 与时刻 j 之间某种关系
```

不同的升维方法，本质区别在于：**"时刻 i 与时刻 j 之间的关系"如何定义**。

---

## 2. 格拉姆角场（GAF）：GASF 与 GADF

> **原始论文**：Wang, Z., & Oates, T. (2015). *Imaging Time-Series to Improve Classification and Imputation.* IJCAI 2015. arXiv:1506.00327

### 2.1 直观理解

**一个类比**：想象你有一段旋律，每个音符有一个音高值。GAF 的做法是：
1. 把每个音符的"高低"转换为一个**角度**（把数值映射到单位圆上）
2. 对于任意两个时刻 i 和 j，计算它们对应角度的**和**或**差**
3. 把所有时刻对的计算结果排成一张矩阵——这就是 GASF（角度和）或 GADF（角度差）

这张矩阵的对角线（i = j）记录了每个时刻自身的信息，而非对角线元素（i ≠ j）记录了不同时刻之间的"相互关系"——这正是 CNN 最擅长捕捉的结构化模式！

![image-20260330143652141](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330143652141.png)

### 2.2 数学原理

#### 第一步：归一化

将时间序列 $X = \{x_1, x_2, \ldots, x_N\}$ 归一化到 $[-1, 1]$：

$$\tilde{x}_i = \frac{(x_i - \max(X)) + (x_i - \min(X))}{\max(X) - \min(X)}$$

> ⚠️ 也可归一化到 $[0, 1]$，区别见第3节可逆性分析。

归一化后，每个值 $\tilde{x}_i \in [-1, 1]$，正好是某个角度的余弦值。

#### 第二步：极坐标编码

将数值映射为**极坐标中的角度**：

$$\phi_i = \arccos(\tilde{x}_i), \quad \phi_i \in [0°, 180°]$$

$$r_i = \frac{t_i}{N} \quad \text{（时间戳归一化为半径，表达时序信息）}$$

**几何意义**：每个数据点成为单位圆上的一个点，时间轴变成了"绕圆弧旋转的方向"，数值大小变成了"离圆心的角度偏转"。

```
              cos(φ) = x̃
              φ = arccos(x̃)

 [-1]        [0]        [+1]
  φ=180°    φ=90°      φ=0°
  ●          ●          ●    ← 单位圆上的对应位置
```

#### 第三步A：构造 GASF（角度求和场）

$$\text{GASF}_{ij} = \cos(\phi_i + \phi_j)$$

利用三角恒等式 $\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$，展开为：

$$\boxed{\text{GASF}_{ij} = \tilde{x}_i \tilde{x}_j - \sqrt{1-\tilde{x}_i^2}\cdot\sqrt{1-\tilde{x}_j^2}}$$

**物理含义**：GASF 矩阵编码了时刻 i 和时刻 j 对应角度之"叠加"后的余弦投影，是一种**内积型**的相关性度量。

#### 第三步B：构造 GADF（角度差分场）

$$\text{GADF}_{ij} = \sin(\phi_i - \phi_j)$$

展开为：

$$\boxed{\text{GADF}_{ij} = \sqrt{1-\tilde{x}_i^2}\cdot\tilde{x}_j - \tilde{x}_i\cdot\sqrt{1-\tilde{x}_j^2}}$$

**物理含义**：GADF 矩阵编码了两时刻角度之"差"的正弦值，更突出相对变化，是一种**反对称型**度量（GADF 主对角线恒为 0，因为 $\sin(0) = 0$）。

### 2.3 完整计算流程

```
原始序列 X = [0.2, 0.8, 0.5, -0.3, 0.9]
         ↓  归一化至[-1,1]
X̃ = [0.2, 0.8, 0.5, -0.3, 0.9]（已在范围内）
         ↓  arccos 编码
Φ = [arccos(0.2), arccos(0.8), arccos(0.5), arccos(-0.3), arccos(0.9)]
  = [78.5°, 36.9°, 60°, 107.5°, 25.8°]
         ↓  构造矩阵
GASF[i,j] = cos(Φ[i] + Φ[j])    →  5×5 矩阵
GADF[i,j] = sin(Φ[i] - Φ[j])    →  5×5 矩阵（反对称）
```

#### GASF 矩阵的对称性

GASF 是**对称矩阵**（因为 $\cos(\alpha+\beta) = \cos(\beta+\alpha)$），图像看起来关于主对角线镜像对称。

GADF 是**反对称矩阵**（$\sin(\alpha-\beta) = -\sin(\beta-\alpha)$），主对角线为零，上下三角互为相反数。

#### 图像可视化特征

| 特征 | GASF | GADF |
|------|------|------|
| 对称性 | 中心对称（关于主对角线） | 反对称（上三角 = -下三角） |
| 主对角线 | $\cos(2\phi_i)$，编码原始值 | 恒为 0 |
| 像素范围 | $[-1, 1]$ | $[-1, 1]$ |
| 视觉特点 | 暖色块对应相似时段 | 高频变化更突出 |

---

## 3. 可逆性分析：能从图像还原时间序列吗？

通过GASF和GADF变换，我们可以将1维的数据升维，变为高维度矩阵，使其可以兼容一系列的二维深度学习模型或者图像处理方法。

那么这个变换是否可逆，毕竟我们很多时候需要的，其实是那个一维数据结果而不是变换后的矩阵。如果这样的话，这就代表其适用于生成式模型等等自由度更高的模型，这对于建模、优化设计等领域都是非常有用的。

**答案是：GASF 在特定条件下是可逆的，但有约束。**

### 3.1 GASF 的双射性（Bijection）

GASF的原始论文中明确提到：

> *"Inspired by the bijection property of GASF on 0/1 scaled data..."*

当时间序列**归一化到 $[0, 1]$**（而非 $[-1, 1]$）时，$\phi_i = \arccos(\tilde{x}_i) \in [0°, 90°]$，GASF 是双射（一一对应）的，即**可以无损还原**。

### 3.2 逆变换方法

#### 从主对角线恢复

GASF 的主对角线元素满足：

$$\text{GASF}_{ii} = \cos(\phi_i + \phi_i) = \cos(2\phi_i) = 2\cos^2(\phi_i) - 1 = 2\tilde{x}_i^2 - 1$$

因此：

$$\tilde{x}_i = \sqrt{\frac{\text{GASF}_{ii} + 1}{2}}$$

**逆变换步骤**：
1. 取 GASF 矩阵的主对角线 $d_i = \text{GASF}_{ii}$
2. 计算 $\tilde{x}_i = \sqrt{(d_i + 1) / 2}$
3. 反归一化：$x_i = \tilde{x}_i \cdot (\max - \min) + \min$

```python
import numpy as np

def gasf_inverse(gasf_matrix, x_min, x_max):
    """从 GASF 矩阵的主对角线恢复时间序列"""
    diag = np.diag(gasf_matrix)          # 取主对角线
    x_normalized = np.sqrt((diag + 1) / 2)  # 逆变换
    x_original = x_normalized * (x_max - x_min) + x_min  # 反归一化
    return x_original
```

### 3.3 可逆性的限制条件

| 条件 | 是否可逆 | 说明 |
|------|----------|------|
| 归一化到 $[0,1]$，主对角线可见 | ✅ 完全可逆 | $\phi \in [0°, 90°]$，arccos 单调，无歧义 |
| 归一化到 $[-1,1]$ | ⚠️ 部分可逆 | $\phi \in [0°, 180°]$，$\sqrt{}$ 会丢失符号 |
| 图像压缩/量化（如保存为 JPEG） | ❌ 有损 | 像素值失真，无法精确恢复 |
| 降分辨率（N×N → n×n，n < N） | ❌ 有损 | 信息丢失 |

#### 归一化到 [-1,1] 时的符号问题

当归一化到 $[-1,1]$ 时，$\phi \in [0°, 180°]$，且：

$$\text{GASF}_{ii} = \cos(2\phi_i) = 2\tilde{x}_i^2 - 1$$

由于 $\tilde{x}_i^2$ 无法区分 $+\tilde{x}_i$ 和 $-\tilde{x}_i$，存在**符号歧义**。此时需要借助 GADF 来辅助恢复符号信息：

$$\text{GADF}_{i, i+1} = \sin(\phi_i - \phi_{i+1})$$

通过 GADF 的差分信息，可以推断相邻时刻的增减关系，从而恢复符号。

### 3.4 GADF 的可逆性

GADF 主对角线恒为 0，因此**无法单独从 GADF 恢复原始序列**。但 GADF 与 GASF 联合使用时，信息是互补的。

### 3.5 实际应用中的逆变换价值

逆变换主要用于：
1. **信号插补（Imputation）**：用 Denoising Autoencoder 在图像域填补缺失段，再还原为曲线
2. **数据增强验证**：检查变换是否保真
3. **生成模型**：在 GAF 图像空间训练 GAN/VAE，生成新的时间序列

---

## 4. 其他主流数据升维方法

### 4.1 马尔可夫转移场（Markov Transition Field, MTF）

> 同样来自 Wang & Oates (2015) 原始论文。

#### 核心思想

![image-20260330143748645](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330143748645.png)

如上图，这里考虑一个时间序列，把时间序列看作一个**马尔可夫过程**：即设置几个不同的数值参考，将时间序列离散化为 Q 个分位数区间（量化区间），例如上图设置了三根虚线，将整张图纵向分割成了四段。

然后统计从区间 i 跳转到区间 j 的概率，形成转移矩阵。

例如从上至下的区间分别记作A,B,C,D，根据时间序列处于哪个区间，给时间序列数据标记为A,B,C,D四个状态。那么从左上角的A状态，下一秒有0.944的概率变为状态A，以及0.056的概率变为状态B，以此类推，产生对应的状态转移矩阵

再按数据点的时间顺序展开为二维图。

这里如果还是不理解什么叫马尔科夫过程，这里强烈推荐观看真理元素的这期节目:"这个数学模型（几乎）能预测宇宙万物" https://www.bilibili.com/video/BV1Aj8DzzE42/?spm_id_from=333.337.search-card.all.click&amp;vd_source=8b6ffc174a6c5a4993bab3a38f1b70f7	

很好的讲了马尔科夫链，核弹与蒙特卡洛算法

#### 构造步骤

1. **量化**：将序列 $X$ 分入 $Q$ 个分位数区间（bins）
2. **计算转移频率矩阵** $W$：$W_{ij}$ = 样本落入区间 $q_i$ 后下一步落入 $q_j$ 的频率
3. **展开为时间-概率场**：
$$\text{MTF}_{ij} = W_{q_i q_j}$$
其中 $q_i$ 是时刻 $i$ 所在的区间编号

#### 与 GASF 的对比

- MTF 关注**状态转移动力学**（类似统计力学中的转移矩阵）
- GASF 关注**角度相关性**（几何关系）
- MTF 更适合捕捉**周期性和状态机**特征；GASF 更适合捕捉**幅值相关性**

#### 可逆性

MTF **不可逆**。量化过程会丢失精确数值信息，无法从 MTF 还原原始序列。

---

### 4.2 递归图（Recurrence Plot, RP）

> 来自非线性动力学领域：Eckmann, J.-P. et al. (1987). *Recurrence Plots of Dynamical Systems.* Europhysics Letters.

![image-20260330150106488](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330150106488.png)

#### 核心思想

判断时刻 $i$ 的状态是否"回到了"时刻 $j$ 的邻域：

$$\text{RP}_{ij} = \Theta(\varepsilon - \|x_i - x_j\|)$$

其中 $\Theta$ 是 Heaviside 阶跃函数，$\varepsilon$ 是阈值半径。

**通俗理解**：如果 $x_i \approx x_j$，则 $(i,j)$ 像素点为白色（1）；否则为黑色（0）——得到一张黑白图。

#### 视觉特征含义

| 视觉模式 | 含义 |
|---------|------|
| 主对角线（恒为白） | 序列与自身完全匹配 |
| 平行于主对角线的线段 | 周期性或准周期振荡 |
| 矩形白色块 | 层流/静止区段 |
| 孤立白点 | 随机/混沌状态 |

#### 可逆性

RP **不可逆**（信息丢失严重，仅保留"是否相似"的二值信息）。



*递归图相关研究里面用的比较少，图也比较难看懂，不如上述GAF以及马尔科夫变换简单直观好用。

[这个文章]: https://www.sciencedirect.com/science/article/pii/S0370157306004066	"Recurrence plots for the analysis of complex systems"

详细介绍了递归图，93页的理论推导，看了下有点看不懂，以防万一先备份在这里。

---

### 4.3 短时傅里叶变换（STFT）/ 语谱图（Spectrogram）

<img src="/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/b1631579e7a9879db33c2e274a3b2377.png" alt="img" style="zoom: 67%;" />

#### 核心思想

用滑动窗口对时间序列做傅里叶变换：

$$\text{STFT}(t, f) = \int_{-\infty}^{\infty} x(\tau) \cdot w(\tau - t) \cdot e^{-j2\pi f\tau} d\tau$$

其中 $w(\tau)$ 是窗函数（如 Hamming、Hann 窗）。结果是一个**时间-频率**矩阵，取模得到语谱图。

#### 特点

- 横轴：**时间**，纵轴：**频率**，颜色：**能量强度**
- 时间分辨率与频率分辨率之间存在 **Heisenberg 不确定原理** 的权衡（窗越宽，频率分辨率越高，时间分辨率越低）

#### 可逆性

STFT **原则上完全可逆**（可用 Griffin-Lim 算法或直接逆变换从复数 STFT 还原），但如果只保存语谱图（丢失相位信息），则只能近似恢复。



*语谱图也是老资历了，和MFCC（梅尔倒频谱系数）一起，在语音、音频信号处理里的特征表征很常用，简单来说就是将原始一维时域信号用STFT变换，取频域的幅度为纵轴，绘制在时域的时间横坐标上。

---

### 4.4 连续小波变换（CWT）/ 小波时频图（Scalogram）

![img](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/v2-3b3f87c4ef6c1aa78ba4ec51de61cbdf_1440w.jpg)

#### 核心思想

用一系列**尺度变化**的母小波 $\psi$ 与信号做卷积：

$$W(a, b) = \frac{1}{\sqrt{a}} \int x(t) \cdot \psi^*\left(\frac{t-b}{a}\right) dt$$

其中 $a$ 是尺度（与频率成反比），$b$ 是平移（时间位置）。取模平方得到 Scalogram（能量-时频图）。

#### 与 STFT 的区别

| | STFT | CWT |
|--|------|-----|
| 时频分辨率 | 固定窗口，均匀分辨率 | 多尺度，高频高时间分辨率，低频高频率分辨率 |
| 适用场景 | 平稳信号 | 非平稳、瞬态特征 |
| 逆变换 | 容易 | 存在，但计算复杂 |

#### 可逆性

CWT **原则上可逆**（存在解析的逆小波变换公式），但需要保留完整复数系数，实际应用中若只存幅度图则信息有损。



*这里同上STFT，只是换成了小波变换而已，思路是完全一样的

---

### 4.5 TimesNet 周期重塑法（2D Reshape）

> Wu, H. et al. (2023). *TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis.* **ICLR 2023**.

![image-20260330151121372](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330151121372.png)

![image-20260330151235122](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330151235122.png)

<img src="/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/image-20260330151838323.png" alt="image-20260330151838323" style="zoom:67%;" />

#### 核心思想

这是一种**非基于相似性矩阵**的升维方式，直接利用时间序列的**内在周期性**：

1. 用 FFT 找出主要周期 $p_1, p_2, \ldots$
2. 将长度 $T$ 的序列**重塑**为 $\lceil T/p \rceil \times p$ 的二维矩阵
3. 行方向 = 周期内变化（intraperiod），列方向 = 跨周期变化（interperiod）
4. 用 2D CNN（如 Inception）处理这个矩阵

#### 特点

- **自适应**：根据数据自动确定重塑形状
- **无冗余**：矩阵大小约等于原序列长度（不像 GASF 是 N×N）
- **可逆**：重塑操作天然可逆（reshape 回原始长度即可）



*这个东西乍一看很复杂，其实原理很好理解。首先先对原始信号进行FFT，其中找幅度高的主要几个频率。而FFT的物理含义就是将原始信号拆解成多个频率不同的正弦信号，那么每个频率就对应原始信号中的一段周期性信息。

*上面的Figure2讲的清楚一点。然后找出不同频率的对应原始信号（直接反变换），然后reshape成元素一致的矩阵（8x2, 4x4, 1x16...）。用一个预训练好的二维CNN作为特征提取器，将其降维变换成图像

---

### 4.6 对称点模式（Symmetric Dot Pattern, SDP）

![对称点模式(symmetric dot pattern, SDP)-matlab版复现_故障诊断](/assets/posts_figs/2026-03-30-project-1D-to-2D-encoding/20125219_649130838846d22794.png)

#### 核心思想

将时间序列映射到极坐标平面，以**角度编码时间、半径编码幅值**，形成视觉上呈对称花样的散点图：

$$r_i = |x_i|, \quad \theta_i = \frac{2\pi t_i}{N}$$

将各点及其关于某轴的镜像点同时绘制，得到对称图案。

#### 特点

- 视觉直观，周期性特征形成规则几何图案
- 适用于振动信号和音频分析
- 不可逆（镜像操作丢失符号信息）

---

## 5. 方法横向对比

| 方法 | 核心度量 | 矩阵大小 | 主要优势 | 主要缺陷 | 可逆性 |
|------|---------|---------|---------|---------|-------|
| **GASF** | 角度余弦和 | N×N | 保留时序关联性，对角线可还原 | 高维冗余（N×N vs N） | ✅ 有条件可逆 |
| **GADF** | 角度正弦差 | N×N | 突出动态变化，反对称特性 | 主对角线无信息 | ❌ 单独不可逆 |
| **MTF** | 马尔可夫转移概率 | N×N | 捕捉动力学状态转移 | 需量化，分辨率受限 | ❌ |
| **RP** | 相空间距离阈值 | N×N | 揭示非线性动力学、混沌 | 阈值敏感，二值化损失 | ❌ |
| **STFT 谱图** | 时频能量 | T×F | 频域可解释，成熟工具 | 时频分辨率权衡 | ⚠️ 需保留相位 |
| **CWT 小波图** | 多尺度时频能量 | S×T | 多分辨率，适合瞬态信号 | 计算量大 | ⚠️ 需保留相位 |
| **TimesNet Reshape** | 周期重塑 | ≈√T×√T | 高效，无冗余，可逆 | 依赖周期性假设 | ✅ 完全可逆 |
| **SDP** | 极坐标散点 | 自定义 | 视觉直观，周期识别好 | 定量信息弱 | ❌ |

> **选型提示**：
> - 工程故障诊断 → **GASF + GADF** 组合（利用 ImageNet 预训练 CNN）
> - 生物医学信号 → **CWT 小波图**（时频分辨率灵活）或 **GASF**
> - 非线性/混沌分析 → **RP**（递归图）
> - 时间序列预测/补全 → **TimesNet Reshape** 或 **GASF**（可逆）
> - 语音/振声分析 → **STFT 语谱图**（成熟工具链）

---

## 6. 高水平期刊应用案例

### 案例一：Nature Scientific Reports — 变压器故障诊断

**文献**：*Transformer fault diagnosis method based on Gramian Angular Field and optimized neural network.* **Scientific Reports (Nature 旗下)**, 2025.

**问题**：变压器的溶解气体分析（DGA）数据是多元时间序列，传统方法难以综合利用多维特征。

**方法**：
1. 将变压器 DGA 多元时间序列分别转换为 GASF 图像（每个气体指标一张图）
2. 使用多通道 CNN 提取图像特征
3. 引入优化算法（贝叶斯优化）自动调整网络超参数

**结果**：在多个标准变压器故障数据集上，诊断准确率超过 98%，优于传统 SVM 和标准 CNN。

**意义**：证明了 GAF 在工业设备健康管理领域的实用价值。

---

### 案例二：IEEE Transactions on Industrial Electronics — 电机轴承故障诊断

**文献**：*A New Method for Diagnosing Motor Bearing Faults Based on Gramian Angular Field Image Coding and Improved CNN-ELM.* **IEEE Transactions on Industrial Electronics**, 2023. DOI: 10.1109/TIE.2023.

**问题**：电机轴承振动信号包含复杂非平稳特征，一维信号特征提取困难，卷积网络难以直接建模时序相关性。

**方法**：
1. 振动加速度信号 → GASF 图像（利用角度相关性保留时序结构）
2. 构建改进 CNN（多尺度卷积核） + ELM（极限学习机）的混合分类器
3. GASF 图像作为输入，故障类型（正常/内圈损伤/外圈损伤/滚珠损伤）为输出

**结果**：在 CWRU 轴承数据集上达到 **99.4%** 分类准确率，收敛速度比纯 CNN 快 3 倍。

**意义**：GASF 成功将轴承振动信号的时序相关性转化为图像纹理，使预训练 CNN 直接迁移成为可能。

---

### 案例三：Engineering in Agriculture / Remote Sensing — 卫星遥感作物分类

**文献**：*Combining 2D encoding and convolutional neural network to enhance land use and land cover mapping from satellite image time series.* **Engineering Applications of Artificial Intelligence (Elsevier)**, 2023.

**问题**：卫星时间序列（SITS）数据量大、类别混淆度高，传统 1D-CNN 难以充分利用时序内相关性。

**方法**：
- 将多光谱波段的时间序列数据分别用 GASF、GADF、MTF 编码为图像
- 多编码融合 + ResNet / 时序-空间双流 CNN
- 在巴西土地覆被（SITS 数据集）上训练和评估

**结果**：融合多种编码的 CNN 在作物分类上比单一 1D-CNN 精度提高 **4-8 个百分点**，尤其对季节性作物识别效果显著。

**意义**：展示了 GAF 在遥感/地球观测领域的应用潜力，多种升维方法融合优于单一方法。

---

### 案例四：Sensors (MDPI，Q1) — 滚动轴承故障 + 小样本

**文献**：*A Novel Method for Rolling Bearing Fault Diagnosis Based on Gramian Angular Field and Few-shot Learning.* **Sensors**, 24(12), 2024. DOI: 10.3390/s24123967.

**问题**：工业场景中故障样本稀缺，深度学习需要大量标注数据。

**方法**：
1. 振动信号 → GASF 图像
2. 孪生网络（Siamese Network）实现小样本学习
3. 结合 GASF 的图像相似性度量替代原始信号比较

**亮点**：每类仅用 5-10 个样本即可达到 **92%+** 诊断准确率（传统方法需要数百样本），充分利用了 GASF 图像化后支持迁移学习的特性。

---

### 案例五：PLOS ONE — 强噪声下的滚动轴承故障诊断

**文献**：*Rolling bearing fault diagnosis method based on gramian angular difference field and deep neural network under strong noise interference.* **PLOS ONE**, 2024. DOI: 10.1371/journal.pone.0314898.

**方法**：
- 原始振动信号 → GADF 图像
- EMD（经验模态分解）预降噪 + GADF 编码
- DenseNet 分类

**意义**：在信噪比 −6 dB 的极端噪声条件下，准确率仍达 **95%**，显著优于直接用1D信号的方法，证明了 GADF 对噪声有一定的结构鲁棒性。

---

## 7. 代码速查：Python 实现

### 7.1 GASF/GADF 快速实现（使用 pyts 库）

```python
# pip install pyts matplotlib numpy

import numpy as np
import matplotlib.pyplot as plt
from pyts.image import GramianAngularField

# 生成示例时间序列
t = np.linspace(0, 4 * np.pi, 100)
X = np.sin(t) + 0.1 * np.random.randn(100)
X = X.reshape(1, -1)  # pyts 要求 shape: (n_samples, n_timestamps)

# 计算 GASF
gasf = GramianAngularField(method='summation')  # GASF
gasf_img = gasf.fit_transform(X)

# 计算 GADF
gadf = GramianAngularField(method='difference')  # GADF
gadf_img = gadf.fit_transform(X)

# 可视化
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].plot(t, X[0])
axes[0].set_title('原始时间序列')

axes[1].imshow(gasf_img[0], cmap='rainbow', origin='lower')
axes[1].set_title('GASF 图像')

axes[2].imshow(gadf_img[0], cmap='bwr', origin='lower')
axes[2].set_title('GADF 图像')

plt.tight_layout()
plt.show()
```

### 7.2 从 GASF 还原时间序列

```python
def gasf_inverse(gasf_matrix, x_min=None, x_max=None):
    """
    从 GASF 图像的主对角线恢复归一化时间序列。
    
    假设条件：
    - 原始序列归一化到 [0, 1]（此时变换为双射）
    - gasf_matrix 为无损原始矩阵（非 JPEG 压缩图）
    
    参数：
    - gasf_matrix: np.ndarray, shape (N, N)
    - x_min, x_max: 原始序列的最小/最大值（用于反归一化，可选）
    
    返回：
    - x_normalized: 归一化序列 [0, 1]
    - x_original: 反归一化序列（若提供了 x_min, x_max）
    """
    # Step 1: 提取主对角线
    diag = np.diag(gasf_matrix)  # d_i = cos(2*phi_i) = 2*x_i^2 - 1
    
    # Step 2: 反算归一化值（仅适用于 [0,1] 归一化）
    # cos(2φ) = 2x² - 1  =>  x = sqrt((cos(2φ) + 1) / 2)
    x_normalized = np.sqrt(np.clip((diag + 1) / 2, 0, 1))
    
    # Step 3: 反归一化（可选）
    if x_min is not None and x_max is not None:
        x_original = x_normalized * (x_max - x_min) + x_min
        return x_normalized, x_original
    
    return x_normalized

# 验证
from sklearn.preprocessing import MinMaxScaler

X_raw = np.array([0.2, 0.5, 0.8, 0.4, 0.9, 0.1, 0.6])
x_min, x_max = X_raw.min(), X_raw.max()

# 归一化到 [0, 1]
X_norm = (X_raw - x_min) / (x_max - x_min)

# 手动构造 GASF
phi = np.arccos(X_norm)
GASF = np.array([[np.cos(phi[i] + phi[j]) for j in range(len(phi))] 
                  for i in range(len(phi))])

# 逆变换
X_recovered_norm, X_recovered = gasf_inverse(GASF, x_min, x_max)

print("原始序列:", X_raw)
print("恢复序列:", X_recovered)
print("最大误差:", np.max(np.abs(X_raw - X_recovered)))  # 应约为 0（机器精度）
```

### 7.3 MTF 和 RP 实现

```python
from pyts.image import MarkovTransitionField, RecurrencePlot

# MTF
mtf = MarkovTransitionField(n_bins=4)  # 4 个量化区间
mtf_img = mtf.fit_transform(X)

# 递归图
rp = RecurrencePlot(threshold='point', percentage=20)
rp_img = rp.fit_transform(X)
```

---

## 8. 总结与选型建议

### 8.1 核心结论

1. **GASF/GADF** 是目前工程应用最广泛的时序升维方法，数学原理清晰，与 CNN 结合效果出色。
2. **GASF 在 [0,1] 归一化条件下具有双射性**，可以从图像主对角线无损还原原始时间序列——这是它有别于其他方法的独特优势。
3. **不同方法捕捉不同维度的信息**，实际应用中多种编码融合通常优于单一方法。
4. **时频方法（STFT/CWT）** 在语音、振声领域历史更悠久，工具链成熟，也具有可逆性。
5. **TimesNet 的周期重塑** 代表了一种不依赖手工设计的"学习式"升维思路，在时序预测任务上表现最优。

### 8.2 可逆性汇总

```
完全可逆（信息无损）：
  ✅ GASF（[0,1]归一化 + 无损存储）— 从主对角线恢复
  ✅ STFT（保留复数系数）
  ✅ CWT（保留复数系数）
  ✅ TimesNet Reshape（reshape 天然可逆）

有条件/部分可逆：
  ⚠️ GASF（[-1,1]归一化）— 符号歧义，需辅助 GADF
  ⚠️ STFT/CWT 幅度图 — 丢失相位，Griffin-Lim 近似恢复

不可逆：
  ❌ GADF（单独使用）
  ❌ MTF（量化损失）
  ❌ RP（阈值二值化）
  ❌ SDP（镜像对称损失）
```

### 8.3 一句话选型指南

| 你的需求 | 推荐方法 |
|---------|---------|
| 复用 ImageNet 预训练 CNN，快速搭建基线 | **GASF + GADF** |
| 需要还原原始曲线（可逆） | **GASF（[0,1]）** 或 **TimesNet Reshape** |
| 振动/声音信号，频率信息重要 | **CWT Scalogram** 或 **STFT 语谱图** |
| 非线性动力学、混沌系统分析 | **RP（递归图）** |
| 时间序列预测（长序列） | **TimesNet Reshape** |
| 多方法融合提升分类性能 | **GASF + MTF + RP 三合一** |

---

## 参考文献

1. Wang, Z., & Oates, T. (2015). *Imaging time-series to improve classification and imputation.* IJCAI 2015. arXiv:1506.00327.

2. Wu, H., Hu, T., Liu, Y., Zhou, H., Wang, J., & Long, M. (2023). *TimesNet: Temporal 2D-variation modeling for general time series analysis.* **ICLR 2023**. arXiv:2210.02186.

3. Eckmann, J. P., Kamphorst, S. O., & Ruelle, D. (1987). *Recurrence plots of dynamical systems.* Europhysics Letters, 4(9), 973.

4. Bagnall, A., Lines, J., Bostrom, A., Large, J., & Keogh, E. (2017). *The great time series classification bake off.* Data Mining and Knowledge Discovery, 31(3), 606–660.

5. *Transformer fault diagnosis method based on Gramian Angular Field and optimized neural network.* Scientific Reports (Nature), 2025. https://doi.org/10.1038/s41598-025-08590-2

6. *A New Method for Diagnosing Motor Bearing Faults Based on Gramian Angular Field Image Coding and Improved CNN-ELM.* IEEE Transactions on Industrial Electronics, 2023. DOI: 10.1109/TIE.2023.

7. *Combining 2D encoding and convolutional neural network to enhance land use and land cover mapping from satellite image time series.* Engineering Applications of Artificial Intelligence, 2023. https://doi.org/10.1016/j.engappai.2023.106354

8. *A Novel Method for Rolling Bearing Fault Diagnosis Based on Gramian Angular Field and Few-shot Learning.* Sensors, 24(12), 2024. DOI: 10.3390/s24123967

9. *Rolling bearing fault diagnosis method based on gramian angular difference field and deep neural network under strong noise interference.* PLOS ONE, 2024. DOI: 10.1371/journal.pone.0314898

