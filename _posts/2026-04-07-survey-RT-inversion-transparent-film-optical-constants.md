---
layout: post
title: "[专题调研] 仅用 R/T 曲线反演透明介质薄膜光学常数 (n, k, d) 研究综述"
date: 2026-04-07 10:31:43 +0800
categories: Project
mathjax: true
---

# [专题调研] 仅用 R/T 曲线反演透明介质薄膜光学常数 (n, k, d) 研究综述

> **调研范围**：透明介质薄膜（BaF₂、CaF₂、CeF₂/CeF₃、SiO₂、HfO₂等）  
> **核心问题**：仅利用透射率 T(λ) 和/或反射率 R(λ) 光谱曲线，反演薄膜折射率 n、消光系数 k 及厚度 d  
> **整理时间**：2026-04-07

---

## 一、问题背景与物理基础

### 1.1 为什么用 R/T 而非椭偏

椭偏仪（SE）是表征薄膜光学常数的黄金标准，但在以下场景中，R/T 光谱法具有不可替代的优势：

| 对比维度 | 椭偏法（SE） | R/T 光谱法 |
|---------|-------------|-----------|
| 仪器成本 | 高（几十万至百万） | 低（分光光度计，几万元） |
| 现场/在线测量 | 需斜入射，腔体集成复杂 | 正入射，易集成 |
| 厚膜（>1 μm） | 需扫描模型拟合 | 干涉条纹丰富，信息量大 |
| 近透明薄膜（k≈0） | 对 k 灵敏度低 | 吸收边特征可直接提取 |
| 标准化程度 | 较高（IEC 62624） | 中国已有团体标准 T/CSTM 00313—2021 |

### 1.2 正问题与反问题

**正问题**（给定 n, k, d → 计算 R, T）：  
采用**传递矩阵法（Transfer Matrix Method, TMM）**，对于单层薄膜（衬底 + 薄膜 + 空气结构）：

$$M = \begin{pmatrix} \cos\delta & -\frac{i\sin\delta}{\tilde{n}} \\ -i\tilde{n}\sin\delta & \cos\delta \end{pmatrix}$$

其中 $\delta = \frac{2\pi \tilde{n} d}{\lambda}$ 为相位厚度，$\tilde{n} = n - ik$ 为复折射率。

整个系统的 R 和 T 可由特征矩阵的元素直接计算。

**反问题**（给定 R(λ), T(λ) → 求解 n, k, d）：  
这是一个典型的**不适定（ill-posed）非线性反演问题**，存在以下挑战：
- **参数耦合**：n, k, d 三者耦合，单个波长方程有多解
- **多值问题**：对于厚膜，相位 δ 可能跨越多个 2π 周期（级次模糊）
- **噪声敏感**：实验 R/T 存在测量误差，反演容易陷入局部极小

---

## 二、核心方法分类

### 2.1 解析/半解析方法

#### 2.1.1 Swanepoel 包络法（1983）

**来源**：R. Swanepoel, *Journal of Physics E: Scientific Instruments*, 16, 1214 (1983)  
**适用范围**：弱吸收薄膜（k 很小）、仅需 T(λ) 谱  
**核心思路**：

1. 从透射谱中提取**上包络 T_M(λ)** 和**下包络 T_m(λ)**（干涉条纹的极大值和极小值）
2. 利用包络曲线建立关于 n 和 k 的方程：

$$n = \left[ N + \sqrt{N^2 - n_s^2} \right]^{1/2}$$

其中 $N = 2n_s \frac{T_M - T_m}{T_M \cdot T_m} + \frac{n_s^2 + 1}{2}$，$n_s$ 为衬底折射率

3. 由相邻干涉极值波长确定膜厚 d
4. 由 T 与包络偏差程度计算 k

**优点**：无需迭代，计算快速，物理直观  
**局限性**：
- 需要足够多干涉条纹（膜厚通常 >200 nm）
- k 精度有限（通常 >10⁻⁴ 量级）
- 包络提取精度影响结果
- 不适用于高吸收薄膜

**2025年改进**：M. Ballester 等（Arizona大学）提出精确包络检测算法，改善干涉条纹的自动提取精度，发表于 *Optics Letters* (2025)。

---

#### 2.1.2 双厚度法 / 多厚度法

**核心思想**：对**同一材料**制备两个（或多个）不同厚度的样品，分别测量 T(λ) 或 R(λ)，利用差值消除衬底贡献，直接解析 n 和 k。

