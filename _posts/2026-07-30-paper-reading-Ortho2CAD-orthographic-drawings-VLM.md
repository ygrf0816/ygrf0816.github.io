---
layout: post
title: "[论文阅读] Ortho2CAD：基于视觉语言模型的三视图到 3D CAD 生成"
date: 2026-07-30 11:39:23 +0800
categories: Learning
mathjax: true
---

# [论文阅读] Ortho2CAD：基于视觉语言模型的三视图到 3D CAD 生成

> **文献信息**
> - **标题**: Ortho2CAD: 3D CAD Generation from Orthographic Drawings using Vision Language Models
> - **作者**: Aditya Joglekar, Amit Regmi, Kenji Shimada, Levent Burak Kara*（卡内基梅隆大学 机械工程系）
> - **发表**: arXiv:2607.08891v1 [cs.CE], 2026-07-09
> - **代码**: https://github.com/AdityaJoglekar/Ortho2CAD
> - **阅读日期**: 2026-07-30

---

## 一、研究目的与动机

### 1.1 问题定位
工程图→3D CAD 的另一条路线（与 Drawing2CAD 形成有趣对照）：
- 工业界实际**交换最多的是栅格化（raster）工程图**——易分享、可 QA、保护知识产权（不可编辑）；
- 但下游工作流（制造规划、仿真、成本估算）需要**可编辑的参数化 3D CAD**；
- 矢量格式可直接脚本化访问几何实体，栅格图则传统上只能靠人工读图 → 自动化重建的瓶颈。

### 1.2 与现有 VLM/LLM CAD 工作的差距
- 已有 LLM/VLM 能从文本、透视图、点云生成 CadQuery 代码（CAD-Coder、Cadrille 等），但**没有工作处理正交投影工程图**这一工业设计通信的标准格式；
- 正交图带**虚线隐藏线、尺寸标注**等制图规范，与产品渲染图/透视图差异大。

### 1.3 核心思路
用 **VLM（Qwen3-VL-8B-Instruct）** 把三视图正交工程图直接翻译成 **CadQuery 代码**（Python 参数化 CAD 脚本），执行即得 STEP 模型。根据数据集是否有代码监督，分两路：
- **有 CadQuery 标签（DeepCAD + GenCAD-Code）** → 监督微调（SFT）；
- **无 CadQuery 标签（Fusion 360 Reconstruction）** → 几何反馈强化学习（RL，奖励 = 执行后实体的 IoU）。

---

## 二、方法

### 2.1 数据生成管线（重要贡献）
- 基于 **pythonOCC**（OpenCASCADE 的 Python 封装）的自动工程图生成器，输入 STEP：
  - 三视图（前/俯/右），**第一角投影**（first-angle，欧标惯例）；
  - 遵循制图规范：**可见边实线、隐藏边虚线**，并标注 **3 个关键尺寸**（仅包围盒尺寸，不覆盖全部特征尺寸——如空心圆柱内径需靠与包围盒尺寸的比例推知）；
  - 输出为**栅格 PNG**（贴近工业实际交换格式）；
- 已用于 DeepCAD 和 Fusion 360 Reconstruction 两个数据集，合计 **>150k 样本**，是最大开源正交工程图资源之一；生成代码开源，可用于任何含 STEP 的数据集；
- DeepCAD 生成时设 **10 秒超时**——既加速生成，又模拟真实场景"某些视图可能缺失"；
- 对比已有资源：Zhang et al. (2023) 仅 2981 样本且无公开管线；Zhang et al. (2025) 用 ABC+FreeCAD 生成约 70k 图但**无尺寸标注、无虚线隐藏线**，不符合制图规范。

### 2.2 监督微调（SFT，DeepCAD 路线）
- **问题设定**: 学习条件分布 π_θ(τ|q)，q = (工程图 I, 指令 prompt)，τ = CadQuery token 序列；监督来自 GenCAD-Code 数据集（CAD-Coder 提供的 GT 代码）；
- **backbone**: Qwen3-VL-8B-Instruct（参数量与 CAD-Coder ~13B 相当但更新更强）；
- **prompt**: 固定指令 "Generate the CADQuery code needed to create the CAD for the provided image. Just the code, no other words."（与 CAD-Coder 一致）；未微调模型额外追加输出格式约束（最后将实体赋给变量 `solid`）；
- **目标**: 标准自回归交叉熵 L_SFT = −E Σ_t log π_θ(y_t|q, y_<t)；
- **训练细节**: 5 epochs，lr=1e-5，per-device batch 4 × 梯度累积 4；**视觉塔冻结**，只训多模态投影层 + LLM 主干；4×H100 约 11 小时（CAD-Coder 基线同数据同预算复训）；
- **数据划分**: 沿用 GenCAD-Code train/test/val = 147289/7355/9027，最终评估取与 CAD-Coder 相同的 **100 样本测试子集**。

