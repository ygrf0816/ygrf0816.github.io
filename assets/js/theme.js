/**
 * theme.js — 自包含主题脚本（代理 A）
 * 功能：暗色模式切换 / 移动端导航 / 阅读进度条 / 文章目录（TOC）/ 图片懒加载 + 灯箱
 * 不依赖任何 CDN；GitHub Pages 白名单环境可用。
 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 1. 主题切换（localStorage 持久化，默认跟随系统） ---------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  function currentTheme() {
    var t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(currentTheme());

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // 跟随系统（当用户未手动指定时）
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemChange(e) {
      var stored = null;
      try { stored = localStorage.getItem("theme"); } catch (err) {}
      if (stored !== "light" && stored !== "dark") applyTheme(e.matches ? "dark" : "light");
    }
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  /* ---------- 2. 移动端导航（纯 class 切换） ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    // 点击导航项后自动收起（窄屏）
    siteNav.addEventListener("click", function (ev) {
      if (ev.target && ev.target.tagName === "A" && window.matchMedia("(max-width: 1024px)").matches) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. 阅读进度条 ---------- */
  var progress = document.querySelector(".reading-progress");
  function setProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var scrollTop = window.pageYOffset || h.scrollTop || 0;
    var height = h.scrollHeight - h.clientHeight;
    var ratio = height > 0 ? scrollTop / height : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    progress.style.width = (ratio * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", setProgress, { passive: true });
  window.addEventListener("resize", setProgress, { passive: true });
  setProgress();

  /* ---------- 4. 文章目录（TOC）：扫描 h2/h3，自动加 id，嵌套，滚动高亮 ---------- */
  function slugify(text, index, used) {
    // 中文 slug 去重：非 ASCII 字符退化为编号
    var base = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!base) base = "sec";
    // 去掉中文，保留纯数字/字母前缀作为可读性；同时用编号兜底
    var ascii = base.replace(/[\u4e00-\u9fa5]/g, "");
    var id = ascii || ("sec-" + index);
    // 去重
    var candidate = id;
    var n = 1;
    while (used[candidate]) {
      candidate = id + "-" + n;
      n++;
    }
    used[candidate] = true;
    return candidate;
  }

  function buildTOC() {
    var contentEl = document.querySelector(".post-content");
    var tocRoot = document.querySelector("[data-toc-root]");
    if (!contentEl || !tocRoot) return;

    var headings = contentEl.querySelectorAll("h2, h3");
    if (headings.length === 0) {
      tocRoot.innerHTML = '<li class="toc-loading">本文暂无章节</li>';
      return;
    }

    var used = {};
    var items = [];
    headings.forEach(function (h, i) {
      var id = h.id || slugify(h.textContent.trim(), i, used);
      if (!h.id) h.id = id;
      items.push({
        id: id,
        level: h.tagName.toLowerCase() === "h3" ? 3 : 2,
        text: h.textContent.trim()
      });
    });

    // 渲染嵌套列表（h2 -> ol, h3 -> 子 ol）
    var html = '<ol class="toc-list">';
    var lastLevel = 0;
    items.forEach(function (it) {
      if (it.level === 2) {
        if (lastLevel === 3) html += "</ol>";
        lastLevel = 2;
        html += '<li class="toc-l2"><a href="#' + it.id + '">' + escapeHtml(it.text) + "</a>";
      } else {
        if (lastLevel === 2) html += "<ol>";
        lastLevel = 3;
        html += '<li class="toc-l3"><a href="#' + it.id + '">' + escapeHtml(it.text) + "</a></li>";
      }
    });
    if (lastLevel === 3) html += "</ol></li>";
    else html += "</li>";
    html += "</ol>";
    tocRoot.outerHTML = html;

    var links = document.querySelectorAll("[data-toc-root] a, .toc-list a");
    var linkMap = {};
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace(/^#/, "");
      linkMap[id] = a;
    });
    var ids = items.map(function (i) { return i.id; });

    var current = null;
    function highlight() {
      var pos = window.pageYOffset + 90; // 标题下边距
      var active = null;
      for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top + window.pageYOffset - 80 <= pos) {
          active = ids[i];
        }
      }
      if (active !== current) {
        if (current && linkMap[current]) linkMap[current].classList.remove("is-current");
        if (active && linkMap[active]) {
          linkMap[active].classList.add("is-current");
          current = active;
        }
      }
    }
    window.addEventListener("scroll", highlight, { passive: true });
    highlight();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- 5. 图片懒加载 + 灯箱 ---------- */
  function setupImages() {
    var imgs = document.querySelectorAll(".post-content img");
    imgs.forEach(function (img) {
      if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
      // 灯箱
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        openLightbox(img);
      });
    });
  }

  var lightbox = null;
  function openLightbox(img) {
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "图片预览");
      lightbox.innerHTML =
        '<button class="lightbox-close" aria-label="关闭">×</button>' +
        '<img alt="" />' +
        '<span class="lightbox-caption"></span>';
      document.body.appendChild(lightbox);
      lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
      });
    }
    var big = lightbox.querySelector("img");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || "";
    var cap = lightbox.querySelector(".lightbox-caption");
    cap.textContent = img.alt || "";
    cap.style.display = img.alt ? "" : "none";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------- 5b. 正文外链：target=_blank rel=noopener ---------- */
  function setupExternalLinks() {
    var content = document.querySelector(".post-content");
    if (!content) return;
    var host = location.hostname || "localhost";
    content.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var abs;
      try { abs = new URL(href, location.href); } catch (e) { return; }
      var isExternal = abs.protocol === "http:" || abs.protocol === "https:";
      if (!isExternal) return;
      var sameHost = abs.hostname === host;
      if (!sameHost) {
        a.setAttribute("target", "_blank");
        var rel = a.getAttribute("rel") || "";
        if (rel.indexOf("noopener") === -1) a.setAttribute("rel", (rel + " noopener").trim());
      }
    });
  }

  /* ---------- 5c. 代码块右上角「复制」按钮（clipboard API，失败静默） ---------- */
  function setupCodeCopy() {
    var pres = document.querySelectorAll(".post-content pre, pre:not(.pre-code-wrap > pre)");
    pres.forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains("pre-code-wrap")) return;
      // 包一层 relative 容器
      var wrap = document.createElement("div");
      wrap.className = "pre-code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "复制代码");
      btn.textContent = "复制";
      pre.appendChild(btn);

      btn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        var text = (code ? code.textContent : pre.textContent).replace(/\n$/, "");
        var done = function (ok) {
          btn.textContent = ok ? "已复制" : "复制";
          if (ok) {
            btn.classList.add("is-copied");
            setTimeout(function () {
              btn.classList.remove("is-copied");
              btn.textContent = "复制";
            }, 1500);
          }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          // 兜底：execCommand（失败静默）
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand("copy");
            document.body.removeChild(ta);
            done(ok);
          } catch (e) { done(false); }
        }
      });
    });
  }

  /* ---------- 5d. 回到顶部按钮（代理 G1）：滚动 > 600px 淡入，点击平滑滚回顶部 ---------- */
  function setupBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    var THRESHOLD = 600;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > THRESHOLD) {
        btn.removeAttribute("hidden");
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
        // 淡出完成后移除 hidden，保证键盘/AT 不聚焦不可见按钮；
        // 这里等 transitionend 或直接延迟移除，避免闪烁
        setTimeout(function () {
          if (!(window.scrollY > THRESHOLD)) btn.setAttribute("hidden", "");
        }, 220);
      }
    }

    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        update();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    update();
  }

  /* ---------- 启动 ---------- */
  function init() {
    buildTOC();
    setupImages();
    setupExternalLinks();
    setupCodeCopy();
    setupBackToTop();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
