---
layout: post
title: "[论文阅读] 垂直表面的日间亚环境辐射制冷"
date: 2026-03-16 15:40:00 +0800
categories: Learning
mathjax: true
---

# [论文阅读] 垂直表面的日间亚环境辐射制冷

这是2024年的一篇Science，单位中科院长春光机所

![image-20260316133949771](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316133949771.png)

主要的研究目的在于设计一个指向性的辐射制冷。传统的辐射制冷是都是水平表面且表面朝向天空（如屋顶等水平表面），但垂直表面既会接收来自地面的热辐射，自己也会辐射热量，且能辐射的天空视野范围受限，很难实现“低于环境温度”的制冷效果（这点文中量化了，吸收的太阳功率需被限制到$P_{sun}<40 W/m^2$才有制冷效果【环境温度30℃，地面温度＞40℃】）。

这项研究的核心是开发并验证了一种**锯齿栅格形状，覆盖一层紫外-可见光（UV-VIS）高反射，红外透明（IR transparent）的纳米多孔聚乙烯（nanoPE）的角非对称、光谱选择性热发射器（Angularly asymmertric spectrally Selective, AS emitter）**,在$920W/m^2$辐照度下，相比环境温度降低了2.5℃±0.7℃。

![image-20260316140129511](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316140129511.png)

图1A展示了AS emitter的制冷原理。

图1B展示了理想的AS emitter的性能指标，要求在8-13μm高发射，同时右侧的极坐标图对应辐射方向，希望实现只对0°-90°的上半圆θ角内有高发射率，下半区域为0发射率，以防止吸收来自地面的指向性辐射。

除了AS emitter以外，还有几种选择性辐射的现有研究，但都是窄角度的
![image-20260316150330454](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316150330454.png)

图1C：净冷却功率$P_{net}$与发射体温度*T*的关系，实线是在典型的夏季白天（具备适当热绝缘，$h_c=3.5 W·m^{−2}·K^{−1}$ ）下的关系曲线，虚线是具有完美热绝缘（$h_c=0 W·m^{−2}·K^{−1}$ ，只通过热辐射散热）情况下的曲线，蓝色对应AS emitter，红线对应全向宽带发射器。

重点在于$P_{net}=0$（代表不加热也不制冷的临界点，此时发射极处于常温）的各个线对应的横轴温度数值：典型白天情况下AS emitter可以将温度降低到20-25℃（低于环境30℃温度），而全向辐射器温度与环境温度基本一致。

$h_c$：对流换热系数，量化了制冷器表面与周围空气之间通过**对流**（Convection）和**传导**（Conduction）方式交换热量的效率。

图1C的内容是由理论计算得到的，通过求解如supplementary Text 1所示的净冷却功率$P_{net}(T)$相关公式，定义公式如下，扫描不同温度数值绘制图像

$$𝑃_{net}(𝑇) = 𝑃_{rad}(𝑇)-𝑃_{atm}(𝑇_{amb}) −𝑃_{ground}(𝑇_g)-𝑃_{Sun}-𝑃_{cond+conv}$$

------

### **作者对他们提出的设计进行了仿真计算，阐述了理论上的特性分布**

![image-20260316142934939](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316142934939.png)

图2A是设计的AS emitter的结构图，衬底是nanoPE，制备了阶梯状结构，然后倾斜面（Slanted surface）上是Ag/SiN/Ag三层结构，水平面Ag/SiN

这个器件是怎么制备加工的：分成PDMS做阶梯形状和nanoPE薄膜制备两部分。PDMS的热固化以及脱模特性很好，所以用PDMS先制备阶梯状结构，再转印到nanoPE薄膜上面。PDMS阶梯形状的制备过程如下图，注意其中第一次在PDMS上做Ag层时，中间还先做了一层10nm Cr作为粘附层

![image-20260316145810592](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316145810592.png)

nanoPE膜的制备如下所示：重量比4:1的**高密度聚乙烯（HDPE）**和**超高分子量聚乙烯（UHMWPE）**混合均匀到固态和液态4:1混合的石蜡油，做完之后反过来把结构转印到nanoPE膜上。其中图2C中研究了nanoPE的空洞大小（0.3 to 1 μm）对于这个阶梯结构散射效率的影响，仿真方法与图2B中一致。

![image-20260316150542177](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316150542177.png)

图2B锯齿光栅在不同入射角下的模拟光谱太阳反射率；图2D随天顶角（ *θ* ）和方位角（ *ϕ* ）变化的光谱角发射率 *ϵ*(*λ*,*θ*) （左图）和 8 至 13 *μm* 波长范围内平均发射率 *ϵ*的关系图，与之前图1的理想结果是一致的 （右图）。

这个仿真用的是Tidy3D求解器，是Flexcompute的一个模块，软件有python接口，且有MCP接口[flexcompute/tidy3d: fast, large scale photonic simulation platform](https://github.com/flexcompute/tidy3d)

图2E，利用涨落耗散定理（fluctuation-dissipation theorem）计算的锯齿光栅在 11 μm波长下的热辐射强度角度分布（左图）和空间分布（右图）。为了便于可视化，我们仅展示了一个单元晶格的发射场。结构参数为： w=1000μm ， h/w=2/3 ， dAg=0.15μm ，以及 dSiN=4μm。

------

### 接下来按照上述相关的流程，制备出了AS emitter并进行了详细表征

![image-20260316152722769](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316152722769.png)

图3A，AS emitter样貌；

图3B，说明这个反射器具有较好的可见光和近紫外光的反射率，AS 发射器在不同入射角下的测量太阳反射光谱。该 AS 发射器显示出全向的太阳反射率为 0.978。

图3C，单独nanoPE的透过率的表征，具有优良的红外透射率

图3D，角分辨热发射光谱ATESM的表征结果，与仿真结果一致

图3E，ATESM的测试方法示意图

图3F，两种不同倾角位置拍摄的热成像图，显示出输出辐射或表观温度的明显对比。

------

### 进一步的实证测试结果，与常见涂层的降温效果对比，AS emitter最好

空旷地面的降温对比

![image-20260316153519628](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316153519628.png)

屋顶有建筑反射面的实测结果
![image-20260316153636426](/assets/posts_figs/2026-03-16-paper-vertical-radiative-cooling/image-20260316153636426.png)