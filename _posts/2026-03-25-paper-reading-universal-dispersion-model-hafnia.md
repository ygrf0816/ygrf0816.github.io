---
layout: post
title: "[论文阅读] 宽光谱通用色散模型及其在 HfO₂ 薄膜表征中的应用"
date: 2026-03-25 13:18:51 +0800
categories: Learning
mathjax: true
---

# [论文阅读] 宽光谱通用色散模型及其在 HfO₂ 薄膜表征中的应用

## Universal Dispersion Model for Characterization of Optical Thin Films over a Wide Spectral Range: Application to Hafnia

---

## 基本信息

| 项目 | 内容 |
|------|------|
| **标题** | Universal dispersion model for characterization of optical thin films over a wide spectral range: application to hafnia |
| **期刊** | *Applied Optics*, Vol. 54, No. 31, November 1, 2015, pp. 9108–9119 |
| **DOI** | 10.1364/AO.54.009108 |
| **作者** | Daniel Franta, David Nečas, Ivan Ohlídal |
| **机构** | Masaryk University, Brno, Czech Republic |
| **接收/修订/发表** | 2015-08-06 / 2015-09-25 / 2015-10-23 |

---

## 一、研究背景与动机

### 1.1 光学薄膜表征的重要性

光学薄膜广泛应用于干涉器件：
- 减反射涂层 (antireflection coatings)
- 光学滤波器 (filters)
- 分束器 (beam splitters)
- 高反射镜 (high-reflection mirrors)

常用材料包括：HfO₂, SiO₂, TiO₂, Al₂O₃, Ta₂O₅, MgF₂ 等。

### 1.2 现有色散模型的局限性

- 传统模型仅在特定光谱范围内有效
- 缺乏**统一框架**来描述从远红外到真空紫外的完整介电响应
- 需要材料特定的先验信息（如原子分数）

### 1.3 本文目标

提出一个**通用色散模型 (Universal Dispersion Model, UDM)**，能够：
1. 用一致的框架描述多种材料的介电响应
2. 覆盖从远红外 (~300 cm⁻¹) 到真空紫外 (~11 eV) 的宽光谱范围
3. 无需材料的详细物理化学结构信息
4. 计算效率高（所有贡献均可解析表达）

---

## 二、Universal Dispersion Model (UDM) 详解

### 2.1 核心思想：联合态密度 (JDOS) 参数化

UDM 基于**联合态密度 (Joint Density of States, JDOS)** 的参数化，而非直接拟合介电函数。

介电函数构造如下：

$$\varepsilon(E) = 1 + N_{vc}\varepsilon'_{vc}(E) + N_{vx}\varepsilon'_{vx}(E) + N_{ut}\varepsilon'_{ut}(E) + \sum_p N_{loc,p}\varepsilon'_{loc,p}(E) + \sum_p N_{ph,p}\varepsilon'_{ph,p}(E)$$

其中各项贡献代表：

| 符号 | 物理意义 | 光谱范围 |
|------|----------|----------|
| **vc** | 价带→导带电子跃迁 (interband) | UV-Vis |
| **vx** | 价电子高激发态 (high-energy excitations) | VUV |
| **ut** | Urbach 指数尾 (exponential tail) | 带隙附近 |
| **loc** | 局域态电子跃迁 (localized states) | 亚带隙 |
| **ph** | 声子吸收 (phonon absorption) | IR |

### 2.2 各贡献项的数学形式

#### (1) 电子带间跃迁 (vc)

**JDOS 参数化**（含激子修正）：

$$J_{vc}(E) = \frac{N_{vc}}{C_N} \frac{(E-E_g)^2(E_h-E)^2}{(E-E_c)^2 + B_c^2} \Pi_{E_g,E_h}(E)$$

其中：
- $E_g$: 带隙能量
- $E_h$: 最大跃迁能量
- $E_c, B_c$: 激子中心能量和展宽
- $\Pi$: 阶跃函数

**归一化条件**：

$$\int_0^\infty \varepsilon'_i(E) E \, dE = 1$$

这使得每个归一化函数的跃迁强度为 1，总跃迁强度为各参数 $N_j$ 之和。

#### (2) 高激发态 (vx)

用于描述价电子到更高激发态的跃迁：

$$J_{vx}(E) = \frac{N_{vx}}{3E_\xi^3} (E^3 - E_\xi^3)^2 \Pi_{E_\xi,\infty}(E)$$

在常规光谱仪器范围内色散很小，替代传统模型中的 $\varepsilon_\infty$ 常数。

#### (3) Urbach 指数尾 (ut)

描述带隙以下的弱吸收（局域态→扩展态跃迁）：

$$J_{ut}(E) = \frac{N_{ut}}{C_N} \exp\left(\frac{E-E_g}{E_u}\right) \times \text{[分段多项式修正]}$$