**典型方程**（两厚度 d₁, d₂，吸收系数 α）：
$$\alpha = \frac{1}{d_2 - d_1} \ln\frac{T_1(\lambda)}{T_2(\lambda)}$$

进一步结合折射率 n 的 Kramers-Kronig 关系可得完整色散曲线。

**代表文献**：
- **2023年中国研究**：雷正龙等，《基于多项式求根的双厚度透射率模型确定透明固体光学常数》，*红外与毫米波学报*，2024年。该方法**无需迭代**，通过多项式求根直接解出 n，验证了 CaF₂ 和 Si 的光学常数。
- Minkov, D. A., *J. Phys. D: Appl. Phys.* (1989)：最早系统论述双厚度法的论文之一

**优缺点**：
- ✅ 避免了级次模糊问题
- ✅ 无反演迭代，无多值问题  
- ❌ 需要额外制备两块样品，增加工艺一致性要求
- ❌ 两样品间材料性质差异会引入系统误差

---

#### 2.1.3 极值点法（Extremum Method）

利用 T(λ) 或 R(λ) 干涉极值点处相位条件满足特定关系（$2nd = m\lambda$）来精确确定膜厚和折射率。

**2024年新进展**：S. Rana 等，*Surface and Interface Analysis* (Wiley, 2024)，《用于确定透明薄膜厚度和光学特性的理论模型》，通过极值级次分析建立了稳健的参数提取模型，适用于 TCO（透明导电氧化物）薄膜。

---

### 2.2 优化/拟合方法（最主流）

#### 2.2.1 基本框架

定义目标函数（merit function / χ²）：
$$\chi^2 = \sum_{\lambda_i} \left[ \left(\frac{T_{calc}(\lambda_i) - T_{meas}(\lambda_i)}{\sigma_T}\right)^2 + \left(\frac{R_{calc}(\lambda_i) - R_{meas}(\lambda_i)}{\sigma_R}\right)^2 \right]$$

其中 $T_{calc}$、$R_{calc}$ 由 TMM 正演计算，$\sigma$ 为测量不确定度权重。

通过优化算法最小化 χ²，反演得到 n(λ), k(λ), d。

#### 2.2.2 色散模型参数化（关键）

不直接拟合每个波长的 n 和 k，而是用**物理色散模型**参数化，大幅减少自由参数数量，提高唯一性：

| 色散模型 | 适用材料 | 参数数量 |
|---------|---------|---------|
| **Cauchy 模型** $n=A+B/\lambda^2+C/\lambda^4$ | 透明介质（k≈0）：SiO₂、CaF₂、BaF₂ | 3~4 |
| **Sellmeier 模型** | 宽波段透明介质 | 6~8 |
| **Tauc-Lorentz 模型** | 半导体、氧化物（含带间跃迁）：HfO₂、TiO₂ | 5/振子 |
| **Drude-Lorentz 模型** | 金属/半导体混合情况 | 多 |
| **B-spline / 通用色散模型（UDM）** | 宽波段复杂材料（见 HfO₂ UDM 论文） | 20~50 |

> **注**：对于 BaF₂、CaF₂、SiO₂ 等近理想透明介质，在可见-近红外波段 k≈0，Cauchy 或 Sellmeier 模型即可。

#### 2.2.3 局部优化算法

- **Levenberg-Marquardt（LM）算法**：梯度下降 + Gauss-Newton，最常用，收敛快，但需要好的初值
- **共轭梯度法（CG）**：内存效率高
- **信赖域算法（Trust-Region Reflective）**：Springer 2024 年 HebalOptics 软件采用，稳健

#### 2.2.4 全局优化算法（解决多值问题）

| 算法 | 代表文献 | 特点 |
|-----|---------|-----|
| **遗传算法（GA）** | Manifacier et al. | 仿生进化，无需梯度 |
| **粒子群优化（PSO）** | iScience 2025 综述 | 群体智能，参数少 |
| **模拟退火（SA）** | 多种软件集成 | 避免局部极小 |
| **差分进化（DE）** | 2022 PLOS ONE | 最新研究使用 |
| **进化优化** | Dutta et al., PLOS ONE (2022) | MIT 团队，同时拟合 R+T |

