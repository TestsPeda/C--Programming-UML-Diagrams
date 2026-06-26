const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "pruefung.js");
const source = fs.readFileSync(scriptPath, "utf8");
const sandbox = {
  window: {},
  document: {
    addEventListener: function () {},
    getElementById: function () { return null; },
    querySelectorAll: function () { return []; }
  },
  localStorage: {
    getItem: function () { return null; },
    setItem: function () {},
    removeItem: function () {}
  },
  navigator: {},
  setInterval: function () { return 1; },
  clearInterval: function () {},
  setTimeout: function () {}
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: scriptPath });

const scoring = sandbox.window.ProbeSaScoring;

assert.ok(scoring, "ProbeSaScoring API is exposed for tests");
assert.equal(scoring.getGrade(92).grade, 1);
assert.equal(scoring.getGrade(91.99).grade, 2);
assert.equal(scoring.getGrade(81).grade, 2);
assert.equal(scoring.getGrade(80.99).grade, 3);
assert.equal(scoring.getGrade(67).grade, 3);
assert.equal(scoring.getGrade(66.99).grade, 4);
assert.equal(scoring.getGrade(50).grade, 4);
assert.equal(scoring.getGrade(49.99).grade, 5);
assert.equal(scoring.getGrade(30).grade, 5);
assert.equal(scoring.getGrade(29.99).grade, 6);

assert.deepEqual(JSON.parse(JSON.stringify(scoring.calculateExamResult(15, 15, 20, 20))), {
  choiceScore: 15,
  choiceMax: 15,
  openScore: 20,
  openMax: 20,
  totalScore: 35,
  totalMax: 35,
  percentage: 100,
  grade: 1,
  gradeLabel: "sehr gut"
});

const passingEdge = scoring.calculateExamResult(10, 15, 7.5, 20);
assert.equal(passingEdge.totalScore, 17.5);
assert.equal(passingEdge.percentage, 50);
assert.equal(passingEdge.grade, 4);

const clamped = scoring.calculateExamResult(15, 15, 25, 20);
assert.equal(clamped.openScore, 20);
assert.equal(clamped.totalScore, 35);
assert.equal(clamped.grade, 1);

console.log("pruefung scoring tests passed");