### 2.3 强化学习（RL，Fusion 360 路线）
- **动机**: 多数 CAD 数据集只有 GT 几何（STEP）而无对齐的 CadQuery 代码；代码执行不可微 → 用 RL 以执行几何的标量反馈优化策略；
- **奖励**: R(q,τ) = IoU(S(τ), S*(q))，即生成代码执行出的实体与 GT STEP 的交并比；**无效代码（解析/运行失败）奖励置 0，不加额外惩罚**；IoU 计算前对模型输出与 GT 做归一化对齐（沿用 CAD-Coder），因此**奖励尺度不变**，输出尺寸单位可按用户需求缩放；
- **算法**: **Dr. GRPO 风格 + 序列级优化（GSPO 视角）**：
  - 每个 query 采样 G=8 个候选代码，组内**均值中心化优势** A(g) = R(g) − mean(R)，不做长度/方差归一化（避免长序列偏置——过长生成提高执行失败率、截断学习信号）；
  - 序列级目标：L_RL = −E_q [ (1/LG) Σ_g log π_θ(τ(g)|q) · A(g) ]，L = 最大补全长 7680（8192 模型上限减去输入 token 与缓冲）；
  - 直觉：同一图纸下 IoU 高于组内平均的完整程序被强化，低于平均的被抑制；每组采样只做一次梯度更新即丢弃；
- **初始化**: 从 DeepCAD SFT 模型出发（代码可执行率高 → RL 训练快而稳）；
- **超参**: 2 epochs，lr=1e-6，有效 batch 64，G=8；视觉塔冻结；4×H100 约 **100 小时**；评估同样 100 样本子集。

### 2.4 评估指标
- **Valid Codes**: 生成代码语法有效且能执行出实体的比例（无效输出 IoU 记 0）；
- **IoU**: 执行实体与 GT STEP 的平均交并比。

---

## 三、实验与结果

### 3.1 基线三族
1. **Qwen3VL 开源族**（8B/32B Instruct，零样本）；
2. **GPT-5.2**（闭源最强通用 VLM，零样本，代表"不训练能走多远"）；
3. **CAD-Coder**（领域专用 SOTA，基于 LLaVA 微调，图像→CadQuery）。
注：Cadrille、MCoT-RL 等 RL-CAD 工作因无公开实现未纳入对比。

### 3.2 SFT 结果（DeepCAD 测试子集，Table 3）

| 模型 | Valid Codes | IoU |
|------|------------|-----|
| Qwen3VL-8B Instruct | 70% | 0.3747 |
| Qwen3VL-32B Instruct | 76% | 0.4919 |
| GPT-5.2 | 90% | 0.5987 |
| CAD-Coder | 100% | 0.7361 |
| **Ortho2CAD (SFT)** | **100%** | **0.7922** |

- 代码有效率 100% 追平 CAD-Coder；IoU 相对最优基线 **+7.6%**；
- GPT-5.2 零样本仅 ~0.59（正文另一处写 0.5905，表格为 0.5987）→ 证明该任务的领域专属性，必须针对性训练；
- 定性：简单棱柱件大家都不错（IoU>0.85）；多特征交互、拓扑复杂、需精心排序操作序列的零件上 Ortho2CAD 优势明显。

### 3.3 RL 结果（Fusion 360 测试子集，Table 4）

| 模型 | Valid Codes | IoU |
|------|------------|-----|
| Qwen3VL-8B Instruct | 58% | 0.2730 |
| Qwen3VL-32B Instruct | 66% | 0.3600 |
| GPT-5.2 | 78% | 0.5181 |
| CAD-Coder (DeepCAD SFT) | 90% | 0.2473 |
| Ortho2CAD (DeepCAD SFT) | 96% | 0.3697 |
| **Ortho2CAD (RL)** | **100%** | **0.5601** |

- Fusion 360 零件整体更难（所有零样本基线 IoU 全面下滑）；
- **跨域迁移现象关键**：DeepCAD SFT 模型直接在 Fusion 360 上代码有效率仍 96%，但 IoU 掉到 0.37——**学会了语法、没对齐几何分布**，恰是 RL 的理想起点；
- RL 后：100% 有效 + IoU 0.5601，相对最强基线 GPT-5.2 **+8.1%**；证明"可执行几何反馈"无需 GT 代码即可适配新数据分布；
- 定性对比 GPT-5.2：GPT 代码更"干净"（有注释、变量名更好），但不转化为更好的几何；失败案例共性：**薄片类复杂几何 IoU 最低**；DeepCAD 最差案例中代码可执行但操作未围成封闭体积。

### 3.4 局限与未来方向
1. 无代码监督场景（如 ABC 数据集）IoU 仍有很大提升空间；操作类型仅 sketch+extrude；
2. SFT 需要更丰富的 CadQuery 代码库（GenCAD-Code + CAD-Recode 等合并是下一步）；
3. RL 奖励可更丰富：除 IoU 外，可奖励"输出实体的正交投影 vs 输入图纸"的相似度；
4. 加 CoT 推理降低探索方差（高质量 CoT 数据是关键）；
5. 推理时迭代细化（inference-time scaling，如 CAD-CodeVerify）vs 单次生成的权衡；闭源大模型（推理强但贵、首遍差）与微调开源模型（首遍好但迭代弱）的混合路线。

