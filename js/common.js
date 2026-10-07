/* ==========================================================================
   Shared helpers used on every page:
   theme toggle, mobile menu, progress storage, code blocks, copy buttons
   ========================================================================== */
(function () {
  "use strict";

  const THEME_KEY = "rk-theme";
  const PROGRESS_KEY = "rk-progress";

  /* ---------- Safe storage (works in private mode / blocked storage) ---------- */
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        /* ignore */
      }
    },
  };

  /* ---------- Theme ---------- */
  function currentTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    store.set(THEME_KEY, theme);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  /* ---------- Progress (which lessons are complete) ---------- */
  function getDone() {
    try {
      const raw = JSON.parse(store.get(PROGRESS_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch (e) {
      return new Set();
    }
  }

  function setDone(id, done) {
    const set = getDone();
    if (done) set.add(id);
    else set.delete(id);
    store.set(PROGRESS_KEY, JSON.stringify([...set]));
    return set;
  }

  /* ---------- Text helpers ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Tiny inline formatter: `code` and **bold** (input is escaped first, so it's safe)
  function inline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[`*]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /* ---------- Icons (inline SVG strings) ---------- */
  const icon = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  };

  const LANG_LABEL = { jsx: "JSX", js: "JavaScript", javascript: "JavaScript", css: "CSS", html: "HTML", bash: "Terminal", json: "JSON" };

  /* ---------- Code blocks ---------- */
  function codeBlock(code, lang, filename) {
    const prismLang = lang === "html" ? "markup" : lang === "js" ? "javascript" : lang;
    const label = filename || LANG_LABEL[lang] || lang;
    return (
      '<div class="code-block">' +
      '<div class="code-head"><span class="file">' + icon.file + escapeHtml(label) + "</span>" +
      '<button type="button" class="copy-btn" data-copy>' + icon.copy + "<span>Copy</span></button></div>" +
      '<pre><code class="language-' + prismLang + '">' + escapeHtml(code.replace(/^\n+|\s+$/g, "")) + "</code></pre>" +
      "</div>"
    );
  }

  function highlight(scope) {
    if (window.Prism && typeof window.Prism.highlightAllUnder === "function") {
      window.Prism.highlightAllUnder(scope || document);
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  // One delegated listener handles every copy button on the page
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const code = btn.closest(".code-block").querySelector("pre code");
    const ok = await copyText(code.textContent);
    const label = btn.querySelector("span");
    btn.classList.toggle("is-copied", ok);
    label.textContent = ok ? "Copied!" : "Press Ctrl+C";
    setTimeout(() => {
      btn.classList.remove("is-copied");
      label.textContent = "Copy";
    }, 1600);
  });

  /* ---------- Header: theme toggle + mobile menu ---------- */
  function initHeader() {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme");
      btn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
    });

    const menuBtn = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }

  // Public API for the page scripts
  window.RK = { store, getDone, setDone, escapeHtml, inline, slugify, icon, codeBlock, highlight, copyText };
})();
