/* ================================================================== */
/*  SAP IBP Planning Area — 互動邏輯                                  */
/*  依賴 pa-data.js: PA_TREE, PA_COMPONENTS, PA_EXAMPLE               */
/* ================================================================== */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

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

/* -------------------- 組成元件 -------------------- */
function renderComponents() {
  const list = document.getElementById("timeline");
  PA_COMPONENTS.forEach((c) => {
    const li = el("li", "tl-item");
    li.dataset.id = c.id;
    li.appendChild(el("span", "tl-item__dot", String(c.id)));
    const body = el("div", "tl-item__body");
    body.appendChild(el("div", "tl-item__en", c.en));
    body.appendChild(el("div", "tl-item__zh", c.zh));
    li.appendChild(body);
    li.addEventListener("click", () => selectComponent(c.id));
    list.appendChild(li);
  });
}

function selectComponent(id) {
  document
    .querySelectorAll(".tl-item")
    .forEach((n) =>
      n.classList.toggle("tl-item--active", Number(n.dataset.id) === id)
    );

  const c = PA_COMPONENTS.find((x) => x.id === id);
  const detail = document.getElementById("detail");
  detail.innerHTML = "";

  detail.appendChild(el("div", "detail__step", c.tagline));
  detail.appendChild(el("h3", "detail__title", c.en));
  detail.appendChild(el("p", "detail__zh", c.zh));
  detail.appendChild(el("p", "detail__summary", c.summary));
  if (c.note) {
    detail.appendChild(el("div", "detail__q", c.note));
  }
  if (c.image) {
    const img = el("img", "cmp-image");
    img.src = c.image;
    img.alt = c.imageAlt || c.en;
    detail.appendChild(img);
  }
  (c.tables || []).forEach((t) => detail.appendChild(buildTable(t)));
}

/* -------------------- 完整範例 -------------------- */
function renderExample() {
  document.getElementById("exampleIntro").textContent = PA_EXAMPLE.intro;

  const walk = document.getElementById("exampleWalk");
  walk.innerHTML = "";
  PA_EXAMPLE.rows.forEach((row, i) => {
    const li = el(
      "li",
      "walk__item" + (row.highlight ? " walk__item--hl" : "")
    );
    li.appendChild(el("span", "walk__num", String(i + 1)));
    const content = el("div", "walk__content");
    content.appendChild(
      el(
        "div",
        "walk__label",
        row.title +
          (row.highlight ? '<span class="walk__flag">重點</span>' : "")
      )
    );
    content.appendChild(el("p", "walk__text", row.text));
    li.appendChild(content);
    walk.appendChild(li);
  });

  const tableWrap = document.getElementById("exampleTable");
  tableWrap.innerHTML = "";
  if (PA_EXAMPLE.table) tableWrap.appendChild(buildTable(PA_EXAMPLE.table));
}

/* -------------------- 初始化 -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderComponents();
  selectComponent(1);
});
