---
layout: page
title: 知识图谱
permalink: /graph/
scripts:
  - /assets/js/graph.js
full_width: true
body_class: graph-view
---
<div class="graph-page">
  <div class="graph-head">
    <div>
      <h1 class="graph-title">知识图谱</h1>
      <p class="graph-desc">节点是研究关键词，默认收起。点击关键词展开它下面的文章，点击文章查看摘要，双击直接打开全文。</p>
    </div>
    <div class="graph-head-stats" id="graph-head-stats" aria-live="polite"></div>
  </div>

  <div class="graph-toolbar" role="toolbar" aria-label="图谱工具栏">
    <button type="button" class="tool-btn" id="g-zoom-in" title="放大" aria-label="放大">＋</button>
    <button type="button" class="tool-btn" id="g-zoom-out" title="缩小" aria-label="缩小">－</button>
    <button type="button" class="tool-btn" id="g-reset" title="重置视图（全部收起）" aria-label="重置视图">⟲</button>
    <button type="button" class="tool-btn" id="g-expand-all" title="展开全部关键词" aria-label="展开全部">⊞</button>
    <button type="button" class="tool-btn" id="g-collapse-all" title="收起全部关键词" aria-label="收起全部">⊟</button>
    <label class="graph-search" for="g-search-input">
      <input id="g-search-input" type="search" placeholder="搜索关键词或文章标题，自动展开命中…" aria-label="关键词搜索" autocomplete="off" spellcheck="false" />
    </label>
  </div>

  <div class="graph-body">
    <div class="graph-stage" id="graph-stage">
      <canvas id="graph-canvas" role="img" aria-label="研究关键词知识图谱" tabindex="0"></canvas>
      <div class="graph-stats" id="graph-stats" aria-live="polite"></div>
    </div>

    <div class="graph-side">
      <aside class="graph-panel" id="graph-panel" aria-label="节点详情">
        <div class="graph-panel-body" id="graph-panel-body"></div>
      </aside>

      <section class="graph-card" aria-labelledby="graph-legend-title">
        <h2 class="graph-card-title" id="graph-legend-title">研究关键词</h2>
        <div class="graph-legend" id="graph-legend"></div>
      </section>

      <details class="graph-card graph-help">
        <summary class="graph-card-title">操作说明</summary>
        <p class="graph-help-text">拖拽节点可手动整理布局；滚轮缩放（0.3–3×）；空白处拖拽平移；双击空白重置视图。点击关键词展开 / 收起其文章，点击文章查看详情，双击文章打开全文。也可以直接用 <code>/graph/?tag=关键词slug</code> 深链到某个主题。</p>
      </details>
    </div>
  </div>
</div>
