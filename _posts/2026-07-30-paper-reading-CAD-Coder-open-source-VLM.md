---
layout: post
title: "[论文阅读] CAD-Coder：面向 CAD 代码生成的开源视觉语言模型"
date: 2026-07-30 12:36:29 +0800
categories: Learning
mathjax: true
---

# [论文阅读] CAD-Coder：面向 CAD 代码生成的开源视觉语言模型

> **论文**: CAD-Coder: An Open-Source Vision-Language Model for Computer-Aided Design Code Generation
> **作者**: Anna C. Doris, Md Ferdous Alam, Amin Heyrani Nobari, Faez Ahmed
> **机构**: MIT（Massachusetts Institute of Technology）
> **发表**: arXiv:2505.14646v1 [cs.CV], 2025-05-20
> **代码/数据**: https://github.com/anniedoris/CAD-Coder （开源，含 GenCAD-Code 数据集与模型权重）
> **关联**: Ortho2CAD (2607.08891) 的主要基线；GenCAD-Code 是 Ortho2CAD SFT 数据来源之一

---

## 一、研究背景与动机

### 1.1 问题
CAD 建模（画草图→定义约束→拉伸实体）至今仍高度依赖人工，是产品设计中成本与周期的瓶颈。AI 驱动的 CAD 生成面临三个痛点：

1. **CAD 操作表示不完整**：现有 DSL（领域专用语言）表示（如 DeepCAD 的 17 维命令向量）只覆盖 sketch line/arc/circle + extrude，缺 spline/revolve/sweep/loft/fillet/chamfer 等，且需要专门转换脚本才能变成可执行实体；
2. **对真实图像泛化差**：从零训练的模型受限于合成数据分布，输入偏离训练分布就失效；
3. **输出精度低**：通用 VLM 靠 prompt engineering 直接生成 CAD 代码时会幻觉几何、产生语法错误（如 GPT-4 生成机械弹簧时 IoU 接近 0，即便接 debugger 迭代也不行）。

### 1.2 核心思路
**与其自定义 DSL，不如直接微调一个开源 VLM 输出成熟的 CAD 脚本库代码（CadQuery Python）**。理由：
- LLM 预训练中已包含大量代码知识，CAD 代码（而非 CAD program DSL）与预训练知识天然对齐；
- 预训练视觉编码器（CLIP）见过数百万真实图像，有望打通"渲染图训练→真实照片推理"的鸿沟；
- CadQuery 基于 OpenCASCADE B-rep 内核，无 GUI 依赖、可独立运行、参数化可编辑，表达能力完备（任何 3D 模型都可表示）。

### 1.3 术语约定（论文明确区分）
- **CAD code**：基于成熟脚本库的可执行代码（CadQuery/FreeCAD/Blender API）——本文路线；
- **CAD program**：命令-参数向量式的 DSL 表示（DeepCAD/SkexGen/GenCAD/OpenECAD）——表示不完整、需转换脚本。

---

## 二、核心贡献

1. **CAD-Coder 模型**：首个专门微调开源 VLM（LLaVA 1.5 架构）直接生成 CadQuery 代码的工作；100% 语法有效率（VSR），IOU_best 0.675，超过 GPT-4.5（0.524）与 Qwen2.5-VL-72B（0.352）；
2. **GenCAD-Code 数据集**：163,671 个 CadQuery 脚本（每个配 5 张渲染图），当时最大公开的图像-CAD 代码配对数据集；
3. **泛化性实验**：真实物体照片（3D 打印件）上仍能生成合理 CAD；通过换用代码型 LLM + 降低学习率，可一定程度保留预训练知识、执行微调时未见过的 CAD 操作（fillet）；
4. **严格的形状评估协议**：基于惯性矩归一化 + 主轴对齐的 IOU_best，附完整数学证明（Appendix A），主张替代 DeepCAD 系沿用的 Chamfer Distance。

---

## 三、方法

### 3.1 GenCAD-Code 数据集构建

