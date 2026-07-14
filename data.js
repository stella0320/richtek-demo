/**
 * SAP IBP R&S / OBP 流程資料
 * 資料來源：obp-spec.md
 * 純資料檔，供 app.js 動態渲染使用。
 */

/* ------------------------------------------------------------------ */
/* 1. 八大流程步驟                                                     */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    id: 1,
    en: "Demand Input",
    zh: "需求輸入",
    tagline: "需求從哪裡來？",
    summary:
      "R&S / OBP 的起點。需求主要來自「預測」與「實際客戶訂單」兩種來源。",
    question: "未來需要多少？哪些需求已經變成實際訂單？",
    io: {
      input: [
        "Forecast（來自 Demand Planning / S&OP）",
        "Sales Order（實際客戶訂單）",
      ],
      output: ["彙整後的總需求清單"],
    },
    table: {
      caption: "需求來源範例",
      headers: ["Demand Type", "說明", "數量"],
      rows: [
        ["Forecast", "預測需求", "PMIC_A 100,000 顆"],
        ["Sales Order", "實際客戶訂單", "PMIC_A 30,000 顆"],
      ],
    },
  },
  {
    id: 2,
    en: "Forecast Consumption",
    zh: "預測消耗",
    tagline: "實際訂單要消耗多少 forecast？",
    summary:
      "避免 forecast 與 sales order 重複計算。Sales order 代表 forecast 已實現的一部分。",
    question: "實際訂單進來後，還剩多少 forecast 需要保留？",
    io: {
      input: ["原始 Forecast", "Sales Order"],
      output: ["Open Forecast（未消耗的預測）", "維持不變的總需求"],
    },
    table: {
      caption: "預測消耗計算",
      headers: ["項目", "數量"],
      rows: [
        ["原 Forecast", "100,000"],
        ["Sales Order 消耗", "30,000"],
        ["Open Forecast", "70,000"],
        ["總需求（非 130,000）", "100,000"],
      ],
    },
  },
  {
    id: 3,
    en: "Supply Planning Run",
    zh: "供應規劃執行",
    tagline: "供應鏈做不做得出來？",
    summary:
      "OBP 的核心計算。把需求、供給、庫存、產能、物料、lead time、成本與限制一起納入運算。",
    question: "目前供應鏈做不做得出來？如果做不出來，缺在哪裡？",
    io: {
      input: [
        "Demand：forecast、sales order",
        "Supply：stock、planned order、Purchase Requisition 採購請購、production order",
        "Master Data：product、location、resource、lane、source of supply",
        "Constraints：產能、物料、allocation、物流限制",
        "Lead Time：production、transportation、component offset",
      ],
      output: [
        "Planned Order / Purchase Requisition / STR",
        "Projected Stock / Capacity Usage",
        "Supply Shortage / Gating Factor",
        "Demand Fulfillment 需求滿足狀況",
      ],
    },
    table: {
      caption: "供應規劃結果（PMIC_A 4 週）",
      headers: ["項目", "數量"],
      rows: [
        ["成品庫存", "20,000"],
        ["Foundry supply", "50,000"],
        ["OSAT capacity", "80,000"],
        ["Lead frame availability", "70,000"],
        ["可滿足量", "70,000"],
        ["缺口", "30,000"],
      ],
    },
    table2: {
      caption: "三種補給輸出比較",
      headers: ["輸出", "補的方式", "對象"],
      rows: [
        ["Planned Order", "自製生產", "內部工廠"],
        ["PR（Purchase Requisition）", "對外採購", "外部供應商"],
        ["STR（Stock Transfer Requisition）", "內部調撥", "自家不同 location"],
      ],
    },
    table3: {
      caption: "三種 Planning Run 引擎",
      headers: ["引擎", "一句話"],
      rows: [
        ["Finite Heuristic", "先排客戶優先序，滿足哪個客戶"],
        ["Optimizer", "在成本、交期、產能、短缺懲罰間找最佳解"],
        ["DDR Heuristic", "何時補貨、補多少，維持庫存水位"],
      ],
    },
  },
  {
    id: 4,
    en: "Review & Refining Plan",
    zh: "檢查與修正計畫",
    tagline: "計畫哪裡不合理，要怎麼修？",
    summary:
      "Planning run 產生的計畫不一定可直接執行，planner 需檢查缺口、pegging、gating factor 並修正。",
    question: "這版計畫哪裡不合理？要怎麼修到可用、可解釋、可執行？",
    io: {
      input: [
        "Planning results / Shortages / Pegging",
        "Gating factors / Projected stock / Capacity usage",
      ],
      output: [
        "調整需求優先順序 / allocation",
        "改 source of supply / transportation lane",
        "fix / unfix orders、simulation、重跑 planning run",
      ],
    },
    table: {
      caption: "檢查發現與修正",
      headers: ["發現", "內容"],
      rows: [
        ["Gating factor", "Lead Frame shortage"],
        ["受影響期間", "Week 3-4"],
        ["受影響客戶", "Customer A / B / C"],
        ["可能調整", "替代 supplier、優先順序、allocation、重跑"],
      ],
    },
    table2: {
      caption: "檢查與修正四步",
      headers: ["順序", "看什麼", "工具 / 例子"],
      rows: [
        ["1", "看缺口有多大", "Shortage"],
        ["2", "找出是什麼卡住", "Gating Factor（例：導線架）"],
        ["3", "追這缺口打到誰", "Pegging（例：客戶 A 那 15,000）"],
        [
          "4",
          "決定怎麼修",
          "換料源 / 改優先序 / 改交期 → 建 scenario 重跑 planning run",
        ],
      ],
    },
  },
  {
    id: 5,
    en: "Allocation Planning",
    zh: "有限供給分配",
    tagline: "供給不足時，先分給誰？",
    summary:
      "供給不足時，依 forecast、constraints、供應能力建立 constrained supply plan 與 product allocation quantity。",
    question:
      "如果供給不夠，有限供給要先分給誰？每個客戶最多可以拿多少？",
    io: {
      input: ["Forecast", "Constraints", "供應能力"],
      output: ["Constrained Supply Plan", "Product Allocation Quantity（分配上限）"],
    },
    table: {
      caption: "有限供給分配（可供 70,000）",
      headers: ["客戶", "需求", "Allocation"],
      rows: [
        ["車用客戶 A", "40,000", "35,000"],
        ["工控客戶 B", "30,000", "25,000"],
        ["消費性客戶 C", "30,000", "10,000"],
      ],
    },
  },
  {
    id: 6,
    en: "Response Planning",
    zh: "訂單與供應變動回應",
    tagline: "訂單或供應變動後，能不能承諾？",
    summary:
      "實際訂單或供應變動後，重新確認能否承諾。觸發情境包含需求、供給、庫存、物流、規則變動。",
    question:
      "這張 sales order 能不能滿足？能滿足多少？什麼時候能交？如果不能，要怎麼調整？",
    io: {
      input: [
        "需求變動：追加、提前、取消",
        "供給變動：foundry delay、OSAT 產能下降、yield 變差",
        "庫存 / 物流 / 規則變動",
      ],
      output: [
        "重新承諾（可交量與交期）",
        "是否違反 allocation / 影響其他客戶的判斷",
      ],
    },
    table: {
      caption: "客戶 A 追加急單判斷",
      headers: ["項目", "數量 / 判斷"],
      rows: [
        ["原本 allocation", "35,000"],
        ["已下單", "35,000"],
        ["追加需求", "10,000"],
        ["系統判斷", "能否多給？是否違反 allocation？是否影響 B/C？"],
      ],
    },
  },
  {
    id: 7,
    en: "Deployment Planning",
    zh: "短期供給部署 / 調撥規劃",
    tagline: "可靠供給現在要送去哪裡？",
    summary:
      "更靠近執行端的短期流程，用 Available-to-Deploy (ATD) Profile 判斷哪些 supply 可實際部署。",
    question: "短期內可靠的供給，現在要實際送去哪裡？",
    io: {
      input: ["前段規劃好的供應", "ATD Profile"],
      output: [
        "Deployment Run：建立 STR 並轉 Deployment Requisition",
        "Deployment Conversion Run：既有 STR 轉 Deployment Requisition",
      ],
    },
    table: {
      caption: "短期可部署供給判斷（ATD）",
      headers: ["Supply", "Quantity", "Status", "ATD"],
      rows: [
        ["成品庫存", "20,000", "已入庫", "是"],
        ["已確認 production order", "30,000", "可靠", "是 / 可能是"],
        ["planned order", "20,000", "尚未確認", "否"],
        ["品檢中庫存", "10,000", "QC", "否"],
      ],
    },
  },
  {
    id: 8,
    en: "ERP Execution",
    zh: "實際執行",
    tagline: "實際調撥、出貨、入庫。",
    summary:
      "Deployment Requisition 確認後傳到 SAP S/4HANA 或 ECC 進入實際執行。",
    question: "計畫確認後，實際怎麼下單、調撥、出貨、入庫？",
    io: {
      input: ["Deployment Requisition"],
      output: [
        "STO 庫存調撥單 / Delivery 出貨單",
        "Goods Issue 發貨 / Goods Receipt 收貨",
        "Purchase Order / Production Order",
      ],
    },
    table: {
      caption: "ERP 執行物件",
      headers: ["ERP Object", "中文"],
      rows: [
        ["Stock Transfer Order (STO)", "庫存調撥單"],
        ["Delivery", "出貨單"],
        ["Goods Issue", "發貨"],
        ["Goods Receipt", "收貨"],
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* 1.5 主資料 Master Data（供 Supply Planning Run 計算的基礎資料）      */
/* ------------------------------------------------------------------ */
/*
 * 以 PMIC_A 情境為例的示範主資料，方便講解時對照真實欄位。
 */
const MASTER_DATA = [
  {
    id: "product",
    name: "Product",
    zh: "產品主檔",
    desc: "定義要規劃的產品／料號及其基本屬性。",
    table: {
      caption: "Product 產品主檔",
      headers: ["Product ID", "描述", "Product Family", "Base UoM"],
      rows: [
        ["PMIC_A", "電源管理 IC（成品）", "PMIC", "PCS 顆"],
        ["DIE_A", "PMIC_A 晶圓（半成品）", "Wafer", "PCS 顆"],
        ["LEADFRAME_A", "導線架（原料）", "Component", "PCS 片"],
      ],
    },
  },
  {
    id: "location",
    name: "Location",
    zh: "地點主檔",
    desc: "供給、庫存、產能所在的實體或邏輯地點。",
    table: {
      caption: "Location 地點主檔",
      headers: ["Location ID", "名稱", "類型", "地區"],
      rows: [
        ["FOUNDRY_TW", "晶圓代工廠", "Supplier 供應商", "台灣新竹"],
        ["OSAT_TW", "封測廠", "Subcontractor 委外", "台灣台中"],
        ["DC_TW", "台灣配銷中心", "Distribution Center", "台灣台北"],
        ["WH_CN", "中國倉", "Warehouse 倉庫", "中國上海"],
      ],
    },
  },
  {
    id: "customer",
    name: "Customer",
    zh: "客戶主檔",
    desc: "需求與分配的對象，含產業別與優先順序。",
    table: {
      caption: "Customer 客戶主檔",
      headers: ["Customer ID", "名稱", "產業", "優先順序"],
      rows: [
        ["CUST_A", "車用客戶 A", "Automotive 車用", "高"],
        ["CUST_B", "工控客戶 B", "Industrial 工控", "中"],
        ["CUST_C", "消費性客戶 C", "Consumer 消費性", "低"],
      ],
    },
  },
  {
    id: "resource",
    name: "Resource",
    zh: "產能資源",
    desc: "生產／封測的產能限制，供應規劃的重要 constraint。",
    table: {
      caption: "Resource 產能資源",
      headers: ["Resource ID", "名稱", "Location", "產能（每週）"],
      rows: [
        ["FAB_CAP", "Foundry 晶圓產能", "FOUNDRY_TW", "50,000"],
        ["OSAT_CAP", "封測產能", "OSAT_TW", "80,000"],
      ],
    },
  },
  {
    id: "lane",
    name: "Transportation Lane",
    zh: "運輸路線",
    desc: "地點間的運輸路徑、方式與 lead time。",
    table: {
      caption: "Transportation Lane 運輸路線",
      headers: ["Lane", "起點 → 終點", "運輸方式", "Lead Time"],
      rows: [
        ["OSAT→DC", "OSAT_TW → DC_TW", "卡車", "2 天"],
        ["DC→WH", "DC_TW → WH_CN", "海運", "7 天"],
        ["FAB→OSAT", "FOUNDRY_TW → OSAT_TW", "卡車", "1 天"],
      ],
    },
  },
  {
    id: "sos",
    name: "Source of Supply",
    zh: "供應來源",
    desc: "某產品在某地點的供給方式（自製 / 採購 / 調撥）。",
    table: {
      caption: "Source of Supply 供應來源",
      headers: ["Product", "Location", "來源類型", "Lead Time"],
      rows: [
        ["PMIC_A", "OSAT_TW", "Production 自製封測", "5 天"],
        ["DIE_A", "FOUNDRY_TW", "Purchase 對外採購", "60 天"],
        ["PMIC_A", "WH_CN", "Stock Transfer 內部調撥", "9 天"],
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* 2. 情境演示（PMIC_A 貫穿全流程）                                    */
/* ------------------------------------------------------------------ */
/*
 * 每個情境針對 8 步驟提供一句「該情境下發生什麼」的說明，
 * 以及該情境的重點資料表；highlight 標示與 base 的差異。
 */
const SCENARIOS = [
  {
    id: "shortage",
    name: "缺料",
    en: "Supply Shortage",
    intro:
      "PMIC_A 未來 4 週需求 100,000 顆，但 Lead Frame 只夠做出 70,000 顆，形成 30,000 顆缺口。",
    steps: {
      1: { text: "Forecast 100,000 + Sales Order 30,000 進入系統。" },
      2: { text: "Sales Order 消耗 forecast，Open Forecast 70,000，總需求維持 100,000。" },
      3: { text: "Planning run 算出可滿足 70,000，缺口 30,000。", highlight: true },
      4: { text: "Planner 發現 gating factor = Lead Frame shortage（Week 3-4）。", highlight: true },
      5: { text: "70,000 有限供給分配給 A/B/C 三客戶。", highlight: true },
      6: { text: "各客戶依 allocation 上限承諾，暫無變動。" },
      7: { text: "確認可部署供給（ATD），只有可靠 supply 轉 Deployment Requisition。" },
      8: { text: "Deployment Requisition 傳 ERP，產生 STO / Delivery / Goods Movement。" },
    },
    table: {
      caption: "缺料情境：分配結果",
      headers: ["客戶", "需求", "Allocation", "缺口"],
      rows: [
        ["車用客戶 A", "40,000", "35,000", "-5,000"],
        ["工控客戶 B", "30,000", "25,000", "-5,000"],
        ["消費性客戶 C", "30,000", "10,000", "-20,000"],
      ],
    },
  },
  {
    id: "rush",
    name: "急單",
    en: "Rush Order",
    intro:
      "在缺料情境的分配之後，車用客戶 A 追加 10,000 顆急單，觸發 Response Planning 重新承諾。",
    steps: {
      1: { text: "客戶 A 於原有 40,000 之外追加 10,000 顆急單。", highlight: true },
      2: { text: "追加為實際 Sales Order，再次消耗 forecast。" },
      3: { text: "供給總量未增加，仍為 70,000，壓力集中在 A。" },
      4: { text: "Planner 檢視追加是否可解、是否影響 B/C。" },
      5: { text: "既有 allocation：A 35,000 已全數下單。" },
      6: { text: "Response Planning 判斷能否多給 A、是否違反 allocation、是否改交期或換來源。", highlight: true },
      7: { text: "若擠出可靠供給則轉 Deployment Requisition 支援急單。", highlight: true },
      8: { text: "確認後傳 ERP，優先安排 A 的 STO / Delivery。" },
    },
    table: {
      caption: "急單情境：Response Planning 判斷",
      headers: ["項目", "數量 / 判斷"],
      rows: [
        ["A 原 allocation", "35,000"],
        ["A 已下單", "35,000"],
        ["A 追加急單", "+10,000"],
        ["可否多給", "需犧牲 B/C 或改交期，否則違反 allocation"],
      ],
    },
  },
  {
    id: "delay",
    name: "供應延遲",
    en: "Supply Delay",
    intro:
      "Foundry 交期延遲，原本 Week 2 的 Foundry supply 延到 Week 4，觸發 Response Planning 重排。",
    steps: {
      1: { text: "需求不變：Forecast 100,000 + Sales Order 30,000。" },
      2: { text: "Open Forecast 70,000，總需求 100,000。" },
      3: { text: "供給輸入變動：Foundry supply 延後，可滿足量與時程改變。", highlight: true },
      4: { text: "Planner 發現 gating factor 由 Lead Frame 轉為 Foundry delay。", highlight: true },
      5: { text: "可用供給時程後移，需重新調整各客戶分配時點。" },
      6: { text: "Response Planning 依供給變動重新承諾交期。", highlight: true },
      7: { text: "延後的 supply 尚未可靠，ATD 判斷從嚴，可部署量下降。", highlight: true },
      8: { text: "傳 ERP 執行時交期整體後移，優先保住關鍵客戶。" },
    },
    table: {
      caption: "供應延遲情境：供給時程變化",
      headers: ["Supply", "原時程", "延遲後", "ATD"],
      rows: [
        ["成品庫存 20,000", "Week 1", "Week 1", "是"],
        ["Foundry supply 50,000", "Week 2", "Week 4", "否（尚未可靠）"],
        ["可交總量", "70,000", "時程後移", "下降"],
      ],
    },
  },
  {
    id: "pegging",
    name: "多階缺料追溯",
    en: "Multi-stage Pegging",
    intro:
      "PMIC_A 成品缺料 16,000 顆，但缺口不在成品階。透過 pegging 沿 BOM 逐階往上游追溯（成品←測試←封裝←Die/Wafer），最終發現根因是最上游 Wafer 良率由 85% 降到 70%。",
    steps: {
      1: { text: "需求不變：Forecast 100,000 + Sales Order 30,000 進系統。" },
      2: { text: "Sales Order 消耗 forecast，Open Forecast 70,000，總需求 100,000。" },
      3: { text: "Planning run 算出成品只能交 84,000，缺口 16,000，但缺口不在成品階。", highlight: true },
      4: { text: "Planner 用 pegging 逐階往上追：成品←測試←封裝←Die，發現 gating factor = Wafer 良率下降。", highlight: true },
      5: { text: "有限 good die 這下去的成品 84,000 分配給 A/B/C 三客戶。", highlight: true },
      6: { text: "各客戶依上游良率回復時程重新承諾交期。" },
      7: { text: "只有已完測、可靠的成品轉 Deployment Requisition。" },
      8: { text: "Deployment Requisition 傳 ERP，產生 STO / Delivery / Goods Movement。" },
    },
    table: {
      caption: "良率逐階追溯（往上游 pegging）",
      headers: ["製程階層", "良率", "良品產出", "狀態"],
      rows: [
        ["Good Die（Wafer / Foundry）", "70%（原 85%）", "90,000", "根因 gating factor"],
        ["Assembly 封裝", "98%", "88,200", "受上游限制"],
        ["Final Test 測試", "95%", "83,790", "受上游限制"],
        ["成品 Finished", "—", "~84,000", "缺 16,000"],
      ],
    },
    table2: {
      caption: "根因與對策",
      headers: ["項目", "內容"],
      rows: [
        ["表面現象", "成品 PMIC_A 缺 16,000"],
        ["逐階追溯", "成品 ← 測試 ← 封裝 ← Die"],
        ["真正根因", "最上游 Wafer 良率 85% → 70%"],
        ["對策", "拉高投片量 / 追加 Wafer / 調整交期而非加強封測"],
      ],
    },
  },
  {
    id: "contention",
    name: "產能競用",
    en: "Capacity Contention",
    intro:
      "PMIC_A 進來一張高優先車用急單 20,000 顆，與 PMIC_B 共用同一條 OSAT 封測產能。分配不只跨客戶，還要跨產品取捨。",
    steps: {
      1: { text: "PMIC_A 車用急單 20,000 進系統，與 PMIC_B 既有訂單並存。", highlight: true },
      2: { text: "兩產品各自消耗 forecast，需求不重複計算。" },
      3: { text: "Planning run 發現 OSAT 產能不足以同時滿足 A + B。", highlight: true },
      4: { text: "Planner 確認 gating factor = OSAT 共用產能，需跨產品取捨。", highlight: true },
      5: { text: "依客戶優先序，車用 A 優先佔用產能，PMIC_B 部分後延。", highlight: true },
      6: { text: "Response Planning 重新承諾 PMIC_B 的交期。", highlight: true },
      7: { text: "確認可靠產能後，將 A / B 可交量轉 Deployment Requisition。" },
      8: { text: "傳 ERP 執行，優先安排 A 的 STO / Delivery。" },
    },
    table: {
      caption: "OSAT 產能競用（跨產品）",
      headers: ["產品", "客戶等級", "需求", "分配產能", "結果"],
      rows: [
        ["PMIC_A（車用急單）", "高", "20,000", "20,000", "全數滿足"],
        ["PMIC_B（消費性）", "中", "60,000", "45,000", "後延 15,000"],
        ["OSAT 總產能", "—", "需 80,000", "65,000", "缺 15,000"],
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* 3. 快速記憶版                                                       */
/* ------------------------------------------------------------------ */
const QUICK_MEMO = [
  ["1", "Demand Input", "需求從哪裡來？"],
  ["2", "Forecast Consumption", "實際訂單要消耗多少 forecast？"],
  ["3", "Supply Planning Run", "供應鏈做不做得出來？"],
  ["4", "Review & Refining Plan", "計畫哪裡不合理，要怎麼修？"],
  ["5", "Allocation Planning", "供給不足時，先分給誰？"],
  ["6", "Response Planning", "訂單或供應變動後，能不能承諾？"],
  ["7", "Deployment Planning", "可靠供給現在要送去哪裡？"],
  ["8", "ERP Execution", "實際調撥、出貨、入庫。"],
];

const ONE_LINER =
  "先有需求 → 消耗 forecast → 跑供應 → 修計畫 → 分配有限供給 → 回應訂單變動 → 部署可靠供給 → ERP 執行。";