**代表工作**：  
Dutta 等（MIT，PLOS ONE 2022）：提出基于**进化优化**的方法，同时利用 R(λ) 和 T(λ) 谱（350–1000 nm），在无需初值的情况下提取各种薄膜（氧化物、氟化物、半导体）的 n, k, d，在 SiO₂/硅体系上验证了方法有效性。

---

### 2.3 基于反射率包络的方法（仅 R 曲线）

2024年 *Optical Materials* 发表的研究提出**仅用反射谱包络**确定薄膜厚度和光学特性：
- **来源**：《Determination of the thickness and optical properties by reflectance method》，*Optics and Laser Technology*，2024年3月
- 方法：从反射谱中提取干涉条纹包络，用类 Swanepoel 方法处理，再与透射谱结果互相验证
- 优点：在只有反射测量（如不透明衬底样品）时提供独立检验手段

---

### 2.4 正则化与自洽方法

**自洽（Self-consistent）方法**核心思想：  
要求最终反演的 n(λ), k(λ) 满足 **Kramers-Kronig（K-K）关系**（因果律约束）：

$$n(\omega) - 1 = \frac{2}{\pi} \mathcal{P}\int_0^\infty \frac{\omega' k(\omega')}{\omega'^2 - \omega^2} d\omega'$$

在拟合中加入 K-K 约束作为正则项，可大幅减少解的不确定性，排除非物理解。

**代表文献**：  
- Poelman & Smet, 《自洽确定 MgF₂ 和 CeF₃ 薄膜光学常数》，*Journal of Physics D* (2003)，用 R+T 数据，K-K 自洽方法确定氟化物薄膜光学常数，对比了衬底-薄膜同步反演与单独反演的差异

---

### 2.5 在线/原位监控方法

**来源**：上海光机所团队（薛春荣、易葵等），《薄膜光学常数的原位测定》，*红外与毫米波学报* 2022年  
**方法**：在镀膜过程中实时监测 T(λ)（或 R(λ)），结合传递矩阵模型在线反演，可在不停止镀膜的情况下动态更新 n, k 估计值。  
**优点**：无需事后离线测量，实时反馈镀膜工艺  
**挑战**：需要稳定的光学窗口设计，实时计算速度要求高

另外，来自中国研究机构（*Infrared and Laser Engineering* 2022年5月）的工作提出了基于透射率监测的现场原位测定方法，通过仅监测 T(λ) 即可快速估算 n, k。

---

### 2.6 深度学习 / 神经网络方法（2020年后新兴）

| 方向 | 代表文献 | 特点 |
|-----|---------|-----|
| 前馈神经网络直接回归 | IOP ML (2020)：2D材料光学常数神经网络确定 | 训练一次，推理极快 |
| 卷积神经网络（CNN）特征提取 | IEEE TIM (2022)：深度学习薄膜测厚 | 学习 T(λ) 谱型特征 |
| 物理嵌入神经网络（PINN） | 多项最新工作 | 结合 TMM 物理约束 |
| SUNDIAL 系统（椭偏） | *Light: Sci. Appl.* 2021 | 逆网络+正网络迭代（本仓库有复现代码）|

> **说明**：深度学习方法主要面向椭偏（ΨΔ）或大规模在线推理场景；纯 R/T 反演中的应用相对较少，但正在兴起。

---

## 三、目标材料综述

### 3.1 BaF₂（氟化钡）

| 参数 | 数值 |
|-----|-----|
| 透明波段 | 150 nm – 15 μm（极宽，覆盖深紫外-中红外） |
| 可见光 n (500 nm) | ~1.475（块体），薄膜约 1.45–1.47 |
| k（可见-近红外） | <10⁻⁴，近似透明 |
| 晶体结构 | 立方萤石型 |
| 常用衬底 | MgF₂ 单晶（紫外）、硼硅酸盐玻璃（可见）|

**R/T 反演要点**：
- 可见光区 k≈0，用 Cauchy/Sellmeier 拟合 n 即可
- 中红外区（>5 μm）存在多声子吸收带，需 Lorentz 振子模型
- 薄膜 n 通常低于块体（孔隙率效应，Bruggeman 有效介质修正）

**代表研究**：
- Wolfe & Giacomo, *Optical Engineering* (1988)：在 MgF₂ 衬底上测量了 BaF₂ 薄膜的 n, k（200–1200 nm），方法：T(λ) 谱 + Swanepoel 法
- Kim 等 *J. Opt. Microsystems* (2022)：Ge/BaF₂ 中红外滤波器薄膜结构，椭偏+R/T 联合表征光学常数（SPIE）
- **复折射率红外研究**：Querry 等 (2017) 在 ResearchGate 发表 BaF₂ 和 CaF₂ 的单角度红外反射率方法（2.5–25 μm），仅用单角度 R 光谱重建 n+ik

---

### 3.2 CaF₂（氟化钙）

| 参数 | 数值 |
|-----|-----|
| 透明波段 | 135 nm – 10 μm |
| 可见光 n (500 nm) | ~1.434（块体），薄膜约 1.39–1.43 |
| k（可见-近红外） | <10⁻⁵，极透明 |
| 应用 | 深紫外增透膜（157 nm 光刻）、红外窗口 |

**R/T 反演要点**：
- 由于 k 极小，需高精度 T 测量（优于 0.1%）才能有效确定 k
- 真空紫外区（<200 nm）存在显著吸收，需 VUV 光源和 KBr 分光光度计
- 157 nm 光刻应用需超低 k（<10⁻⁶），对测量精度要求极高

**代表研究**：
- **Burnett et al., AO (2002)**：《CaF₂、SrF₂、BaF₂、LiF 在 157 nm 附近的精确折射率》，Optica（OL），高精度干涉测量
- **MDPI Appl. Sci. 2020**：《CaF₂ 薄膜光学特性（沉积在硼硅酸盐玻璃上）》，用 R/T 光谱确认 AR 涂层性能
- **双厚度法验证**（2023年中国研究）：用 CaF₂ 晶体验证多项式求根双厚度法，n 符合已知文献值

---

### 3.3 CeF₂ / CeF₃（氟化铈）

> **注意**：文献中的"CeF₂"多为早期研究，现代研究通常是稳定的 CeF₃（三价铈），部分情况下两者并存于薄膜中。

| 参数 | CeF₃ 数值 |
|-----|----------|
| 透明波段 | 300 nm – 5 μm |
| 可见光 n (500 nm) | ~1.62–1.63 |
| 带隙 | ~5.4 eV（近紫外吸收边） |
| 应用 | 高折射率 DUV/UV 膜材、中折射率 AR 膜 |

**R/T 反演要点**：
- 近紫外（300–400 nm）存在铈的 4f→5d 跃迁吸收，k 较大（需 Tauc-Lorentz 模型）
- 可见-近红外区透明，Cauchy 或 Sellmeier 即可
- 注意 Ce²⁺/Ce³⁺ 氧化态对光学常数影响，需沉积条件控制

**代表研究**：
- **Poelman & Smet, J. Phys. D (2003)**：《MgF₂ 和 CeF₃ 薄膜的自洽光学常数》，利用 R+T 数据，K-K 自洽约束方法，在 250–900 nm 波段测定 CeF₃ 薄膜 n, k
- **国内研究（上海光机所）**：薛春荣等（2014），《改进包络技术确定氟化物薄膜光学常数》，*中国激光*，对 LaF₃、GdF₃、NdF₃、CeF₃ 等氟化物薄膜用改进 Swanepoel 包络法提取 n(λ)

---

### 3.4 SiO₂（二氧化硅）

| 参数 | 熔融石英/薄膜 |
|-----|-------------|
| 透明波段 | 160 nm – 2.5 μm |
| 可见光 n (500 nm) | 1.46（熔石英），薄膜 1.42–1.48（视沉积方法） |
| k（可见区） | <10⁻⁶，极透明 |
| 常用模型 | Sellmeier 3-项式 |

**R/T 反演挑战**：
- SiO₂ 折射率与玻璃衬底（BK7 n≈1.52，熔石英 n≈1.46）差异小，干涉对比度低，T 变化幅度小
- 需要使用 Si 衬底（n≈3.5，高对比度）或 CaF₂ 衬底来获得清晰干涉条纹

**代表研究**：
- **HfO₂-SiO₂ 复合薄膜光学常数（2011年 ResearchGate）**：共蒸发沉积，通过 T(λ) 光谱反演，表征不同 HfO₂:SiO₂ 比例下 n 随组分变化，用于宽带 HR 膜设计
- **Dutta et al. PLOS ONE (2022)**：以 SiO₂/Si 体系为验证，进化算法从 R+T 同时反演 n, k, d

---

### 3.5 HfO₂（二氧化铪）

| 参数 | 数值 |
|-----|-----|
| 透明波段 | 200 nm – 12 μm |
| 可见光 n (500 nm) | ~2.0–2.1（视晶态/非晶态，沉积工艺）|
| 带隙 | 5.5–6.0 eV（非晶）→5.1 eV（晶态）|
| 吸收边 | ~210 nm |
| k（可见区） | 通常 <10⁻³ |

**R/T 反演要点**：
- 折射率较高（n~2），与常用玻璃衬底对比度大，干涉条纹清晰
- 近紫外区吸收边可通过 T(λ) 确定带隙（Tauc 图）
- 非晶/晶态混合结构会导致折射率非均匀性

**代表研究**：
- **Pervak 等，Thin Solid Films (2012)**：HfO₂ 薄膜磁控溅射，FTIR + 光谱椭偏联合表征 n, k（300–2500 nm + 中红外），为高功率激光膜系设计提供可靠光学常数数据
- **HfO₂-SiO₂ 复合薄膜反演（2011）**：通过透射谱拟合确定混合层 n 的组分依赖性
- **UDM 论文（Franta et al., AO 2015）**（本仓库已有笔记）：以 HfO₂ 为示例，用通用色散模型（UDM）联合多仪器（T+R+椭偏）宽波段表征
- **国内研究（中国科学院上海光学精密机械研究所）**：多项 HfO₂ 高激光损伤阈值薄膜研究中用 T/R 光谱标定光学常数

---

## 四、国内外研究现状与代表工作

### 4.1 国际代表性工作汇总

| 年份 | 作者/机构 | 期刊/来源 | 方法 | 材料 |
|-----|---------|----------|-----|-----|
| 1983 | R. Swanepoel | J. Phys. E | 包络法（T only） | 通用薄膜 |
| 1988 | Wolfe et al. | Opt. Eng. | T 谱 + Swanepoel | BaF₂, CaF₂, HfO₂, SiO₂ 等 |
| 2002 | Burnett et al. | Appl. Opt. | 高精度干涉法 | CaF₂, SrF₂, BaF₂ (157 nm) |
| 2003 | Poelman & Smet | J. Phys. D | R+T 自洽（K-K 约束） | MgF₂, CeF₃ |
| 2002 | Minkov et al. | Appl. Opt. (AO-41-19-3861) | T 谱，弱吸收薄膜透明衬底 | 通用 |
| 2011 | Zöller 等 | ResearchGate | T 谱拟合 | HfO₂-SiO₂ 复合 |
| 2012 | Pervak et al. | Thin Solid Films | SE + FTIR | HfO₂ |
| 2017 | Querry et al. | ResearchGate | 单角度 IR 反射率法 | BaF₂, CaF₂ |
| 2020 | MDPI Appl. Sci. | MDPI | R+T 光谱 + 模型拟合 | CaF₂ 薄膜 |
| 2022 | Dutta et al. (MIT) | PLOS ONE | 进化优化 R+T | SiO₂ 及其他 |
| 2024 | Rana et al. | Surf. Interface Anal. | 极值理论模型 | TCO 氧化物 |
| 2024 | X. Sun et al. | Opt. Laser Technol. | 反射谱包络法 | 半导体薄膜 |
| 2025 | Schaper et al. | arXiv:2502.21241 | 各向异性衬底无歧义 | 超薄薄膜 |
| 2025 | Ballester et al. | Opt. Lett. | 改进 Swanepoel 包络检测 | 通用薄膜 |

---

### 4.2 国内代表性工作汇总

| 年份 | 作者/机构 | 来源 | 方法 | 材料 |
|-----|---------|-----|-----|-----|
| 2009 | 多位 / 中科院上海光机所 | *光学学报/激光技术* | T 谱 + 包络法/Sellmeier | BaF₂, LaF₃, MgF₂ 等深紫外材料 |
| 2014 | 薛春荣, 易葵等 / 上海光机所+常熟理工 | *中国激光* | 改进包络法 | LaF₃, GdF₃, NdF₃, CeF₃ 等氟化物 |
| 2020 | 多位 / 上海光机所 | *Optics & Precision Engineering* | T 谱 + Cauchy 拟合 | 6 种 VUV 氟化物薄膜 |
| 2021 | 多位 | 中文期刊 | 光学常数常规求解（知乎专栏整理） | 通用软件方法 |
| 2021 | 中关村材料试验技术联盟 | **T/CSTM 00313—2021** 团体标准 | 光谱反演标准流程 | 通用光学薄膜 |
| 2022 | 上海光机所团队 | *红外与毫米波学报* | 原位 T 监测反演 | 通用薄膜 |
| 2022 | 多位 / 专利 202210859879 | 国家专利 | 电磁第一性原理 + 智能反演 | 半透明光学薄膜 |
| 2023 | 雷正龙等 | *红外与毫米波学报* (2024年发表) | 多项式求根双厚度法 | CaF₂, Si |
| 2024 | 多位 / 国内研究机构 | *红外与毫米波学报* | 反射谱包络法 | 通用薄膜 |

---

## 五、仅用 T(λ) vs. 同时用 R(λ)+T(λ) 的比较

| 比较维度 | 仅 T(λ) | R(λ) + T(λ) 同时使用 |
|---------|---------|---------------------|
| 仪器要求 | 单次透射测量 | 需分别测量 R 和 T |
| 信息量 | 较少，k 确定困难 | 较多，n/k/d 均可独立约束 |
| 厚膜（>2 μm）适用性 | 良好（干涉条纹多） | 良好 |
| 薄膜（<50 nm）适用性 | 差（条纹消失） | 稍好，R 对薄膜更敏感 |
| Swanepoel 适用 | ✅ 是 | N/A（包络法仅针对 T）|
| 自洽 K-K 约束 | 需额外假设 | 更完备 |
| 优化算法拟合 | 可用，但多值问题严重 | 减少多值问题，更唯一 |
| 典型精度（n） | ±0.5%–1% | ±0.1%–0.5% |
| 典型精度（k） | ±5%–20%（低 k 时精度差） | ±2%–10% |
| 典型精度（d） | ±0.5%–2% | ±0.3%–1% |

---

## 六、主要挑战与最新进展

### 6.1 核心挑战

1. **参数耦合与多值问题**：n 和 d 通过光学路径 nd 耦合，当 k=0 时 R+T 无法区分 n 和 d
2. **薄膜非均匀性**：折射率梯度（在沉积过程中形成的竹笋状或柱状结构）导致简单分层模型失效
3. **衬底贡献**：透明衬底本身的 T/R 频谱会叠加到薄膜信号上，需要预先精确表征衬底
4. **低 k 测量**：对于近透明材料（k < 10⁻⁴），T/R 对 k 不敏感，需要高精度测量设备

### 6.2 最新方法趋势（2023–2025）

1. **各向异性衬底策略**（Schaper et al., 2025）：利用各向异性（双折射）衬底（如云母、石英）的偏振分离效应，从单次测量中提取更多独立方程，解决 n-k-d 耦合
2. **机器学习辅助**：用神经网络学习 T/R 谱到 n/k/d 的非线性映射，可实现毫秒级实时推理
3. **多目标进化优化**（Dutta 2022, iScience 2025）：用种群算法同时优化 R 和 T 拟合，自动跳出局部极小
4. **联合多角度**：在单次测量中增加倾斜角测量（3°/5°/7°/10°），提供额外约束（国内专利 2022）
5. **改进的包络检测**（Ballester et al., 2025）：精确提取干涉极值包络，大幅提高 Swanepoel 法的稳定性

---

## 七、标准化现状

### 国内标准
- **T/CSTM 00313—2021**《基于光谱反演的光学薄膜常数测试方法》  
  - 发布单位：中关村材料试验技术联盟（CSTM）  
  - 发布日期：2021-10-18  
  - 主要内容：规定了用透射或反射光谱（正入射），通过传递矩阵正演 + 最小二乘反演确定单层薄膜 n, k, d 的完整测试流程，包括衬底预表征、不确定度评定等

### 国际标准
- **IEC 62624:2009**（现已修订）：薄膜光学常数测量方法（含椭偏和分光光度法）
- ISO/TR 18231（部分光学薄膜表征）

---

## 八、推荐工具与软件

| 软件 | 开发者 | 特点 |
|-----|-------|-----|
| **OptiLayer / OptiRE** | Optilayer GmbH（俄罗斯/德国）| 业界最成熟的逆向工程软件，支持 R+T+椭偏联合拟合 |
| **TFCalc** | Software Spectra Inc. | 经典薄膜计算软件，含光学常数拟合模块 |
| **WVASE / CompleteEASE** | J.A. Woollam | 主要面向椭偏，也支持 T/R |
| **Essential Macleod** | Thin Film Center | 薄膜设计 + 常数拟合 |
| **tmm（Python）** | S. Byrnes / GitHub | 开源传递矩阵法库，可自行构建反演框架 |
| **SCOUT** | W. Theiss Hard&Software | 全谱光学常数拟合，支持 KK 分析 |
| **自编脚本（Python/MATLAB）** | 各科研组 | 灵活，可结合 scipy.optimize 或 pyswarm 等 |

---

## 九、建议研究流程

针对 BaF₂ / CaF₂ / CeF₃ / SiO₂ / HfO₂ 透明薄膜，基于 R/T 测量反演 n, k, d 的推荐流程：

```
1. 衬底表征
   ├── 测量裸衬底的 T_sub(λ) 和 R_sub(λ)
   └── 拟合得到 n_sub(λ), k_sub(λ)（或使用已知文献值）

2. 薄膜样品测量
   ├── 分光光度计测量 T_film(λ)（正入射，350–1100 nm 或更宽）
   └── 测量 R_film(λ)（若有反射附件）

3. 参数初值估计
   ├── 从干涉极值间距估算膜厚 d₀ ≈ λ₁λ₂ / [2(λ₁-λ₂)·n₀]
   └── 从折射率数据库或 Cauchy 经验值设定 n₀ 初值

4. 正演模型建立
   └── TMM + 选定色散模型（Cauchy/Sellmeier/Tauc-Lorentz）

5. 优化反演
   ├── 透明区（k≈0）：Cauchy/Sellmeier + LM 局部优化
   ├── 含吸收区：Tauc-Lorentz + 遗传/PSO 全局优化
   └── 联合 R+T 拟合，减少多值问题

6. 自洽检验
   ├── K-K 关系验证
   └── 对比文献已知值

7. 不确定度评定（参照 T/CSTM 00313—2021）
```

---

## 十、参考文献精选

1. **Swanepoel, R.** (1983). Determination of the thickness and optical constants of amorphous silicon. *J. Phys. E*, 16, 1214–1222.
2. **Minkov, D. A.** (1989). Method for determining the optical constants of a thin film on a transparent substrate. *J. Phys. D*, 22, 1157.
3. **Poelman, D. & Smet, P. F.** (2003). Methods for the determination of the optical constants of thin films from single transmission measurements: a critical review. *J. Phys. D*, 36, 1850–1857.
4. **Burnett, J. H. et al.** (2002). Absolute refractive indices and thermal coefficients of CaF₂, SrF₂, BaF₂ and LiF near 157 nm. *Appl. Opt.*, 41(13), 2508–2513.
5. **Wolfe, J. D. & Giacomo, G.** (1988). Optical constant determination of thin films (BaF₂, CaF₂, LaF₃, MgF₂, Al₂O₃, HfO₂, SiO₂ on MgF₂). *Optical Engineering*, 27, 1117.
6. **Dutta, T. et al.** (2022). Extracting film thickness and optical constants from spectrophotometric data by evolutionary optimization. *PLOS ONE*, 17(11), e0276555.
7. **Franta, D. et al.** (2015). Universal dispersion model for HfO₂ thin films. *Appl. Opt.*, 54(31), 9108–9119.
8. **薛春荣, 易葵等** (2014). 改进的包络技术确定氟化物薄膜的光学常数. *中国激光*.
9. **中关村材料试验技术联盟** (2021). T/CSTM 00313—2021 基于光谱反演的光学薄膜常数测试方法.
10. **雷正龙等** (2023/2024). 基于多项式求根的双厚度透射率模型确定透明固体光学常数. *红外与毫米波学报*.
11. **Schaper, S. et al.** (2025). Unambiguous determination of optical constants and thickness of ultrathin films by using optical anisotropic substrates. arXiv:2502.21241.
12. **Ballester, M. et al.** (2025). Enhancing the Swanepoel method: precise envelope detection of thin-film transmission spectra. *Optics Letters*.
13. **Pervak, V. et al.** (2012). Optical properties of HfO₂ thin films deposited by magnetron sputtering. *Thin Solid Films*, 523, 90–96.
14. **iScience** (2025). Optical multilayer thin film structure inverse design: From traditional to AI-based methods. *iScience*, S2589-0042(25)00483-3.
15. **上海光机所团队** (2022). 薄膜光学常数的原位测定. *红外与毫米波学报*.
