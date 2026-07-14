/**
 * SAP IBP S&OP 流程資料
 * 資料來源：tbp-spec.md
 * 純資料檔，供 snop-app.js 動態渲染使用。
 */

/* ------------------------------------------------------------------ */
/* 1. 八大流程步驟                                                     */
/* ------------------------------------------------------------------ */
const SNOP_STEPS = [
  {
    id: 1,
    en: "Data Preparation",
    zh: "資料準備",
    tagline: "規劃資料準備好了嗎？",
    summary:
      "S&OP 的起點，準備後續規劃會用到的各種資料，確保完整、正確、可用。",
    question: "規劃需要的資料是否完整、正確、可用？",
    io: {
      input: [
        "Sales History 歷史銷售",
        "Financial / Marketing / Sales Plan",
        "Master Data：product、customer、location、resource",
        "Aggregated Supply Data：月 / 季層級產能、庫存水位、供應來源、lead time",
        "Financial Data：成本、售價、營收、毛利，用於產品組合與管理決策",
      ],
      output: ["完整、正確、可用的規劃資料集"],
    },
    masterData: [
      {
        name: "Product",
        zh: "產品主檔",
        desc: "定義要規劃的產品／料號及其基本屬性。",
        table: {
          caption: "Product 產品主檔",
          headers: ["Product ID", "描述", "Product Family", "Base UoM"],
          rows: [
            ["PMIC_A", "車用 / 工控電源管理 IC（成品）", "PMIC", "PCS 顆"],
            ["DIE_A", "PMIC_A 晶粒（晶圓切割後半成品）", "Die", "PCS 顆"],
            ["WAFER_A", "PMIC_A 8 吋晶圓", "Wafer", "WAFER 片"],
            ["LEADFRAME_A", "QFN 導線架", "Component", "PCS 片"],
            ["MOLD_COMPOUND_A", "封膠材料", "Component", "KG"],
            ["GOLD_WIRE_A", "鍵合金線", "Component", "M"],
          ],
        },
      },
      {
        name: "Location",
        zh: "地點主檔",
        desc: "供給、庫存、產能所在的實體或邏輯地點。",
        table: {
          caption: "Location 地點主檔",
          headers: ["Location ID", "名稱", "類型", "地區"],
          rows: [
            ["FOUNDRY_TW", "8 吋晶圓代工廠", "Supplier 供應商", "台灣新竹"],
            ["OSAT_TW", "QFN 封測廠", "Subcontractor 委外", "台灣台中"],
            ["DC_TW", "成品配銷中心", "Distribution Center", "台灣桃園"],
            ["CUST_AUTO_EU", "歐洲車用客戶倉", "Customer Location", "歐洲"],
            ["CUST_IND_US", "美國工控客戶倉", "Customer Location", "美國"],
            ["DISTY_ASIA", "亞洲消費性通路倉", "Distributor", "亞洲"],
          ],
        },
      },
      {
        name: "Customer",
        zh: "客戶主檔",
        desc: "需求與分配的對象，含產業別與優先順序。",
        table: {
          caption: "Customer 客戶主檔",
          headers: ["Customer ID", "名稱", "產業", "優先順序"],
          rows: [
            ["AUTO_OEM_A", "車用 Tier-1 客戶", "Automotive 車用", "高：缺貨會影響長約"],
            ["IND_OEM_B", "工控設備客戶", "Industrial 工控", "高：毛利穩定"],
            ["CONSUMER_DISTY", "消費性通路商", "Consumer 消費性", "低：可延後交期"],
          ],
        },
      },
      {
        name: "Resource",
        zh: "產能資源",
        desc: "生產／封測的產能限制，是後續供應審查與 R&S 計算的重要 constraint。",
        table: {
          caption: "Resource 產能資源",
          headers: ["Resource ID", "名稱", "Location", "產能（每週）"],
          rows: [
            ["FAB_8INCH_START", "8 吋 wafer starts", "FOUNDRY_TW", "34,000 die equivalent"],
            ["OSAT_ASSEMBLY_QFN", "QFN assembly capacity", "OSAT_TW", "30,000 顆"],
            ["OSAT_FINAL_TEST", "Final test capacity", "OSAT_TW", "32,000 顆"],
          ],
        },
      },
      {
        name: "Transportation Lane",
        zh: "運輸路線",
        desc: "地點間的運輸路徑、方式與 lead time。",
        table: {
          caption: "Transportation Lane 運輸路線",
          headers: ["Lane", "起點 → 終點", "運輸方式", "Lead Time"],
          rows: [
            ["FOUNDRY→OSAT", "FOUNDRY_TW → OSAT_TW", "保稅卡車", "2 天"],
            ["OSAT→DC", "OSAT_TW → DC_TW", "卡車", "2 天"],
            ["DC→AUTO", "DC_TW → CUST_AUTO_EU", "空運", "5 天"],
            ["DC→IND", "DC_TW → CUST_IND_US", "空運", "4 天"],
            ["DC→DISTY", "DC_TW → DISTY_ASIA", "海運", "10 天"],
          ],
        },
      },
      {
        name: "Source of Supply",
        zh: "供應來源",
        desc: "某產品在某地點的供給方式，可包含成品、半成品與關鍵元件的自製、採購或調撥來源。",
        table: {
          caption: "Source of Supply 供應來源",
          headers: ["Product", "Product Type", "Supply Location", "Source Type", "Source / Supplier", "Lead Time"],
          rows: [
            ["WAFER_A", "Wafer", "FOUNDRY_TW", "Purchase / Foundry", "8 吋晶圓代工", "60 天"],
            ["DIE_A", "Semi-finished", "OSAT_TW", "Production", "Wafer sort + dicing", "7 天"],
            ["PMIC_A", "Finished Goods", "OSAT_TW", "Production", "Assembly + final test", "10 天"],
            ["PMIC_A", "Finished Goods", "DC_TW", "Stock Transfer", "OSAT_TW → DC_TW", "2 天"],
            ["LEADFRAME_A", "Component", "OSAT_TW", "Purchase", "Lead frame supplier", "30 天"],
            ["MOLD_COMPOUND_A", "Component", "OSAT_TW", "Purchase", "Material supplier", "21 天"],
            ["GOLD_WIRE_A", "Component", "OSAT_TW", "Purchase", "Wire supplier", "14 天"],
          ],
        },
      },
      {
        name: "Component / BOM",
        zh: "元件關係",
        desc: "定義成品與上游半成品、原材料之間的用量關係，用來判斷需求會消耗哪些物料。",
        table: {
          caption: "Component / BOM 元件關係",
          headers: ["Finished Product", "Component", "Component Type", "Usage", "Supply Stage"],
          rows: [
            ["DIE_A", "WAFER_A", "Wafer / 晶圓", "1 wafer = 約 2,000 die", "Foundry"],
            ["PMIC_A", "DIE_A", "Die / 晶粒", "1 顆 / 顆", "Assembly"],
            ["PMIC_A", "LEADFRAME_A", "Lead Frame / 導線架", "1 片 / 顆", "Assembly"],
            ["PMIC_A", "MOLD_COMPOUND_A", "Molding Compound / 封膠材料", "0.02 g / 顆", "Assembly"],
            ["PMIC_A", "GOLD_WIRE_A", "Bonding Wire / 鍵合線", "0.15 m / 顆", "Wire Bond"],
          ],
        },
      },
    ],
  },
  {
    id: 2,
    en: "Demand Planning",
    zh: "需求規劃",
    tagline: "未來可能賣多少？",
    summary: "建立初版需求計畫，結合統計預測與各單位輸入，形成全球需求計畫。",
    question: "未來可能需要多少？需求趨勢是什麼？",
    io: {
      input: [
        "Statistical Forecast 統計預測",
        "Local Demand 區域 / 業務單位需求",
        "Global Demand 全球彙總需求",
      ],
      output: ["Global Demand Plan 全球需求計畫"],
    },
    table: {
      caption: "Demand Planning 組成",
      headers: ["項目", "說明"],
      rows: [
        ["Statistical Forecast", "系統依歷史銷售推估的統計預測"],
        ["Automotive Demand", "車用 Tier-1 客戶需求 60K"],
        ["Industrial Demand", "工控客戶需求 40K"],
        ["Consumer Demand", "消費性通路需求 30K"],
        ["Global Demand Plan", "整合後的全球需求計畫：PMIC_A 每月 130K"],
      ],
    },
  },
  {
    id: 3,
    en: "Demand Sensing",
    zh: "短期需求感知",
    tagline: "短期真實需求有沒有變？",
    summary: "用更短期、更接近實際市場的訊號（如未完成訂單）修正需求。",
    question: "根據短期訂單與市場訊號，原本的需求計畫是否需要修正？",
    io: {
      input: ["Global Demand Plan 原需求計畫", "Open Orders 未完成訂單"],
      output: ["Sensed Demand 感知需求"],
    },
    table: {
      caption: "Demand Sensing 修正",
      headers: ["項目", "數值 / 說明"],
      rows: [
        ["Global Demand Plan", "130K（原月需求計畫）"],
        ["Open Orders", "車用客戶 pull-in，工控客戶提前備料"],
        ["Sensed Demand", "145K（短期上修）"],
      ],
    },
  },
  {
    id: 4,
    en: "Demand Review",
    zh: "需求審查 / 共識需求",
    tagline: "公司認可的需求是多少？",
    summary:
      "把 Demand Planning 與 Demand Sensing 結果拿來審查，跨部門形成公司認可的需求數字。",
    question: "公司正式認可的需求數字是多少？",
    io: {
      input: [
        "Global Demand Plan",
        "Sensed Demand",
        "Sales / Marketing / Finance / PM 意見",
      ],
      output: ["Consensus Demand Plan 共識需求計畫"],
    },
    table: {
      caption: "Demand Review 審查項目",
      headers: ["項目", "說明"],
      rows: [
        ["Forecast Accuracy", "預測準確度"],
        ["Demand Outlier", "是否有異常需求"],
        ["Customer Forecast Reliability", "客戶 forecast 是否可靠"],
        ["NPI / EOL", "新產品導入 / 舊產品退場"],
        ["Upside / Downside", "需求上修或下修風險"],
      ],
    },
    table2: {
      caption: "共識形成（PMIC_A）",
      headers: ["來源", "數值"],
      rows: [
        ["Demand Planning", "130K"],
        ["Demand Sensing", "145K"],
        ["Sales / PM 需求確認", "車用與工控需求優先保留"],
        ["Finance 檢查", "消費性需求毛利較低，可接受部分延後"],
        ["Consensus Demand Plan", "140K"],
      ],
    },
    image: "abc-xyz%20prod.png",
    imageAlt: "ABC-XYZ Product Classification",
  },
  {
    id: 5,
    en: "Inventory Optimization",
    zh: "庫存最佳化",
    tagline: "庫存水位要設多少才合理？",
    summary:
      "在需求與供應不確定的情況下，決定合理的安全庫存與目標庫存水位。",
    question:
      "為了達成服務水準，又不要庫存過高，安全庫存與目標庫存應該設多少？",
    io: {
      input: [
        "Demand Variability 需求波動",
        "Supply Variability 供應波動",
        "Lead Time 前置時間 / Service Level 服務水準 / Holding Cost 庫存持有成本",
      ],
      output: ["Inventory Plan 庫存計畫"],
    },
    images: [
      {
        title: "不確定因素影響",
        src: "inventory%20influence.png",
        alt: "Inventory influence",
      },
      {
        title: "Optimal Inventory Placement",
        src: "inventory%20cycle.png",
        alt: "Optimal Inventory Placement",
        notes: [
          "庫存會隨著需求消耗下降，補貨到貨後再拉高，所以呈現鋸齒狀變化。",
          "<span class='note-color note-color--green'>綠色 Safety Stock</span> 是保底庫存，用來應付需求突然增加、供應延遲或預測誤差。",
          "<span class='note-color note-color--blue'>藍色 On Hand / Cycle Stock</span> 是手上可用、會被訂單慢慢消耗的庫存。",
          "<span class='note-color note-color--orange'>橘色 Pipeline Stock / On Order</span> 是已下單但還沒到貨的在途庫存，補貨有 Lead Time，不會立刻可用。",
          "<span class='note-color note-color--red'>紅色箭頭</span> 代表檢查後下補貨單，<span class='note-color note-color--blue'>藍色箭頭</span> 代表訂單到貨入庫。",
          "Target Inventory Position 會把 cycle stock、pipeline stock 與 safety stock 一起納入，判斷要補到多少才合理。",
        ],
      },
    ],
  },
  {
    id: 6,
    en: "Supply Review",
    zh: "供應審查 / 受限需求計畫",
    tagline: "供應能力能支援多少需求？",
    summary:
      "根據 Consensus Demand Plan 與 Inventory Plan，檢查供應鏈能否滿足需求，得出受限需求計畫。",
    question: "這個共識需求，供應鏈做不做得出來？如果做不出來，能滿足多少？",
    io: {
      input: [
        "Consensus Demand Plan",
        "Inventory Plan",
        "Capacity / Material / Lead Time / Source of Supply",
      ],
      output: ["Constrained Demand Plan 受限需求計畫"],
    },
    table: {
      caption: "Supply Review 供應檢查（PMIC_A）",
      headers: ["項目", "數值"],
      rows: [
        ["Consensus Demand", "140K"],
        ["Foundry wafer starts", "135K die equivalent"],
        ["OSAT assembly / final test", "120K"],
        ["Lead frame availability", "110K"],
        ["可滿足量（Constrained Demand Plan）", "110K"],
      ],
    },
  },
  {
    id: 7,
    en: "Reconciliation Review",
    zh: "調和審查 / 供需整合審查",
    tagline: "需求、供應、庫存、財務能否對齊？",
    summary:
      "把需求、供應、庫存與財務結果放在一起檢查，比較共識需求與受限需求的差距。",
    question: "供需缺口、庫存影響、財務影響是否能被管理層接受？",
    io: {
      input: ["Consensus Demand Plan", "Constrained Demand Plan"],
      output: ["供需缺口與多種因應方案評估"],
    },
    table: {
      caption: "Reconciliation Review 缺口（PMIC_A）",
      headers: ["項目", "數值"],
      rows: [
        ["Consensus Demand", "140K"],
        ["Constrained Demand", "110K"],
        ["Gap 缺口", "30K"],
        ["主要限制", "Lead frame 供應不足，其次是 OSAT 產能"],
        ["主要影響", "車用長約風險、工控毛利、消費性客戶延後出貨"],
      ],
    },
    table2: {
      caption: "Planner 可提方案",
      headers: ["方案", "說明"],
      rows: [
        ["1", "加價取得 10K lead frame，縮小材料缺口"],
        ["2", "啟用第二供應商，但需承擔認證與良率風險"],
        ["3", "優先供應車用與工控客戶"],
        ["4", "延後消費性通路需求 20K"],
      ],
    },
  },
  {
    id: 8,
    en: "Management Business Review",
    zh: "管理層業務審查 / 最終決策",
    tagline: "管理層最後採用哪個方案？",
    summary:
      "S&OP 的決策點，由管理層決定最終供需方案，輸出最終共識需求。",
    question: "公司最後要採用哪個供需方案？",
    io: {
      input: ["各項供需方案與財務 / 風險影響評估"],
      output: ["Final Consensus Demand 最終共識需求"],
    },
    table: {
      caption: "Management Business Review 決策（PMIC_A）",
      headers: ["決策", "內容"],
      rows: [
        ["Final Consensus Demand", "130K"],
        ["客戶策略", "車用 60K 全供、工控 40K 優先供應、消費性 30K 中延後 20K"],
        ["供應決策", "加價取得 10K lead frame，OSAT 加班支援策略客戶"],
        ["取捨", "短期犧牲部分消費性營收，保護長約與高毛利客戶"],
        ["財務", "接受 expedite cost 與短期毛利下降，降低車用客戶缺貨風險"],
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* 2. 半導體貫穿例子（PMIC_A）                                          */
/* ------------------------------------------------------------------ */
const SNOP_EXAMPLE = {
  intro:
    "以 PMIC_A 為例，先建立產品、客戶、地點、產能、供應來源與 BOM 等 Master Data Types，再把客戶需求一路轉成共識需求、受限供應與管理層決策。",
  steps: {
    1: {
      text:
        "先準備 PMIC_A 的主資料：產品包含 PMIC_A、die、wafer 與關鍵材料；地點包含 foundry、OSAT、DC 與客戶倉；客戶分為車用、工控、消費性；再補上 BOM、供應來源、lead time、庫存、成本與毛利資料。",
      tables: [
        {
          caption: "PMIC_A Master Data Types",
          headers: ["Master Data Type", "PMIC_A 例子", "S&OP 用途"],
          rows: [
            ["Product", "PMIC_A、DIE_A、WAFER_A、LEADFRAME_A", "定義要規劃的成品、半成品與關鍵材料"],
            ["Customer", "車用 Tier-1、工控 OEM、消費性通路", "決定需求來源、優先順序與 allocation 規則"],
            ["Location", "FOUNDRY_TW、OSAT_TW、DC_TW、客戶倉", "定義供應、庫存與出貨節點"],
            ["Resource", "8 吋 wafer starts、QFN assembly、final test", "提供 Supply Review 的產能限制"],
            ["Source / Lane", "Foundry → OSAT → DC → Customer", "定義供應來源、運輸路線與 lead time"],
            ["BOM", "1 顆 PMIC_A 需要 die、lead frame、封膠、金線", "把成品需求轉成材料需求"],
          ],
        },
      ],
    },
    2: {
      text: "統計預測加上業務輸入後，初版需求為車用 60K、工控 40K、消費性 30K，Global Demand Plan = 每月 130K。",
      tables: [
        {
          caption: "Demand Planning：初版需求",
          headers: ["客戶區隔", "需求量", "說明"],
          rows: [
            ["Automotive 車用", "60K", "長約客戶，需求穩定且缺貨風險高"],
            ["Industrial 工控", "40K", "毛利穩定，交期彈性中等"],
            ["Consumer 消費性", "30K", "需求波動較大，可接受部分延後"],
            ["Global Demand Plan", "130K", "三類需求加總後的初版月需求"],
          ],
        },
      ],
    },
    3: {
      text: "短期 open orders 顯示車用客戶 pull-in、工控客戶提前備料，Sensed Demand 上修到 145K。",
      highlight: true,
      tables: [
        {
          caption: "Demand Sensing：短期訊號修正",
          headers: ["訊號", "影響", "調整後需求"],
          rows: [
            ["Global Demand Plan", "基準需求", "130K"],
            ["車用客戶 pull-in", "+10K", "140K"],
            ["工控客戶提前備料", "+5K", "145K"],
            ["Sensed Demand", "短期需求上修", "145K"],
          ],
        },
      ],
    },
    4: {
      text: "業務、PM、供應鏈與財務討論後，認定 145K 中有部分消費性需求可延後，因此 Consensus Demand Plan = 140K。",
      highlight: true,
      tables: [
        {
          caption: "Demand Review：共識需求形成",
          headers: ["來源 / 角色", "數字", "判斷"],
          rows: [
            ["Demand Planning", "130K", "原始月需求基準"],
            ["Demand Sensing", "145K", "短期訂單與 pull-in 後的需求"],
            ["Sales / PM", "保留車用與工控需求", "策略客戶優先"],
            ["Finance / Supply Chain", "-5K", "消費性需求可延後，避免過度承諾"],
            ["Consensus Demand Plan", "140K", "跨部門認可的需求數字"],
          ],
        },
      ],
    },
    5: {
      text: "因車用與工控客戶缺貨代價高，Inventory Plan 建議在 DC 保留 25K safety stock，優先保護策略客戶。",
      tables: [
        {
          caption: "Inventory Optimization：庫存政策",
          headers: ["庫存策略", "數值 / 對象", "用途"],
          rows: [
            ["Safety Stock", "25K", "吸收需求波動、供應延遲與預測誤差"],
            ["Service Level", "車用 / 工控優先", "策略客戶缺貨成本高，服務水準需較高"],
            ["Target Inventory Position", "Cycle + Pipeline + Safety Stock", "決定補貨要補到多少才合理"],
            ["Holding Cost", "避免為消費性需求囤過多庫存", "降低庫存持有成本與呆滯風險"],
          ],
        },
      ],
    },
    6: {
      text: "供應端檢查後發現 foundry 可支援 135K、OSAT 可支援 120K，但 lead frame 只夠 110K，因此 Constrained Demand Plan = 110K。",
      highlight: true,
      tables: [
        {
          caption: "Supply Review：供應限制檢查",
          headers: ["供應限制", "可支援量", "結果"],
          rows: [
            ["Consensus Demand", "140K", "需要檢查供應端是否做得到"],
            ["Foundry wafer starts", "135K", "晶圓端略低於共識需求"],
            ["OSAT assembly / final test", "120K", "封測端形成第二層限制"],
            ["Lead frame availability", "110K", "最小可用量，成為主要瓶頸"],
            ["Constrained Demand Plan", "110K", "受限後實際可承諾供應量"],
          ],
        },
      ],
    },
    7: {
      text: "Consensus 140K vs Constrained 110K，缺口 30K；planner 評估加價取得 lead frame、啟用第二供應商、優先 allocation 與延後消費性需求。",
      highlight: true,
      tables: [
        {
          caption: "Reconciliation Review：缺口與方案",
          headers: ["項目 / 方案", "數值 / 影響", "取捨"],
          rows: [
            ["Supply Gap", "140K - 110K = 30K", "共識需求與受限供應的差距"],
            ["Premium Buy", "+10K lead frame", "成本上升，但可保護策略客戶"],
            ["Second Source", "中期增加供應", "需承擔認證時間與良率風險"],
            ["Allocation", "車用 / 工控優先", "保護長約與高毛利客戶"],
            ["Defer Consumer", "延後 20K", "短期犧牲部分消費性營收"],
          ],
        },
      ],
    },
    8: {
      text: "管理層核准 Final Consensus Demand = 130K：車用 60K 全供、工控 40K 優先供應、消費性 30K 中延後 20K，並接受 expedite cost。",
      highlight: true,
      tables: [
        {
          caption: "Management Business Review：最終決策",
          headers: ["決策項目", "數字 / 決策", "原因"],
          rows: [
            ["Final Consensus Demand", "130K", "在供應限制與客戶策略之間取得平衡"],
            ["Automotive", "60K 全供", "保護長約與客戶關係"],
            ["Industrial", "40K 優先供應", "毛利穩定且需求可信度高"],
            ["Consumer", "30K 中延後 20K", "需求彈性較高，缺貨衝擊較低"],
            ["Supply Action", "加價取得 10K lead frame", "提高可供應量並降低策略客戶缺貨風險"],
          ],
        },
      ],
    },
  },
};

/* ------------------------------------------------------------------ */
/* 3. 快速記憶版                                                       */
/* ------------------------------------------------------------------ */
const SNOP_MEMO = [
  ["1", "Data Preparation", "規劃資料準備好了嗎？"],
  ["2", "Demand Planning", "未來可能賣多少？"],
  ["3", "Demand Sensing", "短期真實需求有沒有變？"],
  ["4", "Demand Review", "公司認可的需求是多少？"],
  ["5", "Inventory Optimization", "庫存水位要設多少才合理？"],
  ["6", "Supply Review", "供應能力能支援多少需求？"],
  ["7", "Reconciliation Review", "需求、供應、庫存、財務結果能否對齊？"],
  ["8", "Management Business Review", "管理層最後決定採用哪個方案？"],
];

const SNOP_ONE_LINER =
  "先把歷史資料/主檔資料準備好 → 預估需求 → 用短期訊號需求修正 → 開會形成共識需求 → 設定庫存策略 → 看供應端做不做得到 → 做供需與財務取捨 → 管理層拍板。";
