/* ================================================================== */
/*  SAP IBP S&OP — 互動邏輯                                           */
/*  依賴 snop-data.js: SNOP_STEPS, SNOP_EXAMPLE, SNOP_MEMO,           */
/*                     SNOP_ONE_LINER                                 */
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
  if (t.caption) table.appendChild(el("caption", null, t.caption));
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
  SNOP_STEPS.forEach((step) => {
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

  const step = SNOP_STEPS.find((s) => s.id === id);
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
  if (step.images) {
    step.images.forEach((image) => {
      if (image.title) {
        detail.appendChild(el("h4", "detail__subhead", image.title));
      }
      const img = el("img", "cmp-image");
      img.src = image.src;
      img.alt = image.alt || image.title || step.en;
      detail.appendChild(img);
      if (image.notes) {
        const notes = el("ul", "image-notes");
        image.notes.forEach((note) => notes.appendChild(el("li", null, note)));
        detail.appendChild(notes);
      }
    });
  }
  if (step.image) {
    if (step.imageTitle) {
      detail.appendChild(el("h4", "detail__subhead", step.imageTitle));
    }
    const img = el("img", "cmp-image");
    img.src = step.image;
    img.alt = step.imageAlt || step.en;
    detail.appendChild(img);
  }
  if (step.masterData) {
    detail.appendChild(el("h4", "detail__subhead", "主資料 Master Data"));
    detail.appendChild(
      el(
        "p",
        "detail__summary",
        "S&OP 在 Data Preparation 階段先準備規劃會用到的主檔資料，後續供應審查與 R&S 執行會用更細的粒度延伸這些資料。"
      )
    );
    step.masterData.forEach((md) => {
      detail.appendChild(
        buildTable({
          ...md.table,
          caption: `${md.table.caption}：${md.desc}`,
        })
      );
    });
  }
}

/* -------------------- 半導體貫穿例子 -------------------- */
let activeExampleStepId = 1;

function renderExampleStep(id) {
  activeExampleStepId = id;

  document.querySelectorAll(".example-tab").forEach((button) => {
    const isActive = Number(button.dataset.id) === id;
    button.classList.toggle("example-tab--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const step = SNOP_STEPS.find((s) => s.id === id);
  const entry = SNOP_EXAMPLE.steps[id] || { text: "" };
  const detail = document.getElementById("exampleStepDetail");
  detail.innerHTML = "";
  detail.classList.toggle("example-detail--hl", Boolean(entry.highlight));

  detail.appendChild(
    el(
      "div",
      "example-detail__eyebrow",
      `Step ${step.id} · ${step.zh}`
    )
  );
  detail.appendChild(
    el(
      "h3",
      "example-detail__title",
      step.en + (entry.highlight ? '<span class="walk__flag">數字變動</span>' : "")
    )
  );
  detail.appendChild(el("p", "example-detail__summary", entry.text));

  if (entry.tables) {
    entry.tables.forEach((tableData) => {
      const table = buildTable(tableData);
      table.classList.add("walk__table");
      detail.appendChild(table);
    });
  }
}

function renderExample() {
  document.getElementById("exampleIntro").textContent = SNOP_EXAMPLE.intro;
  const tabs = document.getElementById("exampleStepTabs");
  tabs.innerHTML = "";

  SNOP_STEPS.forEach((step) => {
    const entry = SNOP_EXAMPLE.steps[step.id] || {};
    const button = el(
      "button",
      "example-tab" + (entry.highlight ? " example-tab--hl" : ""),
      `<span>${step.id}</span>${step.en}`
    );
    button.type = "button";
    button.dataset.id = step.id;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => renderExampleStep(step.id));
    tabs.appendChild(button);
  });

  const walk = document.getElementById("exampleWalk");
  if (walk) walk.innerHTML = "";
  renderExampleStep(activeExampleStepId);
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
  SNOP_MEMO.forEach((row) => {
    const tr = el("tr");
    row.forEach((cell) => tr.appendChild(el("td", null, cell)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  document.getElementById("memoOneLiner").textContent = SNOP_ONE_LINER;
  document.getElementById("heroOneLiner").textContent = SNOP_ONE_LINER;
}

/* -------------------- 初始化 -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTimeline();
  renderExample();
  renderMemo();
  selectStep(1);
});
