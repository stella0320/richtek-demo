/* ================================================================== */
/*  SAP IBP S&OP vs. R&S — 差異比較渲染                               */
/*  依賴 compare-data.js: COMPARE                                     */
/* ================================================================== */

function el(tag, className, html) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (html != null) n.innerHTML = html;
  return n;
}

function buildList(items) {
  const ul = el("ul", "cmp-list");
  items.forEach((t) => ul.appendChild(el("li", null, t)));
  return ul;
}

function renderCompare() {
  const cmp = document.getElementById("cmp");
  const table = el("table", "cmp-table");

  // 表頭
  const thead = el("thead");
  const htr = el("tr");
  htr.appendChild(el("th", "cmp-corner", "核心定位"));
  htr.appendChild(
    el(
      "th",
      "cmp-head cmp-head--snop",
      `${COMPARE.snopHead.title}<small>${COMPARE.snopHead.sub}</small>`
    )
  );
  htr.appendChild(
    el(
      "th",
      "cmp-head cmp-head--rs",
      `${COMPARE.rsHead.title}<small>${COMPARE.rsHead.sub}</small>`
    )
  );
  thead.appendChild(htr);
  table.appendChild(thead);

  // 內容列
  const tbody = el("tbody");
  COMPARE.rows.forEach((row) => {
    const tr = el("tr");
    tr.appendChild(el("th", "cmp-label", row.label));

    const snopTd = el("td", "cmp-cell cmp-cell--snop");
    snopTd.appendChild(buildList(row.snop));
    tr.appendChild(snopTd);

    const rsTd = el("td", "cmp-cell cmp-cell--rs");
    rsTd.appendChild(buildList(row.rs));
    tr.appendChild(rsTd);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  cmp.appendChild(table);

  // 精髓
  const ess = document.getElementById("essence");
  ess.appendChild(
    el(
      "div",
      "essence essence--snop",
      `<span class="essence__tag">S&OP 精髓</span>${COMPARE.essence.snop}`
    )
  );
  ess.appendChild(
    el(
      "div",
      "essence essence--rs",
      `<span class="essence__tag">R&S 精髓</span>${COMPARE.essence.rs}`
    )
  );
}

document.addEventListener("DOMContentLoaded", renderCompare);