**数据源链路**：ABC 数据集（1M STEP）→ DeepCAD（~172k 命令序列，仅 prismatic sketch+extrude 子集）→ GenCAD（168k，每个配 5 张不同尺度的灰度等轴测渲染图）→ **GenCAD-Code**（163,671 个 CadQuery 脚本）。

**转换方式**：写脚本将 GenCAD 的每条 CAD 命令 $c_i = (t_i, p_i)$（$c_i \in \mathbb{R}^{17}$，$t_i \in \{$Sketch Line, Sketch Arc, Sketch Circle, Extrude$\}$，$p_i \in \mathbb{R}^{16}$）直接映射为对应 CadQuery 代码。

**统计**：
- 划分：train 147,289 / test 7,355 / val 9,027；
- token 数：平均 611 tokens/脚本，99.9% < 3000 tokens；
- 分布右偏：简单模型多、复杂模型少（作者承认不平衡，列为 future work）。

**已知缺陷**：直接转换不产生最简代码——矩形用 4 条顺序 line 而非 CadQuery 原生的 `.rect()`；后续可做脚本后处理压缩。

### 3.2 模型架构（LLaVA 1.5 架构）

```
图像(336×336) → CLIP-ViT-L-336px（冻结）→ 2层MLP（可训练）→ Vicuna-13B-v1.5（可训练）→ CadQuery 代码
```

- **视觉编码器**：CLIP-ViT-L-336px（高分辨率版本，捕捉细节）；
- **LLM**：Vicuna-13B-v1.5（13B 参数）；
- **连接器**：两层 MLP，把图像特征映射到 LLM 词嵌入空间。

### 3.3 两阶段训练（沿用 LLaVA visual instruction tuning）

| 阶段 | 目标 | 数据 | 可训练参数 | 超参 |
|------|------|------|-----------|------|
| Stage 1: 特征对齐预训练 | 学习图像特征→词嵌入的映射 | 595k CC3M 图文对（同 LLaVA） | 仅 MLP（冻结 ViT 与 LLM） | lr=1e-3, 1 epoch, eff. batch 256, 4.5h |
| Stage 2: GenCAD-Code SFT | 端到端微调生成 CadQuery | 147k GenCAD-Code | MLP + 全部 LLM 权重（ViT 仍冻结） | lr=2e-5, 1 epoch, eff. batch 128, 5.7h |

- 硬件：4× H100；max_model_length = 4096（比 LLaVA 默认 2048 加长以容纳长脚本）；过滤掉总 token 超 4096 的样本（<0.1%）；
- **固定文本 prompt**（训练与评测一致）："Generate the CadQuery code needed to create the CAD for the provided image. Just the code, no other words."；
- 训练目标即标准自回归似然最大化（Eq. 1）；
- 推理：temperature = 0（贪心解码），最大输出 3450 tokens。

### 3.4 评估指标（重点，数学上较讲究）

**(1) VSR（Valid Syntax Rate）**：生成的 CadQuery 脚本作为 Python 文件运行无报错的比例。

**(2) IOU_best**：在最佳对齐下生成实体与真值实体的交并比。流程：

**Step 1 — 归一化**（平移+缩放，Eq. 2）：

$$n(\Omega) = \left\{ \frac{x - \bar{x}}{\sqrt{\dfrac{\mathrm{tr}(I)}{2\,\mathrm{Vol}(\Omega)}}} \,\Bigg|\, x \in \Omega \right\}$$

其中 $\bar{x}$ 为质心，$I$ 为惯性矩矩阵。缩放因子是**回转半径的均方根**（RMS radius of gyration）——Appendix A Lemma 2 证明这是最优缩放。注意：因输入只有图像、不含绝对尺度信息，评估时必须做尺度归一化。

**Step 2 — 主轴对齐**：对齐两实体的惯性主轴；主轴方向有符号歧义，共 8 种可能，其中 4 种是 $SO(3)$ 合法旋转，**枚举全部 4 种取 IOU 最大者**。

**Step 3 — IOU 计算**：只在成功执行的脚本上计算（语法错误样本不参与）。

