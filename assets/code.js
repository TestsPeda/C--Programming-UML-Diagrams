/* Hybrid-Code-Komponente — KI-Bewertungs-Prompt in die Zwischenablage kopieren.
   Statische Seite (GitHub Pages): kein Server, kein API-Key. Der Button baut aus
   dem versteckten <template class="prompt-tpl"> + dem eingegebenen Code einen
   fertigen Prompt, den man in eine beliebige KI (z. B. ChatGPT/Claude) einfügt.
   Vanilla JS, keine Abhängigkeiten. */
(function () {
  "use strict";

  function buildPrompt(q) {
    var tpl = q.querySelector("template.prompt-tpl");
    var input = q.querySelector(".code-input");
    var tplText = tpl ? tpl.innerHTML : "";
    // <template>.innerHTML liefert den reinen Textinhalt (kein echtes Markup hier).
    var code = input ? input.value : "";
    if (!code.trim()) code = "// (kein Code eingegeben — bitte Code oben einfügen)";
    return tplText.replace(/\{\{CODE\}\}/g, code).trim();
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flash(btn, msg) {
    var orig = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", orig);
    btn.textContent = msg;
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = btn.getAttribute("data-label");
      btn.classList.remove("copied");
    }, 1800);
  }

  function initCopy(q) {
    var btn = q.querySelector(".q-copyprompt");
    if (!btn) return;
    btn.setAttribute("data-label", btn.textContent);
    btn.addEventListener("click", function () {
      var text = buildPrompt(q);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { flash(btn, "✓ kopiert"); },
          function () { flash(btn, fallbackCopy(text) ? "✓ kopiert" : "Kopieren fehlgeschlagen"); }
        );
      } else {
        flash(btn, fallbackCopy(text) ? "✓ kopiert" : "Kopieren fehlgeschlagen");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".q").forEach(function (q) { initCopy(q); });
  });
})();
