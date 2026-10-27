/**
 * 知识图谱（代理 D 重写）
 * 数据源：/assets/data/site-index.json
 * 结构：2 层节点 —— 16 个标签节点（taxonomy 全集，环形铺开）+ 文章节点（点击标签展开/收起）；
 *       边 = 标签-标签共享文章加权 + 标签→文章连边。
 * 渲染：自写 Canvas 2D 力导向（库仑斥力按半径加权 + 弹簧 + 向心 + 轻碰撞分离），
 *       devicePixelRatio 高清（canvas.width=cssW*dpr + setTransform），ResizeObserver 跟随容器；
 *       首屏先同步跑 250 次迭代收敛，再 fitView（8% padding 包围盒居中）后首绘，
 *       不允许让用户看到塌缩的一团；alpha 0.02→0 衰减，静止后停 rAF。
 * 交互：拖拽节点 / 滚轮以鼠标为中心缩放 0.3–3× / 空白拖拽平移 / 双击空白重置 /
 *       点击标签展开收起 / 点击文章选中显示面板 / 双击文章跳转 / hover 高亮邻居 /
 *       工具栏 5 按钮 / 搜索过滤并自动展开命中 / ?tag=slug 深链 / 画布 Tab 可聚焦 + 键盘。
 * 浮层：左上统计、左下图例（16 标签两列，点击高亮）、底部帮助条；右侧 320px 详情面板
 *       （未选中时显示引导语 + 已展开标签列表可点击收起；窄屏 <900px 变底部抽屉）。
 * 标签文字：13px --ink 色，strokeText(3px 背景色) 后 fillText；measureText + 已占用矩形
 *       贪心剔除重叠，优先级：标签节点 > 已展开文章；zoom<0.6 隐藏文章标签。
 * 加载失败：画布区显示可见错误提示 + 重试按钮，绝不白屏。
 * 纯 vanilla JS，无第三方依赖。
 */
