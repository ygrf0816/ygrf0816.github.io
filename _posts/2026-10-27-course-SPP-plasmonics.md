---
layout: post
title: "[课程笔记] 表面等离激元极化激元（SPPs）：从 Drude 模型到亚波长光刻"
date: 2026-10-27 16:10:00 +0800
categories: Learning
mathjax: true
type: 课程笔记
tags: [等离激元, 色散模型]
keywords: [Drude模型, ATR棱镜, 光栅耦合, 亚波长光刻]
summary: "系统推导Drude模型与单界面SPP色散关系，覆盖动量失配的三种激发方式与SPP干涉光刻应用，补齐课件跳过的代数步骤。"
cover: /assets/posts_figs/course-SPP-plasmonics/fig01_geometry.png
---

# [课程笔记] 表面等离激元极化激元（SPPs）：从 Drude 模型到亚波长光刻

> **一句话概括**：把 SPPs 从"金属为什么能用麦克斯韦方程描述"一路推到"棱镜/光栅怎么激发、怎么用 SPP 做亚波长光刻"，并补齐了课件里被跳过的代数步骤。主线是：Drude 模型 → 单界面色散关系 → 动量失配与三种激发方式 → 局域表面等离激元 → SPP 干涉光刻。

---

## 基本信息

| 项目 | 内容 |
|---|---|
| **笔记性质** | 课程笔记（专题整理），非论文阅读 |
| **依据** | 课程 PPT（SOOCHOW UNIVERSITY）p12–p40，共 19 张 |
| **参考教材** | Maier, *Plasmonics: Fundamentals and Applications*, Springer, 2007（课件公式编号 = 教材编号去掉章号） |
| **内容主线** | Drude 模型 → 单界面 SPP 色散 → 棱镜/光栅/近场激发 → LSP → SPP 亚波长光刻 |
| **配套图** | 11 张按公式重绘的示意图 + 7 张课件原片 |

---

## 目录