**附录证明要点**：
- **Lemma 1**：仿射变换 $f(x) = sRx + t$（$R \in SO(3)$）是保相对体积的双射，$\mathrm{Vol}(\Omega_2) = s^3\,\mathrm{Vol}(\Omega_1)$；
- **Lemma 2**：刚体对齐问题 $\min_{R,s,t} \int_{\Omega_1} \|sRx + t - f(x)\|_2^2 dx$ 有唯一闭式解：
  - $t^* = \bar{x}_2 - sR\bar{x}_1$（质心对齐）；
  - $s^* = \sqrt{\mathrm{tr}(I_2)/\mathrm{Vol}(\Omega_2)} \big/ \sqrt{\mathrm{tr}(I_1)/\mathrm{Vol}(\Omega_1)}$；
  - $R^* = VU^T$（对互协方差 $S = \int \tilde{f}(x)\tilde{x}^T dx$ 做 SVD，即正交 Procrustes 问题）。
- 作者论证：相比 DeepCAD/GenCAD 用的"点云化 + bounding box 角点对齐 + Chamfer Distance"，该 IOU 协议**数学上更严格、对实体比较保真度更高**。

### 3.5 基线设置

- 评测子集：test set 随机抽 **100 个样本**（因推理与评估成本高）；
- 闭源（MMMU 榜单前三，2025-03-17 时点）：GPT-o1、GPT-4.5、Gemini-2.0-Pro；
- 开源（OpenVLM 榜单前三）：InternVL2_5-78B-MPO、Ovis2-34B、Qwen2.5-VL-72B；
- **消融基线**：LLaVA-v1.5-13B（架构相同，但 Stage 2 用通用 VQA 数据而非 GenCAD-Code）；
- 基线 prompt 补充 "Assign the final solid to the variable 'solid'…"（GenCAD-Code 约定最后一行返回 `solid`），Qwen 额外提醒 "Be sure to include necessary imports."

---

## 四、实验结果

### 4.1 主结果（Table 2，100 样本测试子集）

| 模型 | VSR ↑ | IOU_best ↑ |
|------|-------|------------|
| **开源** | | |
| InternVL2_5-78B-MPO | 88% | 0.379 |
| Ovis2-34B | 83% | 0.408 |
| Qwen2.5-VL-72B | 94% | 0.352 |
| LLaVA-v1.5-13B（通用VQA版） | **0%** | 0.0 |
| **闭源** | | |
| GPT-o1 | 88% | 0.494 |
| GPT-4.5 | 84% | 0.524 |
| Gemini-2.0-Pro | 82% | 0.445 |
| **CAD-Coder (Ours)** | **100%** | **0.675** |

要点：
- CAD-Coder 比最好的开源模型（Qwen2.5-VL-72B）IOU 高约 **60% 相对**；比最好的闭源 GPT-4.5 高 0.151 绝对值；
- Figure 3 直观校准 IOU 观感：0.963 时仅中心孔略大；**0.04 的 IOU 差距肉眼已可分辨**，说明 0.151 的提升很显著；
- **LLaVA-v1.5-13B 双零分**是关键的消融证据：同架构换成通用 VQA 微调后，生成的"类 CadQuery 文本"全部语法错误——Vicuna-13B 预训练里几乎没有 CadQuery 知识，证明 GenCAD-Code 领域微调（而非架构本身）才是性能来源。

### 4.2 变体实验（Table 3）：换代码型 LLM 的意外结果

动机：Vicuna-13B 不懂 CadQuery，换用代码榜单第一的 Qwen2.5-Coder-14B-Instruct（32B 受算力限制改 14B）应能保留更多预训练 CAD 操作知识。

| 模型 | 预训练 LLM | Stage2 lr | VSR ↑ | IOU_best ↑ |
|------|-----------|-----------|-------|------------|
| CAD-Coder | Vicuna-13B-v1.5 | 2e-5 | **100%** | **0.675** |
| CAD-Coder-Qwen2.5-14B | Qwen2.5-Coder-14B-Inst | 2e-5 | 95% | 0.641 |
| CAD-Coder-Qwen2.5-14B-LowLR | 同上 | 1e-5 | 94% | 0.592 |

