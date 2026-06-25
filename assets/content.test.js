const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const uml = fs.readFileSync(path.join(root, "03-uml-aktivitaetsdiagramm.html"), "utf8");
const pruefung = fs.readFileSync(path.join(root, "pruefung.html"), "utf8");

function articleByNumber(html, number) {
  const marker = `<span class="q-num">${number}</span>`;
  const pos = html.indexOf(marker);
  assert.notEqual(pos, -1, `article ${number} exists`);
  const start = html.lastIndexOf('<article class="q">', pos);
  const end = html.indexOf("</article>", pos);
  assert.notEqual(start, -1, `article ${number} start exists`);
  assert.notEqual(end, -1, `article ${number} end exists`);
  return html.slice(start, end + "</article>".length);
}

function openArticleByNumber(html, number) {
  const marker = `<span class="q-num">${number}</span>`;
  const pos = html.indexOf(marker);
  assert.notEqual(pos, -1, `open article ${number} exists`);
  const start = html.lastIndexOf('<article class="q open-q">', pos);
  const end = html.indexOf("</article>", pos);
  assert.notEqual(start, -1, `open article ${number} start exists`);
  assert.notEqual(end, -1, `open article ${number} end exists`);
  return html.slice(start, end + "</article>".length);
}

assert.match(articleByNumber(uml, "08"), /<svg[\s\S]*Kehrwert[\s\S]*<\/svg>/);
assert.match(openArticleByNumber(pruefung, "P3"), /<svg[\s\S]*Passwort[\s\S]*Konto sperren[\s\S]*<\/svg>/);

[
  "PDF 1",
  "PDF 2",
  "PDF 3",
  "PDF 4",
  "Global Medi AG",
  "LaLuSe GmbH",
  "Visite und Patientendaten"
].forEach((text) => assert.ok(uml.includes(text), `UML page contains ${text}`));

assert.ok((uml.match(/<svg /g) || []).length >= 9, "UML page has SVG diagrams for the added solutions");

console.log("content tests passed");
