---
layout: post
title: "LightTools 软件学习笔记"
date: 2024-07-16 17:43:33 +0800
categories: Learning
mathjax: true
---

# 用lighttools做一个简单的凹透镜聚光系统

## 初始设置

左下角如下图区域

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716174018971.png" alt="图片描述" style="zoom:100%;" />
</div>

1.常规首选项-系统：单位选择毫米，定义一个球面可选择曲率半径或普通半径模式

2.默认-材料：将光学材料选择为 塑料-PMMA

3.默认-接收器-光源：单位从辐射功率瓦特改为流明

4.默认-接收器：单位改为光通量，照度lux，亮度Nit



## 简单照明光学系统

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716174618698.png" style="zoom:100%;" />
</div>

IES 北美照明光学学会标准

Model 用户自定义

光学系统：对入射光进行处理的光学系统

如何在lighttools中定义光学系统？主要要定义光源，光学系统和接收器几个要素。主要菜单在右侧侧边栏处

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716175236164.png" alt="图片描述" style="zoom:100%;" />
</div>

如下图，在右边侧边栏中选择了一个球形光源，四点式定义法做了透镜，机械-三点法做了接受平面。单击选中平面，右击选择添加表面接收器!
<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716175530863.png" alt="图片描述" style="zoom:100%;" />
</div>
这样一个简单的光学系统就定义好了，在仿真运行之前，可以进行光学追迹的设定。

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716175637468.png" alt="图片描述" style="zoom:100%;" />
</div>

在弹出的窗口中可以设定追踪光线的数目，设定完后点击开始所有模拟，或者点击列表中的！感叹号也可启动
<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716175853621.png" alt="图片描述" style="zoom:100%;" />
</div>

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716175730372.png" alt="图片描述" style="zoom:100%;" />
</div>



## LT显示选项的操作

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716180006692.png" alt="图片描述" style="zoom:100%;" />
</div>

上述操作是对窗口本身大小进行调整。通常定义下光线是在y-z平面下，从左往右进行传播的，x轴方向垂直纸面向里（右手坐标系）

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716180253175.png" alt="图片描述" style="zoom:100%;" />
</div>

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716180355370.png" alt="图片描述" style="zoom:100%;" />
</div>



## 物体模型的坐标

对于一个建好的物体模型，其结构可以分成 主体-零件-面 三级

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716180711881.png" alt="图片描述" style="zoom:100%;" />
</div>

要修改物体整体所在位置，右击主体-属性，在弹出窗口中便可以对其坐标位置以及旋转角进行修改

要对物体长宽高定义，则是在零件-属性中进行修改，零件的坐标指的是构成主体的每个零件的坐标，一般不用定义



## 如何做平行光源

首先随便定义一个光源，这里我用的一个平面光源，定义好光源位置和光源接收器

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716184952888.png" alt="图片描述" style="zoom:100%;" />
</div>

直接跑的话就会是这个样子，光是杂散的。设置平行光首先右击光源-属性，测量于改为定位区域，角度分布改为均匀

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716185128164.png" alt="图片描述" style="zoom:100%;" />
</div>

然后定位球面-角度上下限都改为0度，这样的光就会是垂直于发光光源平面的

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716185218741.png" alt="图片描述" style="zoom:100%;" />
</div>

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716185346380.png" alt="图片描述" style="zoom:100%;" />
</div>

如果要让平行光进行旋转移动，比如我想让平行光源向z轴正方向旋转30度。那么z轴坐标要补正为$$tan30^{\circ}\cdot y$$，alpha角负的更多，等于-90°-30°

<div style="text-align: center;">
  <img src="/assets/posts_figs/2024-07-16-LightTools/image-20240716190138477.png" alt="图片描述" style="zoom:100%;" />
</div>