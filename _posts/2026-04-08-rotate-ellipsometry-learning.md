---
layout: post
title: "[原理学习] 旋转检偏器型椭偏仪的测量原理"
date: 2026-04-09 12:32:00 +0800
categories: Learning
mathjax: true
---

# 旋转检偏器型椭偏仪的测量原理


## 目录

1. [引言](#引言)
2. [椭偏仪的基本分类](#椭偏仪的基本分类)
3. [偏振光基础与琼斯矩阵](#偏振光基础与琼斯矩阵)
4. [椭偏参数 Ψ 与 Δ 的物理含义](#椭偏参数-ψ-与-δ-的物理含义)
5. [旋转检偏器椭偏仪（RAE）的物理原理与推导](#旋转检偏器椭偏仪-rae-的物理原理与推导)
   - 5.1 光路结构
   - 5.2 各元件的琼斯矩阵
   - 5.3 探测器接收到的强度信号
   - 5.4 傅里叶展开提取 Ψ 和 Δ
   - 5.5 完整推导汇总
6. [旋转起偏器椭偏仪（RPE）简介](#旋转起偏器椭偏仪-rpe-简介)
7. [相位调制椭偏仪（PME）原理](#相位调制椭偏仪-pme-原理)
8. [穆勒矩阵椭偏仪（MME）简介](#穆勒矩阵椭偏仪-mme-简介)
9. [从强度信号到薄膜参数：完整测量流程](#从强度信号到薄膜参数：完整测量流程)
10. [各类椭偏仪对比](#各类椭偏仪对比)
11. [参考文献](#参考文献)

---

## 引言

椭偏仪（Ellipsometer）是一种非接触、非破坏性的光学测量仪器，通过测量光束在样品表面反射（或透射）后**偏振态的变化**，反演出样品的折射率 $n$、消光系数 $k$、薄膜厚度 $d$ 等光学参数。

其核心思想可以用一句话概括：

> **偏振光打在样品上，反射后偏振椭圆的形状（椭偏角 Ψ、相位差 Δ）记录了样品的全部光学信息。**

但是，探测器（光电二极管、CCD 等）只能测量**光强**（即电场振幅的平方），无法直接感知相位或偏振方向。因此，椭偏仪的核心技术挑战就是：

> **如何从纯强度信号中提取出偏振态信息？**

答案是：利用**旋转光学元件**（或相位调制器）将偏振信息编码为强度的周期性调制，再通过**傅里叶分析**解码。本报告将以最常见的**旋转检偏器椭偏仪（RAE）**为主线，给出完整的物理推导。

---

## 椭偏仪的基本分类

椭偏仪按调制方式和构型可分为以下几大类：

| 类型 | 英文缩写 | 调制方式 | 特点 |
|------|----------|----------|------|
| **旋转检偏器椭偏仪** | RAE (Rotating Analyzer Ellipsometer) | 机械旋转检偏器 | 结构简单，最常用；不能测 Δ=0° 或 180° 附近 |
| **旋转起偏器椭偏仪** | RPE (Rotating Polarizer Ellipsometer) | 机械旋转起偏器 | 与 RAE 对偶，同类局限 |
| **旋转补偿器椭偏仪** | RCE (Rotating Compensator Ellipsometer) | 机械旋转波片 | 可测完整 Stokes 参数，精度高 |
| **相位调制椭偏仪** | PME (Phase Modulation Ellipsometer) | 光弹调制器（PEM） | 无旋转部件，速度快（50 kHz），适合动态测量 |
| **穆勒矩阵椭偏仪** | MME (Mueller Matrix Ellipsometer) | 多元件组合 | 测完整 4×4 穆勒矩阵，适合各向异性、散射样品 |
| **成像椭偏仪** | IE (Imaging Ellipsometer) | 结合显微成像 | 二维空间分辨，适合晶圆映射 |
| **宽带光谱椭偏仪** | SE (Spectroscopic Ellipsometer) | 宽光谱光源 + 上述任一 | 扫描多波长，可拟合色散模型 |

> **最常用的工业和科研型号**多为 **RAE 或 RCE + 宽带光源** 的组合，即光谱旋转检偏/补偿器椭偏仪。下文重点推导 RAE。

---

## 偏振光基础与琼斯矩阵

### 3.1 电磁波的偏振描述

单色平面电磁波在 $xy$ 平面内传播（沿 $z$ 方向），其电场可写为：

$$
\mathbf{E} = \begin{pmatrix} E_x \\ E_y \end{pmatrix} = \begin{pmatrix} E_{0x} e^{i\delta_x} \\ E_{0y} e^{i\delta_y} \end{pmatrix} e^{i(kz - \omega t)}
$$

其中 $E_{0x},\, E_{0y}$ 为振幅，$\delta_x,\, \delta_y$ 为初相位。偏振态由**振幅比和相位差**完全决定。

### 3.2 琼斯矢量

用**琼斯矢量**简洁表示偏振态（省略传播因子）：

$$
\mathbf{J} = \begin{pmatrix} E_x \\ E_y \end{pmatrix} = \begin{pmatrix} E_{0x} e^{i\delta_x} \\ E_{0y} e^{i\delta_y} \end{pmatrix}
$$

常用偏振态的琼斯矢量：

| 偏振态 | 琼斯矢量 |
|--------|----------|
| 水平线偏振（0°） | $\begin{pmatrix}1\\0\end{pmatrix}$ |
| 垂直线偏振（90°） | $\begin{pmatrix}0\\1\end{pmatrix}$ |
| +45° 线偏振 | $\frac{1}{\sqrt{2}}\begin{pmatrix}1\\1\end{pmatrix}$ |
| 右旋圆偏振 | $\frac{1}{\sqrt{2}}\begin{pmatrix}1\\-i\end{pmatrix}$ |
| 左旋圆偏振 | $\frac{1}{\sqrt{2}}\begin{pmatrix}1\\i\end{pmatrix}$ |

### 3.3 光学元件的琼斯矩阵

光通过各光学元件后，琼斯矢量被 2×2 复数矩阵（琼斯矩阵）变换。关键元件：

**线偏振器**（透光轴与 $x$ 轴成角 $\theta$）：

$$
\mathbf{P}(\theta) = \begin{pmatrix} \cos^2\theta & \sin\theta\cos\theta \\ \sin\theta\cos\theta & \sin^2\theta \end{pmatrix}
$$

**波片**（快轴沿 $x$，相位延迟 $\Gamma$）：

$$
\mathbf{W}(\Gamma) = \begin{pmatrix} e^{i\Gamma/2} & 0 \\ 0 & e^{-i\Gamma/2} \end{pmatrix}
$$

**反射样品**（沙姆 $p$ 和 $s$ 方向）：

在入射面坐标系下（$p$：平行入射面，$s$：垂直入射面），样品反射用菲涅耳系数矩阵描述：

$$
\mathbf{R}_{\text{sample}} = \begin{pmatrix} r_p & 0 \\ 0 & r_s \end{pmatrix}
$$

其中 $r_p,\, r_s$ 为复数菲涅耳反射系数。

---

## 椭偏参数 Ψ 与 Δ 的物理含义

椭偏测量的核心量是**复数反射率比**：

$$
\boxed{\rho = \frac{r_p}{r_s} = \tan\Psi \cdot e^{i\Delta}}
$$

其中：

- **$\Psi$（椭偏振幅角，Psi）**：$\tan\Psi = |r_p|/|r_s|$，即 $p$ 分量与 $s$ 分量反射振幅之比，$0° \leq \Psi \leq 90°$；
- **$\Delta$（椭偏相位差，Delta）**：$\Delta = \delta_p^{\text{ref}} - \delta_s^{\text{ref}}$，即反射后 $p$ 分量和 $s$ 分量之间的相位差，$0° \leq \Delta \leq 360°$。

### 直观理解

想象一束 +45° 线偏振光打在薄膜上：

- **入射时**：$p$ 分量和 $s$ 分量振幅相等，相位相同 → 线偏振
- **反射后**：由于薄膜对 $p$ 和 $s$ 的反射率不同（振幅比 $\tan\Psi \neq 1$）且引入额外相位差 $\Delta$ → 变为**椭圆偏振**

椭偏仪通过测量这个"入射线偏 → 反射椭偏"的变化量 $(\Psi,\, \Delta)$，反演出薄膜的 $n,\, k,\, d$。

---

## 旋转检偏器椭偏仪（RAE）的物理原理与推导

### 5.1 光路结构

RAE 的典型光路（反射型）：

```
光源 → [起偏器 P，固定] → 样品（入射角 θ_i）→ [检偏器 A，旋转] → 探测器
```

- **光源**：单色光或宽带光（配分光系统）
- **起偏器 P**：固定，快轴方向与入射面成角 $P$（通常取 $P = 45°$，使 $E_p = E_s$）
- **样品**：被测薄膜/材料，以入射角 $\theta_i$ 照射
- **检偏器 A**：以角速度 $\omega$ 连续旋转，旋转角 $A(t) = \omega t + A_0$
- **探测器**：只能测量光强 $I(t)$（光电流/光电压）

> **关键思想**：检偏器旋转时，每个旋转角度 $A$ 对应"透过不同方向偏振分量后的强度"，将偏振信息编码为时变强度信号 $I(t)$，再通过傅里叶分析提取 $\Psi$ 和 $\Delta$。

### 5.2 各元件的琼斯矩阵

**坐标约定**：以入射面为参考，$p$ 分量沿水平方向（$x$），$s$ 分量沿垂直方向（$y$）。

#### (a) 固定起偏器 P（透光轴与 $s$ 轴成角 $P$）

$$
\mathbf{J}_P = \begin{pmatrix} \cos^2 P & \sin P \cos P \\ \sin P \cos P & \sin^2 P \end{pmatrix}
$$

对于 $P = 45°$：

$$
\mathbf{J}_{P=45°} = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}
$$

作用于自然光（用 $\begin{pmatrix}1\\1\end{pmatrix}$ 表示均匀分量）后，出射为 +45° 线偏振：

$$
\mathbf{J}_{P=45°} \cdot \begin{pmatrix}1\\1\end{pmatrix} = \begin{pmatrix}1\\1\end{pmatrix}
$$

即 $E_p^{\text{inc}} = E_s^{\text{inc}} = E_0$（振幅相等，相位相同）。

#### (b) 样品反射矩阵

在 $p$-$s$ 坐标系下：

$$
\mathbf{J}_{\text{sample}} = \begin{pmatrix} r_p & 0 \\ 0 & r_s \end{pmatrix}
$$

其中 $r_p = |r_p|e^{i\delta_p}$，$r_s = |r_s|e^{i\delta_s}$。

反射后琼斯矢量：

$$
\mathbf{E}_{\text{ref}} = \mathbf{J}_{\text{sample}} \cdot \begin{pmatrix}E_0\\E_0\end{pmatrix} = \begin{pmatrix}r_p E_0\\r_s E_0\end{pmatrix}
$$

记 $r_s = |r_s|e^{i\delta_s}$，令 $r_s$ 为相位参考（令 $\delta_s = 0$，则 $r_s = |r_s|$ 为实数），则：

$$
\mathbf{E}_{\text{ref}} = E_0 |r_s| \begin{pmatrix} \tan\Psi \cdot e^{i\Delta} \\ 1 \end{pmatrix}
$$

这里用到了 $r_p/r_s = \tan\Psi \cdot e^{i\Delta}$。

#### (c) 旋转检偏器 A（透光轴与 $p$ 轴成角 $A$）

$$
\mathbf{J}_A = \begin{pmatrix} \cos^2 A & \sin A \cos A \\ \sin A \cos A & \sin^2 A \end{pmatrix}
$$

检偏器只透射沿其透光轴的分量，透过后的电场为：

$$
\mathbf{E}_{\text{det}} = \mathbf{J}_A \cdot \mathbf{E}_{\text{ref}}
$$

### 5.3 探测器接收到的强度信号

探测器测量的是**电场强度（即 $|\mathbf{E}_{\text{det}}|^2$）**：

$$
I(A) = |\mathbf{E}_{\text{det}}|^2 = \mathbf{E}_{\text{det}}^\dagger \cdot \mathbf{E}_{\text{det}}
$$

**逐步计算**：

设反射后的电场（忽略全局振幅因子 $E_0|r_s|$）：

$$
\mathbf{E}_{\text{ref}} = \begin{pmatrix} \tan\Psi \cdot e^{i\Delta} \\ 1 \end{pmatrix}
$$

检偏器沿角度 $A$ 方向透射，透过的电场分量（标量投影）为：

$$
E_{\text{out}} = \cos A \cdot (\tan\Psi \cdot e^{i\Delta}) + \sin A \cdot 1
$$

即检偏器将 $\mathbf{E}_{\text{ref}}$ 投影到方向 $(\cos A,\, \sin A)$：

$$
E_{\text{out}} = \tan\Psi \cdot e^{i\Delta} \cos A + \sin A
$$

探测器测量的强度为：

$$
I(A) = |E_{\text{out}}|^2 = \left|\tan\Psi \cdot e^{i\Delta} \cos A + \sin A\right|^2
$$

展开：

$$
I(A) = (\tan\Psi \cos A \cdot e^{i\Delta} + \sin A)(\tan\Psi \cos A \cdot e^{-i\Delta} + \sin A)
$$

$$
= \tan^2\Psi \cos^2 A + \sin^2 A + \tan\Psi \cos A \sin A (e^{i\Delta} + e^{-i\Delta})
$$

$$
= \tan^2\Psi \cos^2 A + \sin^2 A + 2\tan\Psi \cos A \sin A \cos\Delta
$$

利用二倍角公式 $\cos^2 A = \frac{1+\cos 2A}{2}$，$\sin^2 A = \frac{1-\cos 2A}{2}$，$2\sin A \cos A = \sin 2A$：

$$
I(A) = \frac{\tan^2\Psi(1+\cos 2A)}{2} + \frac{1-\cos 2A}{2} + \tan\Psi \sin 2A \cos\Delta
$$

$$
= \frac{\tan^2\Psi + 1}{2} + \frac{\tan^2\Psi - 1}{2}\cos 2A + \tan\Psi\cos\Delta \cdot \sin 2A
$$

整理为**直流 + 二次谐波**的形式：

$$
\boxed{I(A) = I_0 \left[1 + \alpha \cos 2A + \beta \sin 2A\right]}
$$

其中：

$$
I_0 = \frac{E_0^2|r_s|^2(\tan^2\Psi + 1)}{2}
\quad \text{（直流强度）}
$$

$$
\alpha = \frac{\tan^2\Psi - 1}{\tan^2\Psi + 1}
\quad \text{（$\cos 2A$ 的傅里叶系数）}
$$

$$
\beta = \frac{2\tan\Psi\cos\Delta}{\tan^2\Psi + 1}
\quad \text{（$\sin 2A$ 的傅里叶系数）}
$$

### 5.4 傅里叶展开提取 Ψ 和 Δ

#### 强度是 $2A$ 的周期函数

检偏器以角速度 $\omega$ 旋转：$A(t) = \omega t + A_0$，则：

$$
I(t) = I_0 \left[1 + \alpha \cos(2\omega t + 2A_0) + \beta \sin(2\omega t + 2A_0)\right]
$$

强度信号以频率 $2\omega$（检偏器旋转频率的 **2 倍**）做正弦调制。

> **物理直觉**：检偏器转一圈（$360°$），强度完成**两个**完整的周期，因为偏振椭圆有关于原点的对称性（相差 $180°$ 的透光轴效果相同）。

#### 傅里叶系数的提取

在一个完整旋转周期 $T = \pi/\omega$ 内对 $I(t)$ 做离散/连续傅里叶分析，提取：

$$
\hat{I}_{\cos} = \frac{2}{T}\int_0^T I(t)\cos(2\omega t)\,dt = I_0 \cdot \alpha
$$

$$
\hat{I}_{\sin} = \frac{2}{T}\int_0^T I(t)\sin(2\omega t)\,dt = I_0 \cdot \beta
$$

$$
\hat{I}_0 = \frac{1}{T}\int_0^T I(t)\,dt = I_0
$$

归一化后得到**无需绝对光强**的系数：

$$
\alpha = \frac{\hat{I}_{\cos}}{\hat{I}_0}, \qquad \beta = \frac{\hat{I}_{\sin}}{\hat{I}_0}
$$

#### 反解 Ψ 和 Δ

由 $\alpha$ 和 $\beta$ 的表达式：

$$
\alpha = \frac{\tan^2\Psi - 1}{\tan^2\Psi + 1} = \cos 2\Psi
$$

（注意：令 $x = \tan\Psi$，则 $\frac{x^2-1}{x^2+1} = -\cos 2\arctan(x) = \cos(2\Psi - \pi)$；更直接地，由三角恒等式 $\cos 2\Psi = \frac{1-\tan^2\Psi}{1+\tan^2\Psi}$，所以 $\alpha = -\cos 2\Psi$）

**仔细重算**（以 $\tan^2\Psi \equiv \tau^2$）：

$$
\alpha = \frac{\tau^2 - 1}{\tau^2 + 1}
$$

注意 $\cos 2\Psi = \frac{1 - \tan^2\Psi}{1 + \tan^2\Psi}$，所以：

$$
\alpha = -\cos 2\Psi
$$

$$
\beta = \frac{2\tau \cos\Delta}{\tau^2 + 1} = \sin 2\Psi \cdot \cos\Delta
$$

（用到 $\frac{2\tan\Psi}{1+\tan^2\Psi} = \sin 2\Psi$）

因此：

$$
\boxed{
\cos 2\Psi = -\alpha
\quad \Longrightarrow \quad
\Psi = \frac{1}{2}\arccos(-\alpha)
}
$$

$$
\boxed{
\cos\Delta = \frac{\beta}{\sin 2\Psi} = \frac{\beta}{\sqrt{1-\alpha^2}}
\quad \Longrightarrow \quad
\Delta = \arccos\!\left(\frac{\beta}{\sqrt{1-\alpha^2}}\right)
}
$$

> **注意**：$\arccos$ 的值域为 $[0°, 180°]$，因此单独用 RAE 时，$\Delta$ 和 $360°-\Delta$ 无法区分（符号不定性）。若需区分，需要加波片（成为 RCE），或利用辅助实验。

### 5.5 完整推导汇总

将完整的推导流程概括如下：

```
光源
  │
  ▼
[起偏器 P=45°]
  │ 产生 +45° 线偏振光: E_p = E_s = E₀
  ▼
[样品反射]
  │ 反射后: E_p → E₀·r_p = E₀|r_s|tanΨ·e^(iΔ)
  │        E_s → E₀·r_s = E₀|r_s|
  │ → 变为椭圆偏振光
  ▼
[旋转检偏器 A(t) = ωt + A₀]
  │ 投影: E_out = tanΨ·e^(iΔ)·cosA + sinA
  ▼
[探测器：测强度]
  │ I(A) = |E_out|² = I₀[1 + α·cos2A + β·sin2A]
  ▼
[数字信号处理：傅里叶变换]
  │ 提取: α = Î_cos / Î₀  ,  β = Î_sin / Î₀
  ▼
[反演]
  │ cosΨ 对应 α: Ψ = ½·arccos(-α)
  │ cosΔ 对应 β: Δ = arccos(β / sin2Ψ)
  ▼
 (Ψ, Δ) → 输入菲涅耳模型 → 拟合 n, k, d
```

---

## 旋转起偏器椭偏仪（RPE）简介

RPE 与 RAE 完全对偶：

- 检偏器固定，起偏器旋转
- 强度信号形式相同：$I(\theta_P) = I_0[1 + \alpha'\cos 2\theta_P + \beta'\sin 2\theta_P]$
- 傅里叶系数与 $\Psi,\Delta$ 的关系式完全类似

RPE 的优点是：由于旋转元件在样品前，可以避免检偏器旋转引起的光路漂移；缺点是起偏器旋转时光斑位置可能微小变化。

---

## 相位调制椭偏仪（PME）原理

PME 使用**光弹调制器（PEM, Photoelastic Modulator）**代替机械旋转，以约 $50\,\mathrm{kHz}$ 的高频对相位进行调制。

### 光路

```
光源 → [起偏器 P，固定] → [PEM，快轴固定，相位调制幅度 δ₀] → 样品 → [检偏器 A，固定] → 探测器
```

PEM 引入的相位延迟为：

$$
\delta(t) = \delta_0 \sin(\omega_m t)
$$

其中 $\delta_0$ 为调制幅度（通常 $\delta_0 \approx 137.8° = J_0$ 零点，消除直流误差），$\omega_m = 2\pi \times 50\,\mathrm{kHz}$。

### 强度信号展开

利用**贝塞尔函数展开**：

$$
e^{i\delta_0\sin\omega_m t} = \sum_{n=-\infty}^{\infty} J_n(\delta_0) e^{in\omega_m t}
$$

PME 输出的强度含有直流 $I_{dc}$、一次谐波 $I_{1\omega}$、二次谐波 $I_{2\omega}$ 等成分，锁相放大器分别提取：

$$
I_{dc} \propto 1 - J_0(\delta_0)\cos\Delta\sin 2\Psi\sin 2P
$$

$$
I_{2\omega} \propto 2J_2(\delta_0)\cos\Delta\sin 2\Psi\sin 2P
$$

$$
I_{1\omega} \propto 2J_1(\delta_0)\sin\Delta\sin 2\Psi\sin 2P
$$

从 $I_{1\omega}/I_{dc}$ 和 $I_{2\omega}/I_{dc}$ 中可同时提取 $\sin\Delta$ 和 $\cos\Delta$，从而确定 $\Delta$ 的完整四象限值（无符号不定性），这是 PME 优于 RAE 的关键。

---

## 穆勒矩阵椭偏仪（MME）简介

### 斯托克斯参数与穆勒矩阵

当样品存在各向异性、散射、退偏等效应时，简单的 $(\Psi,\Delta)$ 不足以完整描述样品，需要使用斯托克斯（Stokes）矢量和穆勒（Mueller）矩阵：

$$
\mathbf{S} = \begin{pmatrix} S_0 \\ S_1 \\ S_2 \\ S_3 \end{pmatrix} = \begin{pmatrix} I \\ I_0 - I_{90} \\ I_{45} - I_{-45} \\ I_R - I_L \end{pmatrix}
$$

其中所有量均为**强度**，故斯托克斯矢量可由探测器直接测量（不同偏振滤片组合）。

样品的作用由 4×4 穆勒矩阵描述：

$$
\mathbf{S}_{\text{out}} = \mathbf{M} \cdot \mathbf{S}_{\text{in}}
$$

穆勒矩阵椭偏仪通过改变入射和出射侧的波片/检偏器方向，测量 16 个矩阵元，完整描述样品的偏振响应（包括退偏）。

---

## 从强度信号到薄膜参数：完整测量流程

```
①测量: 采集 I(t) 时序数据（RAE: 通常每转采 64 个点以上）
    ↓
②信号处理: 快速傅里叶变换 → 提取 α, β（归一化 2ω 分量）
    ↓
③椭偏参数: Ψ = ½ arccos(-α)   Δ = arccos(β/sin2Ψ)
    ↓
④光学模型: 建立薄膜堆栈的菲涅耳方程或传递矩阵模型
    Ψ_model(n,k,d,θ_i,λ) , Δ_model(n,k,d,θ_i,λ)
    ↓
⑤数值拟合: 最小化 χ² = Σ[(Ψ_meas - Ψ_model)² + (Δ_meas - Δ_model)²]
    采用 Levenberg-Marquardt、差分进化等算法
    ↓
⑥输出: 薄膜参数 n(λ), k(λ), d
```

椭偏仪**不直接给出** $n,k,d$，而是先测出 $(\Psi,\Delta)$，再通过**模型拟合**间接得到。这也是椭偏仪的主要局限之一——结果依赖于模型选择的合理性。

---

## 各类椭偏仪对比

| 特性 | RAE | RPE | RCE | PME | MME |
|------|-----|-----|-----|-----|-----|
| Δ 符号确定 | ❌（有歧义） | ❌ | ✅ | ✅ | ✅ |
| 测量速度 | 中（数十 Hz） | 中 | 中 | 快（50 kHz） | 较慢 |
| 结构复杂度 | 简单 | 简单 | 中等 | 中等（需 PEM） | 复杂 |
| 各向异性测量 | 有限 | 有限 | 有限 | 有限 | ✅（完整） |
| 退偏测量 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 适合动态过程 | 一般 | 一般 | 一般 | ✅ | 一般 |
| 工业应用 | 广泛 | 广泛 | 广泛 | 中等 | 科研为主 |

---

## 参考文献

1. **Azzam, R.M.A. & Bashara, N.M.** (1977). *Ellipsometry and Polarized Light*. North-Holland Publishing Company.
2. **Tompkins, H.G. & Irene, E.A.** (2005). *Handbook of Ellipsometry*. William Andrew Publishing.
3. **Fujiwara, H.** (2007). *Spectroscopic Ellipsometry: Principles and Applications*. Wiley.
4. **Jellison, G.E.** (1993). Data analysis for spectroscopic ellipsometry. *Thin Solid Films*, 234(1-2), 416–422.
5. **Collins, R.W.** (1990). Automatic rotating element ellipsometers: Calibration, operation, and real-time applications. *Review of Scientific Instruments*, 61(8), 2029–2062.
6. **Arwin, H.** (2011). Application of ellipsometry techniques to biological materials. *Thin Solid Films*, 519(9), 2589–2592.
7. **Woollam, J.A. et al.** (1999). Overview of variable angle spectroscopic ellipsometry (VASE): I. Basic theory and typical applications. *SPIE Proceedings*, 10294.
8. **Losurdo, M. & Hingerl, K.** (2013). *Ellipsometry at the Nanoscale*. Springer.
