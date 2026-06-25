/* Probe-SA — Prüfungssimulation mit Countdown.
   Eigene Logik (NICHT quiz.js): Antworten werden erst beim Abgeben bewertet.
   Single-Choice-Fragen tragen data-answer="<Index der richtigen Option>".
   Speichert Ergebnisse lokal (localStorage). Vanilla JS. */
(function () {
  "use strict";

  var DURATION = 30 * 60;        // Sekunden (30 Minuten)
  var remaining = DURATION;
  var timerId = null;
  var submitted = false;
  var RESULT_KEY = "aeup:probe-sa:results";

  function saveResult(res) {
    var arr;
    try { arr = JSON.parse(localStorage.getItem(RESULT_KEY)) || []; } catch (e) { arr = []; }
    arr.push(res);
    try { localStorage.setItem(RESULT_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function getResults() {
    try { return JSON.parse(localStorage.getItem(RESULT_KEY)) || []; } catch (e) { return []; }
  }
  function clearResults() { localStorage.removeItem(RESULT_KEY); }

  function fmt(s) {
    var m = Math.floor(s / 60), x = s % 60;
    return m + ":" + (x < 10 ? "0" : "") + x;
  }

  function tick() {
    remaining--;
    var el = document.getElementById("timer");
    if (el) {
      el.textContent = fmt(Math.max(0, remaining));
      if (remaining <= 60) el.classList.add("low");
    }
    if (remaining <= 0) { clearInterval(timerId); doSubmit(true); }
  }

  function initSelect() {
    document.querySelectorAll(".exam-q").forEach(function (q) {
      var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
      opts.forEach(function (o) {
        o.setAttribute("tabindex", "0");
        function pick() {
          if (submitted) return;
          opts.forEach(function (x) { x.classList.remove("picked"); });
          o.classList.add("picked");
        }
        o.addEventListener("click", pick);
        o.addEventListener("keydown", function (e) {
          if (e.key === " " || e.key === "Enter") { e.preventDefault(); pick(); }
        });
      });
    });
  }

  function doSubmit(auto) {
    if (submitted) return;
    submitted = true;
    clearInterval(timerId);

    var total = 0, ok = 0;
    document.querySelectorAll(".exam-q").forEach(function (q) {
      var ans = parseInt(q.getAttribute("data-answer"), 10);
      var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
      var list = q.querySelector(".q-options");
      if (list) list.classList.add("locked");
      total++;
      var picked = -1;
      opts.forEach(function (o, i) { if (o.classList.contains("picked")) picked = i; });
      opts.forEach(function (o, i) {
        var mark = o.querySelector(".tick");
        if (i === ans) { o.classList.add("correct"); if (mark) mark.textContent = "✓"; }
        else if (i === picked) { o.classList.add("wrong"); if (mark) mark.textContent = "✕"; }
      });
      if (picked === ans) { ok++; q.classList.add("answered-ok"); }
      else q.classList.add("answered-bad");
      var sol = q.querySelector(".q-solution");
      if (sol) sol.hidden = false;
    });

    var used = DURATION - Math.max(0, remaining);
    showResult(ok, total, used, auto);
    saveResult({ score: ok, total: total, seconds: used, ts: Date.now() });
    renderBest();
    var sb = document.getElementById("submit-btn");
    if (sb) { sb.disabled = true; sb.textContent = "Abgegeben"; }
  }

  function showResult(ok, total, used, auto) {
    var box = document.getElementById("result");
    if (!box) return;
    var pct = total ? Math.round(ok / total * 100) : 0;
    box.hidden = false;
    box.innerHTML =
      "<strong>Auswahlteil:</strong> " + ok + " / " + total + " richtig (" + pct + " %) · " +
      "Zeit: " + fmt(used) + (auto ? " · <em>Zeit abgelaufen</em>" : "") +
      "<br>Die Musterlösungen sind jetzt unter den Fragen sichtbar." +
      "<br><strong>Offener Teil (13 P):</strong> per KI-Bewertungs-Prompt bewerten lassen und die Punkte addieren.";
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderBest() {
    var box = document.getElementById("history");
    if (!box) return;
    var res = getResults();
    if (!res.length) { box.hidden = true; return; }
    box.hidden = false;
    var rows = res.slice(-5).reverse().map(function (r) {
      var d = new Date(r.ts);
      var datum = d.toLocaleDateString() + " " + d.toLocaleTimeString().slice(0, 5);
      var pct = r.total ? Math.round(r.score / r.total * 100) : 0;
      return "<tr><td>" + datum + "</td><td>" + r.score + "/" + r.total +
             "</td><td>" + pct + " %</td><td>" + fmt(r.seconds) + "</td></tr>";
    }).join("");
    box.innerHTML =
      "<span class='rubric-label'>Deine letzten Versuche</span>" +
      "<div class='tbl-wrap'><table class='ref'><tr><th>Datum</th><th>Punkte</th><th>Quote</th><th>Zeit</th></tr>" +
      rows + "</table></div>" +
      "<button class='btn' id='clear-history' type='button'>Verlauf löschen</button>";
    var cl = document.getElementById("clear-history");
    if (cl) cl.addEventListener("click", function () {
      clearResults(); renderBest(); box.hidden = true;
    });
  }

  /* ---- Offener Teil: Reveal-Toggle + Sammel-Prompt für die KI-Bewertung ---- */
  function copyText(text, btn) {
    function flash(msg) {
      var orig = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", orig);
      btn.textContent = msg; btn.classList.add("copied");
      setTimeout(function () { btn.textContent = btn.getAttribute("data-label"); btn.classList.remove("copied"); }, 1800);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash("✓ kopiert"); },
        function () { flash(fallback() ? "✓ kopiert" : "Kopieren fehlgeschlagen"); });
    } else { flash(fallback() ? "✓ kopiert" : "Kopieren fehlgeschlagen"); }
  }

  function buildOpenPrompt() {
    var blocks = [];
    document.querySelectorAll(".open-q").forEach(function (q, i) {
      var tpl = q.querySelector("template.prompt-tpl");
      var input = q.querySelector(".code-input");
      var t = tpl ? tpl.innerHTML : "";
      var code = input ? input.value : "";
      if (!code.trim()) code = "(keine Eingabe)";
      blocks.push("=== Aufgabe " + (i + 1) + " ===\n" + t.replace(/\{\{CODE\}\}/g, code).trim());
    });
    return "Du bist Informatik-Lehrkraft. Bewerte den offenen Teil meiner Probe-SA (Fach AEuP, C#) " +
      "und vergib pro Aufgabe Punkte streng nach den jeweils genannten Kriterien. Nenne je Aufgabe " +
      "die erreichten Punkte mit kurzer Begründung und am Ende die Gesamtpunktzahl des offenen Teils.\n\n" +
      blocks.join("\n\n");
  }

  function initOpen() {
    document.querySelectorAll(".open-q .q-reveal").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = btn.closest(".q");
        var sol = q ? q.querySelector(".q-solution") : null;
        if (!sol) return;
        sol.hidden = !sol.hidden;
        btn.setAttribute("aria-expanded", sol.hidden ? "false" : "true");
        btn.textContent = sol.hidden ? "Musterlösung anzeigen" : "Musterlösung ausblenden";
      });
    });
    var co = document.getElementById("copy-open");
    if (co) co.addEventListener("click", function () { copyText(buildOpenPrompt(), co); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSelect();
    initOpen();
    var el = document.getElementById("timer");
    if (el) el.textContent = fmt(remaining);
    timerId = setInterval(tick, 1000);

    var sb = document.getElementById("submit-btn");
    if (sb) sb.addEventListener("click", function () { doSubmit(false); });

    renderBest();
  });
})();
