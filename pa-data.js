/**
 * SAP IBP Planning Area 架構介紹資料
 * 資料來源：SAP_IBP_Planning_Area_Spec.md
 */

/* 架構樹 */
const PA_TREE = `Planning Area
 ├─ Time Profile
 ├─ Master Data Types
 │   ├─ Product
 │   ├─ Customer
 │   ├─ Location
 │   ├─ Resource / Capacity
 │   └─ Source / Production / Transportation
 ├─ Attributes
 ├─ Planning Levels
 ├─ Key Figures
 └─ Versions / Scenarios`;

/* ------------------------------------------------------------------ */
/* 組成元件                                                            */
/* ------------------------------------------------------------------ */
const PA_COMPONENTS = [
  {
    id: 1,
    en: "Planning Area",
    zh: "計畫模型容器",
    tagline: "整個供應鏈計畫模型的容器",
    summary:
      "SAP IBP 最核心的模型設定，決定這個計畫模型要處理什麼業務流程。",
    note:
      "SAP IBP Fiori Launchpad 是使用者操作系統的入口，提供需求規劃、供應規劃、庫存規劃、分析與系統設定等不同 App；Planning Area 則是 SAP IBP 背後預先建立的規劃模型，定義要使用哪些主資料、時間結構、Planning Level、Key Figure，以及 Version 等內容。當使用者開啟需求、供應或分析 App 時，系統會載入對應的 Planning Area，讓 App 知道要針對哪些資料、維度與指標進行規劃或分析。",
    tables: [
      {
        caption: "Fiori App 與 Planning Area 的關係",
        headers: ["層次", "角色", "例子", "一句話"],
        rows: [
          ["Fiori App", "執行規劃或分析任務", "需求分析、供應檢查、情境比較", "App 是工具本身。"],
          ["Planning Area", "資料模型容器", "Time Profile、Master Data、Planning Levels、Key Figures", "定義 App 要讀哪些資料與怎麼計算。"],
        ],
      },
    ],
  },
  {
    id: 2,
    en: "Time Profile",
    zh: "時間維度",
    tagline: "用什麼時間粒度看資料",
    summary:
      "定義計畫資料要以什麼時間粒度儲存與分析（Day / Week / Month / Quarter / Year）。",
    image: "time%20profile.png",
    imageAlt: "Time Periods for a Time Profile with 6 Time Levels",
    tables: [
      {
        caption: "不同流程適合的 Time Bucket",
        headers: ["業務問題", "適合 Time Bucket"],
        rows: [
          ["S&OP 看未來供需趨勢", "Month / Quarter"],
          ["Demand Planning 看月需求", "Month"],
          ["R&S 看短期訂單與供應", "Day / Week"],
          ["產能排程與缺料回應", "Day / Week"],
        ],
      },
      {
        caption: "範例：以「月」為單位規劃需求",
        headers: ["Month", "Product", "Consensus Demand"],
        rows: [
          ["2026-08", "PMIC_A", "100,000"],
          ["2026-09", "PMIC_A", "120,000"],
          ["2026-10", "PMIC_A", "150,000"],
        ],
      },
    ],
  },
  {
    id: 3,
    en: "Master Data Types",
    zh: "供應鏈主資料",
    tagline: "供應鏈裡有哪些物件",
    summary:
      "像資料庫主檔 Table，描述供應鏈中的實體物件：Product、Customer、Location、Resource、Source / Production / Transportation relationship。",
    tables: [
      {
        caption: "Product 產品",
        headers: [
          "Product ID",
          "Product Name",
          "Product Family",
          "Package Type",
          "Lifecycle",
        ],
        rows: [
          ["PMIC_A", "Power IC A", "PMIC", "QFN", "MP"],
          ["PMIC_B", "Power IC B", "PMIC", "WLCSP", "NPI"],
          ["WAFER_A", "Wafer for PMIC_A", "Wafer", "8 inch", "MP"],
          ["LEADFRAME_QFN", "QFN Lead Frame", "Component", "QFN", "Active"],
        ],
      },
      {
        caption: "Customer 客戶",
        headers: ["Customer ID", "Customer Name", "Region", "Priority"],
        rows: [
          ["CUST_ASUS", "ASUS", "Taiwan", "High"],
          ["CUST_DELL", "Dell", "US", "High"],
          ["CUST_DISTY_A", "Distributor A", "Asia", "Medium"],
        ],
      },
      {
        caption: "Location 地點",
        headers: ["Location ID", "Location Name", "Location Type"],
        rows: [
          ["FOUNDRY_TW_A", "台灣晶圓代工廠 A", "Foundry"],
          ["OSAT_TW_A", "台灣封測廠 A", "OSAT"],
          ["DC_TW", "台灣成品倉", "Distribution Center"],
          ["CUST_SITE_US", "美國客戶倉", "Customer Site"],
        ],
      },
      {
        caption: "Resource / Capacity 資源與產能",
        headers: ["Resource ID", "Resource Name", "Location", "Capacity Type"],
        rows: [
          ["FOUNDRY_8INCH_A", "8 吋晶圓產能", "FOUNDRY_TW_A", "Wafer Capacity"],
          ["OSAT_QFN_LINE_A", "QFN 封裝線", "OSAT_TW_A", "Assembly Capacity"],
          ["FT_TESTER_A", "Final Test Tester A", "OSAT_TW_A", "Testing Capacity"],
        ],
      },
      {
        caption: "Production Source 生產來源",
        headers: ["Product", "Location", "Resource", "Lead Time", "Cost"],
        rows: [
          ["PMIC_A", "OSAT_TW_A", "OSAT_QFN_LINE_A", "14 days", "0.8 USD"],
          ["PMIC_A", "OSAT_MY_A", "OSAT_QFN_LINE_B", "21 days", "0.7 USD"],
        ],
      },
      {
        caption: "Transportation Source 運輸來源",
        headers: ["Product", "From", "To", "Lead Time", "Cost"],
        rows: [
          ["PMIC_A", "OSAT_TW_A", "DC_TW", "3 days", "0.05 USD"],
          ["PMIC_A", "DC_TW", "CUST_SITE_US", "7 days", "0.2 USD"],
        ],
      },
      {
        caption: "Component / BOM 元件關係",
        headers: ["Finished Product", "Component", "Usage Qty"],
        rows: [
          ["PMIC_A", "WAFER_A", "0.002 wafer"],
          ["PMIC_A", "LEADFRAME_QFN", "1"],
          ["PMIC_A", "BONDING_WIRE", "0.01"],
          ["PMIC_A", "TAPE_REEL", "1"],
        ],
      },
    ],
  },
  {
    id: 4,
    en: "Attributes",
    zh: "主資料欄位",
    tagline: "這些物件有哪些欄位",
    summary:
      "Master Data Type 裡的欄位，例如 Product 有 Product Family、Package Type；Customer 有 Region、Priority。",
    tables: [
      {
        caption: "Attribute 的用途",
        headers: ["Attribute", "用途"],
        rows: [
          ["Product Family", "依產品線彙總需求"],
          ["Package Type", "分析不同封裝型態產能"],
          ["Lifecycle Status", "區分 NPI / MP / EOL"],
          ["Customer Priority", "做 allocation"],
          ["Location Type", "區分 foundry / OSAT / DC"],
          ["Lead Time", "計算供應提前期"],
          ["Cost", "做成本比較"],
        ],
      },
    ],
  },
  {
    id: 5,
    en: "Planning Levels",
    zh: "資料儲存與分析粒度",
    tagline: "用哪些維度組合來存與看資料",
    summary:
      "一組 attributes，決定 key figure 要存在哪個顆粒度，也就是「這個數值要用什麼維度來看」。",
    tables: [
      {
        caption: "需求 Planning Level：Month + Product + Customer",
        headers: ["Month", "Product", "Customer", "Consensus Demand"],
        rows: [
          ["2026-08", "PMIC_A", "ASUS", "50,000"],
          ["2026-08", "PMIC_A", "Dell", "70,000"],
        ],
      },
      {
        caption: "庫存 Planning Level：Week + Product + Location",
        headers: ["Week", "Product", "Location", "Projected Inventory"],
        rows: [
          ["2026-W32", "PMIC_A", "DC_TW", "30,000"],
          ["2026-W33", "PMIC_A", "DC_TW", "20,000"],
        ],
      },
      {
        caption: "產能 Planning Level：Month + Resource + Location",
        headers: ["Month", "Resource", "Location", "Available Capacity"],
        rows: [
          ["2026-08", "FT_TESTER_A", "OSAT_TW_A", "600,000"],
          ["2026-08", "OSAT_QFN_LINE_A", "OSAT_TW_A", "800,000"],
        ],
      },
    ],
  },
  {
    id: 6,
    en: "Key Figures",
    zh: "供應鏈指標",
    tagline: "要分析與計算的數值",
    summary:
      "Planning View 裡真正被拿來分析、計算、模擬的數值指標。",
    note:
      "Projected Inventory = 期初庫存 + 供應收貨 − 需求，例：30,000 + 100,000 − 120,000 = 10,000。",
    tables: [
      {
        caption: "常見 Key Figures",
        headers: ["Key Figure", "中文理解", "範例"],
        rows: [
          ["Sales Forecast", "銷售預測", "業務預估需求"],
          ["Consensus Demand", "共識需求", "業務、供應鏈、財務共識後的需求"],
          ["Supply Receipts", "供應收貨", "預計進貨或生產完成量"],
          ["Component Usage", "元件使用量", "生產 PMIC_A 需要多少 Lead Frame"],
          ["Capacity Usage", "產能使用量", "使用多少 test slot"],
          ["Available Capacity", "可用產能", "測試機台可用時數或數量"],
          ["Projected Inventory", "預估庫存", "未來庫存水位"],
          ["Shortage / Gap", "缺口", "需求 − 可供應量"],
          ["Revenue", "營收", "需求量 × ASP"],
          ["Cost", "成本", "生產、運輸、庫存成本"],
        ],
      },
    ],
  },
  {
    id: 7,
    en: "Versions / Scenarios",
    zh: "版本與情境模擬",
    tagline: "用不同假設比較不同計畫結果",
    summary:
      "做不同計畫假設的比較。Version 像獨立版本 / 長期基準；Scenario 像 Planning View 裡快速建立的短期模擬。",
    tables: [
      {
        caption: "Version 正式版本 / 長期比較",
        headers: ["Version", "說明"],
        rows: [
          ["Baseline", "目前正式計畫"],
          ["Upside", "樂觀需求版本"],
          ["Downside", "保守需求版本"],
          ["Budget", "財務預算版"],
          ["Executive Approved", "高層核准版"],
        ],
      },
      {
        caption: "Scenario 短期假設模擬",
        headers: ["Scenario", "假設"],
        rows: [
          ["Demand +20%", "客戶需求增加 20%"],
          ["Foundry Capacity -10%", "晶圓產能下降 10%"],
          ["OSAT Delay 2 Weeks", "封測交期延後兩週"],
          ["Priority Customer Allocation", "優先供應高 priority 客戶"],
          ["Build Ahead Inventory", "提前建立安全庫存"],
        ],
      },
      {
        caption: "情境模擬比較（PMIC_A 2026-08）",
        headers: ["情境", "Demand", "Supply", "Shortage", "備註"],
        rows: [
          ["A Baseline", "120,000", "100,000", "20,000", "基準"],
          ["B Demand +20%", "144,000", "100,000", "44,000", "需求上升"],
          ["C 加開 OSAT 產能", "144,000", "130,000", "14,000", "成本 +15%"],
          [
            "D 優先分配高價值客戶",
            "144,000",
            "130,000",
            "14,000",
            "ASUS 全供 / Dell 部分 / Disty 延後",
          ],
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 完整範例：PMIC_A 未來三個月供需規劃                                  */
/* ------------------------------------------------------------------ */
const PA_EXAMPLE = {
  intro:
    "規劃 PMIC_A 未來 3 個月供需，一次串起 Planning Area 的所有元件。",
  rows: [
    {
      title: "Time Profile",
      text: "Month：2026-08、2026-09、2026-10。",
    },
    {
      title: "Master Data Types",
      text:
        "Product：PMIC_A｜Customer：ASUS、Dell｜Location：FOUNDRY_TW_A、OSAT_TW_A、DC_TW｜Resource：FOUNDRY_8INCH_A、FT_TESTER_A｜Source：OSAT_TW_A → DC_TW → Customer。",
    },
    {
      title: "Attributes",
      text:
        "Product Family=PMIC、Package Type=QFN、Customer Priority=High、Location Type=OSAT / DC、Resource Type=Testing Capacity。",
    },
    {
      title: "Planning Levels",
      text:
        "Demand=Month+Product+Customer；Supply=Month+Product+Location；Capacity=Month+Resource+Location；Inventory=Month+Product+Location。",
    },
    {
      title: "Key Figures",
      text:
        "Demand 120,000、Supply 100,000 → Shortage 20,000；Available Capacity 110,000、Capacity Usage 120,000 → Capacity Gap 10,000。",
      highlight: true,
    },
    {
      title: "Scenario 模擬",
      text: "以不同假設比較缺口與成本，可在 Versions / Scenarios 元件中查看 PMIC_A 情境比較。",
      highlight: true,
    },
  ],
};
