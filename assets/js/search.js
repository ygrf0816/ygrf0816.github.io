/**
 * 站内搜索（代理 C）
 * 数据源：/assets/data/site-index.json（CONTRACT §4.2，构建时 Liquid 生成）
 * 特性：自动聚焦 · 150ms 防抖 · 中英文分词评分 · 多词 AND · <mark> 高亮
 *       分类/类型/标签过滤 · 键盘导航 · ?q=&tag= 深链 · 空态热门标签
 * 纯 vanilla JS，无第三方依赖。
 */
(function () {
  'use strict';

  var INDEX_URL = '/assets/data/site-index.json';

  var state = {
    posts: [],
    tags: [],          // 顶层标签元数据（含 count/color/short）
    tagByName: {},     // 名称 → 标签元数据
    typeSet: {},       // 出现过 type → true
    catSet: {},        // 出现过 cat → true
    tagCount: {},      // 标签名 → 计数（兜底：顶层 count 缺失时实时统计）

    // 当前查询
    rawQuery: '',      // 输入框原始文本
    query: [],         // 归一化后的词数组（去空格/去重/排序）
    activeCat: null,   // 单选：分类
    activeType: null,  // 单选：类型
    activeTags: [],    // 多选：标签名数组

    // 渲染
    results: [],       // 当前排序后的 [{post, score}]
    activeIndex: -1,   // 键盘选中的结果下标
    loading: false
  };

  /* ---------------- 工具 ---------------- */

  function $(sel) { return document.querySelector(sel); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  /**
   * 中英文混合分词：
   * - 每个连续 CJK 串拆成「双字重叠滑窗」+ 完整串本身（VO₂ → VO/₂ 之外，
   *   如「薄膜工艺」→ 薄膜/膜工/工艺 + 薄膜工艺）；
   * - 西文按空白切，整词保留并小写化；
   * - 同一 token 去重、按字典序排序（AND 语义稳定、评分可缓存）。
   */
  function tokenize(input) {
    var text = String(input || '').toLowerCase();
    var tokens = {};

    // 西文/数字词（至少含 1 个字母或数字，长度 ≥ 1）
    var lat = text.match(/[a-z0-9][a-z0-9\u00b2\u00b3]*?/g) || [];
    lat.forEach(function (w) { if (w.length) tokens[w] = true; });

    // CJK 串
    var cjkRe = /[\u4e00-\u9fff\u3400-\u4dbf]+/g;
    var m;
    while ((m = cjkRe.exec(text)) !== null) {
      var s = m[0];
      tokens[s] = true;                    // 完整串
      if (s.length > 2) {
        for (var i = 0; i + 2 <= s.length; i++) tokens[s.slice(i, i + 2)] = true;
      }
    }

    return Object.keys(tokens).sort();
  }

  function normalizePost(p) {
    return {
      // 展示与匹配都用去掉 [论文阅读] 前缀的标题；原始标题仍保留在 raw.title（用于排序/SEO）
      title: stripPrefix(p.title || ''),
      kw: (p.keywords || []).join(' '),
      tags: (p.tags || []).join(' '),
      summary: p.summary || '',
      text: p.text || '',
      raw: p
    };
  }

  /* ---------------- 评分 ---------------- */

  // 权重：title > keywords > tags > summary > body
  var W_TITLE = 100, W_KW = 50, W_TAG = 30, W_SUM = 12, W_BODY = 4;

  function postHaystack(norm) {
    return {
      title: norm.title.toLowerCase(),
      kw: norm.kw.toLowerCase(),
      tags: norm.tags.toLowerCase(),
      summary: norm.summary.toLowerCase(),
      text: norm.text.toLowerCase()
    };
  }

  /**
   * 多词 AND 评分：每个词命中至少一个字段才保留；
   * 总分 = Σ 各词（title 命中? 100 : kw? 50 : tags? 30 : summary? 12 : text? 4），
   * 同词重复命中不同字段相加。
   */
  function scorePost(norm, queryTokens, hay) {
    if (!queryTokens.length) return 0;
    var total = 0;
    for (var i = 0; i < queryTokens.length; i++) {
      var tok = queryTokens[i];
      var pts = 0;
      if (hay.title.indexOf(tok) !== -1) pts += W_TITLE;
      if (hay.kw.indexOf(tok) !== -1) pts += W_KW;
      if (hay.tags.indexOf(tok) !== -1) pts += W_TAG;
      if (hay.summary.indexOf(tok) !== -1) pts += W_SUM;
      if (hay.text.indexOf(tok) !== -1) pts += W_BODY;
      if (pts === 0) return 0;             // 该词未命中 → AND 淘汰
      total += pts;
    }
    return total;
  }

  /**
   * 在 haystack 中定位 query 各词的首个命中位置（用于截取摘要窗口）
   */
  function hitWindow(hay, queryTokens, summary) {
    // 摘要窗口优先 summary，其次 text；返回 {text, start}
    var source = hay.summary.length >= 20 ? hay.summary : hay.text;
    var start = -1;
    for (var i = 0; i < queryTokens.length; i++) {
      var idx = source.indexOf(queryTokens[i]);
      if (idx !== -1 && (start === -1 || idx < start)) start = idx;
    }
    if (start === -1) start = 0;
    var winStart = Math.max(0, start - 40);
    var slice = source.slice(winStart, winStart + 180);
    return { text: slice, startOffset: winStart, wasTrimmedHead: start > 40 };
  }

  function highlightWindow(hay, queryTokens, summary, win) {
    // 在摘要窗口文本上做 <mark>（词级，大小写不敏感）
    var text = win.text;
    var html = escapeHtml(text);
    // 长词优先，避免短词先吃掉长词的一部分
    var sorted = queryTokens.slice().sort(function (a, b) { return b.length - a.length; });
    sorted.forEach(function (tok) {
      if (!tok) return;
      var re;
      try {
        re = new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      } catch (e) { return; }
      html = html.replace(re, function (m) {
        return '<mark>' + escapeHtml(m) + '</mark>';
      });
    });
    // 标题同样高亮
    var titleHtml = escapeHtml(hay.title);
    sorted.forEach(function (tok) {
      if (!tok) return;
      var re;
      try { re = new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); } catch (e) { return; }
      titleHtml = titleHtml.replace(re, function (m) { return '<mark>' + escapeHtml(m) + '</mark>'; });
    });
    return { titleHtml: titleHtml, bodyHtml: (win.wasTrimmedHead ? '… ' : '') + html + (win.text.length < 180 ? '' : ' …') };
  }

  /* ---------------- 索引加载 ---------------- */

  function loadIndex() {
    state.loading = true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', INDEX_URL, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        applyIndex(xhr.response);
      } else {
        showFatal('索引加载失败（' + xhr.status + '），请刷新重试。');
      }
      state.loading = false;
    };
    xhr.onerror = function () {
      state.loading = false;
      showFatal('索引加载失败，请刷新重试。');
    };
    xhr.send();
  }

  function applyIndex(data) {
    state.posts = (data.posts || []).map(normalizePost);

    // 顶层标签元数据 + 兜底计数
    state.tags = data.tags || [];
    state.tagCount = {};
    state.tagByName = {};
    state.tags.forEach(function (t) {
      state.tagByName[t.name] = t;
      state.tagCount[t.name] = 0;
    });
    state.posts.forEach(function (n) {
      (n.raw.tags || []).forEach(function (tn) {
        state.tagCount[tn] = (state.tagCount[tn] || 0) + 1;
      });
      if (n.raw.type) state.typeSet[n.raw.type] = true;
      if (n.raw.cat) state.catSet[n.raw.cat] = true;
    });

    buildFilters();
    buildHotTags();
    buildIdleState();

    // 深链：?q=&tag=
    var params = new URLSearchParams(location.search);
    var q = params.get('q');
    var tag = params.get('tag');
    if (tag) {
      // 深链 tag 值可能是标签名或 slug，都尝试匹配
      var match = state.tagByName[tag] ? tag : null;
      if (!match) {
        for (var k in state.tagByName) {
          if (state.tagByName[k].slug === tag) { match = k; break; }
        }
      }
      if (match) state.activeTags = [match];
    }
    if (q != null) {
      state.rawQuery = q;
      var inp = $('#search-input');
      if (inp) inp.value = q;
    }
    rerender(true);
    if (q != null && typeof window.__searchRun === 'function') window.__searchRun();
  }

  function showFatal(msg) {
    var meta = $('#search-meta');
    meta.hidden = false;
    meta.textContent = msg;
  }

  /* ---------------- 过滤区 ---------------- */

  function buildFilters() {
    buildFilterRow('cat', Object.keys(state.catSet).sort(), function (val) { return val; });
    buildFilterRow('type', Object.keys(state.typeSet).sort(), function (val) { return val; });
    buildTagChips();
  }

  function buildFilterRow(kind, values, labelFn) {
    var row = document.querySelector('.filter-row[data-filter="' + kind + '"]');
    if (!row) return;
    var box = row.querySelector('.filter-opts');
    box.innerHTML = '';

    // 每个可选值 + 「全部」
    var all = mkChip('全部', true, function () { clearKind(kind); rerender(); });
    all.classList.add('is-on');
    box.appendChild(all);

    values.forEach(function (v) {
      var chip = mkChip(labelFn(v), false, function () {
        singleSelect(kind, v);
        rerender();
      });
      chip.dataset.value = String(v);
      chip.classList.add('fchip');
      box.appendChild(chip);
    });
  }

  function buildTagChips() {
    var row = document.querySelector('.filter-row[data-filter="tag"]');
    if (!row) return;
    var box = row.querySelector('.filter-opts');
    box.innerHTML = '';

    var all = mkChip('全部', false, function () {
      state.activeTags = [];
      syncTagChips();
      rerender();
    });
    all.classList.add('is-on');
    all.dataset.value = '';
    box.appendChild(all);

    // 按计数降序展示
    var names = Object.keys(state.tagCount).sort(function (a, b) {
      return state.tagCount[b] - state.tagCount[a];
    });
    names.forEach(function (n) {
      var meta = state.tagByName[n];
      var chip = mkChip(n + ' ' + state.tagCount[n], false, function () {
        toggleTag(n);
        rerender();
      });
      chip.classList.add('fchip');
      chip.dataset.value = n;
      if (meta && meta.color) chip.style.setProperty('--tag-color', meta.color);
      box.appendChild(chip);
    });
  }

  function mkChip(label, isAll, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fchip';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function singleSelect(kind, value) {
    if (kind === 'cat') state.activeCat = value;
    if (kind === 'type') state.activeType = value;
    syncChips(kind);
  }

  function clearKind(kind) {
    if (kind === 'cat') state.activeCat = null;
    if (kind === 'type') state.activeType = null;
    if (kind === 'tag') state.activeTags = [];
    syncChips(kind);
  }

  function toggleTag(name) {
    var i = state.activeTags.indexOf(name);
    if (i === -1) state.activeTags.push(name);
    else state.activeTags.splice(i, 1);
    syncTagChips();
  }

  function syncChips(kind) {
    var row = document.querySelector('.filter-row[data-filter="' + kind + '"]');
    if (!row) return;
    row.querySelectorAll('.fchip').forEach(function (chip) {
      var v = chip.dataset.value;
      if (chip.textContent === '全部') {
        chip.classList.toggle('is-on', kind === 'tag' ? state.activeTags.length === 0 : v === '');
      } else if (kind === 'tag') {
        chip.classList.toggle('is-on', state.activeTags.indexOf(v) !== -1);
      } else {
        chip.classList.toggle('is-on', (kind === 'cat' ? state.activeCat : state.activeType) === v);
      }
    });
  }

  function syncTagChips() { syncChips('tag'); }

  /* ---------------- 未输入空态：最近文章 + 热门标签 + 示例词 ---------------- */

  function buildIdleState() {
    // 最近 6 篇
    var recent = $('#idle-recent');
    if (recent) {
      recent.innerHTML = '';
      var top6 = state.posts.slice(0, 6);
      top6.forEach(function (p) {
        var raw = p.raw;
        var el = document.createElement('a');
        el.href = raw.url || '/';
        el.className = 'idle-recent-item';
        var badge = raw.type ? '<span class="sr-badge">' + escapeHtml(raw.type) + '</span>' : '';
        el.innerHTML = badge +
          '<span class="ir-title">' + escapeHtml(stripPrefix(raw.title || '')) + '</span>' +
          '<time class="ir-date">' + escapeHtml(raw.date || '') + '</time>';
        recent.appendChild(el);
      });
    }
    // 热门标签（复用 buildHotTags 逻辑，但填到 idle-hot-tags）
    var hot = $('#idle-hot-tags');
    if (hot) {
      hot.innerHTML = '';
      var top = state.tags.slice().sort(function (a, b) {
        return (b.count || 0) - (a.count || 0);
      }).slice(0, 10);
      top.forEach(function (t) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hot-tag';
        if (t.color) b.style.setProperty('--tag-color', t.color);
        b.innerHTML = '<span class="ht-dot"></span>' + escapeHtml(t.name);
        b.addEventListener('click', function () {
          toggleTag(t.name);
          rerender();
          $('#search-input').focus();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        hot.appendChild(b);
      });
    }
    // 示例词点击 → 填入搜索框并触发搜索
    document.querySelectorAll('#idle-suggest .ss-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-q') || '';
        var input = $('#search-input');
        if (input) { input.value = q; state.rawQuery = q; }
        rerender(true);
        syncUrl();
        var input2 = $('#search-input');
        if (input2) input2.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* 展示层标题：剥掉开头的 [类型] 前缀（与 _includes/post-title.html 同规则） */
  function stripPrefix(title) {
    var s = String(title || '');
    if (s.indexOf('[') === 0 && s.indexOf(']') !== -1) {
      var i = s.lastIndexOf(']');
      s = s.slice(i + 1);
    }
    return s.trim();
  }

  /* 无结果时：给出与查询词相关的相近标签建议 */
  function suggestNearTags() {
    var box = $('#near-tags');
    if (!box) return;
    box.innerHTML = '';
    var qTokens = state.query.slice();
    // 命中标签名或关键词/摘要的标签，取最多 8 个
    var hits = {};
    state.posts.forEach(function (p) {
      var hay = postHaystack(p);
      var ok = qTokens.length === 0;
      if (!ok) {
        ok = qTokens.every(function (t) {
          return hay.title.indexOf(t) !== -1 || hay.kw.indexOf(t) !== -1 ||
                 hay.tags.indexOf(t) !== -1 || hay.summary.indexOf(t) !== -1;
        });
      }
      if (ok) {
        (p.raw.tags || []).forEach(function (tn) { hits[tn] = (hits[tn] || 0) + 1; });
      }
    });
    var names = Object.keys(hits).sort(function (a, b) { return hits[b] - hits[a]; }).slice(0, 8);
    // 兜底：没有命中就用热门标签
    if (!names.length) {
      names = state.tags.slice().sort(function (a, b) { return (b.count || 0) - (a.count || 0); })
        .map(function (t) { return t.name; }).slice(0, 6);
    }
    names.forEach(function (n) {
      var meta = state.tagByName[n];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hot-tag';
      if (meta && meta.color) b.style.setProperty('--tag-color', meta.color);
      b.innerHTML = '<span class="ht-dot"></span>' + escapeHtml(n);
      b.addEventListener('click', function () {
        // 清空查询，改为按该标签过滤
        var input = $('#search-input');
        if (input) input.value = '';
        state.rawQuery = '';
        state.activeTags = [n];
        syncTagChips();
        rerender(true);
        syncUrl();
      });
      box.appendChild(b);
    });
  }

  /* ---------------- 空态 / 热标签 ---------------- */

  function buildHotTags() {
    var box = $('#hot-tags');
    if (!box) return;
    var top = state.tags.slice().sort(function (a, b) {
      return (b.count || 0) - (a.count || 0);
    }).slice(0, 12);
    box.innerHTML = '';
    top.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hot-tag';
      if (t.color) b.style.setProperty('--tag-color', t.color);
      b.innerHTML = '<span class="ht-dot"></span>' + escapeHtml(t.name);
      b.addEventListener('click', function () {
        // 把该标签加入过滤并聚焦输入框
        toggleTag(t.name);
        rerender();
        $('#search-input').focus();
      });
      box.appendChild(b);
    });
  }

  /* ---------------- 渲染 ---------------- */

  function filteredRanked(applyQuery) {
    var out = [];
    var norm = state.query;
    for (var i = 0; i < state.posts.length; i++) {
      var p = state.posts[i];
      var raw = p.raw;

      // 过滤
      if (state.activeCat && raw.cat !== state.activeCat) continue;
      if (state.activeType && raw.type !== state.activeType) continue;
      if (state.activeTags.length) {
        var ok = state.activeTags.every(function (tn) { return (raw.tags || []).indexOf(tn) !== -1; });
        if (!ok) continue;
      }

      if (!applyQuery || !norm.length) {
        out.push({ post: p, score: 0 });
        continue;
      }

      var hay = postHaystack(p);
      var s = scorePost(p, norm, hay);
      if (s > 0) out.push({ post: p, score: s });
    }

    // 排序：score 降序 → ts 降序 → title
    out.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      var at = (a.post && a.post.raw && a.post.raw.ts) || 0;
      var bt = (b.post && b.post.raw && b.post.raw.ts) || 0;
      if (bt !== at) return bt - at;
      var ati = String((a.post && a.post.raw && a.post.raw.title) || '');
      var bti = String((b.post && b.post.raw && b.post.raw.title) || '');
      return ati.localeCompare(bti, 'zh-Hans-CN');
    });
    return out;
  }

  function rerender(fast) {
    var t0 = performance.now();
    state.query = tokenize(state.rawQuery);
    var list = filteredRanked(true);
    state.results = list;

    var resultsBox = $('#search-results');
    var metaBox = $('#search-meta');
    var emptyBox = $('#search-empty');
    var idleBox = $('#search-idle');
    var hasQuery = state.query.length > 0;
    var hasFilter = !!(state.activeCat || state.activeType || state.activeTags.length);

    // 未输入且无过滤 → 显示「开始浏览」空态（最近文章 + 热门标签 + 示例词）
    if (!hasQuery && !hasFilter) {
      if (resultsBox) resultsBox.innerHTML = '';
      if (metaBox) metaBox.hidden = true;
      if (emptyBox) emptyBox.hidden = true;
      if (idleBox) idleBox.hidden = false;
      state.activeIndex = -1;
      return;
    }
    if (idleBox) idleBox.hidden = true;

    if (hasQuery && list.length === 0) {
      resultsBox.innerHTML = '';
      emptyBox.hidden = false;
      metaBox.hidden = true;
      suggestNearTags();
      state.activeIndex = -1;
      return;
    }
    emptyBox.hidden = true;

    // 命中数量 + 耗时
    if (!fast && (hasQuery || hasFilter)) {
      metaBox.hidden = false;
      var ms = Math.round(performance.now() - t0);
      var parts = [];
      if (hasQuery) parts.push('「' + escapeHtml(state.rawQuery.trim()) + '」');
      metaBox.innerHTML =
        '共 <strong>' + list.length + '</strong> 条结果' +
        (hasQuery ? '' : '（仅按过滤条件）') +
        ' · 耗时 ' + ms + ' ms';
    } else if (fast) {
      metaBox.hidden = true;
    }

    // 渲染卡片（最多 50，性能保护）
    var frag = document.createDocumentFragment();
    var showN = Math.min(list.length, 50);
    for (var i = 0; i < showN; i++) {
      frag.appendChild(renderCard(list[i], i));
    }
    resultsBox.innerHTML = '';
    resultsBox.appendChild(frag);

    if (list.length > 50) {
      var more = document.createElement('p');
      more.className = 'search-more';
      more.style.cssText = 'font-size:13px;color:var(--ink-3);text-align:center;margin:8px 0;';
      more.textContent = '… 其余 ' + (list.length - 50) + ' 条已省略，请缩小关键词范围';
      resultsBox.appendChild(more);
    }

    // 键盘选中态
    if (state.activeIndex >= 0 && state.activeIndex < showN) {
      markActive(state.activeIndex);
    } else {
      state.activeIndex = -1;
    }
  }

  function renderCard(item, idx) {
    var p = item.post;
    var raw = p.raw;
    var wrap = document.createElement('article');
    wrap.className = 'card search-result';
    wrap.dataset.index = idx;

    var hay = postHaystack(p);
    var win = hitWindow(hay, state.query, p.summary);
    var hl = state.query.length
      ? highlightWindow(hay, state.query, p.summary, win)
      : { titleHtml: escapeHtml(hay.title), bodyHtml: escapeHtml(win.text) };

    var tagEls = (raw.tags || []).map(function (tn) {
      var meta = state.tagByName[tn];
      var style = meta && meta.color ? ' style="--tag-color:' + meta.color + '"' : '';
      return '<button type="button" class="sr-tag" data-tag="' + escapeHtml(tn) + '"' + style + '>'
        + escapeHtml(tn) + '</button>';
    }).join('');

    wrap.innerHTML =
      '<div class="sr-top">' +
        (raw.type ? '<span class="sr-badge">' + escapeHtml(raw.type) + '</span>' : '') +
        (raw.cat ? '<span class="sr-cat">' + escapeHtml(raw.cat) + '</span>' : '') +
        '<time class="sr-date">' + escapeHtml(raw.date || '') + '</time>' +
      '</div>' +
      '<h3 class="sr-title"><a href="' + escapeHtml(raw.url) + '">' + hl.titleHtml + '</a></h3>' +
      '<p class="sr-excerpt">' + (state.query.length ? hl.bodyHtml : escapeHtml((raw.summary || win.text).slice(0, 140))) + '</p>' +
      (tagEls ? '<div class="sr-tags">' + tagEls + '</div>' : '');

    // 标签 chip 点击 → 加入 tag 过滤
    wrap.querySelectorAll('.sr-tag').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var tn = b.dataset.tag;
        toggleTag(tn);
        rerender(true);
        resultsBox.scrollTop = 0;
      });
    });

    return wrap;
  }

  var resultsBox = null; // 占位
  function markActive(idx) {
    var box = $('#search-results');
    var cards = box.querySelectorAll('.search-result');
    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === idx); });
    if (idx >= 0 && cards[idx]) {
      var el = cards[idx];
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  /* ---------------- 事件 ---------------- */

  function wire() {
    var input = $('#search-input');
    var clearBtn = $('#search-clear');

    var runSearch = debounce(function (val) {
      state.rawQuery = val;
      state.activeIndex = -1;
      rerender(true);
      syncUrl();
    }, 150);

    input.addEventListener('input', function () {
      state.rawQuery = input.value;
      clearBtn.hidden = !input.value.length;
      runSearch(input.value);
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      state.rawQuery = '';
      clearBtn.hidden = true;
      rerender(true);
      syncUrl();
      input.focus();
    });

    // 键盘导航
    input.addEventListener('keydown', function (e) {
      var cards = $('#search-results').querySelectorAll('.search-result');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.activeIndex = Math.min(state.activeIndex + 1, cards.length - 1);
        markActive(state.activeIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.activeIndex = Math.max(state.activeIndex - 1, 0);
        markActive(state.activeIndex);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.activeIndex >= 0 && cards[state.activeIndex]) {
          var link = cards[state.activeIndex].querySelector('.sr-title a');
          if (link) window.location.href = link.getAttribute('href');
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        state.rawQuery = '';
        clearBtn.hidden = true;
        rerender(true);
        syncUrl();
      }
    });

    // 自动聚焦
    input.focus();
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.rawQuery.trim()) params.set('q', state.rawQuery.trim());
    if (state.activeTags.length) params.set('tag', state.activeTags.join(','));
    var qs = params.toString();
    var url = location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', url);
  }

  /* ---------------- 启动 ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    loadIndex();
    wire();
  });

})();
