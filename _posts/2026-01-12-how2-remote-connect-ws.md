---
layout: post
title: "[技术] 如何利用ssh和xrdp插件与工作站进行远程连接"
date: 2026-01-12 21:11:00 +0800
categories: Learning
mathjax: true
---

这几天在帮同办公室的师弟解决工作站的远控问题，简单记录一下解决过程。

## 1.用SSH和ftp协议远控并传递数据
这个算是最简单最基础的方法了，只需要远端工作站上开启了ssh，端口22开启了并且防火墙没有屏蔽就可以使用。

使用的基础软件：
### Xshell 和 Xftp

![image-20260112203704873](\assets\posts_figs\2026-01-12-how2-remote-connect-ws\image-20260112203704873.png)

<center><p><font color='gray'>图1：Xshell设置方法，红圈内的名称随便填，主机号改为工作站当前的ip账号，协议和端口号改成一样的</font></p></center>

![image-20260112203845580](\assets\posts_figs\2026-01-12-how2-remote-connect-ws\image-20260112203845580.png)

<center><p><font color='gray'>图2：Xshell设置方法，把用户名和密码改成管理员给你分配的用户名和密码，即可登录</font></p></center>

![image-20260112203916335](\assets\posts_figs\2026-01-12-how2-remote-connect-ws\image-20260112203916335.png)

<center><p><font color='gray'>图3：xftp设置方法，设置内容同xshell</font></p></center>

## 2. VNC链接

配置ssh连接是很简单的，像这一套使用命令行方式来控制电脑是最基础的操作方法。但是安装某些特定软件，或者例如用COMSOL，VASP这种软件进行计算或者用一些渲染建模软件的时候，有图形界面会方便很多。

Ubuntu 22.02自带了VNC链接方法，VNC链接不需要设备连接外网，只需要两个设备都处于同一局域网环境下（比如都连接了校园网WiFi）即可链接，相对应的就是速度会很慢，只需在工作站“设置”-“分享”中打开远程桌面选项即可：

![img](\assets\posts_figs\2026-01-12-how2-remote-connect-ws\clip_image002.png)

然后勾选上如下选项，设置账号密码即可：

![image-20260112204509955](\assets\posts_figs\2026-01-12-how2-remote-connect-ws\image-20260112204509955.png)

上述流程做完了之后，还需要安装一些依赖库。这里介绍的方法都是在Ubuntu 24.04上设置的，在20，22版本的ubuntu上的设置方法类似。这里通过xrdp进行连接。

首先安装

```bash
sudo apt install xrdp
```

安装完毕后可以查看版本号来验证是否成功

```bash
xrdp --version
```

确认成功了，启动服务并开机自启动：

```bash
sudo systemctl enable xrdp
sudo systemctl start xrdp
```

我们的工作站是桌面版，自带gnome桌面环境，所以无需额外配置桌面环境。还有就是端口防火墙的设置，用如下命令添加允许规则

```bash
sudo ufw allow 3389/tcp
```

不过这个一般可以不用管，除非用户或者管理员额外设置防火墙了。设置完毕后就可以进行远程连接了，远程连接的软件有如下三种：

- **Windows**：使用内置的“远程桌面连接”（mstsc）
- **Mac**：安装 Microsoft Remote Desktop 应用
- **Linux**：可使用 remmina 或 rdesktop

这里演示使用Windows自带的远程桌面链接方法进行链接：

<img src="\assets\posts_figs\2026-01-12-how2-remote-connect-ws\clip_image002-1768221713424-4.png" alt="img" style="zoom:50%;" />

打开后在显示的窗口中输入服务器ip地址，点击连接：
 <img src="\assets\posts_figs\2026-01-12-how2-remote-connect-ws\clip_image004.png" alt="img" style="zoom:50%;" style="text-align: center;" />

显示如下登录窗口，输入在服务器上的账号密码，点击OK即可远程登陆（这个登录方式用的是linux的xrdp工具）:

<img src="\assets\posts_figs\2026-01-12-how2-remote-connect-ws\clip_image005.png" alt="img" style="zoom:50%;" />

------

按照如上方法设置完了，但很有可能会遇到登录时出来是黑屏的或者输入完密码登录后闪退的问题。

会导致这个问题出现的可能性有很多，比如搜索后会提示：

1. xorg不稳定，需要切换到 xfce 环境
2. 工作站没有注销
3. 还需要在配置文件中添加新的配置

......

但很容易忽视的一个点是，**远程连接的工作站上没有接显示器**。这种情况下工作站根本就不会有视频信号输出，导致远程连接闪退或者黑屏问题。

解决方法：1. 买一个显卡欺骗器插上去；2.配置一个虚拟桌面

如何配置一个虚拟桌面：

1. 安装 **xserver-xorg-video-dummy** 驱动
首先，安装虚拟显示器驱动：

```bash
sudo apt-get update

sudo apt-get install xserver-xorg-video-dummy
```

2. 配置 **xorg.conf** 文件
创建或编辑 /etc/X11/xorg.conf 文件，添加虚拟显示器的配置：

```bash
sudo nano /etc/X11/xorg.conf
```

​		然后在其中添加如下内容（可根据自己需求更改色彩深度，画面尺寸，同步刷新率）

```bash
Section "Device"

  Identifier "Configured Video Device"

  Driver   "dummy"

EndSection

Section "Monitor"

  Identifier "Configured Monitor"

  HorizSync  31.5-48.5

  VertRefresh 50-70

EndSection

Section "Screen"

  Identifier "Default Screen"

  Monitor   "Configured Monitor"

  Device   "Configured Video Device"

  DefaultDepth 24

  SubSection "Display"

     Depth 24

     Modes "1920x1080"

  EndSubSection

EndSection
```

3. 重启 X 服务
重启 X 服务以应用更改，然后重试即可：

```
sudo systemctl restart display-manager
```

------

还有一个别的方法那就是直接用向日葵/todesk/teamviewer/rustdesk....等等成熟的远控软件，但是这种软件都必须连接外网才能使用，对于校园网这种连接网络设备有上限的情景，不太适用，但胜在方法简单。