- $E_u$: Urbach 能量（指数斜率）
- 典型值：非晶半导体 ~50 meV，HfO₂ ~0.65 eV

> ⚠️ 注意：作者指出 "Urbach tail" 术语常被误用。真正的 Urbach 尾应具有温度依赖特性（源于结构无序+热无序），而局域态（如悬挂键、杂质）引起的指数吸收不应称为 Urbach 尾。

#### (4) 局域态吸收 (loc)

局域态之间的跃迁 $\lambda \rightarrow \lambda^*$ 通常表现为带隙以下的峰：

采用**高斯展宽离散谱**描述：

$$\varepsilon_{loc}(E) = \sum_p \frac{N_{loc,p}}{C_N} \exp\left(-\frac{(E-E_{loc,p})^2}{2B_{loc,p}^2}\right)$$

#### (5) 声子吸收 (ph)

红外区的振动模式：

同样采用高斯展宽离散谱，对于 HfO₂ 使用 4 个高斯峰即可有效描述。

### 2.3 UDM vs ADM

| 特性 | UDM (本文) | ADM (Advanced Dispersion Model) |
|------|------------|--------------------------------|
| **先验信息** | 不需要 | 需要（原子分数等） |
| **物理连接** | 与求和规则的连接较弱 | 强连接（密度参数 $N_a$） |
| **计算效率** | 高（全解析表达式） | 部分需数值计算 |
| **适用范围** | 未知材料 | 已知结构的材料 |
| **核心参数** | 跃迁强度 $N_j$ | 原子密度 $N_a$ + 电子数/原子 |

---

## 三、实验方法

### 3.1 样品制备

- **材料**: HfO₂ (hafnia) 薄膜
- **基底**: 磷掺杂硅单晶 (电阻率 0.482 Ω·cm)
- **制备方法**: 真空蒸发 (SYRUS pro DUV, Leybold Optics)
- **沉积温度**: 25°C – 300°C
- **沉积速率**: 0.25 – 1 nm/s

### 3.2 多仪器联合测量

| 仪器 | 光谱范围 | 测量模式 |
|------|----------|----------|
| Horiba UVISEL2 VUV | 0.6–8.7 eV | 反射，70°，真空 |
| Horiba UVISEL | 0.6–6.5 eV | 反射，55°–75° |
| Woollam IRVASE | 300–6500 cm⁻¹ | 反射+透射，55°–75° |
| McPherson VUVAS 2000 | 3.3–10.8 eV | 反射，10°，真空 |
| Perkin Elmer Lambda 1050 | 0.67–6.7 eV / 80–7500 cm⁻¹ | 反射+透射 |

### 3.3 结构模型

```
[空气/真空]
─────────────────────────────
  HfO₂ 薄膜 (粗糙上表面)
  · 厚度 ~112.7 nm
  · 粗糙度 σ ~2.19 nm
  · 轻微厚度非均匀性
─────────────────────────────
  过渡 SiOₓ 层 (~3.29 nm)
─────────────────────────────
  硅单晶基底 (~0.409 mm)
─────────────────────────────
  背面原生 SiO₂ 层 (~2.83 nm)
─────────────────────────────
[空气/真空]
```

**粗糙度处理**: Rayleigh-Rice 理论 (RRT) + Yeh 4×4 矩阵形式

**非均匀性处理**: 楔形假设 + Mueller 矩阵积分

### 3.4 数据处理策略

**关键创新**：**双面反射 + 透射联合拟合**

- 同时处理椭偏参数 ($I_s, I_c, I_n$) 和光度数据 ($R_f, R_b, T$)
- 使用**相对反射率**和**差分椭偏**抑制基底影响
- Marquardt-Levenberg 算法 + 自动数据权重均衡

**为什么双面测量很重要？**

在 IR 区域，薄膜和基底的吸收结构经常重叠。通过测量：
- 正面反射 $R_f$（薄膜侧）
- 背面反射 $R_b$（基底侧）
- 透射 $T$

可以分离薄膜和基底的弱吸收，无需事先测量裸基底。

---

## 四、主要实验结果

### 4.1 结构参数

| 参数 | 数值 | 说明 |
|------|------|------|
| 薄膜厚度 $d_f$ | 112.7 ± 0.1 nm | IR 测量 |
| 粗糙度 σ | 2.19 ± 0.06 nm | 光学法 |
| AFM 粗糙度 | 0.56 nm | 形貌测量 |
| 过渡层厚度 | 3.29 ± 0.03 nm | SiOₓ |
| 背面氧化层 | 2.83 ± 0.007 nm | 原生 SiO₂ |

### 4.2 色散参数

#### 电子带间跃迁 (vc)