---

## 四、创新点总结

1. **任务开创性**: 首个面向**带制图规范（虚线隐藏线+关键尺寸）的三视图正交工程图**的 VLM→CadQuery 生成框架；
2. **双训练机制覆盖两种现实场景**: 有代码监督走 SFT、无代码监督走几何奖励 RL（Dr. GRPO+序列级优化），同一框架贯通；
3. **数据生成管线开源**: pythonOCC 第一角投影三视图生成器（虚线+包围盒尺寸），>150k 样本，可迁移到任意 STEP 数据集；
4. **实证发现**: 零样本 GPT-5.2 远不及 8B 微调模型；SFT 模型跨域"语法保留、几何失配"，RL 几何反馈可补齐——为 CAD 代码生成的 post-training 范式提供了清晰证据链。

---

## 五、个人思考与关联（含与 Drawing2CAD 的对照）

- **与 Drawing2CAD 的互补/对立**：两篇恰好构成"矢量 vs 栅格"的一对镜像：
  | | Drawing2CAD (MM'25) | Ortho2CAD (2026) |
  |---|---|---|
  | 输入 | SVG 矢量图元序列 | 栅格三视图 PNG（含虚线+尺寸） |
  | 输出 | DeepCAD 命令序列（4 类操作） | CadQuery Python 代码 |
  | 模型 | 定制小 Transformer（d=256） | Qwen3-VL-8B + SFT/RL |
  | 评价 | ACC_cmd/param、MCD、IR | Valid Codes、IoU |
  | 图纸来源 | FreeCAD TechDraw | pythonOCC 自研管线 |
  - Drawing2CAD 证明矢量输入精度远胜栅格（同架构下 IR 23% vs 30%）；Ortho2CAD 则主张栅格才是工业现实格式，用大模型容量弥补像素信息损失。**两条路线的分歧本质是"信息保真 vs 格式现实性"**——做调研对比时这是核心论点。
- **输出表示的选择**：CadQuery 代码比 DeepCAD 命令序列更灵活（完整 Python 表达能力、可加注释、天然可编辑），但也带来更长生成序列和执行失败风险；DeepCAD 序列更受限但更可控。CadQuery 路线能借上 LLM 代码能力的"免费午餐"。
- **RL 奖励设计可借鉴**：IoU 奖励 = 执行几何与 GT 的相似度，无效置 0 不额外惩罚——与我们光谱反演中"物理一致性奖励"（TMM 重算光谱与目标比对）思路同构；"执行-评估-反馈"的 RL 闭环可迁移到任何有正向求解器的反问题（我们有 TMM/RCWA，相当于他们的 pythonOCC）。
- **Dr. GRPO 的细节值得记**：组内均值中心化、不做长度归一化、序列级而非 token 级优化——针对"只有终端奖励"的场景（代码执行完才能算 IoU），这些选择都有明确动机，不是无脑套 GRPO。
- **"语法学会、几何失配"现象**（96% 有效但 IoU 0.37）是很漂亮的实验发现，说明 VLM 学代码任务时语法与语义可分离，跨域适配必须靠几何级反馈。
- **局限共性**：两篇都在"薄片/细小特征"上失败（Drawing2CAD 的参数精度问题、Ortho2CAD 的 thin sheets 低 IoU），且都只支持 sketch+extrude 操作族；评价也都停留在几何相似度，未评估人类建模习惯对齐度。
- **工程图规范程度**：Ortho2CAD 的图纸有虚线隐藏线和包围盒尺寸（更接近真实图纸但仍非完整标注），Drawing2CAD 的 SVG 只有纯几何轮廓——若做调研综述，"图纸信息完备度"是一个值得单列的比较维度。

---

## 六、关键信息速查

| 项目 | 内容 |
|------|------|
| 任务 | 栅格三视图正交工程图 → CadQuery 代码 → STEP 模型 |
| 输入 | 三视图 PNG（第一角投影，虚线隐藏线+3 个包围盒尺寸）+ 固定 prompt |
| 模型 | Qwen3-VL-8B-Instruct（视觉塔冻结，训投影层+LLM） |
| SFT | DeepCAD+GenCAD-Code，5 epochs，lr=1e-5，CE 损失，4×H100 11h |
| RL | Fusion 360，Dr. GRPO+序列级，奖励=IoU（无效=0），G=8，lr=1e-6，2 epochs，4×H100 100h |
| 最优结果 | DeepCAD: 100% 有效, IoU 0.7922（+7.6% vs CAD-Coder）；Fusion360 RL: 100% 有效, IoU 0.5601（+8.1% vs GPT-5.2） |
| 数据 | >150k 正交工程图（DeepCAD + Fusion360），pythonOCC 生成管线开源 |
| 评估 | 100 样本测试子集；Valid Codes + IoU |
| 典型失败 | 薄片/细小复杂几何；代码可执行但未围成封闭体积 |
