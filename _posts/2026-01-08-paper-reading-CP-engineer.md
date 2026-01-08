---
layout: post
title: "[论文阅读] PSK的组分工程与带隙和稳定性之间的关系"
date: 2024-07-16 17:43:33 +0800
categories: Learning
mathjax: true
---

###  Bush K.A, Compositional Engineering for Efficient Wide Band Gap Perovskites with Improved Stability to Photoinduced Phase Segregation, 2018, ACS Energy Lett,3,428-435

### 主要内容

对$$Cs_xFA_{1−x}Pb (Br_yI_{1−y})_3$$ 组分的钙钛矿进行分析，得出tandem-relevant最佳带隙应该在1.68-1.75eV范围。Cs和Br的比例都可以调控带隙，但增加Cs阳离子比例相较增加Br卤素阴离子比例而言，具有更好的$V_{oc}$和光稳定性

### 内容分析

首先，钙钛矿层中存在三种对电池IV特性以及稳定性有重要影响的现象：**相分离**（phase segregation）,**光致卤素分离**（photoinduced halide segregation）和**离子迁移**（ion migration）

**光致卤素分离**，又称Hoke效应[1]，定义是：“Upon illumination, segregation of the halides into lower band gap I-rich and higher band gap Br-rich regions, mediated by halogen vacancies” [2],[3].通俗来说，就是卤素离子在光照下从原本在晶格中混合的状态分离，例如MAPBIBr分离成宽带隙的MAPbBr3和窄带隙的MAPbI3。MA pure的PVK长时间使用后会出现$V_{oc}$下降问题，就是因为该现象分离出的窄带隙钙钛矿组分，成为复合中心。 



为了解决这个问题，便采取了混合阳离子（mixed cation）的策略。使用Cs,FA来替代原本MA pure的PVK，有效提高了结构，热，潮湿稳定性，而且效率也超越了原本的MAPbIBr[4],[5],[6]



那么$Cs_xFA_{1−x}Pb (Br_yI_{1−y})_3$这种组分钙钛矿该采取什么样的设计原则呢？就是这篇文章的重点。这篇文章制作了一系列不同Cs:Br比例的钙钛矿电池，对这些电池的IV性能和稳定性进行衡量，最后得出结论。

这里只放一张图：
![image-20240711154841551](/assets/posts_figs/2026-01-08-paper-reading-CP-engineer/image-20240711154841551.png)

可以看到，这篇文章里“Cs和Br的比例都可以调控带隙，但增加Cs阳离子比例相较增加Br卤素阴离子比例而言，具有更好的$V_{oc}$和光稳定性”这一结论是有Br比例大于17.5%这个限制条件的。



## Reference

[1] Hoke, E. T.; Slotcavage, D. J.; Dohner, E. R.; Bowring, A. R.; Karunadasa, H. I.; McGehee, M. D. Reversible Photo-Induced Trap Formation in Mixed-Halide Hybrid Perovskites for Photovoltaics. Chem. Sci. 2015, 6, 613−617.

[2] Eames, C.; Frost, J. M.; Barnes, P. R. F.; O’Regan, B. C.; Walsh, A.; Islam, M. S. Ionic Transport in Hybrid Lead Iodide Perovskite Solar Cells. Nat. Commun. 2015, 6, 7497. 

[3] Yoon, S. J.; Kuno, M.; Kamat, P. V. Shift Happens. How Halide Ion Defects Influence Photoinduced Segregation in Mixed Halide Perovskites. ACS Energy Lett. 2017, 2, 1507−1514.

[4] Lee, J. W.; Kim, D. H.; Kim, H. S.; Seo, S. W.; Cho, S. M.; Park, N. G. Formamidinium and Cesium Hybridization for Photo- and Moisture-Stable Perovskite Solar Cell. Adv. Energy Mater. 2015, 5,1− 9. 

[5] Li, Z.; Yang, M.; Park, J. S.; Wei, S. H.; Berry, J. J.; Zhu, K. Stabilizing Perovskite Structures by Tuning Tolerance Factor: Formation of Formamidinium and Cesium Lead Iodide Solid-State Alloys. Chem. Mater. 2016, 28, 284−292. 

[6] Yi, C.; Luo, J.; Meloni, S.; Boziki, A.; Ashari-Astani, N.; Gratzel, C.; Zakeeruddin, S. M.; Rothlisberger, U.; Gratzel, M. Entropic Stabilization of Mixed A-Cation ABX 3 Metal Halide Perovskites for High Performance Perovskite Solar Cells. Energy Environ. Sci. 2016, 9, 656−662.