| 参数 | 数值 | 说明 |
|------|------|------|
| $N_{vc}$ | 421 ± 32 eV² | 跃迁强度 |
| $E_g$ | 5.311 ± 0.004 eV | 带隙 |
| $E_{ex,1}$ | 6.98 ± 0.01 eV | 第一激子能量 |
| $B_{ex,1}$ | 0.86 ± 0.01 eV | 第一激子展宽 |
| $E_h$ | 20 eV (固定) | 最大跃迁能量 |

#### 高激发态 (vx)

| 参数 | 数值 | 说明 |
|------|------|------|
| $N_{vx}$ | 1637 ± 314 eV² | 跃迁强度 |
| $E_\xi$ | 12 eV (固定) | ξ* 带最小能量 |

#### 亚带隙吸收

| 参数 | 数值 | 说明 |
|------|------|------|
| $E_u$ | 0.65 ± 0.02 eV | "Urbach" 能量 |
| $N_{ut}$ | 7 ± 2 eV² | 指数尾强度 |
| $N_{loc}$ | 0.067 ± 0.003 eV² | 局域态跃迁强度 |
| $E_{loc}$ | 4.547 ± 0.004 eV | 局域态平均能量 |

### 4.3 光学常数

**折射率 n(λ)**:
- 可见光区 (~550 nm): n ≈ 2.1
- 近红外 (~1000 nm): n ≈ 2.0
- 消光系数在带隙以下极低 (k < 10⁻⁴)

**消光系数 k(E)** 的关键特征：
- 带隙 $E_g$ = 5.31 eV 处 k ≈ 2×10⁻⁴
- 局域态吸收峰在 4.55 eV
- 四个声子吸收峰：302, 322, 366, 750 cm⁻¹

### 4.4 有效价电子数

计算得到：

$$N_{ve} = 2064 \pm 280 \text{ eV}^2$$

理论预测值（仅价电子）：

$$\bar{N}_{ve} = n_{ve} N_a = 720 \text{ eV}^2$$

差异原因："vx" 贡献中包含了部分芯电子激发（Hf 的 4f、5p 电子，O 的 2s 电子）。

有效价电子数/原子：

$$n_{ve}^{eff} = \frac{34.41}{3} = 11.47$$

（理论价电子数/原子 = 4）

---

## 五、局域态定量分析（创新点）

### 5.1 分离不同类型的局域态跃迁

通过 UDM 可以定量区分：
1. **λ → λ***：局域态之间的跃迁
2. **λ → σ***：局域态→导带（扩展态）
3. **σ → λ***：价带→局域态

### 5.2 局域态密度估算

假设：
- $N_{\lambda \rightarrow \sigma^*} \approx N_{\sigma \rightarrow \lambda^*} \approx N_{ut}/2$
- $N_{\lambda \rightarrow \xi^*} / N_{\lambda \rightarrow \sigma^*} \approx N_{\sigma \rightarrow \xi^*} / N_{\sigma \rightarrow \sigma^*}$

得到局域态总跃迁强度：

$$N_\lambda = N_{\lambda \rightarrow \lambda^*} + N_{\lambda \rightarrow \sigma^*} + N_{\lambda \rightarrow \xi^*} \approx 5.654 \text{ eV}^2$$

局域电子数/原子：

$$n_\lambda = \frac{N_\lambda}{N_a} = 0.03141$$

### 5.3 化学计量比估算

假设局域态主要源于**氧空位**，估算 HfOₓ 的化学计量比：

$$x = \frac{4 - n_\lambda}{2 + n_\lambda} = 1.954$$

即薄膜略微缺氧（理想为 HfO₂）。

---

## 六、核心创新点总结

### 6.1 方法论创新

1. **通用色散模型 (UDM)**
   - 首次实现从远红外到真空紫外的统一描述
   - 无需材料先验信息，适用于"未知"材料
   - 全解析表达式，计算效率高

2. **多仪器数据联合处理**
   - 椭偏仪 + 分光光度计
   - 双面反射 + 透射测量
   - 自动权重均衡算法

3. **弱吸收分离技术**
   - 无需裸基底预测量
   - 有效分离薄膜与基底吸收（尤其在 IR 重叠区）

### 6.2 物理洞察

1. **Urbach 尾的重新定义**
   - 区分真正的 Urbach 尾（温度依赖，源于无序）
   - 与局域态引起的指数吸收（如氧空位）

2. **局域态定量分析**
   - 分离不同类型的亚带隙跃迁
   - 估算局域态密度和薄膜化学计量比

3. **芯电子贡献的识别**
   - 通过求和规则分析识别高激发态中的芯电子贡献

---

## 七、UDM 真能"通用"吗？

### 7.1 适用范围

