---
layout: page
title: 站内搜索
permalink: /search/
scripts:
  - /assets/js/search.js
full_width: true
---
<div class="wrap-wide search-page">
  <section class="search-hero" aria-label="搜索">
    <label class="search-box" for="search-input">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      <input id="search-input" type="search" autocomplete="off" spellcheck="false"
             placeholder="输入关键词，空格分词，例如「VO₂ 镀膜 工艺」" aria-label="站内搜索框" />
      <button type="button" id="search-clear" class="search-clear" aria-label="清空搜索" hidden>×</button>
    </label>
    <p class="search-hint">按 <kbd>↑</kbd> <kbd>↓</kbd> 切换结果，<kbd>Enter</kbd> 打开，<kbd>Esc</kbd> 清空 · 支持 <code>?q=…</code> 与 <code>?tag=…</code> 深链</p>
  </section>

  <section class="search-filters" id="search-filters" aria-label="结果过滤">
    <div class="filter-row" data-filter="cat">
      <span class="filter-label">分类</span>
      <div class="filter-opts" role="radiogroup"></div>
    </div>
    <div class="filter-row" data-filter="type">
      <span class="filter-label">类型</span>
      <div class="filter-opts" role="radiogroup"></div>
    </div>
    <div class="filter-row" data-filter="tag">
      <span class="filter-label">标签</span>
      <div class="filter-opts" role="group"></div>
    </div>
  </section>

  <section class="search-meta" id="search-meta" aria-live="polite" hidden></section>

  <section class="search-results" id="search-results" aria-label="搜索结果"></section>

  {%- comment -%} 未输入时的空态：最近文章 + 热门标签 + 示例词（search.js 填充） {%- endcomment -%}
  <section class="search-idle" id="search-idle" aria-label="开始浏览">
    <section class="idle-block">
      <h2 class="idle-heading">最近文章</h2>
      <div class="idle-recent" id="idle-recent"></div>
    </section>
    <section class="idle-block">
      <h2 class="idle-heading">热门标签</h2>
      <div class="hot-tags" id="idle-hot-tags"></div>
    </section>
    <section class="idle-block">
      <h2 class="idle-heading">试试这些搜索</h2>
      <div class="search-suggest" id="idle-suggest">
        {%- for kw in site.data.taxonomy -%}{% endfor %}
        <button type="button" class="ss-chip" data-q="光学常数 反演">光学常数 反演</button>
        <button type="button" class="ss-chip" data-q="椭偏 Psi Delta">椭偏 Psi Delta</button>
        <button type="button" class="ss-chip" data-q="薄膜 工艺">薄膜 工艺</button>
        <button type="button" class="ss-chip" data-q="CAD 生成">CAD 生成</button>
        <button type="button" class="ss-chip" data-q="辐射制冷">辐射制冷</button>
        <button type="button" class="ss-chip" data-q="机器学习 椭偏">机器学习 椭偏</button>
      </div>
    </section>
  </section>

  <section class="search-empty" id="search-empty" hidden>
    <h2>没有匹配的结果</h2>
    <p>试试更短的关键词，或从相近的标签开始：</p>
    <div class="hot-tags" id="near-tags"></div>
    <div class="search-suggest" id="search-suggest">
      <span class="ss-label">示例搜索词</span>
      <button type="button" class="ss-chip" data-q="光学常数 反演">光学常数 反演</button>
      <button type="button" class="ss-chip" data-q="椭偏 测量">椭偏 测量</button>
      <button type="button" class="ss-chip" data-q="薄膜 色散">薄膜 色散</button>
    </div>
  </section>
</div>