1. [为什么要研究 SPP：从衍射极限说起](#1-为什么要研究-spp从衍射极限说起)
2. [金属的光学性质：Drude 模型](#2-金属的光学性质drude-模型)
3. [从麦克斯韦方程到波动方程](#3-从麦克斯韦方程到波动方程)
4. [单界面 SPP 的场分布（TM 模）](#4-单界面-spp-的场分布tm-模)
5. [边界条件与色散关系](#5-边界条件与色散关系)
6. [为什么 TE 偏振没有表面模](#6-为什么-te-偏振没有表面模)
7. [色散关系的物理：三个极限、传播长度、穿透深度](#7-色散关系的物理三个极限传播长度穿透深度)
8. [激发难题：动量失配](#8-激发难题动量失配)
9. [棱镜耦合（衰减全反射 ATR）](#9-棱镜耦合衰减全反射-atr)
10. [光栅耦合](#10-光栅耦合)
11. [强聚焦光束激发与泄漏辐射显微](#11-强聚焦光束激发与泄漏辐射显微)
12. [局域表面等离激元（LSP）](#12-局域表面等离激元lsp)
13. [应用（一）：SPR 传感](#13-应用一spr-传感)
14. [应用（二）：SPP 亚波长光刻（课件后半部分）](#14-应用二spp-亚波长光刻课件后半部分)
15. [公式速查表与编号对照](#15-公式速查表与编号对照)
16. [常见误区与自检题](#16-常见误区与自检题)

---

## 记号约定

| 符号 | 含义 | 备注 |
| --- | --- | --- |
| $\varepsilon_1(\omega)$ | 金属的介电函数（复数） | 课件用 $\varepsilon_1$；教材同 |
| $\varepsilon_2$ | 介质的介电常数（实数、正） | 空气 $=1$，石英 $=2.25$ |
| $k_0=\omega/c=2\pi/\lambda_0$ | 真空波矢 | $\lambda_0$ 为真空波长 |
| $\beta=k_x$ | SPP 的传播常数（复数） | 教材称 propagation constant |
| $k_{z,i}\equiv k_i$ | 垂直于界面的波矢分量 | 倏逝时取正实数 |
| $\delta_i=1/k_i$ | 穿透深度（场衰减到 $1/e$ 的距离） | 注意是**场**不是强度 |
| $L$ | 传播长度（强度衰减到 $1/e$） | $L=1/(2\,\mathrm{Im}\,\beta)$ |
| $\lambda_{sp}=2\pi/\mathrm{Re}\,\beta$ | SPP 波长 | 比 $\lambda_0$ 短 |
| $\omega_p$ | 体等离子体频率 | 金属的本征参数 |
| $\gamma=1/\tau$ | 碰撞频率（阻尼） | 室温 $\sim 100$ THz |

---

## 1. 为什么要研究 SPP：从衍射极限说起

### 1.1 先把"波矢"说清楚

后面每一节都在用 $k$ 和 $\beta$，所以这里一次讲透。

**波矢是"空间频率"，和频率是一对。**

看一维行波：

$$
\psi(x,t)=A\cos\left(kx-\omega t+\varphi_0\right).
$$

括号里那一坨叫**相位** $\Phi=kx-\omega t+\varphi_0$，它决定"波此刻走到了哪一步"。相位有两个自变量，就对应两个"变化率"：

- 固定位置 $x$，看相位随时间转多快 → $\omega=2\pi/T$，单位 rad/s，叫**角频率**（每秒转几圈相位）；
- 固定时间 $t$，看相位随空间转多快 → $k$，单位 rad/m，叫**波矢**（每米转几圈相位）。

波走一个波长 $\lambda$，相位正好转一整圈 $2\pi$，所以

$$
k\lambda=2\pi\quad\Longrightarrow\quad \boxed{k=\frac{2\pi}{\lambda}} .
\tag{1.1}
$$

**这就是"为什么这么定义"**：$k$ 不是硬造出来的量，它就是"相位对空间的导数"$\;\partial\Phi/\partial x$。因为相位是最基本的物理量（干涉、衍射、相位匹配全靠它），所以"相位在空间上变化得多快"必然是最基本的量。带上 $2\pi$ 是为了让"转一圈"记作 $2\pi$ 而不是 1——这样 $k\lambda=2\pi$ 与 $\omega T=2\pi$ 形式完全对称，所有公式里不必再到处写 $2\pi$。

> **换算**：$\lambda_0=633$ nm 的光，$k_0=2\pi/0.633\ \mu\mathrm{m}^{-1}\approx9.93\ \mathrm{rad/\mu m}$，即**每走 1 µm 相位转 1.58 圈**。$\lambda$ 越短，$k$ 越大，相位转得越快。

**在介质里要乘折射率**：介质中波长被压缩成 $\lambda_0/n$，所以

$$
k=nk_0=\frac{2\pi n}{\lambda_0},\qquad k_0=\frac{\omega}{c}=\frac{2\pi}{\lambda_0}.
\tag{1.2}
$$

**三维里它是矢量**：$\mathbf{k}=(k_x,k_y,k_z)$，方向是波传播方向（各向同性介质里也是能流方向），大小仍是 $2\pi/\lambda$。界面问题永远把 $\mathbf{k}$ 拆成两部分：

- **沿界面的 $k_x$**：必须连续（两侧"踩着同一个节拍"），这就是后面反复出现的 $\beta$；
- **垂直界面的 $k_z$**：两侧可以不同，负责"衰减"或"振荡"——倏逝场就是它变成虚数的结果（1.5 节）。

这个拆分是整篇笔记的骨架：第 8 节的"动量失配"就是 $k_x<\beta$，第 9、10 节的棱镜和光栅都是在"给 $k_x$ 加料"。

**为什么可以当"动量"用**：量子化后光子动量 $\mathbf{p}=\hbar\mathbf{k}$。于是"相位匹配"（两列波在界面上处处同步）等价于"沿界面的动量守恒"。记住这句话，后面所有耦合条件都是它的具体写法。

**为什么波矢会出现在波动方程里**：因为 $\partial/\partial x$ 作用在 $e^{ikx}$ 上就是"乘 $ik$"。这就是第 3 节里 $\partial_x\to i\beta$ 的由来——微分方程变成代数方程，全靠在频域/波矢域里算。

### 1.2 衍射极限

**例 1：光栅——周期小于波长，衍射级就"消失"了**

垂直入射到周期 $a$ 的光栅，第 $m$ 级衍射角满足

$$
a\sin\theta_m=m\lambda .
$$

$m=1$ 要有实数解，必须 $\lambda/a\le1$，即 $a\ge\lambda$。当 $a<\lambda$ 时 $\sin\theta_1>1$，**没有传播的衍射波**（严格说它变成了倏逝波，见 1.5 节）。物理含义：**周期结构要把光散射到远场，周期必须大于波长**。

**例 2：光刻——分辨率被 $\lambda/(2NA)$ 卡死**

投影光刻的瑞利判据：

$$
R=k_1\frac{\lambda}{NA},\qquad NA=n\sin\theta .
$$

193 nm 波长、浸没式 $NA=1.35$、$k_1\approx0.25$ 时 $R\approx36$ nm——这已是单次曝光的极限，再小只能多重曝光。要真正提高，只有缩 $\lambda$（EUV，13.5 nm）或抬 $NA$（高 NA EUV，0.55），两条路都极其昂贵。

**例 3：显微镜——两点靠得比 $\lambda/2$ 近就分不开**

Abbe 分辨率 $\delta=0.61\lambda/NA$，$NA$ 做到 1.4 时也就 $\approx\lambda/2$。

**三个例子是同一件事的三种说法**：一束光（严格说是有限个平面波）在空间上能搭出来的最细"花纹"就是 $\lambda/(2n)$。为什么？直接算最极端的情况——两束光以 $\pm\theta$ 相交：
$$
I\propto\left|e^{ikx\sin\theta}+e^{-ikx\sin\theta}\right|^2=4\cos^2\!\left(kx\sin\theta\right),
\tag{1.3}
$$

条纹周期

$$
\boxed{\Lambda=\frac{2\pi}{2k\sin\theta}=\frac{\lambda}{2n\sin\theta}\ \ge\ \frac{\lambda}{2n}} .
\tag{1.4}
$$

$\theta\to90^\circ$（掠入射对撞）才取等号。

> **注意 (1.4) 分母里的那个 2**：条纹的空间频率是 $2k_x$ 而不是 $k_x$，因为**强度是场的平方**，频率翻倍。这一点在第 14 章会原样出现：SPP 干涉光刻的条纹周期是 $\Lambda=\lambda_{sp}/2$，不是 $\lambda_{sp}$。

**本质（一句话）**：一个周期为 $\Lambda$ 的图案，对应空间频率 $K=2\pi/\Lambda$；要"写"出它，参与叠加的波必须能提供 $K$。而自由空间里传播波的波矢大小最大就是 $nk_0$，两束最多凑出 $2nk_0$，于是

$$
K_{\max}=2nk_0\;\Longrightarrow\;\Lambda_{\min}=\frac{2\pi}{2nk_0}=\frac{\lambda_0}{2n}.
$$

**这就是衍射极限的信息论版本**：不是"透镜不够好"，而是"可用的空间频率不够高"。

### 1.3 突破口：把波矢做大

既然瓶颈是"$|k|\le nk_0$"，那就去找一种**波矢可以超过 $nk_0$** 的电磁模式。

**SPP 正好是**：它的传播常数 $\beta$（就是 $k_x$）满足 $\beta>k_0\sqrt{\varepsilon_2}$（第 5 节会证），而且场被紧紧约束在界面附近（1.5 节的倏逝场）。用它做干涉，条纹可以细到

$$
\Lambda=\frac{\lambda_{sp}}{2}=\frac{\pi}{\beta}<\frac{\lambda_0}{2\sqrt{\varepsilon_2}} .
$$

代价是：$\beta$ 越大，场越多地渗进金属，损耗越大、传播越短（第 7.8 节的 trade-off）。

**这就是整门课的逻辑起点**——不是"SPP 很神奇"，而是"衍射极限要求更大的波矢，而 SPP 恰好能提供"。

### 1.4 SPP 是什么

**定义**：SPP 是沿金属/介质界面传播、在垂直于界面方向指数衰减的电磁表面波，它是光子与金属中自由电子气的集体振荡耦合形成的**混合模式**（polariton 这个名字就来自"光子 + 激元"的耦合）。

三个关键词，后面每一节都会兑现：

| 关键词 | 数学表现 | 物理后果 |
| --- | --- | --- |
| 沿界面传播 | 场含 $e^{i\beta x}$，$\beta$ 为复数 | 可以像波导一样传输能量 |
| 垂直方向倏逝 | 场含 $e^{-k_1\lvert z\rvert}$、$e^{-k_2\lvert z\rvert}$（见 1.5 节） | 能量被"压"在界面附近，可远小于 $\lambda_0/2$ |
| 波矢大于光 | $\beta>k_0\sqrt{\varepsilon_2}$ | 不能被自由空间光直接激发（第 8 节），但**波长更短、分辨率更高** |

### 1.5 倏逝场：SPP 的"身体"

第 1.4 节说 SPP 在垂直方向"指数衰减"。这种场有个专门的名字，而且它是整个近场光学的基础，必须单独讲清楚。

**定义**：在某个方向上**不做振荡、只做指数衰减**，并且沿该方向**不传输净能量**的场，叫倏逝场（evanescent field，evanescent = 迅速消失的）。

**它只可能来自一件事：波矢分量"超额"了。**

平面波在折射率 $n$ 的介质里必须满足

$$
k_x^2+k_z^2=\left(nk_0\right)^2 .
\tag{1.5}
$$

如果某个方向上"要求"的分量比总波矢还大，剩下的那个分量就只能是虚数：

$$
k_z^2=\left(nk_0\right)^2-k_x^2<0
\;\Longrightarrow\;
k_z=\pm\,i\kappa,\qquad \kappa=\sqrt{k_x^2-\left(nk_0\right)^2}.
\tag{1.6}
$$

代回 $e^{ik_zz}$：

$$
e^{ik_zz}=e^{\mp\kappa z}.
$$

**不是"转圈"，是"掉下去"。** 这就是倏逝场的全部数学来源——没有别的机制。

**三个必须记住的性质**

1. **按 $e^{-\kappa z}$ 衰减，穿透深度 $\delta=1/\kappa$**（场降到 $1/e$）；强度按 $e^{-2\kappa z}$，所以强度的 $1/e$ 距离是 $\delta/2$。
2. **单个倏逝场不传输能量**：沿衰减方向的平均坡印廷矢量 $\langle S_z\rangle=0$。能量只是在界面附近"存一下、还回去"（电场能与磁场能交替转换），不向外辐射。**这正是不违反能量守恒的原因**——它根本没往外送能量。
3. **它携带"超过 $nk_0$ 的波矢"**：$k_x>nk_0$。这是衍射极限之外唯一的信息/能量通道，近场光学（SNOM）、超透镜、SPP 全都建立在这一点上。

> **一个极容易搞混的点**：上面第 2 条说的是"孤立的倏逝场"。如果在衰减长度**以内**再放一块介质，能量就能"隧穿"过去（受抑全反射、光子隧道效应）——此时确实有净能流。棱镜耦合（Kretschmann/Otto）和光纤耦合器都靠这个。所以准确的说法是：**倏逝场本身不辐射，但它可以被"接管"**。

**四个熟悉的例子**

| 场景 | 为什么会有倏逝场 | 穿透深度量级 |
| --- | --- | --- |
| 棱镜全反射 | $\theta>\theta_c$ 时空气侧 $k_x=n_pk_0\sin\theta>k_0$，由 (1.5) 得 $k_z$ 为虚 | 约 $\lambda/2$（几百 nm） |
| 光纤包层 | 纤芯模在包层中"超额"衰减 | 几十到几百 nm |
| **SPP** | 介质侧要 $\beta>k_0\sqrt{\varepsilon_2}$ 才倏逝；金属侧因 $\varepsilon_1<0$ **自动**倏逝 | $\delta_d$ 几百 nm，$\delta_m$ 约 20 nm（第 7.6 节） |
| 亚波长光栅 | $a<\lambda$ 时衍射级无解，(1.6) 自动给出虚 $k_z$ | 约 $a/2\pi$ |

**SPP 为什么必然"两侧都是倏逝场"**（这里有个容易搞反的地方）：

- **介质侧**：由 (5.3) 有 $k_d^2=\beta^2-k_0^2\varepsilon_2$，要它为正（倏逝）就必须 $\beta>k_0\sqrt{\varepsilon_2}$——这是第 5 节要证的；
- **金属侧**：$k_m^2=\beta^2-k_0^2\varepsilon_1=\beta^2+k_0^2\lvert\varepsilon_1\rvert>0$ **恒成立**，所以只要 $\varepsilon_1<0$，场在金属里**永远**是指数衰减的，跟 $\beta$ 多大无关。

**这就是"为什么必须是金属"**：只有 $\varepsilon<0$ 才能对任意波矢都提供倏逝解。介质（$\varepsilon>0$）做不到——波矢一旦超过 $nk_0$ 它就"关不住"，会辐射出去。所以表面波只能长在"一边能传播、一边不能传播"的界面上。

### 1.6 历史脉络（记时间线即可）

- **1902** Wood 在金属光栅的反射谱里看到异常暗带（Wood 异常）；
- **1941** Fano 用表面波解释它；
- **1957** Ritchie 理论上指出金属薄膜中存在"表面等离子体"；
- **1959** Powell & Swan 用电子能量损失谱（EELS）实验证实；
- **1968** Otto、Kretschmann 分别提出棱镜耦合方案（第 9 节），SPP 从此可以被光方便地激发；
- **1998** Ebbesen 发现亚波长孔阵列的**异常透射**（EOT），把 SPP 推到纳米光子学中心；
- **2000s** SPP 干涉光刻、SPP 波导、SPR 传感、等离激元超表面……

---

## 2. 金属的光学性质：Drude 模型

> 这一节回答一个前置问题：**为什么金属的 $\varepsilon$ 可以是负的，负了又意味着什么。**

### 2.1 自由电子气的运动方程

把金属看成"自由电子气（数密度 $n$，有效质量 $m$）+ 固定的正离子背景"。电子在电场驱动下运动，同时以碰撞频率 $\gamma=1/\tau$ 损失动量（$\tau$ 为弛豫时间，室温约 $10^{-14}$ s）：

$$
m\ddot{\mathbf{x}}+m\gamma\dot{\mathbf{x}}=-e\mathbf{E}(t).
$$

设谐和驱动 $\mathbf{E}(t)=\mathbf{E}_0e^{-i\omega t}$，取特解 $\mathbf{x}(t)=\mathbf{x}_0e^{-i\omega t}$，代入得 $(-\omega^2-i\gamma\omega)m\mathbf{x}_0=-e\mathbf{E}_0$，即

$$
\mathbf{x}(t)=\frac{e}{m(\omega^2+i\gamma\omega)}\mathbf{E}(t).
$$

> **注意负号去哪了**：$\ddot{\mathbf{x}}=-\omega^2\mathbf{x}$、$\dot{\mathbf{x}}=-i\omega\mathbf{x}$，代回后左边是 $-m(\omega^2+i\gamma\omega)\mathbf{x}_0$，两边同除 $-m(\omega^2+i\gamma\omega)$ 就得到上式。这一步 PPT 直接给了结果。

### 2.2 极化率与介电函数

电子位移产生宏观极化强度 $\mathbf{P}=-ne\mathbf{x}$（$n$ 是数密度，$-e$ 是电子电荷），于是

$$
\mathbf{P}=-\frac{ne^2}{m(\omega^2+i\gamma\omega)}\mathbf{E}.
$$

由 $\mathbf{D}=\varepsilon_0\mathbf{E}+\mathbf{P}=\varepsilon_0\varepsilon(\omega)\mathbf{E}$ 得

$$
\boxed{\varepsilon(\omega)=1-\frac{\omega_p^2}{\omega^2+i\gamma\omega}},
\qquad
\omega_p^2=\frac{ne^2}{\varepsilon_0 m}.
\tag{2.1}
$$

**对应课件 p13 的 Drude 式、教材式 (1.20)。**

把实部虚部分开（分子分母同乘 $\omega^2-i\gamma\omega$）：

$$
\varepsilon_1(\omega)=1-\frac{\omega_p^2\tau^2}{1+\omega^2\tau^2},
\qquad
\varepsilon_2(\omega)=\frac{\omega_p^2\tau}{\omega\,(1+\omega^2\tau^2)} .
\tag{2.2}
$$

高频区 $\omega\tau\gg1$（可见光以上对良导体成立）时阻尼可忽略：

$$
\varepsilon(\omega)\approx 1-\frac{\omega_p^2}{\omega^2}.
\tag{2.3}
$$

这就是课件色散曲线里用的**无阻尼 Drude 金属**。真实贵金属要加一个背景介电常数 $\varepsilon_\infty$（$1\lesssim\varepsilon_\infty\lesssim10$，来自 d 带电子的极化）：

$$
\varepsilon(\omega)=\varepsilon_\infty-\frac{\omega_p^2}{\omega^2+i\gamma\omega}.
\tag{2.4}
$$

### 2.3 三个频段

| 频段 | 条件 | 表现 |
| --- | --- | --- |
| 低频（远红外以下） | $\omega\tau\ll1$ | $\varepsilon_2\gg\lvert\varepsilon_1\rvert$，金属以吸收为主，趋肤深度 $\delta=\sqrt{2/(\sigma_0\omega\mu_0)}$，趋肤深度约 100 nm；光几乎进不去 |
| 中频（近红外—可见） | $1\lesssim\omega\tau\lesssim\omega_p\tau$ | $\varepsilon_1<0$ 且 $\lvert\varepsilon_1\rvert$ 很大，$R\approx1$，金属像镜子；**这是 SPP 的主战场** |
| 高频（紫外以上） | $\omega>\omega_p$ | $\varepsilon_1>0$，金属变"透明"，可以用 $1-\omega_p^2/\omega^2$ 算出 $\omega^2=\omega_p^2+K^2c^2$ 的横波色散 |

### 2.4 关键：$\varepsilon_1<0$ 意味着什么

$\varepsilon_1<0$ 不是"介电常数变成负的"这种算术游戏，它对应**恢复力的相位反转**：在正常介质里，电子被电场推离平衡位置后受到指向平衡位置的恢复力，位移与场同相（$\varepsilon>1$）；当 $\omega<\omega_p$ 时，电子气响应得"太快"，位移相位反转，感生场反过来**削弱**入射场，等效于 $\varepsilon<0$。这时介质中的波矢 $K=\sqrt{\varepsilon}\,\omega/c$ 变成纯虚数——波无法传播，只能以倏逝形式存在。

**倏逝波是 SPP 存在的前提**：只有一侧介质"不能传播波、只能存倏逝场"，场才能被"焊"在界面上而不辐射出去。

### 2.5 真实金属：带间跃迁

Drude 模型在可见区对 Au、Ag 只是**近似**。$\mathrm{Ag}$ 的带间跃迁阈值约 4 eV，Au 约 2.4 eV；阈值以上 $\varepsilon_2$ 被带间吸收抬高，Drude 拟合失效。工程上常用"Drude + 若干 Lorentz 振子"（教材式 1.34）：

$$
m\ddot{\mathbf{x}}+m\gamma\dot{\mathbf{x}}+m\omega_0^2\mathbf{x}=-e\mathbf{E}
\;\Longrightarrow\;
\varepsilon(\omega)=\varepsilon_\infty-\frac{\omega_p^2}{\omega^2+i\gamma\omega}
+\sum_i\frac{A_i}{\omega_i^2-\omega^2-i\gamma_i\omega}.
$$

> **课件给的具体数字（p13）**：$\lambda_0=436$ nm 时银的 $\varepsilon_1=-6.489+i\,0.064$。
> 本笔记后面所有数值算例用 $\varepsilon_\infty=3.7$、$\hbar\omega_p=9.2$ eV、$\hbar\gamma=0.021$ eV 的 Drude 拟合，在 436 nm 给出 $-6.76+i\,0.077$，与课件值一致到 5% 以内，足以做数量级估算。

---

## 3. 从麦克斯韦方程到波动方程

### 3.1 出发点

无外源（$\rho_{ext}=0,\mathbf{J}_{ext}=0$）的宏观麦克斯韦方程：

$$
\nabla\cdot\mathbf{D}=0,\quad
\nabla\cdot\mathbf{B}=0,\quad
\nabla\times\mathbf{E}=-\frac{\partial\mathbf{B}}{\partial t},\quad
\nabla\times\mathbf{H}=\frac{\partial\mathbf{D}}{\partial t}.
$$

取 $\nabla\times$ 第一式并代入第二式、用 $\mathbf{B}=\mu_0\mathbf{H}$、$\mathbf{D}=\varepsilon_0\varepsilon\mathbf{E}$：

$$
\nabla\times\nabla\times\mathbf{E}=-\mu_0\frac{\partial^2\mathbf{D}}{\partial t^2}.
\tag{3.1}
$$

### 3.2 矢量恒等式与 $\nabla\varepsilon$ 项

用 $\nabla\times\nabla\times\mathbf{E}=\nabla(\nabla\cdot\mathbf{E})-\nabla^2\mathbf{E}$，以及 $\nabla\cdot(\varepsilon\mathbf{E})=\varepsilon\nabla\cdot\mathbf{E}+\mathbf{E}\cdot\nabla\varepsilon=0$（因为 $\nabla\cdot\mathbf{D}=0$），得 $\nabla\cdot\mathbf{E}=-(\mathbf{E}\cdot\nabla\varepsilon)/\varepsilon$。代回：

$$
\nabla\!\left(-\frac{1}{\varepsilon}\mathbf{E}\cdot\nabla\varepsilon\right)-\nabla^2\mathbf{E}
=-\mu_0\varepsilon_0\varepsilon\frac{\partial^2\mathbf{E}}{\partial t^2}.
\tag{3.2}
$$

若 $\varepsilon$ 在一个波长尺度内变化很小（界面处严格说不行，所以要**分区求解 + 边界条件匹配**），第一项可略：

$$
\nabla^2\mathbf{E}-\frac{\varepsilon}{c^2}\frac{\partial^2\mathbf{E}}{\partial t^2}=0,
\qquad c=\frac{1}{\sqrt{\varepsilon_0\mu_0}}.
\tag{3.3}
$$

### 3.3 亥姆霍兹方程

设 $\mathbf{E}(\mathbf{r},t)=\mathbf{E}(\mathbf{r})e^{-i\omega t}$（$\partial/\partial t\to-i\omega$）：

$$
\nabla^2\mathbf{E}+k_0^2\varepsilon\,\mathbf{E}=0,
\qquad k_0=\frac{\omega}{c}.
\tag{3.4}
$$

### 3.4 一维几何：$\varepsilon=\varepsilon(z)$

取界面为 $z=0$，波沿 $x$ 传播、在 $y$ 方向均匀（课件 Fig.2 的坐标系）：

$$
\mathbf{E}(x,y,z)=\mathbf{E}(z)\,e^{i\beta x},
\qquad \frac{\partial}{\partial x}=i\beta,\quad \frac{\partial}{\partial y}=0 .
$$

代入 (3.4)：

$$
\boxed{\frac{\partial^2\mathbf{E}(z)}{\partial z^2}+\left(k_0^2\varepsilon-\beta^2\right)\mathbf{E}=0 }.
\tag{3.5}
$$

**这就是课件式 (5)（教材式 2.5），全篇的出发点。** $\beta=k_x$ 称为传播常数。

**这一个方程包含了两种截然不同的解**，取决于括号 $(k_0^2\varepsilon-\beta^2)$ 的符号：

$$
k_0^2\varepsilon>\beta^2:\quad E\propto e^{\pm ik_zz},
\qquad
k_0^2\varepsilon<\beta^2:\quad E\propto e^{\mp\kappa z}.
\tag{3.5b}
$$

前者是**振荡的传播波**（普通的光），后者是 1.5 节讲的**指数衰减的倏逝场**——同一个方程，只因为 $\beta$ 比 $k_0\sqrt{\varepsilon}$ 大，解就从"转圈"变成"掉下去"。**SPP 的全部特殊性，就在于它要求两侧都取后一种解。**

### 3.5 六个耦合方程

把 $\nabla\times\mathbf{E}=i\omega\mu_0\mathbf{H}$、$\nabla\times\mathbf{H}=-i\omega\varepsilon_0\varepsilon\mathbf{E}$ 写成分量，代入 $\partial_x=i\beta$、$\partial_y=0$：

$$
\frac{\partial E_y}{\partial z}=-i\omega\mu_0H_x,
\qquad
\frac{\partial E_x}{\partial z}-i\beta E_z=i\omega\mu_0H_y,
\qquad
i\beta E_y=i\omega\mu_0H_z,
\tag{3.6a-c}
$$

$$
\frac{\partial H_y}{\partial z}=i\omega\varepsilon_0\varepsilon E_x,
\qquad
\frac{\partial H_x}{\partial z}-i\beta H_z=-i\omega\varepsilon_0\varepsilon E_y,
\qquad
i\beta H_y=-i\omega\varepsilon_0\varepsilon E_z .
\tag{3.6d-f}
$$

这个方程组有两组自洽解：

**(a) TM（p 偏振）模**：只有 $E_x,E_z,H_y\ne0$。由 (3.6d) 和 (3.6f)：

$$
E_x=-\frac{i}{\omega\varepsilon_0\varepsilon}\frac{\partial H_y}{\partial z},
\qquad
E_z=-\frac{\beta}{\omega\varepsilon_0\varepsilon}H_y .
\tag{3.7}
$$

把 (3.7) 代入 (3.6b) 并整理，就得到 $H_y$ 的波动方程

$$
\frac{\partial^2H_y}{\partial z^2}+\left(k_0^2\varepsilon-\beta^2\right)H_y=0 .
\tag{3.8}
$$

**（课件式 (7) 上方那三行 $k_i^2=\beta^2-k_0^2\varepsilon_i$ 就是从这里来的。）**

> **推导细节（PPT 略）**：把 $E_z$ 代入 (3.6b)：$\partial_zE_x=i\omega\mu_0H_y+i\beta E_z=i\left(\omega\mu_0-\beta^2/(\omega\varepsilon_0\varepsilon)\right)H_y$；再用 (3.8) 把 $\partial_zH_y$ 的导数换掉，两式自动一致。**这也顺便验证了 (3.7) 与 (3.8) 是自洽的，不是硬凑的**。

**(b) TE（s 偏振）模**：只有 $H_x,H_z,E_y\ne0$：

$$
H_x=\frac{i}{\omega\mu_0}\frac{\partial E_y}{\partial z},
\qquad
H_z=\frac{\beta}{\omega\mu_0}E_y,
\qquad
\frac{\partial^2E_y}{\partial z^2}+\left(k_0^2\varepsilon-\beta^2\right)E_y=0 .
\tag{3.9}
$$

---

## 4. 单界面 SPP 的场分布（TM 模）

### 4.1 几何

- $z>0$：介质，$\varepsilon_2>0$（实数）；
- $z<0$：金属，$\varepsilon_1(\omega)$，要求 $\mathrm{Re}\,\varepsilon_1<0$。

在两侧分别求解 (3.8)，并要求解在 $z\to\pm\infty$ 时衰减（这就是"束缚在界面"）：

$$
H_y(z)=A_2e^{i\beta x}e^{-k_2z}\quad(z>0),
\qquad
H_y(z)=A_1e^{i\beta x}e^{k_1z}\quad(z<0),
$$

其中 $k_1,k_2$ 取**正实部**（倏逝）。用 (3.7) 求 $E_x,E_z$，得到课件式 (7) 与 (8)（教材式 2.10、2.11）：

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig01_geometry.png" alt="图1 单界面SPP几何与场分布" />
</div>
$$
\left.
\begin{aligned}
H_y&=A_2e^{i\beta x}e^{-k_2z}\\
E_x&=iA_2\frac{1}{\omega\varepsilon_0\varepsilon_2}k_2e^{i\beta x}e^{-k_2z}\\
E_z&=-A_2\frac{\beta}{\omega\varepsilon_0\varepsilon_2}e^{i\beta x}e^{-k_2z}
\end{aligned}
\quad\right\}\;z>0,
\qquad
\left.
\begin{aligned}
H_y&=A_1e^{i\beta x}e^{k_1z}\\
E_x&=-iA_1\frac{1}{\omega\varepsilon_0\varepsilon_1}k_1e^{i\beta x}e^{k_1z}\\
E_z&=-A_1\frac{\beta}{\omega\varepsilon_0\varepsilon_1}e^{i\beta x}e^{k_1z}
\end{aligned}
\quad\right\}\;z<0 .
\tag{4.1}
$$

> **课件上的一个小笔误**：p12 的 $E_z(z>0)$ 写成 $-A_1\frac{\beta}{\omega\varepsilon_0\varepsilon_2}e^{i\beta x}e^{-k_2z}$，振幅下标应为 $A_2$。因为下面边界条件会给出 $A_1=A_2$，所以**结果不受影响**，但推导时别被绕进去。

### 4.2 场的特点（先记住，第 7 节会定量算）

1. $H_y$ 是**唯一**的磁场分量，主导；电场有 $E_x$ 和 $E_z$ 两个分量，且**相位相差 $90^\circ$**（因为一个带 $i$，一个不带）。所以 SPP 的电场在 $xz$ 平面内做椭圆偏振，并且**纵向分量 $E_z$ 在界面处最大**——这正是"电子被推着沿 $z$ 方向堆积"的图像，也是 SPP 作为"纵向波"的来源。
2. 两侧都指数衰减，衰减长度 $\hat z_i=1/k_i$ 一般差别很大：介质侧可到几百纳米，金属侧只有 ~20 nm（第 7.5 节）。
3. 场被"夹"在一个远小于 $\lambda_0$ 的薄层里——这就是亚波长约束的来源。

---

## 5. 边界条件与色散关系

### 5.1 两个连续性条件

界面 $z=0$ 处，切向 $\mathbf{E}$ 和切向 $\mathbf{H}$ 连续；在无自由表面电荷/电流时，法向 $\mathbf{D}$ 连续。对 TM 模：

**(i) $H_y$ 连续**（切向磁场）：

$$
A_1=A_2 .
\tag{5.1}
$$

**(ii) $\varepsilon E_z$ 连续**（法向电位移）：

$$
\varepsilon_1E_z(0^-)=\varepsilon_2E_z(0^+)
\;\Longrightarrow\;
-A_1\frac{\beta}{\omega\varepsilon_0}=-A_2\frac{\beta}{\omega\varepsilon_0}
\;\Longrightarrow\;
A_1=A_2,
$$

与 (5.1) 一致（所以它不提供新信息，这是 TM 模的特点）。

**(iii) $E_x$ 连续**（切向电场）：

$$
-iA_1\frac{k_1}{\omega\varepsilon_0\varepsilon_1}=iA_2\frac{k_2}{\omega\varepsilon_0\varepsilon_2}
\;\Longrightarrow\;
\boxed{\frac{k_2}{k_1}=-\frac{\varepsilon_2}{\varepsilon_1}} .
\tag{5.2}
$$

**(5.1)(5.2) 就是课件式 (9)(10)（教材式 2.12）。**

### 5.2 存在条件：为什么必须 $\mathrm{Re}\,\varepsilon_1<0$

$k_1,k_2>0$（束缚要求），由 (5.2)：

$$
\frac{k_2}{k_1}=-\frac{\varepsilon_2}{\varepsilon_1}>0
\;\Longrightarrow\;
\varepsilon_1<0\quad(\varepsilon_2>0).
$$

**结论**：表面波只能存在于"介电常数实部反号"的两种材料之间——**导体 + 绝缘体**。这解释了课件 p13 那句红字，也解释了为什么拿两块玻璃贴在一起看不到 SPP。

### 5.3 联立求 $\beta$（PPT 跳过的那步代数）

波动方程 (3.8) 在每个半空间给出

$$
k_1^2=\beta^2-k_0^2\varepsilon_1,
\qquad
k_2^2=\beta^2-k_0^2\varepsilon_2 .
\tag{5.3}
$$

**(5.3) 就是课件式 (11)。**

把 (5.2) 平方，再用 (5.3) 代入：

$$
\frac{\beta^2-k_0^2\varepsilon_2}{\beta^2-k_0^2\varepsilon_1}
=\frac{\varepsilon_2^2}{\varepsilon_1^2}
$$

交叉相乘：

$$
\varepsilon_1^2\left(\beta^2-k_0^2\varepsilon_2\right)
=\varepsilon_2^2\left(\beta^2-k_0^2\varepsilon_1\right)
$$

$$
\beta^2\left(\varepsilon_1^2-\varepsilon_2^2\right)
=k_0^2\left(\varepsilon_1^2\varepsilon_2-\varepsilon_1\varepsilon_2^2\right)
=k_0^2\varepsilon_1\varepsilon_2\left(\varepsilon_1-\varepsilon_2\right)
$$

两边同除 $(\varepsilon_1-\varepsilon_2)(\varepsilon_1+\varepsilon_2)$：

$$
\boxed{\;\beta=k_0\sqrt{\frac{\varepsilon_1\varepsilon_2}{\varepsilon_1+\varepsilon_2}}\;}
\tag{5.4}
$$

**这就是 SPP 的色散关系——课件式 (12)，教材式 (2.14)，全课程最重要的一个公式。**

它的适用范围：$\varepsilon_1$ 可以是复数（有损耗的真实金属），结论仍然成立，只是 $\beta$ 变复数。

> **自检**：把 $\varepsilon_1=\varepsilon_2$ 代入会得到 $\beta=k_0\sqrt{\varepsilon/2}$，但这不满足 $\mathrm{Re}\,\varepsilon_1<0$ 的前提，是数学上的"假根"。**用 (5.4) 之前先确认 $\mathrm{Re}\,\varepsilon_1<0$。**

---

## 6. 为什么 TE 偏振没有表面模

用 (3.9) 写出 TE 场，形式与 TM 完全平行（课件式 13、14）：

$$
\left.
\begin{aligned}
E_y&=A_2e^{i\beta x}e^{-k_2z}\\
H_x&=-iA_2\frac{k_2}{\omega\mu_0}e^{i\beta x}e^{-k_2z}\\
H_z&=A_2\frac{\beta}{\omega\mu_0}e^{i\beta x}e^{-k_2z}
\end{aligned}
\right\}\;z>0,
\qquad
\left.
\begin{aligned}
E_y&=A_1e^{i\beta x}e^{k_1z}\\
H_x&=iA_1\frac{k_1}{\omega\mu_0}e^{i\beta x}e^{k_1z}\\
H_z&=A_1\frac{\beta}{\omega\mu_0}e^{i\beta x}e^{k_1z}
\end{aligned}
\right\}\;z<0 .
$$

**$E_y$ 连续** $\Rightarrow A_1=A_2$。

**$H_x$ 连续**：

$$
-iA_2\frac{k_2}{\omega\mu_0}=iA_1\frac{k_1}{\omega\mu_0}
\;\Longrightarrow\;
A_1\left(k_1+k_2\right)=0 .
\tag{6.1}
$$

束缚要求 $\mathrm{Re}\,k_1>0$、$\mathrm{Re}\,k_2>0$，故 $k_1+k_2\ne0$，只能是 $A_1=A_2=0$：**场恒为零，没有解**。

**结论：SPP 只存在于 TM（p）偏振。**

**物理直觉**：TE 模的电场 $\mathbf{E}=E_y\hat{\mathbf{y}}$ 完全平行于界面，没有法向分量，也就不能把电子"推"向界面形成电荷堆积，无法激发界面的集体振荡。**必须有 $E_z$ 才能"摇晃"界面电荷。**

> **实验上的直接后果**（课件 p22、教材 Fig.3.10）：做 SPR 实验时把偏振片从 TM 转到 TE，共振凹陷会**完全消失**。这是判断"你看到的是不是真的 SPP"最快的实验判据。

---

## 7. 色散关系的物理：三个极限、传播长度、穿透深度

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig02_dispersion.png" alt="图2 SPP色散关系" />
</div>

### 7.1 归一化色散曲线

把 (2.3) 的无阻尼 Drude 代入 (5.4)，并令 $u=\omega/\omega_p$、横轴 $x=\beta c/\omega_p$：

$$
x=u\sqrt{\frac{u^2-1}{2u^2-1}}\quad(\varepsilon_2=1),
\qquad
x=u\sqrt{\frac{u^2-1}{3.25u^2-1}}\quad(\varepsilon_2=2.25).
\tag{7.1}
$$

这就是课件 Fig.3（p18）的曲线。图中三条"地标线"必须记住：

| 地标 | 表达式 | 物理含义 |
| --- | --- | --- |
| 空气光线 | $\omega=ck$ | 自由空间光的色散，SPP 曲线永远在它**右边** |
| 石英光线 | $\omega=ck/\sqrt{2.25}$ | 同上，介质中的光 |
| 表面等离子体频率 | $\omega_{sp}=\dfrac{\omega_p}{\sqrt{1+\varepsilon_2}}$ | 曲线的水平渐近线 |

### 7.2 极限一：小 $\beta$（远红外）——趋近光线

$\beta\to k_0\sqrt{\varepsilon_2}$ 时，(5.4) 要求 $\lvert\varepsilon_1\rvert\to\infty$，即 $\omega\ll\omega_p$。此时 SPP 的场延伸到介质里很多个波长，行为接近**掠入射的光**（Sommerfeld–Zenneck 波）。这个区间 SPP 几乎"不像表面波"，约束很差。

### 7.3 极限二：$\beta\to\infty$——表面等离子体（静电极限）

令 (5.4) 分母为零：

$$
\varepsilon_1(\omega)+\varepsilon_2=0
\;\Longrightarrow\;
1-\frac{\omega_p^2}{\omega^2}=-\varepsilon_2
\;\Longrightarrow\;
\boxed{\omega_{sp}=\frac{\omega_p}{\sqrt{1+\varepsilon_2}}} .
\tag{7.2}
$$

此时 $\beta\to\infty$，$\lambda_{sp}\to0$，群速度 $v_g=\mathrm{d}\omega/\mathrm{d}\beta\to0$——波"停"在界面上，变成纯粹的静电振荡。

**严格验证**：在静电极限直接解拉普拉斯方程 $\nabla^2\varphi=0$，设 $\varphi=A_2e^{i\beta x}e^{-k_2z}$（$z>0$）、$\varphi=A_1e^{i\beta x}e^{k_1z}$（$z<0$）。由 $\nabla^2\varphi=0$ 得 $k_1=k_2=\beta$（两侧衰减长度相同）；由 $\varphi$ 连续和 $\varepsilon\partial_z\varphi$ 连续得 $A_1=A_2$ 且

$$
\varepsilon_1+\varepsilon_2=0 .
\tag{7.3}
$$

与 (7.2) 完全一致——**说明表面等离子体就是 SPP 在 $\beta\to\infty$ 的极限形式**，两者是同一个东西的两个侧面。

> **术语区分**：$\omega<\omega_{sp}$、$\beta$ 有限的**传播**模式叫 SPP；$\beta\to\infty$ 的**局域**模式叫 surface plasmon（SP）。日常口语里混用，但写论文时要注意。

### 7.4 极限三：$\omega_{sp}<\omega<\omega_p$——禁带与辐射区

- $\omega_{sp}<\omega<\omega_p$：$\varepsilon_1+\varepsilon_2>0$（因为 $\varepsilon_1$ 从 $-\varepsilon_2$ 变到 $-1$ 再变 0），$\beta$ 变**纯虚数**，波不能传播——这是一个**频率禁带**（课件 p18 说"between the bound and radiative modes, a frequency gap region with purely imaginary $\beta$"）。
- $\omega>\omega_p$：$\varepsilon_1>0$，金属变透明，SPP 变成**泄漏模**，能量辐射进金属。

真实金属有损耗（$\mathrm{Im}\,\varepsilon_1\ne0$），禁带被"抹平"：$\mathrm{Re}\,\beta$ 在 $\omega_{sp}$ 附近达到一个**有限最大值**后折返（图 2b），同时出现一段 quasi-bound 泄漏区。这直接给出两个物理上限：

$$
\lambda_{sp}^{\min}=\frac{2\pi}{\mathrm{Re}\,\beta_{\max}},
\qquad
\delta_{\min}\sim\frac{1}{\mathrm{Re}\,\beta_{\max}} .
$$

### 7.5 传播长度 $L$

设 $\beta=\beta'+i\beta''$，场 $e^{i\beta x}=e^{i\beta'x}e^{-\beta''x}$，强度 $\propto\lvert E\rvert^2$：

$$
\boxed{L=\frac{1}{2\,\mathrm{Im}\,\beta}}
\tag{7.4}
$$

（这是能量衰减到 $1/e$ 的距离；有的书定义成场衰减长度 $1/\beta''$，差因子 2，引用时看清定义。）

**$\mathrm{Im}\,\beta$ 从哪来**：从 $\varepsilon_1$ 的虚部来（$\varepsilon_2$ 是实数）。对 $\lvert\varepsilon_1\rvert\gg\varepsilon_2$ 的良导体可以把 (5.4) 展开，得到一个非常好用的近似：

$$
\mathrm{Im}\,\beta\approx k_0\sqrt{\varepsilon_2}\,\frac{\varepsilon_2\,\varepsilon_1''}{2\lvert\varepsilon_1\rvert^2}
\quad\Longrightarrow\quad
\boxed{L\approx\frac{\lvert\varepsilon_1\rvert^{2}}{k_0\sqrt{\varepsilon_2}\;\varepsilon_2\,\varepsilon_1''}} .
\tag{7.4b}
$$

这个式子解释了三件事：① $L\propto\lvert\varepsilon_1\rvert^2$，所以**越远离 $\omega_{sp}$（$\lvert\varepsilon_1\rvert$ 越大）传播越远**；② $L\propto1/\varepsilon_1''$，所以**选低损耗金属**（银）比金好；③ 波长变长时 $\lvert\varepsilon_1\rvert$ 涨得比 $\varepsilon_1''$ 快，故 $L$ 随 $\lambda$ 急剧增大（与 7.7 节表格一致）。

> **验算**：Ag/空气、633 nm，$\lvert\varepsilon_1\rvert=18.4$、$\varepsilon_1''=0.24$、$k_0=9.93\times10^6\ \mathrm{m^{-1}}$，代入得 $L\approx1.2\times10^{-4}$ m $=120$ µm，与精确值 132 µm 差 10%——对估算足够。

### 7.6 穿透深度 $\delta_d$、$\delta_m$

由 (5.3) 与 (5.4) 把 $k_i$ 写成只用 $\varepsilon$ 的形式：

$$
k_d^2=\beta^2-k_0^2\varepsilon_2
=k_0^2\varepsilon_2\left(\frac{\varepsilon_1}{\varepsilon_1+\varepsilon_2}-1\right)
=-\frac{k_0^2\varepsilon_2^2}{\varepsilon_1+\varepsilon_2},
$$

$$
k_m^2=\beta^2-k_0^2\varepsilon_1
=-\frac{k_0^2\varepsilon_1^2}{\varepsilon_1+\varepsilon_2}.
$$

取 $\delta_i=1/\lvert k_i\rvert$（$\varepsilon_1<0$，故 $-\varepsilon_1-\varepsilon_2>0$）：

$$
\boxed{\delta_d=\frac{\lambda_0}{2\pi}\frac{\sqrt{-\left(\varepsilon_1+\varepsilon_2\right)}}{\varepsilon_2}},
\qquad
\boxed{\delta_m=\frac{\lambda_0}{2\pi}\frac{\sqrt{-\left(\varepsilon_1+\varepsilon_2\right)}}{\lvert\varepsilon_1\rvert}} .
\tag{7.5}
$$

两式之比

$$
\frac{\delta_d}{\delta_m}=\frac{\lvert\varepsilon_1\rvert}{\varepsilon_2}
$$

**是本节最实用的一个关系**：银在可见光 $\lvert\varepsilon_1\rvert\approx10$–$20$，所以介质侧穿透深度是金属侧的 10–20 倍。**场主要在介质里，但能量有相当一部分在金属里被吸收**——这正是 SPP 损耗的主要来源，也是第 7.8 节"约束-损耗权衡"的根源。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig03_decay.png" alt="图3 场的横向衰减" />
</div>

### 7.7 数值算例（Ag/空气）

用 $\varepsilon_\infty=3.7$、$\hbar\omega_p=9.2$ eV、$\hbar\gamma=0.021$ eV 的 Drude 拟合计算：

| $\lambda_0$ (nm) | $\varepsilon_1$ | $n_{\mathrm{eff}}=\beta'/k_0$ | $\lambda_{sp}$ (nm) | $L$ (µm) | $\delta_d$ (nm) | $\delta_m$ (nm) | $\theta_{SPP}$（$n_p=1.52$） |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 436 | $-6.76+0.08i$ | 1.083 | 402 | 32 | 167 | 25 | 45.5° |
| 633 | $-18.4+0.24i$ | 1.028 | 616 | 132 | 420 | 23 | 42.6° |
| 800 | $-31.5+0.48i$ | 1.016 | 787 | 253 | 704 | 22 | 42.0° |
| 1550 | $-128+3.5i$ | 1.004 | 1544 | 1161 | 2786 | 22 | 41.3° |

三条要点：

1. **波长压缩很有限**：633 nm 处 $n_{\mathrm{eff}}=1.028$，只比光快 2.8%。想要强压缩必须让 $\omega\to\omega_{sp}$（代价是 $L$ 崩塌）或者用 MIM 结构（第 14.4 节）。
2. **金属侧穿透深度几乎不随波长变**（~22 nm），这是个很有用的经验值。
3. **$L$ 随波长迅速增长**（436 nm 时 32 µm，1550 nm 时 1.2 mm），因为 $\mathrm{Im}\,\beta$ 随 $\lvert\varepsilon_1\rvert$ 增大而减小。

### 7.8 约束-损耗权衡（plasmonics 的"第一性原理"）

把 (7.4) 与 (7.5) 放在一起看：**$\beta'$ 越大（约束越强、$\lambda_{sp}$ 越短），$\beta''$ 也越大（损耗越大、$L$ 越短）**。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig03b_tradeoff.png" alt="图3b 约束与损耗的权衡" />
</div>

这不是偶然，而是因果：约束越强，场越多地"渗"进金属，被自由电子吸收的比例越高。教材里给的一组对比数字更直观（Ag/空气）：

- $\lambda_0=450$ nm：$L\approx16$ µm，$\hat z\approx180$ nm；
- $\lambda_0\approx1.5$ µm：$L\approx1080$ µm，$\hat z\approx2.6$ µm。

**记住这个 trade-off，它是判断任何"等离激元方案能不能用"的第一道关**：要亚波长约束就要接受短传播距离。

---

## 8. 激发难题：动量失配

### 8.1 为什么光直接照不行

由 (5.4)，在 $\varepsilon_1<0$、$\varepsilon_2>0$ 时

$$
\frac{\varepsilon_1}{\varepsilon_1+\varepsilon_2}>1
\;\Longrightarrow\;
\beta=k_0\sqrt{\varepsilon_2}\sqrt{\frac{\varepsilon_1}{\varepsilon_1+\varepsilon_2}}
>k_0\sqrt{\varepsilon_2}=k .
\tag{8.1}
$$

也就是 $\beta>k$：**SPP 的波矢比同频率的光在介质中的波矢还大**。

光以角 $\theta$ 斜入射时，沿界面的动量分量是 $k_x=k\sin\theta\le k$，永远够不到 $\beta$——即使掠入射（$\theta=90^\circ$）也只到 $k$，差一个因子 $\sqrt{\varepsilon_1/(\varepsilon_1+\varepsilon_2)}$。所以**平坦金属表面上的 SPP 不能被自由空间光直接激发**（课件 p19）。

几何上看就是：SPP 色散曲线整条位于光线的**右侧**（图 2a 里"束缚区"）。要在色散图上"从左跨到右"，必须额外补一份动量。

### 8.2 三种补动量的办法

| 办法 | 补充的动量 | 课件位置 |
| --- | --- | --- |
| 棱镜（高折射率介质） | $k_0n_p\sin\theta-k_0\sin\theta$ | p20–22 |
| 光栅/周期结构 | $\pm m\,2\pi/a$ | p23–24 |
| 强聚焦光束/近场探针/粗糙表面 | 连续谱的 $k_x$ | p25 |

下面三节分别讲。

---

## 9. 棱镜耦合（衰减全反射 ATR）

### 9.1 基本思想

把金属膜贴在高折射率棱镜（$n_p=\sqrt{\varepsilon_p}$）上。光从棱镜侧入射，在棱镜/金属界面**全反射**（$\theta>\theta_c=\arcsin(1/n_p)$）。全反射时介质侧存在**倏逝场**，其沿界面的波矢是

$$
k_x=k_0n_p\sin\theta .
$$

只要 $n_p>1$，这个 $k_x$ 就可以超过 $k_0$，从而追上 $\beta$：

$$
\boxed{\beta=k_0n_p\sin\theta}
\tag{9.1}
$$

对应的共振角

$$
\boxed{\theta_{SPP}=\arcsin\!\left(\frac{\beta}{k_0n_p}\right)=\arcsin\!\left(\frac{1}{n_p}\sqrt{\frac{\varepsilon_1\varepsilon_2}{\varepsilon_1+\varepsilon_2}}\right)} .
\tag{9.2}
$$

> **例**：Ag/空气，$\lambda_0=633$ nm，$n_p=1.52$。$\beta/k_0=1.0284$，故 $\sin\theta_{SPP}=1.0284/1.52=0.6766$，$\theta_{SPP}=42.6^\circ$。而临界角 $\theta_c=\arcsin(1/1.52)=41.1^\circ$——**共振角刚好在临界角之上一点点**，这正是"必须全反射才能激发"的体现。

### 9.2 两种构型

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig04_prism.png" alt="图4 棱镜耦合的两种构型" />
</div>

*图 4（重绘）：左 Kretschmann（棱镜底面直接压金属膜），右 Otto（中间留空气隙）*

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide08_prism.jpg" alt="课件 p20 原片：棱镜耦合" />
</div>

*课件 p20 原片（斜拍）：注意"棱镜在上、金属膜居中、空气在下"的层序，以及空气侧那束穿过去的消逝场*

- **Kretschmann**：金属膜直接蒸在棱镜底面（膜厚 40–60 nm，必须薄到倏逝场能"穿"过去）。
- **Otto**：棱镜与金属之间留一层 ~$\lambda/2$ 的空气隙。优点是不接触样品，适合研究表面质量；缺点是间隙难以控制，现在少用。

### 9.3 反射率：三层系统的 Fresnel 公式

把系统看成三层：棱镜(1)/金属(2)/空气(3)，膜厚 $d$。TM 偏振的界面反射系数

$$
r_{ij}=\frac{k_{zi}/\varepsilon_i-k_{zj}/\varepsilon_j}{k_{zi}/\varepsilon_i+k_{zj}/\varepsilon_j},
\qquad
k_{zi}=\sqrt{k_0^2\varepsilon_i-k_x^2},
$$

三层总反射系数（Airy 公式）：

$$
\boxed{r=\frac{r_{12}+r_{23}e^{2ik_{z2}d}}{1+r_{12}r_{23}e^{2ik_{z2}d}},
\qquad R=\lvert r\rvert^2 } .
\tag{9.3}
$$

金属里 $k_{z2}$ 是纯虚数，$e^{2ik_{z2}d}=e^{-2\lvert k_{z2}\rvert d}$ 正是"隧穿因子"：**膜越薄，透过去的场越强，耦合越强**。

共振时 $r\to0$ 的条件是 $r_{12}+r_{23}e^{2ik_{z2}d}=0$，即反射光与 leakage radiation 完全相消。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig06_atr.png" alt="图6 ATR反射率曲线" />
</div>

上图是 (9.3) 的数值结果（$n_p=1.52$，Ag 60 nm，633 nm）：TM 在 42.6° 出现一个极窄的深谷（$R_{\min}\approx0.01$），TE 几乎全反射。**注意这个凹陷的角宽只有约 0.1°**——这正是 SPR 传感能测到 $10^{-5}$ 折射率变化的原因，也是做实验时角度扫描必须足够细的原因（扫粗了会"看不见"谷底）。

**三个必须能解释的特征**：

1. **为什么是"凹陷"而不是"峰"**：激发的 SPP 是**泄漏波**——它既被金属吸收，又把能量辐射回棱镜。这份泄漏辐射与界面直接反射的光**相干相消**，反射率下降。所以角度谱上的最小值，等价于"SPP 被激发了"。
2. **为什么只在 TM**：第 6 节已证明 TE 没有表面模。
3. **为什么有个最佳膜厚**：耦合太弱（膜太厚）激发不了；耦合太强（膜太薄）SPP 又立刻辐射回去，凹陷变宽变浅。二者相等时称**临界耦合**（critical coupling），$R_{\min}\to0$。本算例的最佳厚度约 60 nm（课件用 50 nm，实测也差不多）。

> **易错点**：很多人以为"反射率最低点就是 SPP 共振角"。严格说，观测到的极小角 $\theta_{\min}$ 相对单界面值 $\theta_{SPP}$ 有微小偏移（$\Delta\beta$ 的实部），这是三层耦合导致的。膜越薄偏移越大。

### 9.4 光锥图像

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig05_lightcone.png" alt="图5 棱镜耦合的光锥" />
</div>

*图 5（重绘）：绿色楔形区是棱镜能提供的 $\beta$ 范围（$k_0<\beta<k_0n_p$）*

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide09_lightcone.jpg" alt="课件 p21 原片：光锥图" />
</div>

*课件 p21 原片（斜拍）：课件原文标注了 $\beta=k_0\sqrt{\varepsilon_1\varepsilon_2/(\varepsilon_1+\varepsilon_2)}$*

课件 Fig.5（p21）想说的三件事：

1. 棱镜把"可及"的 $\beta$ 区间从 $[0,k_0]$ 扩展到 $[0,k_0n_p]$（绿色楔形区）；
2. 只有落在 $k_0<\beta<k_0n_p$ 之间的 SPP 才能被这个棱镜激发——比如 Ag/空气界面可以，但 **Ag/棱镜界面不行**（它的 $\beta=k_0\sqrt{\varepsilon_1\varepsilon_p/(\varepsilon_1+\varepsilon_p)}$ 落在 $k_0n_p$ 之外）；
3. 因为 $\beta$ 落在棱镜光锥内，激发的 SPP 必然**泄漏**（辐射进棱镜），所以它是 leaky wave，寿命有限。

**这就是为什么棱镜耦合只能测、不能做器件**——它天生是个"测量工具"，不是"低损耗波导"。

---

## 10. 光栅耦合

### 10.1 相位匹配条件

在金属表面刻周期 $a$ 的光栅（或打孔阵列），周期性提供了额外的倒格矢 $g=2\pi/a$。动量守恒变成（课件式，教材式 3.2）：

$$
\boxed{\beta=k\sin\theta\pm m\frac{2\pi}{a}},\qquad m=1,2,3,\dots
\tag{10.1}
$$

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig07_grating.png" alt="图7 光栅耦合" />
</div>

*图 7（重绘）：左为动量补偿的几何，右为对应的波矢三角形*

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide11_grating.jpg" alt="课件 p23 原片：光栅耦合" />
</div>

*课件 p23 原片（斜拍）：课件上的相位匹配条件 $\beta=k\sin\theta\pm mk_{\mathrm{grating}}$*

$m$ 的物理意义：光栅把入射波"折叠"进布里渊区，第 $m$ 级衍射提供了 $m$ 份倒格矢。$\pm$ 对应向左/向右传播的两个 SPP。

**垂直入射**（$\theta=0$）时最简洁：
$$
\beta=m\frac{2\pi}{a}
\;\Longrightarrow\;
\lambda_{sp}=\frac{2\pi}{\beta}=\frac{a}{m}.
\tag{10.2}
$$

这就是光栅耦合的"设计公式"：**想激发什么波长的 SPP，就选 $a=m\lambda_{sp}$**。反过来，测透射/反射谱的峰位就能反推 $\beta$——这是实验上测 SPP 色散最常用的手段。

### 10.2 逆过程：SPP 的解耦（outcoupling）

(10.1) 是可逆的：在光栅上传播的 SPP 也会把能量辐射到远场。这在实验上极其有用——**你看不到 SPP 本身，但你可以看它漏出来的光**（第 11 节的泄漏辐射显微就是基于这个）。

### 10.3 课件实例：微孔阵列（p24，教材 Fig.3.7/3.8）

- 结构：两块孔阵列，周期 760 nm、孔径 250 nm，相距 30 µm。右边小阵列做**源**（正常入射白光照上去激发 SPP），左边大阵列做**探针**（把 SPP 解耦成辐射）；
- 透射谱在 ~810 nm 出现峰，对应 $\beta=2\pi/760\ \mathrm{nm^{-1}}$ 的 SPP 被激发；
- 近场图（课件 Fig.8）清楚看到两阵列之间有一条亮带——**那就是传播中的 SPP**，遇到左边阵列时迅速衰减（被解耦成辐射）。

> **这个实验的教学价值**：它一次性证明了 (a) 光栅能激发 SPP，(b) SPP 真的沿表面传播，(c) SPP 有明确的衰减长度。三件事在一张图上。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide12_nearfield.jpg" alt="课件 p24 原片：微孔阵列的近场图" />
</div>

*左上是两块孔阵列的 SEM，左下是对应的透射谱（810 nm 峰）；右侧两张是 SPP 在两阵列之间传播的近场图，亮带就是传播中的 SPP，遇到左侧阵列时被解耦成辐射*

### 10.4 光栅的"副作用"：能带折叠与带隙

光栅不只是"耦合器"，它还会**改变 SPP 的色散本身**：周期势使色散在布里渊区边界（$\beta=\pi/a$）打开带隙。凹槽深度到 ~20 nm 就能看到明显带隙；更深的沟槽会在槽内形成局域模式，使 SPP 色散整体下移——这就是"designer plasmon"（教材第 6 章）和 SPP 晶体管的物理基础。

---

## 11. 强聚焦光束激发与泄漏辐射显微

### 11.1 原理

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide13_leakage.jpg" alt="课件 p25 原片：高 NA 物镜激发 SPP 与泄漏辐射收集" />
</div>

*油浸物镜（NA 1.4、60×）经折射率匹配油紧贴玻璃衬底，SPP 以 $\theta_{SPP}>\theta_c$ 的角度把光"漏"回物镜*

用高数值孔径（NA）油浸物镜代替棱镜（课件 p25，教材 Fig.3.9）。NA 大意味着**大的角度范围**，其中包含 $\theta>\theta_c$ 的成分，于是
$$
k_x=k_0n\sin\theta_{SPP}=\beta
\;\Longrightarrow\;
\theta_{SPP}=\arcsin\!\left(\frac{\beta}{nk_0}\right)>\theta_c .
\tag{11.1}
$$

激发的 SPP 又会以同样的角度 $\theta_{SPP}$ 把光辐射回玻璃衬底（leakage radiation）。用同一个物镜收集，就得到一张"SPP 传播图"。

**关键优势**：可以**局域激发 + 宽谱同时激发**（白光连续谱），一次成像就得到多个波长的 SPP 传播长度。

### 11.2 泄漏辐射强度与 SPP 强度的关系

泄漏辐射强度 $\propto$ 局部 SPP 强度，所以图像上的亮度衰减**直接就是** $L$。这是测传播长度最直接的方法（不用拟合角度谱）。

> **实验判据**：TE 偏振下图像应该完全均匀（没有那两个"光 jet"）。课件 Fig.9 的插图就是这个对比。

### 11.3 近场激发（补充）

用孔径 $a\ll\lambda_0$ 的近场探针，探针口的近场包含 $k\gtrsim\beta$ 的分量，可作**点源**激发 SPP。优点是可以任意位置激发（扫描），缺点是效率低、探针易损。教材式 (3.4) 给出点源激发的强度分布：

$$
I_{SPP}\propto\frac{e^{-\rho/L}}{\rho}\cos^2\varphi ,
$$

其中 $\rho,\varphi$ 是以激发点为原点的极坐标，$\varphi$ 相对偏振方向。这个 $\cos^2\varphi$ 说明 SPP 主要沿**偏振方向**发出两个"光 jet"。

---

## 12. 局域表面等离激元（LSP）

> 前面讲的都是"传播的" SPP；如果金属不是半空间而是**纳米颗粒**，就变成"局域的"等离激元。两者公式不同，但物理同源。

### 12.1 准静态近似与极化率

条件：颗粒尺寸 $a\ll\lambda$，颗粒内场的相位近似均匀，可当静电场问题处理。半径 $a$ 的球放在均匀场 $\mathbf{E}_0\hat z$ 中，解拉普拉斯方程 $\nabla^2\phi=0$，取

$$
\phi_{in}=\sum_lA_lr^lP_l(\cos\theta),
\qquad
\phi_{out}=\sum_l\left(B_lr^l+C_lr^{-l-1}\right)P_l(\cos\theta).
$$

边界条件（$r=a$ 处 $\phi$ 连续、$\varepsilon\partial_r\phi$ 连续；$r\to\infty$ 时 $\phi\to-E_0r\cos\theta$）只留下 $l=1$ 项，得到

$$
\phi_{out}=-E_0r\cos\theta+\frac{\varepsilon-\varepsilon_m}{\varepsilon+2\varepsilon_m}\frac{E_0a^3\cos\theta}{r^2}.
\tag{12.1}
$$

第二项正是一个位于球心的**偶极子**的势。对比 $\phi_{dip}=\mathbf{p}\cdot\mathbf{r}/(4\pi\varepsilon_0\varepsilon_mr^3)$ 得

$$
\mathbf{p}=4\pi\varepsilon_0\varepsilon_ma^3\frac{\varepsilon-\varepsilon_m}{\varepsilon+2\varepsilon_m}\mathbf{E}_0
\;\Longrightarrow\;
\boxed{\alpha=4\pi a^3\frac{\varepsilon-\varepsilon_m}{\varepsilon+2\varepsilon_m}} .
\tag{12.2}
$$

**这就是亚波长金属球的极化率（教材式 5.7），LSP 的全部内容都从这里出发。**

### 12.2 Fröhlich 条件与共振频率

$\alpha$ 在分母最小时共振：

$$
\boxed{\mathrm{Re}\,\varepsilon(\omega)=-2\varepsilon_m}
\tag{12.3}
$$

（**Fröhlich 条件**，教材式 5.8）。对 Drude 金属放在空气中：

$$
1-\frac{\omega_p^2}{\omega^2}=-2
\;\Longrightarrow\;
\boxed{\omega_0=\frac{\omega_p}{\sqrt{3}}} .
\tag{12.4}
$$

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig08_lsp.png" alt="图8 局域表面等离激元" />
</div>

图 8b 是我们用 Drude 拟合算的 Ag 球极化率：空气中共振在 ~3.85 eV，换成水（$\varepsilon_m=1.77$）红移到 ~3.42 eV。**环境折射率一变，颜色就变**——这就是 LSP 传感（以及古代教堂彩色玻璃）的原理。

### 12.3 场增强

由 (12.1) 求 $\mathbf{E}=-\nabla\phi$：

$$
\mathbf{E}_{in}=\frac{3\varepsilon_m}{\varepsilon+2\varepsilon_m}\mathbf{E}_0,
\qquad
\mathbf{E}_{out}=\mathbf{E}_0+\frac{3\mathbf{n}(\mathbf{n}\cdot\mathbf{p})-\mathbf{p}}{4\pi\varepsilon_0\varepsilon_m}\frac{1}{r^3}.
\tag{12.5}
$$

共振时分母 $\to$ 小量 $\mathrm{Im}\,\varepsilon$，**内场被放大** $\lvert3\varepsilon_m/\mathrm{Im}\,\varepsilon\rvert$ 倍。这是 SERS（表面增强拉曼）能测单分子的原因：拉曼信号 $\propto\lvert E\rvert^4$，增强因子可以到 $10^{10}$ 量级。

两个截面（标准结果）：

$$
C_{abs}=k\,\mathrm{Im}\,\alpha,
\qquad
C_{sca}=\frac{k^4}{6\pi}\lvert\alpha\rvert^2,
\qquad
C_{ext}=C_{abs}+C_{sca}.
$$

$C_{sca}\propto k^4\propto1/\lambda^4$ 就是**瑞利散射的蓝光增强**，也是天空为什么是蓝的（分子偶极子）与金纳米球溶液为什么是红的（共振在绿光，透射剩红光）的统一解释。

### 12.4 LSP 与 SPP 的对比（务必分清）

| 对比项 | 传播型 SPP | 局域型 LSP |
| --- | --- | --- |
| 载体 | 金属/介质**界面**（半空间或薄膜） | 金属**纳米颗粒/纳米结构** |
| 色散关系 | $\beta=k_0\sqrt{\varepsilon_1\varepsilon_2/(\varepsilon_1+\varepsilon_2)}$ | 无 $\beta$；共振条件 $\mathrm{Re}\,\varepsilon=-2\varepsilon_m$（球） |
| 激发方式 | 需要动量补偿（棱镜/光栅/近场） | **可直接用光激发**（因为颗粒尺寸本身提供大波矢） |
| 波长依赖 | 连续可调（改 $\omega$ 即改 $\beta$） | 分立共振，随尺寸/形状/环境移动 |
| 场约束 | 一维（垂直界面） | 三维（可小于 $\lambda^3/1000$） |
| 损耗 | 传播损耗（$\sim$10–100 µm） | 辐射 + 吸收损耗（寿命 fs 量级） |

> **一句话总结**：SPP 是"沿着界面跑的波"，LSP 是"原地晃的振子"。前者要动量补偿，后者不用。

---

## 13. 应用（一）：SPR 传感

由 (9.2)，$\theta_{SPP}=\arcsin\!\left(\frac{1}{n_p}\sqrt{\frac{\varepsilon_1\varepsilon_2}{\varepsilon_1+\varepsilon_2}}\right)$。

$\varepsilon_2$ 一变（比如表面吸附了一层分子），$\theta_{SPP}$ 就变。**测角度移动 = 测表面折射率变化**。

灵敏度量级：$10^{-5}$–$10^{-7}$ RIU（折射率单位），相当于表面覆盖 ~$10^{-3}$ 单层分子。这就是 Biacore 这类商用仪器的原理，也是过去三十年 SPP 最大的应用市场。

**为什么比"直接测透射"灵敏**：共振极窄（$\Delta\theta\sim0.1^\circ$），角度移动一点点，反射率变化很大——本质上是**把折射率变化放大成了强度变化**。

---

## 14. 应用（二）：SPP 亚波长光刻（课件后半部分）

> 课件从 p31 开始换了一个话题：**用 SPP 做光刻**。逻辑链条是：光刻受衍射极限限制 → 需要近场/亚波长光源 → SPP 能把能量压缩到亚波长 → 用 SPP 的干涉条纹或近场增强来曝光光刻胶。

### 14.1 为什么是光刻（课件 p31）

- 光学光刻是最成熟、最便宜、最适合大面积的技术；
- 但分辨率被 $\lambda/2$ 卡死；
- 缩短波长（EUV、软 X 射线、原子波）能提高分辨率，但光源/掩模/光学系统成本爆炸；
- 替代方案（电子束、离子束、蘸笔、纳米压印）都需要全新基础设施，且速度慢、面积小。

**SPP 路线的卖点**：不需要换光源，只要在掩模上做一层金属结构，用近场/SPP 把 436 nm 的光"改写"成 ~50 nm 的图案。

### 14.2 2004：金属掩模的"隧穿-再辐射"（课件 p33）

Luo & Ishihara, *Appl. Phys. Lett.* **84**, 2004：

- 在 2 mm 厚的石英板上做银掩模，周期 300 nm，开口约为周期的 1/5；
- 光从上方照，**穿过**亚波长开口的倏逝场在出口面激发 SPP，SPP 沿掩模下表面传播再辐射；
- 结果：光刻胶上得到远小于开口尺寸的图案。

**物理要点**：单个亚波长孔的透射极弱（$(\lambda/a)^4$ 量级衰减），但**孔阵列 + SPP** 可以把透射增强几个数量级（EOT 效应），这是它能用于曝光的根本原因。

### 14.3 2005：SPP 干涉光刻（课件 p35）

Z. Liu, Q. Wei, X. Zhang, *Nano Lett.* **5**, 957 (2005)：

- 两条平行光栅（间距 2 µm），周期 205 nm，缝宽 60 nm，曝光波长 377 nm → 光刻胶上 100 nm 周期条纹；
- 四条互相垂直的光栅，周期 130 nm，波长 266 nm → 二维 90 nm 周期点阵。

**原理**：每条光栅把入射光耦合成沿表面传播的 SPP，两束**相向传播**的 SPP（$e^{i\beta x}$ 与 $e^{-i\beta x}$）在中间区域叠加成驻波：

$$
\left(e^{i\beta x}+e^{-i\beta x}\right)^{2}\propto\cos^{2}(\beta x)
\;\Longrightarrow\;
\boxed{\Lambda=\frac{\lambda_{sp}}{2}=\frac{\pi}{\beta}} .
\tag{14.1}
$$

**这就是 SPP 光刻的分辨率公式**：条纹周期是 SPP 波长的一半。因为 $\lambda_{sp}<\lambda_0$，所以突破了 $\lambda_0/2$ 的衍射极限；要想更细，就得让 $\beta$ 更大（更靠近 $\omega_{sp}$，或用腔结构）。

### 14.4 SPPR 腔：把 SPP 压得更狠（课件 p38–40）

**结构**（课件 p38），从上到下：

1. $\mathrm{SiO_2}$ 光栅掩模；
2. Ag 光栅：周期 $a=600$ nm、厚 50 nm、缝宽 60 nm；
3. 光刻胶（PR）：厚度 $d$ 从 10 nm 到 50 nm；
4. Ag 背膜 50 nm（关键的一层）；
5. $\mathrm{SiO_2}$ 衬底。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig09_sppl.png" alt="图9 SPPR腔与开放结构" />
</div>

**与"常规开放结构"的区别**：开放结构是"$\mathrm{SiO_2}$ 掩模 / Ag 掩模 / 光刻胶 / $\mathrm{SiO_2}$ 衬底"四层——**光刻胶下方直接就是 $\mathrm{SiO_2}$，没有金属**，SPP 只能沿着上面那层 Ag 光栅跑，场一路漏进衬底，只有"一个边界"；SPPR 腔在光刻胶**下方**再加一层 Ag 背膜变成五层，把 SPP 上下都"夹住"，形成类似 MIM（金属-绝缘体-金属）的**间隙等离激元（gap plasmon）**。两者的差别只在那一层 50 nm 的 Ag，效果却是条纹从 6 对变 8 对。

**MIM 的色散**（教材式 2.29，这里给出结论）：

$$
\tanh\left(k_1a\right)=-\frac{k_1\varepsilon_2}{k_2\varepsilon_1},
$$

其中 $a$ 是介质（光刻胶）的半厚，$k_{1,2}$ 为两区的横向波矢，$\varepsilon_1$ 是介质的介电常数、$\varepsilon_2$ 是金属的介电函数。**关键行为**：间隙 $2a$ 越小，$\beta$ 越大，而且**没有截止**（$2a\to0$ 时 $\beta\to\infty$）。这正好补上了单界面 SPP"必须靠近 $\omega_{sp}$ 才能大 $\beta$"的缺陷——**用几何而不是用频率来换取约束**。

**场分布对比**（436 nm TM，Ag 光栅 600 nm/50 nm/缝 60 nm，PR 50 nm，Ag 50 nm）：

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide18_field_compare.jpg" alt="课件 p39 原片：SPPR 腔与开放结构的场分布对比" />
</div>

| 指标 | SPPR 腔 | 常规开放结构 |
| --- | --- | --- |
| 干涉条纹对数 | **8 对** | 6 对 |
| 曝光深度/均匀性/对比度 | 明显更高 | 较低 |

**腔长依赖**（把 PR 厚度从 50 nm 减到 10 nm）：

| PR 厚度 $d$ (nm) | 条纹对数 $N$ | 条纹周期 $\Lambda$ (nm) |
| --- | --- | --- |
| 50 | 8 | 75 |
| 30 | 10 | 60 |
| 20 | 12 | 50 |
| 10 | 16 | 33 |

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/fig10_cavity.png" alt="图10 腔长与条纹周期" />
</div>

**怎么读这张表**：在一个 600 nm 的光栅周期内塞进 $N$ 对条纹，则 $\Lambda=a/N$（$600/8=75$、$600/10=60$、$600/12=50$、$600/16\approx37$，与课件 33 nm 同量级，最后一点可能来自条纹数目的不同计法）。而 $\Lambda=\lambda_{sp}/2$，所以

$$
\lambda_{sp}=\frac{2a}{N}\;\Longrightarrow\;
N=8:\ \lambda_{sp}=150\ \mathrm{nm};\quad
N=16:\ \lambda_{sp}\approx75\ \mathrm{nm}.
$$

对比 436 nm 自由空间波长，**SPP 波长被压缩了 3–6 倍**，这就是腔结构相对单界面的全部价值。

<div style="text-align: center;">
  <img src="/assets/posts_figs/course-SPP-plasmonics/slide19_cavity_lengths.jpg" alt="课件 p40 原片：不同腔长下的电场分布" />
</div>

*四张 $E_z$ 场图对应的 PR 厚度依次为 50、30、20、10 nm，条纹对数 8→10→12→16，条纹周期 75→60→50→33 nm。可以看到腔越薄，同样 600 nm 光栅周期里"塞"进去的条纹越多*

> **易错点**：不要把这里的"条纹周期"当成"光栅周期"。光栅周期 $a=600$ nm 是**激励源**的周期；条纹周期是**SPP 干涉**的周期，二者差一个整数因子 $N$。这也是为什么细条纹反而需要"粗"光栅——粗光栅才能提供高阶倒格矢，激发出大 $\beta$。

### 14.5 这条技术路线的局限

1. **只能近场**：SPP 场指数衰减，光刻胶必须紧贴金属（几十纳米），所以只能做"接触式/近接式"曝光，不能投影；
2. **缺陷敏感**：金属的晶粒、粗糙度会散射 SPP，造成条纹不均匀；
3. **热损伤**：金属吸收强，高功率曝光会烧掩模；
4. **图案受限**：干涉条纹天然是周期性的，做任意图形要靠掩模设计（计算光刻反过来算掩模）。

**现状**：SPP 光刻没有取代主流光刻，但在**大面积周期结构**（纳米柱阵列、超表面、生物传感器芯片）上有独特优势，属于"补充技术"而非"替代技术"。

---

## 15. 公式速查表与编号对照

### 15.1 核心公式

| # | 公式 | 名称 | 课件 | 教材 |
| --- | --- | --- | --- | --- |
| 1 | $\varepsilon=1-\omega_p^2/(\omega^2+i\gamma\omega)$ | Drude 介电函数 | p13 | (1.20) |
| 2 | $\partial_z^2\mathbf{E}+(k_0^2\varepsilon-\beta^2)\mathbf{E}=0$ | 波动方程 | (5) | (2.5) |
| 3 | $E_x=-\frac{i}{\omega\varepsilon_0\varepsilon}\partial_zH_y,\ E_z=-\frac{\beta}{\omega\varepsilon_0\varepsilon}H_y$ | TM 场分量 | (7) | (2.8) |
| 4 | $k_2/k_1=-\varepsilon_2/\varepsilon_1$ | 边界条件 | (10) | (2.12) |
| 5 | $k_i^2=\beta^2-k_0^2\varepsilon_i$ | 波矢关系 | (11) | (2.13) |
| 6 | $\beta=k_0\sqrt{\varepsilon_1\varepsilon_2/(\varepsilon_1+\varepsilon_2)}$ | **SPP 色散关系** | (12) | (2.14) |
| 7 | $A_1(k_1+k_2)=0$ | TE 无解 | — | (2.17) |
| 8 | $\omega_{sp}=\omega_p/\sqrt{1+\varepsilon_2}$ | 表面等离子体频率 | p18 | (2.18) |
| 9 | $\varepsilon_1+\varepsilon_2=0$ | 静电极限 | — | (2.21) |
| 10 | $L=1/(2\,\mathrm{Im}\,\beta)$ | 传播长度 | — | §2.2 |
| 11 | $\delta_d=\frac{\lambda_0}{2\pi}\frac{\sqrt{-(\varepsilon_1+\varepsilon_2)}}{\varepsilon_2}$ | 介质侧穿透深度 | — | — |
| 12 | $\delta_m=\frac{\lambda_0}{2\pi}\frac{\sqrt{-(\varepsilon_1+\varepsilon_2)}}{\lvert\varepsilon_1\rvert}$ | 金属侧穿透深度 | — | — |
| 13 | $\beta=k_0n_p\sin\theta$ | 棱镜相位匹配 | p20 | §3.2 |
| 14 | $\beta=k\sin\theta\pm m\,2\pi/a$ | 光栅相位匹配 | p23 | (3.2) |
| 15 | $\alpha=4\pi a^3\frac{\varepsilon-\varepsilon_m}{\varepsilon+2\varepsilon_m}$ | 球极化率 | — | (5.7) |
| 16 | $\mathrm{Re}\,\varepsilon=-2\varepsilon_m$ | Fröhlich 条件 | — | (5.8) |
| 17 | $\Lambda=\lambda_{sp}/2=\pi/\beta$ | SPP 干涉条纹 | p35 | — |

### 15.2 三个"一眼看出"的判据

1. **有没有表面模？** 看 $\mathrm{Re}\,\varepsilon_1<0$ 且 $\varepsilon_2>0$（反号）。
2. **能不能被光直接激发？** 看 $\beta>k$——几乎总是成立，所以**默认不能**。
3. **SPP 跑多远？** $L=1/(2\,\mathrm{Im}\,\beta)$，可见光下银 10–100 µm，金差一些，铝更差。

---

## 16. 常见误区与自检题

### 16.1 五个高频误区

> **误区 1**：$\beta>k$ 说明 SPP "超光速"。
> **纠正**：$\beta$ 是**相位**常数，$v_p=\omega/\beta<c$；$\beta>k$ 只说明它的**波长更短**，不是速度快。事实上 SPP 的群速度 $v_g=\mathrm{d}\omega/\mathrm{d}\beta$ 在 $\omega_{sp}$ 附近趋于 0（慢波）。

> **误区 2**：$\lambda_{sp}=\lambda_0/n$。
> **纠正**：$\lambda_{sp}=\lambda_0\sqrt{(\varepsilon_1+\varepsilon_2)/(\varepsilon_1\varepsilon_2)}$。只有 $\lvert\varepsilon_1\rvert\to\infty$ 才退回 $\lambda_0/\sqrt{\varepsilon_2}$；一般情况它**更短**（见 7.7 表）。

> **误区 3**：穿透深度 $\delta$ 是"强度衰减到 $1/e$"。
> **纠正**：$\delta=1/k$ 是**场幅**衰减到 $1/e$；强度衰减到 $1/e$ 的距离是 $\delta/2$。写论文时被审稿人抓的就是这个。

> **误区 4**：SPP 一定比光损耗大。
> **纠正**：要看波导类型。长程 SPP（LRSPP，薄膜对称结构）的 $L$ 可以到毫米甚至厘米，比很多硅光波导还低——代价是约束变差（第 14.4 节的 MIM 是反例）。

> **误区 5**：光栅耦合效率一定低。
> **纠正**：优化槽深/占空比后，光栅耦合效率可以做到 50% 以上；介质光栅（几纳米深）也能有效解耦。

### 16.2 自检题（题下即答案，先遮住再想）

**1. 从 $\nabla\times\nabla\times\mathbf{E}$ 推到 $\partial_z^2E+(k_0^2\varepsilon-\beta^2)E=0$，中间用到了哪两个假设？**

**答**：两个"真假设"加三个"标准步骤"。

- 假设一：**$\varepsilon$ 在一个波长尺度内缓变**，所以 (3.2) 里的 $\nabla(\mathbf{E}\cdot\nabla\varepsilon/\varepsilon)$ 项可以丢掉。注意这对**界面处不成立**（$\varepsilon$ 是阶跃），所以只能分区求解、再用边界条件拼接——这正是第 5 节存在的理由。
- 假设二：**无外源**（$\rho_{ext}=0$、$\mathbf{J}_{ext}=0$），才能把 $\nabla\times\nabla\times\mathbf{E}$ 直接写成 $-\mu_0\partial_t^2\mathbf{D}$。
- 标准步骤：线性/各向同性/非磁性（$\mathbf{D}=\varepsilon_0\varepsilon\mathbf{E}$）、谐和（$\partial_t\to-i\omega$，得到亥姆霍兹方程）、一维几何（$\partial_y=0$、$\partial_x=i\beta$）。

**2. 为什么 $E_x$ 连续给出 $k_2/k_1=-\varepsilon_2/\varepsilon_1$，而 $\varepsilon E_z$ 连续什么新信息都没给？**

**答**：因为它俩在 TM 模里是同一个方程。

把 (4.1) 代入 $E_x$ 连续：$-iA_1k_1/(\omega\varepsilon_0\varepsilon_1)=iA_2k_2/(\omega\varepsilon_0\varepsilon_2)$，用 $A_1=A_2$ 约掉即得 (5.2)。

而 $\varepsilon E_z=-A\beta/\omega\varepsilon_0$——$\varepsilon$ 被 $E_z$ 里的 $1/\varepsilon$ 抵消了，两半空间自动相等，只重复了 $A_1=A_2$。物理原因：TM 模只有一个磁场分量 $H_y$，而 $E_z\propto H_y$，所以"法向 $D$ 连续"与"切向 $H$ 连续"本来就是同一个条件。

**反观 TE 模恰好相反**：那里 $E_y$ 连续只给 $A_1=A_2$，而 $H_x$ 连续给出致命的新条件 $A_1(k_1+k_2)=0$——这就是 TE 无解的全部原因。

**3. 用 (5.4) 证明 $\beta>k_0\sqrt{\varepsilon_2}$，并说明等号何时成立。**

**答**：把 (5.4) 除以 $k_0\sqrt{\varepsilon_2}$：

$$
\frac{\beta}{k_0\sqrt{\varepsilon_2}}=\sqrt{\frac{\varepsilon_1}{\varepsilon_1+\varepsilon_2}} .
$$

$\varepsilon_1<0$、$\varepsilon_2>0$ 时 $\varepsilon_1+\varepsilon_2<\varepsilon_1<0$，两个负数相除为正且**大于 1**（分母的绝对值更小），故比值 $>1$，即 $\beta>k_0\sqrt{\varepsilon_2}$。

等号要求 $\varepsilon_1/(\varepsilon_1+\varepsilon_2)\to1$，即 $\varepsilon_2/\lvert\varepsilon_1\rvert\to0$，也就是 $\lvert\varepsilon_1\rvert\to\infty$、$\omega\ll\omega_p$ 的**非推迟极限**。此时 SPP 紧贴光线，退化成介质表面的 Sommerfeld–Zenneck 波。

**4. 银在 633 nm 的 $\delta_d\approx420$ nm、$\delta_m\approx23$ nm，比值说明了什么？为什么这个比值决定了损耗？**

**答**：比值

$$
\frac{\delta_d}{\delta_m}=\frac{\lvert\varepsilon_1\rvert}{\varepsilon_2}\approx18
$$

说明**约束主要写在介质侧，损耗却全部发生在金属那一薄层里**：场在空气里铺开 420 nm，在银里只钻 23 nm。

为什么这决定了损耗：吸收功率正比于 $\int_{\text{metal}}\varepsilon_1''\lvert E\rvert^2\,\mathrm{d}z$。积分区间只有 23 nm，但（i）界面处场强最大，（ii）$\varepsilon_1''\neq0$ 就一定有吸收——所以**金属这一薄层就是全部损耗的来源**。真正决定损耗的是 $\mathrm{Im}\,\beta$，由 (7.4b) 有 $\mathrm{Im}\,\beta\propto\varepsilon_1''/\lvert\varepsilon_1\rvert^{2}$，所以 $\lvert\varepsilon_1\rvert$ 越大，损耗越小。把 (7.4b) 抄过来：

$$
L\approx\frac{\lvert\varepsilon_1\rvert^{2}}{k_0\sqrt{\varepsilon_2}\,\varepsilon_2\,\varepsilon_1''},
$$

所以 $\lvert\varepsilon_1\rvert$ 越大（远离 $\omega_{sp}$）、$\varepsilon_1''$ 越小（银比金好），跑得越远。这与 7.7 节的表完全一致：436 nm 时 32 µm，1550 nm 时 1161 µm。

**5. 棱镜耦合为什么必须在临界角之上？在临界角之下会发生什么？**

**答**：临界角之下（$\theta<\theta_c$），光大部分直接透射进空气，界面两侧都是**传播波**，没有倏逝场；而且此时 $k_x=k_0n_p\sin\theta<k_0<\beta$，动量差得更远。

临界角之上（$\theta>\theta_c$），发生全反射，空气侧出现倏逝场（1.5 节），它的 $k_x=n_pk_0\sin\theta$ 可以大于 $k_0$。当

$$
\sin\theta_{SPP}=\frac{\beta}{n_pk_0}=\frac{1}{n_p}\sqrt{\frac{\varepsilon_1\varepsilon_2}{\varepsilon_1+\varepsilon_2}}
$$

时恰好匹配。又因为 $\beta>k_0$（第 8 节），必有 $\sin\theta_{SPP}>1/n_p=\sin\theta_c$，所以**共振角一定落在临界角之上**——这不是巧合，是 $\beta>k_0$ 的直接推论。

**6. 光栅垂直入射时，为什么 $\lambda_{sp}=a/m$？如果 $a<\lambda_{sp}$ 还能激发吗？**

**答**：垂直入射 $\theta=0$ 时 $k_x=0$，(10.1) 退化为 $\beta=m\,2\pi/a$；又 $\beta=2\pi/\lambda_{sp}$，两式相等即得 $\lambda_{sp}=a/m$。物理图像：光栅只提供离散的倒格矢 $m\,2\pi/a$，SPP 只能落在这些"格子"上。

"$a<\lambda_{sp}$ 能不能激发"要先问是**哪个** $\lambda_{sp}$：

- 若指"给定的目标波长"：$a<\lambda_{sp}$ 需要 $m<1$，无解，**激发不了**。此时光栅提供的动量"太大"，反而只能激发更短波长的 SPP（$m=2,3,\dots$ 对应的 $\lambda_{sp}=a/m$）。
- 所以光栅是**离散选择器**，不是连续可调。想连续调谐，得改 $a$、改 $\theta$，或者用棱镜（$k_x$ 随 $\theta$ 连续变化）。

**7. SPPR 腔为什么能把条纹周期压到 33 nm，而单界面 SPP 做不到？**

**答**：因为两者的"大 $\beta$ 从哪来"完全不同。

- **单界面**：$\beta$ 完全由频率决定，$\beta=k_0\sqrt{\varepsilon_1\varepsilon_2/(\varepsilon_1+\varepsilon_2)}$。要 $\beta$ 大就必须 $\omega\to\omega_{sp}$，而真实金属在那里 $\mathrm{Re}\,\beta$ 会折返（有上限），且损耗急剧上升、$L\to0$。**等于用"靠近共振"换约束，代价是波跑不动。**
- **SPPR 腔（MIM）**：$\beta$ 由**几何**决定，$\tanh(k_1a)=-k_1\varepsilon_2/(k_2\varepsilon_1)$，间隙 $2a\to0$ 时 $\beta\to\infty$ 且**没有截止**。可以在远离 $\omega_{sp}$ 的地方拿到大 $\beta$，损耗不至于失控。**等于用"缩小间隙"换约束。**

数字上：8 对→16 对条纹对应 $\lambda_{sp}$ 从 150 nm 缩到 75 nm，相对 436 nm 压缩 3–6 倍。

**8. 为什么 LSP 可以被光直接激发，而 SPP 不能？**

**答**：关键在"动量由谁提供"。

- **SPP**：界面是无限大的、平移不变的，$k_x$ 必须严格守恒，而 $\beta>k_0\sqrt{\varepsilon_2}$ 是色散关系钉死的。自由空间光的 $k_x\le k_0$ 永远够不到，所以必须外接棱镜/光栅（第 9、10 节）来补。
- **LSP**：颗粒尺寸 $a\ll\lambda$，**平移对称性被破坏**。空间上被限制在 $a$ 内的场，按傅里叶（不确定性）关系必然含有 $\sim1/a\gg k_0$ 的波矢分量。换句话说，**颗粒的几何本身就是一台动量补偿器**，光一照就匹配上了。

这也顺带解释了二者的"调谐旋钮"为什么不同：SPP 靠材料色散 $\varepsilon(\omega)$，LSP 靠形状、尺寸、周围介质的 $\varepsilon_m$（Fröhlich 条件 $\mathrm{Re}\,\varepsilon=-2\varepsilon_m$）。

---

## 附录：教材对应章节

| 教材章节 | 内容 | 本笔记 |
| --- | --- | --- |
| Ch.1（1.1–1.2） | 麦克斯韦方程、Drude 模型 | §2、§3 |
| Ch.1（1.3–1.4） | 体等离子体、带间跃迁 | §2.3、§2.5 |
| **Ch.2（2.1–2.2）** | **单界面 SPP：波动方程、色散、TE 无解** | **§3–§7** |
| Ch.2（2.3–2.4） | 多层/薄膜耦合、有效模长 | §14.4（MIM） |
| **Ch.3（3.2–3.4）** | **棱镜、光栅、强聚焦激发** | **§9–§11** |
| Ch.4 | 泄漏辐射显微、近场成像 | §11 |
| **Ch.5（5.1）** | **LSP：极化率、Fröhlich 条件** | **§12** |
| Ch.7 | SPP 波导（LRSPP、条纹波导） | §16.1 误区 4 |
| Ch.8–10 | 异常透射、SERS、传感 | §13、§14.2 |

---

*整理自课件照片与教材《Plasmonics: Fundamentals and Applications》（Maier, Springer 2007）。所有数值算例用 $\varepsilon_\infty=3.7$、$\hbar\omega_p=9.2$ eV、$\hbar\gamma=0.021$ eV 的 Drude 拟合计算，与课件的 Johnson–Christy 实测值在可见区一致到 5% 以内。*