**反直觉发现**：代码专精 LLM 版本反而略差。原因诊断：
- Qwen2.5-Coder 预训练上下文长达 131k tokens，生成复杂模型时"刹不住车"，超出 4096 限制被**中途截断**（5/100 的语法错误全是这种情况）；Vicuna 预训练上下文恰为 4096，与数据集天然匹配；
- 降学习率保预训练知识 → 微调任务性能下降（经典 catastrophic forgetting 权衡）。

### 4.3 泛化实验（本文最有价值的部分）

**(1) 真实图像泛化（Figure 4）**
- 做法：把 test set 中 5 个模型 **3D 打印出来**，放在木桌上以近似等轴测角度拍照，输入 CAD-Coder；
- 结果：生成实体与真值大体一致（操作类型基本对），但精度下降——物体 2、4 操作对但**宽高比估错**（如低估边长）；物体 3（多次拉伸的复杂件）操作序列本身就抓不准；
- 原因分析：训练图像全是完美等轴测、灰度渲染图，真实照片有色彩、视角微偏；缓解方向：多角度多材质渲染训练、Stage 1 混入真实几何体照片。
- 作者强调此实验的现实意义：**用户几乎不会拿 CAD 渲染图去生成 CAD（那说明已有 CAD），真实场景就是从照片出发**；而构造"真实照片+CAD 代码"配对数据集需实体制造数十万件，不可行，所以渲染图→真实照片的迁移能力是刚需。

**(2) 未见 CAD 操作泛化（Figure 5，fillet 测试）**
- 设置：GenCAD-Code 中**无任何 fillet 代码**，第二轮对话要求模型给已生成的长方体所有边加圆角；
- CAD-Coder（Vicuna）：失败，即使 prompt 中显式给出 `.fillet()` 语法提示，输出仍语法错误——根因是 Vicuna 本身没有 CadQuery 知识（文本单测也失败）；
- CAD-Coder-Qwen2.5-14B（lr=2e-5）：**也失败**——Qwen2.5-Coder-14B-Instruct 微调前明明能正确生成带圆角的盒子（文本单测通过），微调后反而错误使用 `.edges()`：**预训练知识在 SFT 中被冲掉（灾难性遗忘）**；
- CAD-Coder-Qwen2.5-14B-LowLR（lr 减半至 1e-5）：在**明确语法提示**下成功加圆角；但抽象 prompt（"add fillets to all edges"）仍不行——泛化是脆弱的、prompt 依赖的。

---

## 五、局限性与 Future Work

1. **真实图像精度不足**：对透视变化、精确尺寸比例的推断不可靠；需多视角/透视不变训练、图像增广；
2. **未见操作的泛化强依赖 prompt**：需要更好的微调策略保留预训练知识（作者提到 continual learning、特征保留式微调 [33,34]）；
3. **数据集偏简单**：token 分布右偏，复杂件样本少；
4. **上下文长度矛盾**：长上下文 LLM 与 4096 数据集不匹配，复杂长脚本生成受限；
5. 未来方向：推理型 LLM / CoT 引入微调数据、建立真实照片-CAD 代码评测集、代码简洁化后处理（`.rect()` 等）。

---

## 六、与调研系列其他工作的对照

| 维度 | **CAD-Coder** (本文) | Drawing2CAD (ACM MM'25) | Ortho2CAD (CMU'26) |
|------|---------------------|------------------------|--------------------|
| 输入 | 单张等轴测渲染图（+固定文本） | 4 视图 SVG 矢量工程图 | 3 视图栅格工程图（带尺寸标注） |
| 输出 | **CadQuery 代码** | 自有命令-参数序列（DSL） | **CadQuery 代码** |
| 模型 | LLaVA 1.5（CLIP+ Vicuna-13B+MLP） | 定制 Transformer（双解码器） | Qwen3-VL-8B |
| 训练 | 两阶段 SFT | 从头训练 | SFT + RL（IoU 奖励） |
| 数据集 | GenCAD-Code 163k（自建开源） | CAD-VGDrawing 157k（自建开源） | DeepCAD/GenCAD-Code/Fusion360 |
| 核心指标 | VSR 100%, IOU_best 0.675 | ACC_cmd 82.43, IR 20.31% | IoU 0.7922（DeepCAD） |
| 评估协议 | IOU_best（惯性归一化+主轴对齐） | MCD（Chamfer, 2000点）+ IR | IoU（沿用 CAD-Coder 式） |

