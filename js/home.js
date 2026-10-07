/* ==========================================================================
   Landing page: learning path, stats, "continue learning" card
   ========================================================================== */
(function () {
  "use strict";

  const { escapeHtml, getDone, highlight } = window.RK;
  const LESSONS = window.RK_LESSONS;
  const MODULES = window.RK_MODULES;
  const done = getDone();

  /* ---------- Stats ---------- */
  const totalMinutes = LESSONS.reduce((sum, l) => sum + l.minutes, 0);
  const totalQuestions = LESSONS.reduce((sum, l) => sum + (l.quiz ? l.quiz.length : 0), 0);
  const hours = Math.round((totalMinutes / 60) * 2) / 2; // nearest half hour
  document.getElementById("statLessons").textContent = LESSONS.length;
  document.getElementById("statQuiz").textContent = totalQuestions;
  document.getElementById("statTime").textContent = "~" + hours + "h";

  /* ---------- Learning path ---------- */
  document.getElementById("pathGrid").innerHTML = MODULES.map((m, mi) => {
    const lessons = LESSONS.filter((l) => l.module === m.id);
    const finished = lessons.filter((l) => done.has(l.id)).length;
    const allDone = finished === lessons.length;
    return (
      '<article class="module-card">' +
      '<div class="module-top"><span class="module-num">Module ' + (mi + 1) + "</span>" +
      '<span class="module-progress' + (allDone ? " is-done" : "") + '">' + (allDone ? "✓ Complete" : finished + " / " + lessons.length + " done") + "</span></div>" +
      "<h3>" + escapeHtml(m.title) + "</h3><p>" + escapeHtml(m.text) + "</p>" +
      '<ul class="lesson-links">' +
      lessons
        .map((l) => {
          const n = LESSONS.indexOf(l) + 1;
          return (
            '<li><a href="learn.html#' + l.id + '"' + (done.has(l.id) ? ' class="is-done"' : "") + ">" +
            '<span class="num">' + (done.has(l.id) ? "✓" : n) + "</span>" + escapeHtml(l.title) +
            '<span class="mins">' + l.minutes + " min</span></a></li>"
          );
        })
        .join("") +
      "</ul></article>"
    );
  }).join("");

  /* ---------- Continue where you left off ---------- */
  const completed = LESSONS.filter((l) => done.has(l.id)).length;
  if (completed > 0) {
    const next = LESSONS.find((l) => !done.has(l.id));
    const card = document.getElementById("resumeCard");
    const pct = completed / LESSONS.length;
    document.getElementById("resumeRing").style.strokeDashoffset = String(113.1 * (1 - pct));
    document.getElementById("resumeTitle").textContent = next ? "Welcome back!" : "Course complete 🎉";
    document.getElementById("resumeText").textContent = next
      ? completed + " of " + LESSONS.length + " lessons done · Next: " + next.title
      : "You finished all " + LESSONS.length + " lessons. Time to build something!";
    const link = document.getElementById("resumeLink");
    link.href = next ? "learn.html#" + next.id : "playground.html";
    link.textContent = next ? "Continue" : "Playground";
    card.classList.add("is-visible");
    document.getElementById("startBtn").firstChild.textContent = next ? "Go to lessons " : "Review lessons ";
  }

  /* ---------- Hero demo: the "Result" card actually works ---------- */
  const follow = document.getElementById("demoFollow");
  let following = false;
  follow.addEventListener("click", () => {
    following = !following;
    follow.textContent = following ? "Following ✓" : "Follow";
  });
  follow.removeAttribute("tabindex");
  follow.closest(".hero-visual").removeAttribute("aria-hidden");

  highlight(document.querySelector(".hero-visual"));
})();