**作者声称 UDM 适用于**：
- HfO₂, SiO₂, TiO₂, Al₂O₃, Ta₂O₅, MgF₂ 等光学材料
- 非晶、纳米晶、多晶薄膜
- 覆盖远红外到真空紫外

**实际限制**：

| 限制因素 | 说明 |
|----------|------|
| **金属/强吸收材料** | UDM 主要针对介电材料，Drude 项仅简单提及 |
| **各向异性材料** | 模型假设各向同性 |
| **强激子效应** | 需要多个激子项拟合，参数相关性高 |
| **复杂声子结构** | 晶态材料可能需要大量高斯峰（HfO₂ 非晶相仅需4个，晶态需更多） |
| **自由载流子** | 未在 HfO₂ 中考虑，但模型框架可包含 |

### 7.2 "通用"的含义

UDM 的"通用"体现在：
1. **框架通用**：同一数学形式适用于多种材料
2. **光谱范围通用**：单一模型覆盖宽光谱
3. **物理机制通用**：包含电子跃迁、局域态、声子等所有主要贡献

但并非：
- ❌ 一套参数适用于所有材料
- ❌ 无需任何材料特定调整
- ❌ 自动确定物理机制

### 7.3 与数据驱动方法的对比

| 方法 | 优点 | 缺点 |
|------|------|------|
| **UDM** | 物理可解释、外推能力强、参数有物理意义 | 需要合理初始猜测、复杂材料参数多 |
| **机器学习方法** | 无需物理假设、拟合速度快 | 需要大量训练数据、外推能力差、黑箱 |

---

## 八、结论

### 8.1 论文主要结论

1. UDM 成功描述了 HfO₂ 薄膜从远红外到真空紫外的介电响应
2. 多仪器联合测量 + 双面反射/透射技术有效分离了薄膜与基底的弱吸收
3. 定量分析了局域态吸收，估算出氧空位密度和化学计量比 HfO₁.₉₅₄
4. 识别了高激发态中的芯电子贡献

### 8.2 对 GST 相变材料研究的启示

虽然本文研究的是 HfO₂，但其方法论对 GST 研究有重要参考价值：

1. **宽光谱椭偏表征**：GST 的相变伴随光学常数巨大变化，需要宽光谱覆盖
2. **亚带隙吸收分析**：GST 非晶态的亚带隙吸收与局域态（共振键）密切相关
3. **求和规则应用**：可用于验证 GST 相变过程中的电子数守恒
4. **多仪器联合**：透射+反射+椭偏联合可提高 GST 两相光学常数的确定精度

---

## 九、关键公式汇总

### 介电函数总表达式

$$\varepsilon(E) = 1 + \sum_j N_j \varepsilon'_j(E)$$

### 带间跃迁 JDOS

$$J_{vc}(E) = \frac{N_{vc}}{C_N} \frac{(E-E_g)^2(E_h-E)^2}{(E-E_c)^2 + B_c^2} \Pi_{E_g,E_h}(E)$$

### 归一化条件

$$\int_0^\infty \varepsilon'_i(E) E \, dE = 1$$

### 有效价电子数

$$N_{ve} = N_{vc} + N_{vx} + N_{ut} + \sum_p N_{loc,p} = n_{ve} N_a$$

### 局域态密度估算

$$n_\lambda = \frac{N_\lambda}{N_a}, \quad N_\lambda = N_{\lambda \rightarrow \lambda^*} + N_{\lambda \rightarrow \sigma^*} + N_{\lambda \rightarrow \xi^*}$$

---

## 十、参考文献精选

1. **Franta et al. (2013)** - UDM 理论基础（Thomas-Reiche-Kuhn 求和规则）
2. **Franta et al. (2013)** - 非晶硅氢化物的 UDM 应用
3. **Tauc (1972)** - 非晶固体光学性质经典文献
4. **Urbach (1953)** - Urbach 尾原始论文
5. **Jellison & Modine (1996)** - Tauc-Lorentz 模型（对比参考）

---

## 阅读时间

- **阅读日期**: 2026-03-25
- **关键词**: Universal Dispersion Model, UDM, 椭偏仪, 光学常数, HfO₂, 联合态密度, 局域态, 声子吸收

---

## 论文原图（自原文 PDF 提取）

> 下列图片由论文原文 PDF 自动提取，用于辅助理解；图片编号与图注以原文为准。

![原文第 1 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p01_01.jpeg)

![原文第 3 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p03_02.jpeg)

![原文第 4 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p04_03.jpeg)

![原文第 4 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p04_04.jpeg)

![原文第 5 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p05_05.jpeg)

![原文第 9 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p09_06.jpeg)

![原文第 9 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p09_07.jpeg)

![原文第 10 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p10_08.jpeg)

![原文第 11 页插图](/assets/posts_figs/paper-reading-universal-dispersion-model-hafnia/fig_p11_09.jpeg)