**谱系定位**：CAD-Coder 是"**图像→CAD 代码**"路线的开创性工作（首次证明微调 VLM 输出成熟脚本库代码可行），Ortho2CAD 直接继承了它的输出表示（CadQuery）、部分训练数据（GenCAD-Code）和 IoU 评估协议，并在此基础上加入工程图输入与 RL 几何反馈。Drawing2CAD 则代表"矢量图→DSL 命令"的另一条路线。

**值得注意的细节**：CAD-Coder 主结果 IoU 0.675（100 样本子集、等轴测单视图、渲染图），而 Ortho2CAD 论文中报告 CAD-Coder 在 DeepCAD 测试集上为 0.735、自己达 0.7922——两者数字不可直接比较（测试集规模、输入视图、归一化实现细节不同），引用时需注明评测口径。

---

## 七、创新点总结

1. **表示选择即创新**：放弃自定义 DSL，直接用 CadQuery 完整脚本作为输出表示——表达能力完备、天然可编辑、与 LLM 预训练知识对齐；
2. **首次系统验证"微调开源 VLM → CAD 代码"路线**：100% VSR + 显著超 GPT-4.5 的几何精度，且同架构通用 VQA 版双零分的消融干净利落；
3. **GenCAD-Code 数据集**：163k 图像-CadQuery 对，成为后续工作（Ortho2CAD 等）的训练资源；
4. **数学上严格的 IOU_best 评估协议**：惯性矩归一化 + SVD 主轴对齐 + 枚举 4 种合法旋转，附完整最优性证明，比 Chamfer+bbox 对齐更严谨；
5. **两类泛化实验设计**（真实照片、未见操作）揭示了"渲染图→真实图"与"灾难性遗忘"两个真问题，为后续 RL/持续学习方法（如 Ortho2CAD 的 IoU 奖励 RL）铺垫了动机。

---

## 八、个人思考（与自身工作的关联）

1. **"物理可执行输出"的奖励设计**：CAD-Coder 把 CAD 变成 Python 代码，天然可执行、可验证（VSR/IoU 都是执行后评估）。这与我们光谱反演中"预测 n/k → TMM 正向求解 → 对比实测光谱"的闭环同构——Ortho2CAD 正是沿此思路加 RL 才超过 CAD-Coder。对我们的反演框架，把"正向求解器一致性"作为奖励或损失项是已被这两条工作验证的方向。
2. **IOU_best 的归一化思想可迁移**：其"先消去无关自由度（平移/尺度/旋转）再比较本质形状"的协议设计，类比到光谱匹配即"先归一化强度/基线再比较线形"，比直接算端到端距离更鲁棒。
3. **灾难性遗忘的教训**：换更强基座（Qwen2.5-Coder）+ 暴力 SFT 反而退化，降学习率只能部分挽回。对我们在预训练模型基础上做领域微调的场景（如用预训练光谱模型微调），学习率与知识保留策略需要显式设计。
4. **数据集是最大护城河**：CAD-Coder 的真正遗产是 GenCAD-Code；同理，领域内高质量配对数据（结构↔光谱）比模型架构更能决定上限。
5. **谨慎对待其主结果数字**：仅 100 样本评测、单一固定 prompt、渲染图输入——离"拍照即 CAD"的愿景仍有实质差距，真实图像实验里宽高比都估不准，说明单视图几何尺度推断本身就是病态问题（ Drawing2CAD 用多视图矢量输入正是针对这一点）。
