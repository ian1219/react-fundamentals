/* ==========================================================================
   Live React playground
   - Editor: a transparent <textarea> over a Prism-highlighted <pre>
   - Preview: a sandboxed iframe that loads React 18 + Babel and runs the code
   - Console: console.log / warn / error from the preview are shown below it
   ========================================================================== */
(function () {
  "use strict";

  const { store, escapeHtml, copyText } = window.RK;
  const LESSONS = window.RK_LESSONS;

  const CDN = {
    react: "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.development.js",
    reactDom: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.development.js",
    babel: "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.2/babel.min.js",
  };

  // Hooks are available without importing (imports from 'react' are removed before running)
  const PRELUDE =
    "const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, createContext, Fragment } = React;";

  const BLANK = `
import { useState } from 'react';

function App() {
  const [name, setName] = useState('World');

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}`;

  /* ---------- Templates ---------- */
  const templates = [{ id: "blank", label: "Blank starter", code: BLANK }].concat(
    LESSONS.filter((l) => l.playground).map((l, i) => ({
      id: l.id,
      label: "Lesson " + (LESSONS.indexOf(l) + 1) + ": " + l.title,
      code: l.playground,
    }))
  );

  const clean = (code) => code.replace(/^\n+|\s+$/g, "") + "\n";

  const els = {
    select: document.getElementById("templateSelect"),
    code: document.getElementById("code"),
    highlight: document.getElementById("highlight"),
    pre: document.querySelector(".editor pre"),
    iframe: document.getElementById("preview"),
    status: document.getElementById("status"),
    overlay: document.getElementById("errorOverlay"),
    consoleEl: document.getElementById("console"),
    consoleBody: document.getElementById("consoleBody"),
    run: document.getElementById("runBtn"),
    autoRun: document.getElementById("autoRun"),
    reset: document.getElementById("resetBtn"),
    share: document.getElementById("shareBtn"),
    back: document.getElementById("backLink"),
    clearConsole: document.getElementById("clearConsole"),
    toggleConsole: document.getElementById("toggleConsole"),
    toast: document.getElementById("toast"),
  };

  let currentTemplate = "blank";
  let runId = 0;
  let runTimer = null;
  let saveTimer = null;

  /* ---------- Small UI helpers ---------- */
  function setStatus(state, text) {
    els.status.classList.remove("is-error", "is-busy");
    if (state) els.status.classList.add("is-" + state);
    els.status.lastElementChild.textContent = text;
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => els.toast.classList.remove("is-visible"), 2000);
  }

  function showError(title, message) {
    els.overlay.innerHTML = "<strong>" + escapeHtml(title) + "</strong>" + escapeHtml(message);
    els.overlay.classList.add("is-visible");
    setStatus("error", "Error");
  }

  function hideError() {
    els.overlay.classList.remove("is-visible");
  }

  function clearConsole() {
    els.consoleBody.innerHTML = '<div class="console-empty">Use console.log() to print values here.</div>';
  }

  function logToConsole(type, text) {
    const empty = els.consoleBody.querySelector(".console-empty");
    if (empty) empty.remove();
    const line = document.createElement("div");
    line.className = "console-line " + type;
    line.textContent = text;
    els.consoleBody.appendChild(line);
    els.consoleBody.scrollTop = els.consoleBody.scrollHeight;
  }

  /* ---------- Editor ---------- */
  function paint() {
    // Trailing newline keeps the highlighted layer the same height as the textarea
    els.highlight.textContent = els.code.value + "\n";
    if (window.Prism) window.Prism.highlightElement(els.highlight);
    syncScroll();
  }

  function syncScroll() {
    els.pre.scrollTop = els.code.scrollTop;
    els.pre.scrollLeft = els.code.scrollLeft;
  }

  function insertText(text) {
    els.code.focus();
    // execCommand keeps the browser's undo history working; setRangeText is the fallback
    const ok = document.execCommand && document.execCommand("insertText", false, text);
    if (!ok) {
      const { selectionStart: s, selectionEnd: e } = els.code;
      els.code.setRangeText(text, s, e, "end");
      onEdit();
    }
  }

  function onEdit() {
    paint();
    hideError();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set("rk-pg:" + currentTemplate, els.code.value), 400);
    if (els.autoRun.checked) {
      clearTimeout(runTimer);
      runTimer = setTimeout(run, 700);
    }
  }

  els.code.addEventListener("input", onEdit);
  els.code.addEventListener("scroll", syncScroll);
  els.code.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      insertText("  ");
      return;
    }
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      // Keep the indentation of the current line (and indent after an opening bracket)
      const { value, selectionStart } = els.code;
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const line = value.slice(lineStart, selectionStart);
      let indent = (line.match(/^\s*/) || [""])[0];
      if (/[{([>]\s*$/.test(line) && !/<\/[^>]*>\s*$/.test(line) && !/\/>\s*$/.test(line)) indent += "  ";
      e.preventDefault();
      insertText("\n" + indent);
    }
  });

  /* ---------- Running code ---------- */
  function prepare(code) {
    // Blank out import lines (keeping the line so error line numbers stay correct)
    return code
      .replace(/^\s*import\s[^\n]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, "")
      .replace(/^\s*import\s+['"][^'"]+['"];?[ \t]*$/gm, "")
      .replace(/export\s+default\s+(function|class)\b/g, "$1")
      .replace(/^\s*export\s+default\s+[\w$]+;?[ \t]*$/gm, "")
      .replace(/^(\s*)export\s+(?=(const|let|var|function|class)\b)/gm, "$1");
  }

  function buildDoc(code, id) {
    const payload = JSON.stringify({ code: code, prelude: PRELUDE, id: id }).replace(/</g, "\\u003c");
    return (
      '<!doctype html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      "<style>" +
      "*,*::before,*::after{box-sizing:border-box}" +
      "body{margin:0;padding:20px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#16202c;line-height:1.55;background:#fff}" +
      "h1,h2,h3{line-height:1.2;margin:0 0 .5em}" +
      "button{font:inherit;font-size:14px;padding:7px 14px;border-radius:8px;border:1px solid #cfd7e2;background:#fff;color:#16202c;cursor:pointer;transition:border-color .15s,background .15s}" +
      "button:hover:not(:disabled){border-color:#087ea4;background:#f0fafd}" +
      "button:disabled{opacity:.5;cursor:default}" +
      "input:not([type=checkbox]):not([type=radio]),select,textarea{font:inherit;font-size:14px;padding:7px 10px;border:1px solid #cfd7e2;border-radius:8px;background:#fff;color:#16202c}" +
      "input:focus,select:focus,textarea:focus{outline:2px solid #087ea4;outline-offset:1px}" +
      "label{font-size:14px}" +
      "</style>" +
      '<script src="' + CDN.react + '"><\/script>' +
      '<script src="' + CDN.reactDom + '"><\/script>' +
      '<script src="' + CDN.babel + '"><\/script>' +
      '</head><body><div id="root"></div><script>' +
      "(function(){" +
      "var P=" + payload + ";" +
      "function send(type,text){parent.postMessage({source:'rk-preview',id:P.id,type:type,text:text},'*');}" +
      "function fmt(v){if(typeof v==='string')return v;if(v instanceof Error)return v.message;if(typeof v==='function')return 'ƒ '+(v.name||'anonymous')+'()';if(v===undefined)return 'undefined';try{return JSON.stringify(v,null,2)}catch(e){return String(v)}}" +
      "['log','info','warn','error'].forEach(function(m){var o=console[m];console[m]=function(){var a=[].slice.call(arguments);" +
      "var text=a.map(fmt).join(' ');" +
      // React's dev warnings use %s placeholders: fill them in so they read nicely
      "if(typeof a[0]==='string'&&a[0].indexOf('%s')>-1){var i=1;text=a[0].replace(/%s/g,function(){return fmt(a[i++])});}" +
      "if(text.indexOf('React DevTools')===-1&&text.indexOf('The above error occurred')===-1)send(m==='info'?'log':m,text);" +
      "o.apply(console,a)}});" +
      "window.addEventListener('error',function(e){send('runtime-error',e.message||'Unknown error')});" +
      "if(!window.React||!window.ReactDOM||!window.Babel){send('runtime-error','Could not load React from the CDN. Check your internet connection.');return;}" +
      "var compiled;" +
      "try{compiled=Babel.transform(P.prelude+P.code+'\\n;if(typeof App===\"undefined\"){throw new Error(\"Create a component called App — it is what the preview shows.\")}\\nReactDOM.createRoot(document.getElementById(\"root\")).render(React.createElement(App));',{presets:['react'],filename:'App.jsx'}).code;}" +
      "catch(err){send('compile-error',String(err.message).replace(/\\u001b\\[[0-9;]*m/g,''));return;}" +
      "try{new Function(compiled)();send('ready','')}catch(err){send('runtime-error',err.message)}" +
      "})();" +
      "<\/script></body></html>"
    );
  }

  function run() {
    clearTimeout(runTimer);
    runId += 1;
    hideError();
    clearConsole();
    setStatus("busy", "Running…");
    els.iframe.srcdoc = buildDoc(prepare(els.code.value), runId);
  }

  window.addEventListener("message", (e) => {
    const msg = e.data;
    if (!msg || msg.source !== "rk-preview" || msg.id !== runId) return;
    switch (msg.type) {
      case "ready":
        if (!els.overlay.classList.contains("is-visible")) setStatus(null, "Running");
        break;
      case "compile-error":
        showError("Syntax error", msg.text.replace(/^App\.jsx:\s*/, ""));
        logToConsole("error", msg.text);
        break;
      case "runtime-error":
        showError("Error", msg.text.replace(/^Uncaught\s+/, ""));
        break;
      default:
        logToConsole(msg.type, msg.text);
    }
  });

  /* ---------- Templates & state ---------- */
  function loadTemplate(id, opts) {
    const t = templates.find((x) => x.id === id) || templates[0];
    currentTemplate = t.id;
    els.select.value = t.id;
    const saved = opts && opts.fresh ? null : store.get("rk-pg:" + t.id);
    els.code.value = saved || clean(t.code);
    els.back.href = t.id === "blank" || t.id === "shared" ? "learn.html" : "learn.html#" + t.id;
    els.back.textContent = t.id === "blank" || t.id === "shared" ? "Lessons" : "Back to lesson";
    paint();
    run();
  }

  els.select.innerHTML = templates.map((t) => '<option value="' + t.id + '">' + escapeHtml(t.label) + "</option>").join("");

  els.select.addEventListener("change", () => {
    const id = els.select.value;
    history.replaceState(null, "", id === "blank" ? "playground.html" : "playground.html?lesson=" + encodeURIComponent(id));
    loadTemplate(id);
  });

  els.run.addEventListener("click", run);

  els.reset.addEventListener("click", () => {
    if (!confirm("Reset this example to its original code? Your changes will be lost.")) return;
    try {
      localStorage.removeItem("rk-pg:" + currentTemplate);
    } catch (e) {
      /* ignore */
    }
    loadTemplate(currentTemplate, { fresh: true });
    toast("Example reset");
  });

  els.share.addEventListener("click", async () => {
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(els.code.value))));
    const url = location.origin + location.pathname + "#code=" + encoded;
    const ok = await copyText(url);
    toast(ok ? "Link copied — share your code!" : "Could not copy the link");
  });

  els.clearConsole.addEventListener("click", clearConsole);
  els.toggleConsole.addEventListener("click", () => {
    const collapsed = els.consoleEl.classList.toggle("is-collapsed");
    els.toggleConsole.textContent = collapsed ? "Show" : "Hide";
    els.toggleConsole.setAttribute("aria-expanded", String(!collapsed));
  });

  /* ---------- Start ---------- */
  function init() {
    const hash = location.hash.match(/^#code=(.+)$/);
    if (hash) {
      try {
        const code = decodeURIComponent(escape(atob(decodeURIComponent(hash[1]))));
        templates.push({ id: "shared", label: "Shared code", code: code });
        els.select.insertAdjacentHTML("beforeend", '<option value="shared">Shared code</option>');
        loadTemplate("shared", { fresh: true });
        return;
      } catch (e) {
        toast("That share link looks broken");
      }
    }
    const lessonId = new URLSearchParams(location.search).get("lesson");
    loadTemplate(lessonId && templates.some((t) => t.id === lessonId) ? lessonId : "blank");
  }

  init();
})();
