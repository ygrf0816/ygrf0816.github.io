---
layout: post
title: "[论文阅读] 违背基尔霍夫热辐射定律的超表面结构"
date: 2026-03-26 17:00:00 +0800
categories: Learning
mathjax: true
---

# 违背基尔霍夫热辐射定律的超表面结构

> **论文标题**：Direct observation of the violation of Kirchhoff's law of thermal radiation  
> **期刊**：*Nature Photonics*, Vol. 17, October 2023, pp. 891–896
> **DOI**：[10.1038/s41566-023-01261-6](https://doi.org/10.1038/s41566-023-01261-6)
> **作者**：Komron J. Shayegan, Souvik Biswas, Bo Zhao, Shanhui Fan & Harry A. Atwater（加州理工学院 (Caltech)、斯坦福大学、休斯顿大学）

---

## 一、研究背景

### 1.1 基尔霍夫热辐射定律（1860年）

热辐射的基本定律指出：对于给定的波长 λ、方向角 θ 和偏振态 χ，任何物体的**光谱方向吸收率**（α）与**光谱方向发射率**（e）恒等：

$$\alpha(\lambda, \theta, \chi, T) = e(\lambda, \theta, \chi, T)$$

这一等式的成立根本依赖于**洛伦兹互易性（Lorentz reciprocity）**。对于非互易系统，这一等式不再必然成立。这个工作的出发点就是人为构建非互易系统

### 1.2 打破基尔霍夫定律的动机

- 突破热辐射收集效率的物理极限（超越 Shockley-Queisser 限制）
- 减少太阳能收集系统中向太阳的再辐射损耗
- 实现辐射隐身与伪装（强吸收但不再向外发射）
- 理论预言已大量存在，但**实验上的直接测量从未实现**

---

## 二、核心创新点

> **这是世界上首次在实验中直接测量并证实热辐射中吸收率 ≠ 发射率的现象——违背基尔霍夫热辐射定律的直接实验观测**

具体创新包括：

1. **首次实验直接观测**：此前仅有理论预言，本文首次给出了 α ≠ e 的直接实验证据
2. **非互易磁光设计**：将导模共振（GMR）光子结构与磁光材料 n-InAs 耦合，利用外加横向磁场破坏洛伦兹互易性
3. **反对称调控**：施加磁场后，发射率增强的角度恰好对应吸收率减弱，实现两者的独立调控
4. **Onsager-Casimir 关系验证**：实验结果完全符合理论预测的非互易关系

---

## 三、器件结构与物理机制

### 3.1 双层光子结构

![image-20260326150218733](E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326150218733.png)

结构如上图a和b所示。图c展示了不同温度下角度与辐射光波长之间实测结果（空心圆点）与理论计算（实线）的对比图，可见随着温度上升，辐射光出现明显的红移

```
           [空气]
─────────────────────────────────────
  a-Si 光栅（导模共振层）
    · 光栅周期  Λ = 5.50 μm
    · 光栅槽深    = 0.50 μm
    · a-Si 平板厚  = 1.55 μm
─────────────────────────────────────
  n-InAs（磁光 ENZ 材料，2 μm 厚）
    · 载流子浓度 n = 3.0 × 10¹⁸ cm⁻³
    · ENZ 波长 ≈ 12.9 μm
─────────────────────────────────────
  铝反射背板（Heater）
─────────────────────────────────────
  ← 外加横向磁场 B（沿 z 轴，垂直入射面）→
```

### 3.2 物理机制

#### （1）n-InAs 的磁光效应

无磁场时，n-InAs 的介电张量为对角矩阵；施加横向磁场 B 后，出现非对角分量：

$$\varepsilon(\omega) = \begin{pmatrix} \varepsilon_{xx} & \varepsilon_{xy} & 0 \\ \varepsilon_{yx} & \varepsilon_{yy} & 0 \\ 0 & 0 & \varepsilon_{zz} \end{pmatrix}$$

其中,非对角项 $\varepsilon_{xy} = -\varepsilon_{yx}$ 在 ENZ 波长附近达到最大，是非互易效应的根源。相关介电常数计算式如下

<img src="E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326144016990.png" alt="image-20260326144016990" style="zoom: 67%;" />

<img src="E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326144031596.png" alt="image-20260326144031596" style="zoom:67%;" />

关键参数：

- 等离子体频率 $\omega_p = \sqrt{ne^2 / (m_e \varepsilon_0)}$
- 回旋频率 $\omega_c = eB/m_e$（随磁场线性增大）
- 散射率 $\Gamma = 5.1$ THz，有效质量 $m_e = 0.035 \, m_0$

#### （2）导模共振（GMR）结构的作用

a-Si 条带状光栅结构支持 TM 偏振的导波模式（“guided-mode resonance (GMR) waveguide”），通过光栅衍射耦合到自由空间，产生窄线宽的方向性发射/吸收增强峰（**Fano 型谱线**）。设计上令 +1 阶导模的共振波长在大角度（θ > 50°）处与 n-InAs 的 ENZ 波长谱重合。

#### （3）违背基尔霍夫定律的关键

非对角介电分量破坏洛伦兹互易性 → 吸收率和发射率的磁场响应方向**相反**：

Onsager-Casimir关系：
![image-20260326145245105](E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326145245105.png)

即：改变入射方向（θ → −θ）等价于反转磁场（B → −B）。

而本文提出磁场的互反效应（B = −B），则：$\alpha(\lambda,-\theta,B) = e(\lambda,\theta,B)$

---

## 四、研究方法

### 4.1 样品制备流程

1. n-InAs 晶圆清洗（丙酮 + 异丙醇超声）
2. PECVD 沉积 2.05 μm 非晶硅（a-Si）（200 °C，SiH₄/Ar 气氛）
3. 旋涂 ZEP520A 光刻胶（750 nm 厚）
4. 电子束光刻（EBPG）写入光栅图案
5. ICP-RIE（SF₆/CF₄）刻蚀 0.5 μm 深光栅
6. 去除光刻胶，SEM 表征确认结构

### 4.2 发射率测量系统

- **设备**：自制角分辨热发射光谱系统（FTIR + ZnSe 透镜 + 角度仪）
- **激励**：电阻加热至 50 / 100 / 150 °C
- **参考**：碳黑体（归一化），铝片（背景扣除）
- **磁场**：电磁铁（GMW 5403），±1.0 T，Hall 传感器监测均匀度
- **偏振**：线栅偏振片分辨 TM / TE

发射率计算公式：

$$e_{\text{sample}}(\lambda,\theta,\chi,T) = \frac{I_{\text{sample}}(\lambda,\theta,\chi,T) - I_{\text{Al}}(\lambda,\theta,\chi,24°\text{C})}{I_{\text{Carbon BB}}(\lambda,\theta,\chi,T) - I_{\text{Al}}(\lambda,\theta,\chi,24°\text{C})}$$

### 4.3 吸收率测量系统

- **设备**：J.A. Woollam 红外椭偏仪（反射-透射模式）
- **归一化**：金参考样品
- **磁场**：Halbach 阵列永磁体（可调气隙）
- **限制**：仪器体积限制，仅能测量 θ > 35° 的角度

### 4.4 理论模拟

- COMSOL 多物理场仿真（定性验证）
- Drude 模型拟合 n-InAs 介电常数（含温度依赖）
- 数据拟合：sigmoid（InAs 发射边）+ Fano 共振双分量模型

---

## 五、主要实验结果

### 5.1 零磁场：基尔霍夫定律成立（基准验证）

![image-20260326150319213](E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326150319213.png)

无外加磁场时，TM 和 TE 偏振的发射率与吸收率谱高度吻合，验证了零场基准下基尔霍夫定律的成立。两者均呈现 Fano 型谱线，由 GMR 的窄共振叠加在 InAs 宽带背景上产生。

### 5.2 施加磁场：α ≠ e（核心结果）

![image-20260326150449932](E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326150449932.png)

在 θ = 70° 处，±1 T 磁场对发射率和吸收率的调制**符号相反**：

$$\Delta e \approx -\Delta\alpha \quad \text{（全波长、全角度范围）}$$

epsilon-near-zero (ENZ) materials，介电常数近乎为0材料

- 正磁场 → InAs ENZ 边蓝移 → GMR 与 ENZ 失配 → 发射率减小，吸收率增大
- 负磁场 → InAs ENZ 边红移 → GMR 与 ENZ 重合 → 发射率增大，吸收率减小

### 5.3 Onsager-Casimir 关系验证

![image-20260326150536338](E:\workspace\mygithubpage\assets\posts_figs\2026-03-26-paper-reading-violate-kirchhoff-law\image-20260326150536338.png)

上图a：零磁场时遵循基尔霍夫定律，角度变化对应的发射率e是对称点；而图b展示了随着角度变化，左侧是+1T,最右侧是-1T磁场，观测到明显的角度部队称特性。通过测量 ±θ 和 ±B 的全组合，验证了：

$$\alpha(\lambda, -\theta, B) = e(\lambda, \theta, B)$$

正负角度下的发射率变化呈**反对称分布**，与理论完全一致。

### 5.4 三个角度区域的不同行为

| 区域 | 角度范围 | 现象描述 |
|:----:|:--------:|---------|
| **完全解耦区** | 0° < θ < ~45° | GMR 与 InAs ENZ 谱不重叠，磁场对发射率几乎无调控效果 |
| **"模式牵引"区** | ~45° < θ < ~60° | InAs ENZ 边与 GMR 部分谱重叠，磁场拉动共振峰波长（临界角 θ_C ≈ 50°） |
| **完全耦合区** | θ > ~60° | GMR 完全落在 InAs ENZ 内，磁场强烈调控发射率幅度（而非峰位） |

### 5.5 发射率磁场调制的线性与饱和行为

- **小磁场**（正向）：发射率调制与磁场近似线性（斜率 ≈ 0.1/T），源于 InAs 的回旋共振
- **大负磁场**：调制饱和，因为发射率不能超过黑体极限（e ≤ 1，不存在超普朗克辐射）
- 全场范围拟合为二次函数

---

## 六、研究结论

1. **实验首次直接证实了基尔霍夫热辐射定律的违背**，为非互易热辐射领域提供了里程碑式的实验证据
2. GMR 结构 + n-InAs 磁光耦合的设计，在适度磁场（≤1 T）下实现了吸收率和发射率的独立、反对称调控
3. 实验行为完全符合 Onsager-Casimir 非互易关系，理论框架得到验证
4. 发射率调制受普朗克辐射极限约束，不存在超普朗克辐射
5. n-InAs 的 ENZ 效应与 GMR 的谱重叠是实现强调控的关键，临界角 θ_C ≈ 50° 是两种机制耦合的分界

---

## 七、研究意义与未来展望

| 应用方向 | 潜在价值 |
|---------|---------|
| **太阳能收集** | 减少向太阳的再辐射，有望突破 Shockley-Queisser 效率极限 |
| **辐射制冷** | 吸收与发射通道分离，实现更高效的被动冷却 |
| **辐射隐身/伪装** | 强吸收但不发射，实现红外波段的辐射伪装 |
| **自旋极化光源** | 非互易热辐射产生自旋极化光 |

**未来技术路径**：

- **宽带化**：利用渐变 ENZ 结构扩展非互易波段
- **免磁场化**：韦尔半金属（Weyl semimetals）、铁磁卡戈米晶格等本征非互易材料，无需外加磁场
- **时空调制**：利用时空调制（spatiotemporal modulation）实现非互易
- **漂移电子**：利用半导体中定向漂移电子实现非互易等离激元

---

## 八、关键公式汇总

| 名称 | 公式 |
|------|------|
| 基尔霍夫定律 | $\alpha(\lambda,\theta,\chi,T) = e(\lambda,\theta,\chi,T)$ |
| 磁场下介电张量 | $\varepsilon_{xy} = -\varepsilon_{yx} = i\dfrac{\omega_p^2 \omega_c}{\omega[(\omega+i\Gamma)^2 - \omega_c^2]}$ |
| Onsager-Casimir 关系 | $\alpha(\lambda,-\theta,B) = \alpha(\lambda,\theta,-B)$ |
| 互反关系（本文结构） | $\alpha(\lambda,-\theta,B) = e(\lambda,\theta,B)$ |
| 发射率测量公式 | $e_{\text{sample}} = \dfrac{I_{\text{sample}} - I_{\text{Al}}}{I_{\text{Carbon BB}} - I_{\text{Al}}}$ |