(function () {
  'use strict';

  var INDEX_URL = '/assets/data/site-index.json';
  var $ = function (id) { return document.getElementById(id); };
  var debounce = function (fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; };

  /* ---------------- 调色 ---------------- */
  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n)) return { r: 58, g: 95, b: 205 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgba(hex, a) { var c = hexToRgb(hex); return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')'; }
  /** 标签文字描边色 = 画布背景色（从 CSS 变量实时取，亮暗色主题自动跟随） */
  function stageBg() {
    var stage = $('graph-stage');
    if (!stage) return '#ffffff';
    return getComputedStyle(stage).backgroundColor || '#ffffff';
  }

  /* ---------------- 状态 ---------------- */
  var G = {
    posts: [],
    tags: [],
    tagBySlug: {},
    tagByName: {},
    nodes: [],            // {id, kind:'tag'|'post', name, slug, label, color, count, x,y,vx,vy, r, post}
    nodeById: {},
    edges: [],            // {a,b, kind:'tag'|'post', w}
    neighbors: {},        // nodeId → {nodeId:true}

    expanded: {},         // 标签名 → true
    scale: 1, tx: 0, ty: 0,
    hover: null, selected: null, highlighted: null,
    searchQ: '',
    alpha: 0,
    running: false, rafId: 0,
    reducedMotion: false,
    canvas: null, ctx: null, dpr: 1,
    fitDone: false
  };

  /* ---------------- 加载与建模 ---------------- */
  function loadIndex() {
    fetch(INDEX_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(buildModel)
      .catch(function (err) { showGraphError(err && err.message ? err.message : '加载失败'); });
  }

  function showGraphError(msg) {
    var stage = $('graph-stage');
    if (!stage) return;
    var old = stage.querySelector('.graph-error');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'graph-error';
    el.setAttribute('role', 'alert');
    el.innerHTML = '<div class="ge-title">知识图谱数据加载失败</div>' +
      '<div>' + String(msg).replace(/</g, '&lt;') + '（' + INDEX_URL + '）</div>' +
      '<button type="button" id="graph-retry">重试</button>';
    stage.appendChild(el);
    $('graph-retry').addEventListener('click', function () { el.remove(); loadIndex(); });
  }

  function buildModel(data) {
    G.posts = data.posts || [];
    var taxonomy = data.tags || [];

    taxonomy.forEach(function (t) {
      G.tagBySlug[t.slug] = t;
      G.tagByName[t.name] = t;
    });
    G.tags = taxonomy;

    // 实际文章数（优先用 patch 过的 count，缺失时现算）
    var usedCount = {};
    G.posts.forEach(function (p) { (p.tags || []).forEach(function (tn) { usedCount[tn] = (usedCount[tn] || 0) + 1; }); });

    var colorOf = function (tn) { return (G.tagByName[tn] && G.tagByName[tn].color) || '#3a5fcd'; };

    // 标签节点（16 个，taxonomy 全集；0 文章也保留，弱化显示）
    G.nodes = taxonomy.map(function (t) {
      var count = usedCount[t.name] || t.count || 0;
      return {
        id: 'tag:' + t.slug, kind: 'tag', name: t.name, slug: t.slug,
        label: t.name, color: t.color || '#3a5fcd',
        count: count,
        r: 6 + Math.sqrt(count) * 2.0,
        x: 0, y: 0, vx: 0, vy: 0
      };
    });

    // 文章节点：半径 4.5，父标签 = 首个标签；色 = 父色（55% 透明度在绘制时应用）
    G.posts.forEach(function (p) {
      var t0 = (p.tags && p.tags[0]) || null;
      G.nodes.push({
        id: 'post:' + p.id, kind: 'post', post: p,
        name: t0, slug: t0 ? G.tagByName[t0] ? G.tagByName[t0].slug : '' : '',
        label: shortTitle(p.title, 16),
        color: colorOf(t0),
        r: 4.5,
        x: 0, y: 0, vx: 0, vy: 0
      });
    });

    G.nodeById = {};
    G.nodes.forEach(function (n) { G.nodeById[n.id] = n; G.neighbors[n.id] = {}; });

    // 边 1：标签→文章（该标签可见时绘制）
    G.posts.forEach(function (p) {
      var pn = G.nodeById['post:' + p.id];
      (p.tags || []).forEach(function (tn) {
        var tagNode = G.tagByName[tn] ? G.nodeById['tag:' + G.tagByName[tn].slug] : null;
        if (tagNode) addEdge(pn.id, tagNode.id, 'post', 1);
      });
    });

    // 边 2：标签-标签共享文章（权重 = 共享数）
    var postsOfTag = {};
    G.posts.forEach(function (p) {
      (p.tags || []).forEach(function (tn) { (postsOfTag[tn] = postsOfTag[tn] || []).push(p.id); });
    });
    var names = taxonomy.map(function (t) { return t.name; });
    for (var i = 0; i < names.length; i++) {
      for (var j = i + 1; j < names.length; j++) {
        var listA = postsOfTag[names[i]] || [], listB = postsOfTag[names[j]] || [];
        var bSet = {};
        listB.forEach(function (id) { bSet[id] = true; });
        var shared = 0;
        listA.forEach(function (id) { if (bSet[id]) shared++; });
        if (shared > 0) {
          addEdge('tag:' + G.tagByName[names[i]].slug, 'tag:' + G.tagByName[names[j]].slug, 'tag', shared);
        }
      }
    }

    seedLayout();
    applyDeepLinks();

    // 默认不展开任何标签：首屏只显示 16 个研究关键词节点，点击后才展开其下的文章

    buildLegend();
    updateStats();
    renderPanel(null);

    // 首屏：同步跑 250 次迭代收敛 → 归一化世界坐标 → fitView → 首绘
    preRun(250);
    normalizeWorld();
    fitView(false);
    render();
    G.fitDone = true;

    reheat(0.02, true); // 残余轻微收敛（alpha 0.02 → 0，静止后停 rAF）
  }

  function addEdge(a, b, kind, w) {
    var key = a < b ? a + '|' + b : b + '|' + a;
    var i;
    for (i = 0; i < G.edges.length; i++) {
      var ek = G.edges[i].a < G.edges[i].b ? G.edges[i].a + '|' + G.edges[i].b : G.edges[i].b + '|' + G.edges[i].a;
      if (ek === key) { G.edges[i].w = Math.max(G.edges[i].w, w); return; }
    }
    G.edges.push({ a: a, b: b, kind: kind, w: w });
    G.neighbors[a][b] = true;
    G.neighbors[b][a] = true;
  }

  function shortTitle(t, n) {
    t = String(t || '');
    t = t.replace(/^[【\[][^】\]]*[】\]]\s*/, '');
    // 「薄膜光学常数反演速览（18）：基于 CMA-ES…」这类系列前缀只留冒号后的主题
    var m = t.match(/^[^：:]{4,40}[：:]\s*(.+)$/);
    if (m && m[1] && m[1].length >= 4) t = m[1];
    return t.length > n ? t.slice(0, n) + '…' : t;
  }

  /* ---------------- 初始铺开 + 力模拟 ---------------- */

  function seedLayout() {
    var tags = G.nodes.filter(function (n) { return n.kind === 'tag'; });
    var R = 300;
    tags.forEach(function (n, i) {
      var ang = (i / tags.length) * Math.PI * 2 - Math.PI / 2;
      n.x = Math.cos(ang) * R + (Math.random() - 0.5) * 30;
      n.y = Math.sin(ang) * R + (Math.random() - 0.5) * 30;
    });
    G.nodes.filter(function (n) { return n.kind === 'post'; }).forEach(function (n) {
      var anchor = n.name && G.tagByName[n.name] ? G.nodeById['tag:' + G.tagByName[n.name].slug] : null;
      if (anchor) {
        var a = Math.random() * Math.PI * 2, d = 34 + Math.random() * 30;
        n.x = anchor.x + Math.cos(a) * d;
        n.y = anchor.y + Math.sin(a) * d;
      }
    });
  }

  /** 可见节点：16 个标签 + 任一所属标签已展开的文章 */
  function visibleNodes() {
    var out = [];
    for (var i = 0; i < G.nodes.length; i++) {
      var n = G.nodes[i];
      if (n.kind === 'tag') { out.push(n); continue; }
      var tags = n.post.tags || [];
      for (var k = 0; k < tags.length; k++) { if (G.expanded[tags[k]]) { out.push(n); break; } }
    }
    return out;
  }
  function visibleEdges() {
    var vs = {};
    visibleNodes().forEach(function (n) { vs[n.id] = true; });
    return G.edges.filter(function (e) { return vs[e.a] && vs[e.b]; });
  }

  /**
   * 单步力模拟：库仑斥力（∝ r_i*r_j，标签-标签加倍）+ 弹簧（标签-标签长 165、标签-文章 42）
   * + 向心力 + 轻碰撞分离（重叠时沿连线推离）。v 阻尼 0.86。
   */
  function step(a) {
    var nodes = visibleNodes(), edges = visibleEdges();
    var i, j, n, m, dx, dy, d2, d, f;

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j];
        dx = n.x - m.x; dy = n.y - m.y;
        d2 = dx * dx + dy * dy;
        if (d2 < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 0.25; }
        d = Math.sqrt(d2);
        f = 2600 * n.r * m.r / d2;
        if (n.kind === 'tag' && m.kind === 'tag') f *= 3.2;
        var fx = dx / d * f * a, fy = dy / d * f * a;
        n.vx += fx; n.vy += fy;
        m.vx -= fx; m.vy -= fy;
      }
    }

    for (i = 0; i < edges.length; i++) {
      var e = edges[i], A = G.nodeById[e.a], B = G.nodeById[e.b];
      if (!A || !B) continue;
      dx = B.x - A.x; dy = B.y - A.y;
      d = Math.sqrt(dx * dx + dy * dy) || 1;
      var rest = e.kind === 'tag' ? 165 : 42;
      var k = (e.kind === 'tag' ? 0.012 : 0.05) * (e.kind === 'tag' ? Math.min(e.w, 4) : 1);
      f = (d - rest) * k * a;
      var gx = dx / d * f, gy = dy / d * f;
      A.vx += gx; A.vy += gy; B.vx -= gx; B.vy -= gy;
    }

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.vx += (0 - n.x) * 0.0045 * a;   // 向心
      n.vy += (0 - n.y) * 0.0045 * a;
    }
    // 轻碰撞分离
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j];
        dx = n.x - m.x; dy = n.y - m.y;
        d = Math.sqrt(dx * dx + dy * dy);
        var minD = (n.r + m.r + 6);
        if (d > 0.001 && d < minD) {
          var push = (minD - d) / d * 0.5;
          var px = dx * push, py = dy * push;
          n.vx += px * 0.9; n.vy += py * 0.9;
          m.vx -= px * 0.9; m.vy -= py * 0.9;
        }
      }
    }

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.vx *= 0.86; n.vy *= 0.86;
      if (G.drag && G.drag.node === n) { n.vx = 0; n.vy = 0; continue; }
      n.x += n.vx; n.y += n.vy;
    }
  }

  /** 同步跑 n 步（首屏收敛用；n=0 时仅按当前 alpha 补几帧） */
  function preRun(n) {
    var a = 0.02;
    for (var k = 0; k < n; k++) {
      step(a);
      a = Math.max(0.004, a * 0.985);
    }
  }

  /** alpha 重置为 a0 并启动 rAF（a0=0 时仅静态渲染） */
  function reheat(a0, skip) {
    G.alpha = a0 || 0.3;
    if (skip) {
      // 静止终态模式：直接收敛
      var a = G.alpha;
      for (var k = 0; k < 60 && a > 0.004; k++) { step(a); a *= 0.985; G.alpha = a; }
      render();
      return;
    }
    if (!G.reducedMotion && !G.running) {
      G.running = true;
      G.rafId = requestAnimationFrame(tick);
    } else if (G.reducedMotion) {
      var a2 = G.alpha;
      for (var k2 = 0; k2 < 80 && a2 > 0.004; k2++) { step(a2); a2 *= 0.985; G.alpha = a2; }
      render();
    }
  }

  function tick() {
    step(G.alpha);
    G.alpha *= 0.985;
    render();
    if (G.alpha > 0.005) {
      G.rafId = requestAnimationFrame(tick);
    } else {
      G.running = false;
      G.alpha = 0;
      render(); // 静止终态
    }
  }

  /** 布局归一化：把可见节点的世界坐标压到最长边 ~760 的包围盒并居中，
   *  这样 fitView 得到的 scale 接近 1，节点半径/密度才是设计值。 */
  function normalizeWorld() {
    var nodes = visibleNodes();
    if (!nodes.length) return;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(function (n) {
      if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
    });
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
    var k = 760 / Math.max(bw, bh);
    if (!isFinite(k) || k <= 0) return;
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    nodes.forEach(function (n) { n.x = (n.x - cx) * k; n.y = (n.y - cy) * k; });
  }

  /* ---------------- fitView ---------------- */
  function fitView(animate) {
    var c = G.canvas, w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    var nodes = visibleNodes();
    if (!nodes.length) return;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(function (n) {
      minX = Math.min(minX, n.x - n.r); maxX = Math.max(maxX, n.x + n.r);
      minY = Math.min(minY, n.y - n.r - 6); maxY = Math.max(maxY, n.y + n.r + 14);
    });
    // 8% padding
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
    // 预留标签宽度（世界单位 ≈ 屏幕像素 / scale），避免长标签贴边被裁
    var pad = 150;
    var s = Math.min((w - pad * 2) / bw, (h - pad * 2) / bh);
    s = Math.max(0.2, Math.min(0.94, s));
    G.scale = s;
    G.tx = -s * (minX + maxX) / 2;
    G.ty = -s * (minY + maxY) / 2;
  }

  /* ---------------- 高清画布 ---------------- */
  function resizeCanvas() {
    var c = G.canvas, stage = $('graph-stage');
    if (!c || !stage) return;
    G.dpr = window.devicePixelRatio || 1;
    var w = stage.clientWidth, h = stage.clientHeight;
    if (w < 2 || h < 2) return;
    c.width = Math.round(w * G.dpr);
    c.height = Math.round(h * G.dpr);
    G.ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    render();
  }

  var roStarted = false;
  function startResizeObserver() {
    if (roStarted || !('ResizeObserver' in window)) return;
    roStarted = true;
    var stage = $('graph-stage');
    new ResizeObserver(function () {
      resizeCanvas();
      if (G.fitDone) fitView(false);
    }).observe(stage);
  }

  /* ---------------- 渲染 ---------------- */
  function screenOf(n) {
    var c = G.canvas, w = c.clientWidth, h = c.clientHeight;
    return { x: G.tx + n.x * G.scale + w / 2, y: G.ty + n.y * G.scale + h / 2 };
  }

  function render() {
    if (!G.ctx) return;
    var c = G.canvas, ctx = G.ctx, w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2 + G.tx, h / 2 + G.ty);
    ctx.scale(G.scale, G.scale);

    var bg = stageBg();
    var hov = G.hover || G.highlighted;
    var hovNbr = hov ? G.neighbors[hov.id] : {};
    var sel = G.selected;

    // 边
    var edges = visibleEdges();
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var A = G.nodeById[e.a], B = G.nodeById[e.b];
      if (!A || !B) continue;
      var active = hov && (e.a === hov.id || e.b === hov.id);
      var dimmed = hov && !active;
      var stroke;
      if (e.kind === 'tag') {
        // 标签间边：浅灰 alpha = 0.08 + 0.06*共享数（上限 0.28）
        var alpha = Math.min(0.28, 0.08 + 0.06 * e.w);
        stroke = active ? rgba(A.color, 0.65) : 'rgba(125,131,148,' + (dimmed ? alpha * 0.3 : alpha) + ')';
      } else {
        // 标签→文章边：父色 alpha 0.25
        var tagEnd = A.kind === 'tag' ? A : B;
        var palpha = active ? 0.55 : (dimmed ? 0.06 : 0.25);
        stroke = active ? rgba(tagEnd.color, palpha) : rgba(tagEnd.color, palpha);
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.min(2.4, 0.7 + (e.kind === 'tag' ? e.w * 0.22 : 0.3)) / Math.sqrt(G.scale || 1);
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      var cx = mx * 0.93, cy = my * 0.93;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(cx, cy, B.x, B.y);
      ctx.stroke();
    }

    // 节点
    var nodes = visibleNodes();
    nodes.forEach(function (n) {
      var dim = hov && n.id !== hov.id && !hovNbr[n.id];
      var isSel = sel && sel.id === n.id;
      var rad = n.kind === 'post' ? (n === G.hover ? 7 : 4.5) : n.r;
      if (dim) rad *= 0.92;

      // 柔和光晕
      if (!dim && (n === hov || isSel || (n.kind === 'tag' && G.expanded[n.name] && !hov))) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad + (n.kind === 'tag' ? 10 : 5), 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.color, n.kind === 'tag' ? 0.10 : 0.16);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      var fillA = dim ? 0.30 : (n.kind === 'tag' ? 0.95 : 0.55);
      ctx.fillStyle = rgba(n.color, fillA);
      ctx.fill();
      // 2px 背景色描边（标签）；选中加粗
      ctx.lineWidth = isSel ? 3 : 2;
      ctx.strokeStyle = bg;
      ctx.stroke();
      if (isSel) { ctx.lineWidth = 1.5; ctx.strokeStyle = n.color; ctx.stroke(); }
    });

    ctx.restore();

    // 标签文字（屏幕空间，保证 13px 恒定可读）+ 重叠剔除
    drawLabels(ctx, w, h, bg, hov, hovNbr);
  }

  /** 标签文字：strokeText(3px 背景色) 后 fillText；measureText + 已占用矩形贪心剔除（标签 > 已展开文章） */
  function drawLabels(ctx, w, h, bg, hov, hovNbr) {
    var font = '600 13px "Microsoft YaHei", "PingFang SC", system-ui, sans-serif';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    var used = [];
    var overlap = function (r) {
      for (var i = 0; i < used.length; i++) {
        var u = used[i];
        if (r.x < u.x + u.w && r.x + r.w > u.x && r.y < u.y + u.h && r.y + r.h > u.y) return true;
      }
      return false;
    };
    var place = function (n, fs, weight, ink) {
      var p = screenOf(n);
      ctx.font = weight + ' ' + fs + 'px "Microsoft YaHei", "PingFang SC", system-ui, sans-serif';
      var label = n.label;
      var tw = ctx.measureText(label).width;
      var rect = { x: p.x - tw / 2 - 3, y: p.y - 3, w: tw + 6, h: fs + 6 };
      // 出屏剔除
      if (rect.x + rect.w < 0 || rect.x > w || rect.y + rect.h < 0 || rect.y > h) return;
      if (overlap(rect)) return;
      used.push(rect);
      ctx.lineWidth = 3;
      ctx.strokeStyle = bg;
      ctx.strokeText(label, p.x, p.y + n.r * G.scale + 5);
      ctx.fillStyle = ink;
      ctx.fillText(label, p.x, p.y + n.r * G.scale + 5);
    };

    var ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1a1c22';

    // 1) 标签文字（高优先级）
    var nodes = visibleNodes();
    nodes.forEach(function (n) {
      if (n.kind !== 'tag') return;
      var dim = hov && n.id !== hov.id && !hovNbr[n.id];
      if (dim) return;
      place(n, 13, '600', ink);
    });
    // 2) 已展开文章文字（低优先级；zoom<0.6 隐藏）
    if (G.scale >= 0.34) {
      nodes.forEach(function (n) {
        if (n.kind !== 'post') return;
        var tags = n.post.tags || [];
        var vis = false;
        for (var i = 0; i < tags.length; i++) if (G.expanded[tags[i]]) { vis = true; break; }
        if (!vis) return;
        var dim2 = hov && n.id !== hov.id && !hovNbr[n.id];
        if (dim2) return;
        place(n, 11, '400', ink);
      });
    }
  }

  /* ---------------- 交互 ---------------- */
  function toScreen(wx, wy) {
    var c = G.canvas, w = c.clientWidth, h = c.clientHeight;
    return { x: G.tx + wx * G.scale + w / 2, y: G.ty + wy * G.scale + h / 2 };
  }
  function toWorld(sx, sy) {
    var c = G.canvas, w = c.clientWidth, h = c.clientHeight;
    return { x: (sx - w / 2 - G.tx) / G.scale, y: (sy - h / 2 - G.ty) / G.scale };
  }
  function pickNode(sx, sy) {
    var p = toWorld(sx, sy);
    var nodes = visibleNodes();
    var best = null, bestD = Infinity;
    for (var i = nodes.length - 1; i >= 0; i--) {
      var n = nodes[i];
      var dx = n.x - p.x, dy = n.y - p.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var hit = (n.kind === 'post' ? 7 : n.r) + 5 / G.scale;
      if (d < hit && d < bestD) { best = n; bestD = d; }
    }
    return best;
  }

  function wireCanvas() {
    var c = G.canvas;
    var ptr = null;

    c.addEventListener('pointerdown', function (e) {
      dismissHelp();
      if (G.drag) return;
      var n = pickNode(e.offsetX, e.offsetY);
      if (n) {
        var p = toWorld(e.offsetX, e.offsetY);
        G.drag = { node: n, ox: p.x - n.x, oy: p.y - n.y, sx: e.offsetX, sy: e.offsetY, moved: false };
        reheat(0.12);
      } else {
        G.drag = { pan: true, sx: e.offsetX, sy: e.offsetY, tx: G.tx, ty: G.ty, moved: false };
        c.classList.add('is-grabbing');
      }
      c.setPointerCapture(e.pointerId);
    });

    c.addEventListener('pointermove', function (e) {
      if (G.drag) {
        if (G.drag.node) {
          var p = toWorld(e.offsetX, e.offsetY);
          G.drag.node.x = p.x - G.drag.ox;
          G.drag.node.y = p.y - G.drag.oy;
          G.drag.node.vx = 0; G.drag.node.vy = 0;
          G.drag.moved = G.drag.moved || Math.abs(e.offsetX - G.drag.sx) + Math.abs(e.offsetY - G.drag.sy) > 4;
          if (G.reducedMotion) { reheat(0.02, true); }
          else if (!G.running) { reheat(0.06); } else { render(); }
        } else {
          G.tx = G.drag.tx + (e.offsetX - G.drag.sx);
          G.ty = G.drag.ty + (e.offsetY - G.drag.sy);
          G.drag.moved = G.drag.moved || Math.abs(e.offsetX - G.drag.sx) + Math.abs(e.offsetY - G.drag.sy) > 4;
          render();
        }
        return;
      }
      var n2 = pickNode(e.offsetX, e.offsetY);
      if (n2 !== G.hover) {
        G.hover = n2;
        c.classList.toggle('has-node', !!n2);
        render();
      }
    });

    c.addEventListener('pointerup', function (e) {
      if (!G.drag) return;
      var d = G.drag;
      G.drag = null;
      c.classList.remove('is-grabbing');
      if (d.node) {
        if (!d.moved) {
          if (d.node.kind === 'tag') toggleTag(d.node.name);
          else selectNode(d.node);
        }
        reheat(0.1);
      } else if (d.pan && !d.moved) {
        G.selected = null;
        renderPanel(null);
        render();
      }
    });

    c.addEventListener('pointerleave', function () {
      if (G.hover) { G.hover = null; c.classList.remove('has-node'); render(); }
    });

    // 双击：文章 → 跳转；标签/空白 → 重置（fitView）
    c.addEventListener('dblclick', function (e) {
      e.preventDefault();
      var n = pickNode(e.offsetX, e.offsetY);
      if (n && n.kind === 'post' && n.post) { window.location.href = n.post.url; return; }
      resetView();
    });

    // 滚轮以鼠标为中心缩放 0.3–3×
    c.addEventListener('wheel', function (e) {
      e.preventDefault();
      dismissHelp();
      var factor = Math.exp(-e.deltaY * 0.0015);
      var newScale = Math.max(0.3, Math.min(3, G.scale * factor));
      if (newScale === G.scale) return;
      var p = toWorld(e.offsetX, e.offsetY);
      G.tx = G.tx + (e.offsetX - G.canvas.clientWidth / 2) - p.x * newScale - ((e.offsetX - G.canvas.clientWidth / 2) - p.x * G.scale);
      G.ty = G.ty + (e.offsetY - G.canvas.clientHeight / 2) - p.y * newScale - ((e.offsetY - G.canvas.clientHeight / 2) - p.y * G.scale);
      G.scale = newScale;
      G.fitDone = false;
      render();
    }, { passive: false });

    // 键盘（Tab 可聚焦画布）
    c.addEventListener('keydown', function (e) {
      var PAN = 40;
      switch (e.key) {
        case 'ArrowLeft': G.tx += PAN; break;
        case 'ArrowRight': G.tx -= PAN; break;
        case 'ArrowUp': G.ty += PAN; break;
        case 'ArrowDown': G.ty -= PAN; break;
        case '+': case '=': zoomBy(1.25); return;
        case '-': zoomBy(1 / 1.25); return;
        case 'Enter':
          if (G.selected && G.selected.kind === 'post') { window.location.href = G.selected.post.url; return; }
          if (G.selected && G.selected.kind === 'tag') toggleTag(G.selected.name);
          else if (G.hover) selectNode(G.hover);
          return;
        case 'Escape':
          G.selected = null; G.hover = null; G.highlighted = null;
          renderPanel(null); render();
          return;
        default: return;
      }
      e.preventDefault();
      render();
    });
  }

  function zoomBy(f) {
    var w = G.canvas.clientWidth, h = G.canvas.clientHeight;
    var p = toWorld(w / 2, h / 2);
    var ns = Math.max(0.3, Math.min(3, G.scale * f));
    G.tx = -p.x * ns; G.ty = -p.y * ns;
    G.scale = ns;
    G.fitDone = false;
    render();
  }

  function toggleTag(name) {
    G.expanded[name] = !G.expanded[name];
    if (!G.expanded[name] && G.selected && G.selected.kind === 'post') {
      var stillVis = (G.selected.post.tags || []).some(function (t) { return G.expanded[t]; });
      if (!stillVis) { G.selected = null; renderPanel(null); }
    }
    reheat(0.25);
    updateStats();
    renderPanel(G.selected);
    var tagNode = G.nodeById['tag:' + (G.tagByName[name] ? G.tagByName[name].slug : '')];
    if (G.expanded[name] && tagNode) {
      setTimeout(function () { centerOnNode(tagNode, 1); }, 160);
    } else {
      setTimeout(function () { fitView(false); G.fitDone = true; }, 140);
    }
  }

  function selectNode(n) {
    G.selected = n;
    renderPanel(n);
    render();
  }

  function resetView() {
    G.selected = null;
    G.highlighted = null;
    renderPanel(null);
    fitView(false);
    G.fitDone = true;

    reheat(0.05);
    updateStats();
  }

  function expandAll() {
    G.nodes.forEach(function (n) { if (n.kind === 'tag' && n.count > 0) G.expanded[n.name] = true; });
    reheat(0.4);
    updateStats();
    renderPanel(G.selected);
    setTimeout(function () { fitView(false); G.fitDone = true; }, 60);
  }
  function collapseAll() {
    G.expanded = {};
    G.selected = null;
    renderPanel(null);
    reheat(0.3);
    updateStats();
    setTimeout(function () { fitView(false); G.fitDone = true; }, 40);
  }

  /* ---------------- 搜索（过滤并自动展开命中） ---------------- */
  function runSearch(q) {
    G.searchQ = q;
    if (!q) {
      // 清空：回到默认展开（top4）
      G.expanded = {};
      var withPosts = G.nodes.filter(function (n) { return n.kind === 'tag' && n.count > 0; })
        .sort(function (a, b) { return b.count - a.count; }).slice(0, 4);
      withPosts.forEach(function (n) { G.expanded[n.name] = true; });
      G.selected = null; renderPanel(null);
      reheat(0.3); updateStats();
      setTimeout(function () { fitView(false); G.fitDone = true; }, 40);
      return;
    }
    // 命中的文章：标题/关键词/标签名 任一包含 q（忽略大小写）
    var hitPosts = G.posts.filter(function (p) {
      var hay = (p.title + ' ' + (p.keywords || []).join(' ') + ' ' + (p.tags || []).join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    // 自动展开命中文章的标签
    hitPosts.forEach(function (p) { (p.tags || []).forEach(function (tn) { G.expanded[tn] = true; }); });
    if (hitPosts.length) {
      var first = G.nodeById['post:' + hitPosts[0].id];
      if (first) { G.selected = first; renderPanel(first); centerOnNode(first); }
      else { G.selected = null; renderPanel(null); }
    } else {
      G.selected = null; renderPanel(null);
    }
    reheat(0.3);
    updateStats();
  }

  function centerOnNode(n, scale) {
    var c = G.canvas, w = c.clientWidth, h = c.clientHeight;
    if (scale) G.scale = scale;
    G.tx = -n.x * G.scale;
    G.ty = -n.y * G.scale;
    G.fitDone = false;
    render();
  }

  /* ---------------- 深链 ?tag=slug ---------------- */
  function applyDeepLinks() {
    var params = new URLSearchParams(location.search);
    var tagSlug = params.get('tag');
    if (tagSlug) {
      var t = G.tagBySlug[tagSlug];
      var node = t ? G.nodeById['tag:' + t.slug] : null;
      if (node) {
        G.expanded[node.name] = true;
        G.selected = node;
        // 收敛后再居中（首屏 preRun 已跑，这里直接 fit 后定位）
        setTimeout(function () { centerOnNode(node, 0.95); }, 60);
      }
    }
    var q = params.get('q');
    var inp = $('g-search-input');
    if (q && inp) inp.value = q;
    else if (q) G.searchQ = q;
  }

  /* ---------------- 工具栏 ---------------- */
  function wireToolbar() {
    $('g-zoom-in').addEventListener('click', function () { zoomBy(1.25); });
    $('g-zoom-out').addEventListener('click', function () { zoomBy(1 / 1.25); });
    $('g-reset').addEventListener('click', function () {
      G.expanded = {};
      G.selected = null;
      G.fitDone = false;
      renderPanel(null);
      updateStats();
      reheat(0.02, true);
      fitView(false);
      render();
    });
    $('g-expand-all').addEventListener('click', expandAll);
    $('g-collapse-all').addEventListener('click', collapseAll);
    $('g-search-input').addEventListener('input', debounce(function () { runSearch(this.value.trim().toLowerCase()); }, 180));
    var helpClose = $('graph-help-close');
    if (helpClose) helpClose.addEventListener('click', dismissHelp);
  }

  function dismissHelp() {
    var help = $('graph-help');
    if (help && help.tagName !== 'DETAILS' && !help.hidden) help.hidden = true;
  }

  /* ---------------- 图例（16 标签，两列，点击高亮该节点） ---------------- */
  var legendHiTimer = 0;
  function buildLegend() {
    var box = $('graph-legend');
    if (!box) return;
    box.innerHTML = G.nodes.filter(function (n) { return n.kind === 'tag'; }).map(function (n) {
      return '<button type="button" class="gl-item" data-slug="' + n.slug + '" aria-label="高亮 ' + n.name + '">' +
        '<span class="gl-dot" style="background:' + n.color + '"></span>' + n.name +
        '<span class="gl-count">' + n.count + '</span></button>';
    }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('.gl-item'), function (b) {
      b.addEventListener('click', function () {
        var node = G.nodeById['tag:' + b.getAttribute('data-slug')];
        if (!node) return;
        G.highlighted = node;
        Array.prototype.forEach.call(box.querySelectorAll('.gl-item'), function (x) { x.classList.toggle('is-active', x === b); });
        render();
        clearTimeout(legendHiTimer);
        legendHiTimer = setTimeout(function () { G.highlighted = null; box.querySelectorAll('.gl-item').forEach(function (x) { x.classList.remove('is-active'); }); render(); }, 2600);
      });
    });
  }

  /* ---------------- 统计 ---------------- */
  function updateStats() {
    var s = $('graph-stats');
    if (!s) return;
    var vn = visibleNodes().length;
    var ve = visibleEdges().length;
    var exp = Object.keys(G.expanded).filter(function (k) { return G.expanded[k]; }).length;
    var total = G.nodes.filter(function (n) { return n.kind === 'tag' && n.count > 0; }).length;
    s.innerHTML = '<strong>' + vn + '</strong> 节点 · <strong>' + ve + '</strong> 边 · 已展开 <strong>' + exp + ' / ' + total + '</strong> 标签';
    var hs = $('graph-head-stats');
    if (hs) hs.innerHTML = '<strong>' + G.posts.length + '</strong> 篇文章 · <strong>' + total + '</strong> 个标签';
  }

  /* ---------------- 详情面板 ---------------- */
  function renderPanel(n) {
    var body = $('graph-panel-body');
    var panel = $('graph-panel');
    if (!body) return;
    var html = '';
    if (n && n.kind === 'tag') {
      var meta = G.tagByName[n.name] || {};
      html += '<div class="gp-kicker">标签</div>' +
        '<h2 class="gp-title" style="color:' + n.color + '">' + n.name + '</h2>' +
        '<div class="gp-meta"><span class="gm-item"><strong>' + n.count + '</strong> 篇</span>' +
        '<span class="gm-item">' + escapeHtml(meta.short || '') + '</span></div>';
      if (meta.desc) html += '<p class="gp-summary">' + escapeHtml(meta.desc) + '</p>';
      html += '<button type="button" class="gp-cta" id="gp-toggle">' + (G.expanded[n.name] ? '收起该标签' : '展开该标签') + '</button>';
      html += '<div class="gp-tags"><button type="button" class="gp-tag" id="gp-search">' + n.name + '（搜索）</button></div>';
    } else if (n && n.kind === 'post') {
      var p = n.post;
      html += '<div class="gp-kicker">' + escapeHtml(p.type || '文章') + '</div>' +
        '<h2 class="gp-title">' + escapeHtml(p.title || n.label) + '</h2>' +
        '<div class="gp-meta">' +
        (p.cat ? '<span class="gm-item"><strong>' + escapeHtml(p.cat) + '</strong></span>' : '') +
        '<span class="gm-item">' + escapeHtml(p.date || '') + '</span></div>';
      if (p.summary) html += '<p class="gp-summary">' + escapeHtml(p.summary) + '</p>';
      var tbs = (p.tags || []).map(function (tn) {
        var col = G.tagByName[tn] ? G.tagByName[tn].color : '#3a5fcd';
        return '<button type="button" class="gp-tag" data-tag="' + escapeHtml(tn) + '"><span class="gp-tag-dot" style="background:' + col + '"></span>' + escapeHtml(tn) + '</button>';
      }).join('');
      if (tbs) html += '<div class="gp-tags">' + tbs + '</div>';
      if ((p.keywords || []).length) html += '<p class="gp-keywords"><strong>关键词</strong>' + escapeHtml(p.keywords.join(' · ')) + '</p>';
      html += '<a class="gp-cta" href="' + escapeHtml(p.url || '') + '">阅读全文 →</a>';
    } else {
      // 引导态 + 已展开标签列表（可点击收起）
      var expList = G.nodes.filter(function (x) { return x.kind === 'tag' && G.expanded[x.name]; });
      html += '<div class="gp-empty">' +
        '<p>点击画布中的<b>标签</b>展开 / 收起其文章；点击<b>文章</b>查看详情，双击打开全文。</p>' +
        '<p>滚轮缩放，空白处拖拽平移，双击空白重置视图。</p>';
      if (expList.length) {
        html += '<div class="gp-expanded-label">已展开 ' + expList.length + ' 个标签</div>' +
          '<ul class="gp-expanded">';
        expList.sort(function (a, b) { return b.count - a.count; });
        expList.forEach(function (x) {
          html += '<li><span class="gp-tag-dot" style="background:' + x.color + '"></span>' + escapeHtml(x.name) +
            ' <span style="color:var(--ink-3);font-size:11px">' + x.count + ' 篇</span>' +
            '<button type="button" data-tag="' + escapeHtml(x.name) + '" aria-label="收起 ' + escapeHtml(x.name) + '">收起</button></li>';
        });
        html += '</ul>';
      } else {
        html += '<p class="gp-none">当前没有展开任何标签。</p>';
      }
      html += '</div>';
    }
    body.innerHTML = html;

    var tgl = $('gp-toggle');
    if (tgl) tgl.addEventListener('click', function () { toggleTag(n.name); renderPanel(n); });
    var st = $('gp-search');
    if (st) st.addEventListener('click', function () {
      var inp = $('g-search-input');
      inp.value = n.name;
      inp.dispatchEvent(new Event('input'));
    });
    var all = body.querySelectorAll('.gp-tag[data-tag]');
    Array.prototype.forEach.call(all, function (b) {
      b.addEventListener('click', function () {
        var tn = b.getAttribute('data-tag');
        if (G.tagByName[tn]) selectNode(G.nodeById['tag:' + G.tagByName[tn].slug]);
      });
    });
    // 引导态里的「收起」按钮
    Array.prototype.forEach.call(body.querySelectorAll('.gp-expanded li button'), function (b) {
      b.addEventListener('click', function () {
        var tn = b.getAttribute('data-tag');
        if (G.expanded[tn]) toggleTag(tn);
        renderPanel(G.selected);
      });
    });
    panel.hidden = false; // 面板常显（引导态也占位），保证布局稳定
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    G.canvas = $('graph-canvas');
    if (!G.canvas) return;
    G.ctx = G.canvas.getContext('2d');
    G.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startResizeObserver();
    resizeCanvas();
    wireCanvas();
    wireToolbar();
    renderPanel(null);
    loadIndex();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
