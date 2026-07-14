/* ================================================================== */
/*  SAP IBP R&S — 互動邏輯                                            */
/*  依賴 data.js: STEPS, SCENARIOS, QUICK_MEMO, ONE_LINER             */
/* ================================================================== */

/** 建立 HTML 元素小工具 */
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/** 依 table 定義建立資料表格元素 */
function buildTable(t) {
  const table = el("table", "data-table");
  if (t.caption) {
    const cap = el("caption", null, t.caption);
    table.appendChild(cap);
  }
  const thead = el("thead");
  const htr = el("tr");
  t.headers.forEach((h) => htr.appendChild(el("th", null, h)));
  thead.appendChild(htr);
  table.appendChild(thead);

  const tbody = el("tbody");
  t.rows.forEach((row) => {
    const tr = el("tr");
    row.forEach((cell) => tr.appendChild(el("td", null, cell)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

/* -------------------- 流程總覽 -------------------- */
function renderTimeline() {
  const list = document.getElementById("timeline");
  STEPS.forEach((step) => {
    const li = el("li", "tl-item");
    li.dataset.id = step.id;
    li.appendChild(el("span", "tl-item__dot", String(step.id)));
    const body = el("div", "tl-item__body");
    body.appendChild(el("div", "tl-item__en", step.en));
    body.appendChild(el("div", "tl-item__zh", step.zh));
    li.appendChild(body);
    li.addEventListener("click", () => selectStep(step.id));
    list.appendChild(li);
  });
}

function selectStep(id) {
  document
    .querySelectorAll(".tl-item")
    .forEach((n) =>
      n.classList.toggle("tl-item--active", Number(n.dataset.id) === id)
    );

  const step = STEPS.find((s) => s.id === id);
  const detail = document.getElementById("detail");
  detail.innerHTML = "";

  detail.appendChild(
    el("div", "detail__step", `Step ${step.id} · ${step.tagline}`)
  );
  detail.appendChild(el("h3", "detail__title", step.en));
  detail.appendChild(el("p", "detail__zh", step.zh));
  detail.appendChild(el("p", "detail__summary", step.summary));
  detail.appendChild(
    el("div", "detail__q", `<strong>這一步回答：</strong>${step.question}`)
  );

  // 輸入 / 輸出
  const grid = el("div", "io-grid");
  const inCard = el("div", "io-card io-card--in");
  inCard.appendChild(el("div", "io-card__head", "主要輸入"));
  const inList = el("ul", "io-list");
  step.io.input.forEach((i) => inList.appendChild(el("li", null, i)));
  inCard.appendChild(inList);

  const outCard = el("div", "io-card io-card--out");
  outCard.appendChild(el("div", "io-card__head", "主要輸出"));
  const outList = el("ul", "io-list");
  step.io.output.forEach((o) => outList.appendChild(el("li", null, o)));
  outCard.appendChild(outList);

  grid.appendChild(inCard);
  grid.appendChild(outCard);
  detail.appendChild(grid);

  // demo 表格
  if (step.table) detail.appendChild(buildTable(step.table));
  if (step.table2) detail.appendChild(buildTable(step.table2));
  if (step.table3) detail.appendChild(buildTable(step.table3));
}

/* -------------------- 情境演示 -------------------- */
let activeScenario = SCENARIOS[0].id;

function renderScenarioTabs() {
  const tabs = document.getElementById("scenarioTabs");
  SCENARIOS.forEach((sc) => {
    const btn = el("button", "tab", `${sc.name}<small>${sc.en}</small>`);
    btn.dataset.id = sc.id;
    btn.addEventListener("click", () => selectScenario(sc.id));
    tabs.appendChild(btn);
  });
}

function selectScenario(id) {
  activeScenario = id;
  document
    .querySelectorAll(".tab")
    .forEach((n) => n.classList.toggle("tab--active", n.dataset.id === id));

  const sc = SCENARIOS.find((s) => s.id === id);
  document.getElementById("scenarioIntro").textContent = sc.intro;

  // 逐步走位
  const walk = document.getElementById("scenarioWalk");
  walk.innerHTML = "";
  STEPS.forEach((step) => {
    const entry = sc.steps[step.id] || { text: "" };
    const li = el("li", "walk__item" + (entry.highlight ? " walk__item--hl" : ""));
    li.appendChild(el("span", "walk__num", String(step.id)));
    const content = el("div", "walk__content");
    const label = el(
      "div",
      "walk__label",
      `${step.en}<small>${step.zh}</small>` +
        (entry.highlight ? '<span class="walk__flag">此情境重點</span>' : "")
    );
    content.appendChild(label);
    content.appendChild(el("p", "walk__text", entry.text));
    li.appendChild(content);
    walk.appendChild(li);
  });

  // 情境資料表
  const tableWrap = document.getElementById("scenarioTable");
  tableWrap.innerHTML = "";
  if (sc.table) tableWrap.appendChild(buildTable(sc.table));
  if (sc.table2) tableWrap.appendChild(buildTable(sc.table2));
}

/* -------------------- 快速記憶版 -------------------- */
function renderMemo() {
  const table = document.getElementById("memoTable");
  const thead = el("thead");
  const htr = el("tr");
  ["#", "階段", "一句話"].forEach((h) => htr.appendChild(el("th", null, h)));
  thead.appendChild(htr);
  table.appendChild(thead);

  const tbody = el("tbody");
  QUICK_MEMO.forEach((row) => {
    const tr = el("tr");
    row.forEach((cell) => tr.appendChild(el("td", null, cell)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  document.getElementById("memoOneLiner").textContent = ONE_LINER;
  document.getElementById("heroOneLiner").textContent = ONE_LINER;
}

/* -------------------- 主資料 Master Data -------------------- */
function renderMasterTabs() {
  const tabs = document.getElementById("masterTabs");
  MASTER_DATA.forEach((md) => {
    const btn = el("button", "tab", `${md.name}<small>${md.zh}</small>`);
    btn.dataset.id = md.id;
    btn.addEventListener("click", () => selectMaster(md.id));
    tabs.appendChild(btn);
  });
}

function selectMaster(id) {
  document
    .querySelectorAll("#masterTabs .tab")
    .forEach((n) => n.classList.toggle("tab--active", n.dataset.id === id));
  const md = MASTER_DATA.find((m) => m.id === id);
  document.getElementById("masterIntro").textContent = md.desc;
  const wrap = document.getElementById("masterTable");
  wrap.innerHTML = "";
  wrap.appendChild(buildTable(md.table));
}

/* -------------------- 初始化 -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTimeline();
  renderScenarioTabs();
  renderMemo();
  selectStep(1);
  selectScenario(SCENARIOS[0].id);
});
