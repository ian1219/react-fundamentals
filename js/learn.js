/* ==========================================================================
   Lesson viewer: sidebar, lesson rendering, quizzes, progress, prev/next
   URL format: learn.html#lesson-id
   ========================================================================== */
(function () {
  "use strict";

  const { inline, escapeHtml, slugify, codeBlock, highlight, getDone, setDone, icon } = window.RK;
  const LESSONS = window.RK_LESSONS;
  const MODULES = window.RK_MODULES;

  const els = {
    nav: document.getElementById("lessonNav"),
    lesson: document.getElementById("lesson"),
    search: document.getElementById("searchInput"),
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    sidebar: document.getElementById("sidebar"),
    sidebarToggle: document.getElementById("sidebarToggle"),
    backdrop: document.getElementById("sidebarBackdrop"),
  };

  const ICONS = {
    analogy: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    tip: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.7 1.5 7L12 17.5 5.7 21l1.5-7L2 9.3l7-.8z"/></svg>',
    warn: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    note: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V4M4 4h13l-2 4 2 4H4"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
  };

  const CALLOUT_TITLE = { analogy: "Think of it like this", tip: "Pro tip", warn: "Watch out", note: "Good to know" };

  /* ---------- Block renderers ---------- */
  function renderTree(text) {
    // Highlight "folder/" names and "← notes" for readability
    return escapeHtml(text.replace(/^\n+|\s+$/g, ""))
      .split("\n")
      .map((line) =>
        line
          .replace(/(←.*)$/, '<span class="note">$1</span>')
          .replace(/([\w.-]+\/)(?=\s|$)/, '<span class="dir">$1</span>')
      )
      .join("\n");
  }

  function renderCompareSide(side) {
    const toneIcon = side.tone === "bad" ? icon.x : side.tone === "good" ? icon.check : icon.eye;
    const block = codeBlock(side.code, side.lang || "jsx", side.label);
    // Swap the filename label for a coloured verdict label
    return block.replace(
      /<span class="file">[\s\S]*?<\/span>/,
      '<span class="compare-label ' + side.tone + '">' + toneIcon + escapeHtml(side.label) + "</span>"
    );
  }

  function renderBlock(block) {
    const [type, a, b, c] = block;
    switch (type) {
      case "h":
        return '<h2 id="' + slugify(a) + '">' + inline(a) + "</h2>";
      case "p":
        return "<p>" + inline(a) + "</p>";
      case "list":
        return "<ul>" + a.map((i) => "<li>" + inline(i) + "</li>").join("") + "</ul>";
      case "steps":
        return '<ol class="steps">' + a.map((i) => "<li>" + inline(i) + "</li>").join("") + "</ol>";
      case "code":
        return codeBlock(b, a, c);
      case "compare":
        return '<div class="compare">' + renderCompareSide(a.left) + renderCompareSide(a.right) + "</div>";
      case "tree":
        return '<pre class="tree" aria-label="Folder structure">' + renderTree(a) + "</pre>";
      case "table":
        return (
          '<div class="table-wrap"><table><thead><tr>' +
          a.map((h) => "<th>" + inline(h) + "</th>").join("") +
          "</tr></thead><tbody>" +
          b.map((row) => "<tr>" + row.map((cell) => "<td>" + inline(cell) + "</td>").join("") + "</tr>").join("") +
          "</tbody></table></div>"
        );
      case "analogy":
      case "tip":
      case "warn":
      case "note":
        return (
          '<aside class="callout callout-' + type + '">' + ICONS[type] +
          '<div class="callout-body"><span class="callout-title">' + CALLOUT_TITLE[type] + "</span><p>" + inline(a) + "</p></div></aside>"
        );
      default:
        return "";
    }
  }

  function renderQuiz(lesson) {
    if (!lesson.quiz || !lesson.quiz.length) return "";
    const questions = lesson.quiz
      .map((item, qi) => {
        const options = item.options
          .map(
            (opt, oi) =>
              '<button type="button" class="option" data-q="' + qi + '" data-o="' + oi + '">' +
              '<span class="letter">' + String.fromCharCode(65 + oi) + "</span><span>" + inline(opt) + "</span></button>"
          )
          .join("");
        return (
          '<div class="question" data-question="' + qi + '">' +
          '<p class="question-title"><span>Q' + (qi + 1) + ".</span>" + inline(item.q) + "</p>" +
          '<div class="options" role="group" aria-label="Answer options">' + options + "</div>" +
          '<div class="explain" aria-live="polite"></div></div>'
        );
      })
      .join("");

    return (
      '<section class="quiz" aria-labelledby="quiz-title">' +
      '<h2 id="quiz-title">' + ICONS.quiz + "Quick check</h2>" +
      '<p class="quiz-intro">Test yourself — pick an answer to see if you got it.</p>' +
      questions +
      '<p class="quiz-score" aria-live="polite"></p></section>'
    );
  }

  /* ---------- Lesson page ---------- */
  function renderLesson(lesson) {
    const index = LESSONS.indexOf(lesson);
    const module = MODULES.find((m) => m.id === lesson.module);
    const moduleNo = MODULES.indexOf(module) + 1;
    const prev = LESSONS[index - 1];
    const next = LESSONS[index + 1];
    const done = getDone().has(lesson.id);

    const html =
      '<div class="lesson-meta">' +
      '<span class="badge">Module ' + moduleNo + " · " + escapeHtml(module.title) + "</span>" +
      '<span class="badge badge-muted">Lesson ' + (index + 1) + " of " + LESSONS.length + "</span>" +
      '<span class="badge badge-muted">' + ICONS.clock + lesson.minutes + " min read</span>" +
      "</div>" +
      "<h1>" + inline(lesson.title) + "</h1>" +
      '<p class="lesson-summary">' + inline(lesson.summary) + "</p>" +
      lesson.body.map(renderBlock).join("") +
      (lesson.playground
        ? '<div class="try-card"><div class="feature-icon">' + ICONS.code + "</div>" +
          "<div><h3>Try it yourself</h3><p>Open this lesson's example in the live playground and experiment.</p></div>" +
          '<a class="btn btn-primary btn-sm" href="playground.html?lesson=' + encodeURIComponent(lesson.id) + '">' + ICONS.play + "Open Playground</a></div>"
        : "") +
      '<section class="takeaways" aria-labelledby="takeaways-title"><h2 id="takeaways-title">' + ICONS.flag + "Key takeaways</h2><ul>" +
      lesson.takeaways.map((t) => "<li>" + inline(t) + "</li>").join("") +
      "</ul></section>" +
      renderQuiz(lesson) +
      '<div class="lesson-complete"><p>' +
      (next ? "Finished reading? Mark it done and keep going." : "That's the final lesson — amazing work! 🎉") +
      '</p><button type="button" class="btn btn-primary btn-complete' + (done ? " is-done" : "") + '" id="completeBtn">' +
      (done ? icon.check + "Completed" : "Mark as complete") +
      "</button></div>" +
      '<nav class="pager" aria-label="Lesson navigation">' +
      (prev ? '<a class="prev" href="#' + prev.id + '"><small>← Previous</small><strong>' + inline(prev.title) + "</strong></a>" : "") +
      (next ? '<a class="next" href="#' + next.id + '"><small>Next →</small><strong>' + inline(next.title) + "</strong></a>" : "") +
      "</nav>";

    els.lesson.innerHTML = html;
    document.title = lesson.title + " · React Fundamentals";
    highlight(els.lesson);
    bindLessonEvents(lesson);
  }

  function bindLessonEvents(lesson) {
    const completeBtn = document.getElementById("completeBtn");
    completeBtn.addEventListener("click", () => {
      const isDone = !getDone().has(lesson.id);
      setDone(lesson.id, isDone);
      completeBtn.classList.toggle("is-done", isDone);
      completeBtn.innerHTML = isDone ? icon.check + "Completed" : "Mark as complete";
      updateProgress();
      renderNav(els.search.value);
    });

    // Quiz answers
    let answered = 0;
    let correct = 0;
    const total = (lesson.quiz || []).length;
    els.lesson.querySelectorAll(".question").forEach((qEl) => {
      qEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".option");
        if (!btn || btn.disabled) return;
        const item = lesson.quiz[Number(btn.dataset.q)];
        const chosen = Number(btn.dataset.o);
        const isRight = chosen === item.answer;
        const buttons = qEl.querySelectorAll(".option");

        buttons.forEach((b) => (b.disabled = true));
        buttons[item.answer].classList.add("is-correct");
        if (!isRight) btn.classList.add("is-wrong");

        const explain = qEl.querySelector(".explain");
        explain.innerHTML = (isRight ? '<strong class="ok">Correct!</strong> ' : '<strong class="no">Not quite.</strong> ') + inline(item.why);
        explain.classList.add("is-visible");

        answered += 1;
        if (isRight) correct += 1;
        if (answered === total) {
          const score = els.lesson.querySelector(".quiz-score");
          score.textContent =
            "You scored " + correct + " / " + total + (correct === total ? " — perfect! 🎉" : " — review the explanations above and try again later.");
          score.classList.add("is-visible");
          if (correct === total && !getDone().has(lesson.id)) completeBtn.click();
        }
      });
    });
  }

  /* ---------- Sidebar ---------- */
  function renderNav(query) {
    const q = (query || "").trim().toLowerCase();
    const done = getDone();
    const current = currentLesson();
    let html = "";

    MODULES.forEach((m, mi) => {
      const items = LESSONS.filter(
        (l) => l.module === m.id && (!q || l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q))
      );
      if (!items.length) return;
      html +=
        '<div class="nav-module"><h3>' + (mi + 1) + ". " + escapeHtml(m.title) + "</h3><ul>" +
        items
          .map((l) => {
            const n = LESSONS.indexOf(l) + 1;
            const isDone = done.has(l.id);
            return (
              '<li><a href="#' + l.id + '"' + (isDone ? ' class="is-done"' : "") + (current === l ? ' aria-current="page"' : "") + ">" +
              '<span class="check">' + (isDone ? icon.check : n) + "</span>" + escapeHtml(l.title) + "</a></li>"
            );
          })
          .join("") +
        "</ul></div>";
    });

    els.nav.innerHTML = html || '<p class="nav-empty">No lessons match "' + escapeHtml(query) + '".</p>';
  }

  function updateProgress() {
    const count = LESSONS.filter((l) => getDone().has(l.id)).length;
    const pct = Math.round((count / LESSONS.length) * 100);
    els.progressText.textContent = count + " / " + LESSONS.length + " lessons";
    els.progressBar.setAttribute("aria-valuenow", String(pct));
    els.progressBar.firstElementChild.style.width = pct + "%";
  }

  function openSidebar(open) {
    els.sidebar.classList.toggle("is-open", open);
    els.backdrop.classList.toggle("is-visible", open);
    els.sidebarToggle.setAttribute("aria-expanded", String(open));
  }

  /* ---------- Routing ---------- */
  function currentLesson() {
    const id = decodeURIComponent(location.hash.slice(1));
    return LESSONS.find((l) => l.id === id) || LESSONS[0];
  }

  function route() {
    const lesson = currentLesson();
    renderLesson(lesson);
    renderNav(els.search.value);
    openSidebar(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    els.lesson.focus({ preventScroll: true });
  }

  els.search.addEventListener("input", () => renderNav(els.search.value));
  els.sidebarToggle.addEventListener("click", () => openSidebar(!els.sidebar.classList.contains("is-open")));
  els.backdrop.addEventListener("click", () => openSidebar(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") openSidebar(false);
  });
  window.addEventListener("hashchange", route);

  updateProgress();
  route();
})();
