# SAP IBP Planning Area 架構介紹與範例

```text
Planning Area
 ├─ Time Profile
 ├─ Master Data Types
 │   ├─ Product
 │   ├─ Customer
 │   ├─ Location
 │   ├─ Resource / Capacity
 │   └─ Source / Production / Transportation relationship
 ├─ Attributes
 ├─ Planning Levels
 ├─ Key Figures
 └─ Versions / Scenarios
```

## 核心概念

SAP IBP 的 **Planning Area** 可以理解成一個供應鏈計畫模型的容器。

它決定：

```text
用哪些主資料
+ 在哪些時間粒度
+ 以哪些維度
+ 計算哪些供應鏈指標
+ 支援哪些版本或情境比較
```

一句話理解：

> **Planning Area 決定：用哪些主資料、在哪些時間粒度、以哪些維度、計算哪些供應鏈指標，並支援不同版本或情境比較。**

---

# 1. Planning Area：整個計畫模型的容器

**Planning Area** 是 SAP IBP 裡最核心的模型設定。

它決定這個計畫模型要處理什麼業務流程，例如：

| Planning Area 用途 | 範例 |
|---|---|
| Demand Planning | 預測客戶需求 |
| S&OP | 中長期供需平衡 |
| Inventory Planning | 安全庫存與庫存水位 |
| Response & Supply / OBP | 短期供應、訂單、配置、限制式供應 |

## 半導體範例

一個 S&OP Planning Area 可能用來回答：

> 未來 18 個月，PMIC_A 的需求是否超過 foundry / OSAT / 測試產能？  
> 如果需求增加 20%，要不要加產能、延交、提高庫存或做客戶分配？

---

# 2. Time Profile：時間維度

**Time Profile** 定義計畫資料要以什麼時間粒度儲存與分析。

常見時間層級：

```text
Time Profile
 ├─ Day
 ├─ Week
 ├─ Month
 ├─ Quarter
 └─ Year
```

## 不同流程適合的 Time Bucket

| 業務問題 | 適合 Time Bucket |
|---|---|
| S&OP 看未來供需趨勢 | Month / Quarter |
| Demand Planning 看月需求 | Month |
| R&S 看短期訂單與供應 | Day / Week |
| 產能排程與缺料回應 | Day / Week |

## 範例

| Month | Product | Consensus Demand |
|---|---|---:|
| 2026-08 | PMIC_A | 100,000 |
| 2026-09 | PMIC_A | 120,000 |
| 2026-10 | PMIC_A | 150,000 |

這代表需求是以「月」為單位規劃。

---

# 3. Master Data Types：供應鏈主資料

**Master Data Types** 很像資料庫裡的主檔 Table，用來描述供應鏈中的實體物件。

例如：

```text
Product
Customer
Location
Resource / Capacity
Source / Production / Transportation Relationship
```

---

## 3.1 Product：產品

Product 代表你要規劃的產品、半成品、原物料或 component。

| Product ID | Product Name | Product Family | Package Type | Lifecycle Status |
|---|---|---|---|---|
| PMIC_A | Power IC A | PMIC | QFN | MP |
| PMIC_B | Power IC B | PMIC | WLCSP | NPI |
| WAFER_A | Wafer for PMIC_A | Wafer | 8 inch | MP |
| LEADFRAME_QFN | QFN Lead Frame | Component | QFN | Active |

在半導體 IC 設計公司裡，Product 不一定只有成品 IC，也可能包含：

```text
Finished Good：PMIC_A
Semi-finished：Die / Wafer
Component：Lead Frame、Bonding Wire、Mold Compound、Tape & Reel
```

---

## 3.2 Customer：客戶

Customer 代表需求來源，例如 OEM、ODM、代理商或區域市場。

| Customer ID | Customer Name | Region | Priority |
|---|---|---|---|
| CUST_ASUS | ASUS | Taiwan | High |
| CUST_DELL | Dell | US | High |
| CUST_DISTY_A | Distributor A | Asia | Medium |

在 Allocation Plan 裡，Customer Priority 可能會影響缺貨時誰先拿到貨。

---

## 3.3 Location：地點

Location 代表供應鏈中的節點，可以是工廠、倉庫、供應商、客戶地點、foundry、OSAT 等。

| Location ID | Location Name | Location Type |
|---|---|---|
| FOUNDRY_TW_A | 台灣晶圓代工廠 A | Foundry |
| OSAT_TW_A | 台灣封測廠 A | OSAT |
| DC_TW | 台灣成品倉 | Distribution Center |
| CUST_SITE_US | 美國客戶倉 | Customer Site |

半導體供應鏈常見 Location：

```text
Foundry → OSAT → Finished Goods Warehouse → Customer
```

---

## 3.4 Resource / Capacity：資源與產能

Resource 代表會限制供應能力的資源，例如產線、機台、測試機台、封裝產能、晶圓產能。

| Resource ID | Resource Name | Location | Capacity Type |
|---|---|---|---|
| FOUNDRY_8INCH_A | 8 吋晶圓產能 | FOUNDRY_TW_A | Wafer Capacity |
| OSAT_QFN_LINE_A | QFN 封裝線 | OSAT_TW_A | Assembly Capacity |
| FT_TESTER_A | Final Test Tester A | OSAT_TW_A | Testing Capacity |

## 產能範例

| Month | Resource | Available Capacity |
|---|---|---:|
| 2026-08 | FOUNDRY_8INCH_A | 50,000 wafers |
| 2026-08 | OSAT_QFN_LINE_A | 800,000 units |
| 2026-08 | FT_TESTER_A | 600,000 test slots |

---

## 3.5 Source / Production / Transportation Relationship：供應來源關係

這類 Master Data 用來描述：

```text
產品可以在哪裡生產？
產品從哪裡運到哪裡？
生產會消耗哪些 resource？
生產會使用哪些 component？
不同來源的 lead time / cost / priority 是什麼？
```

## Production Source 範例

| Product | Location | Resource | Production Lead Time | Production Cost |
|---|---|---|---:|---:|
| PMIC_A | OSAT_TW_A | OSAT_QFN_LINE_A | 14 days | 0.8 USD |
| PMIC_A | OSAT_MY_A | OSAT_QFN_LINE_B | 21 days | 0.7 USD |

這代表 PMIC_A 可以在不同 OSAT 生產，成本與 lead time 不同。

## Transportation Source 範例

| Product | From Location | To Location | Transport Lead Time | Transport Cost |
|---|---|---|---:|---:|
| PMIC_A | OSAT_TW_A | DC_TW | 3 days | 0.05 USD |
| PMIC_A | DC_TW | CUST_SITE_US | 7 days | 0.2 USD |

## Component Relationship / BOM 範例

| Finished Product | Component | Usage Quantity |
|---|---|---:|
| PMIC_A | WAFER_A | 0.002 wafer |
| PMIC_A | LEADFRAME_QFN | 1 |
| PMIC_A | BONDING_WIRE | 0.01 |
| PMIC_A | TAPE_REEL | 1 |

這些關係會影響 supply planning。  
例如 Lead Frame 缺料時，PMIC_A 即使有需求，也不一定能生產。

---

# 4. Attributes：主資料欄位

**Attributes** 是 Master Data Type 裡的欄位。

例如 Product 有 Product Family、Package Type；Customer 有 Region、Priority；Location 有 Location Type。

## 範例

```text
Product Master Data Type
 ├─ Product ID
 ├─ Product Name
 ├─ Product Family
 ├─ Package Type
 ├─ Lifecycle Status
 └─ Unit Cost
```

## Attribute 的用途

| Attribute | 用途 |
|---|---|
| Product Family | 依產品線彙總需求 |
| Package Type | 分析不同封裝型態產能 |
| Lifecycle Status | 區分 NPI / MP / EOL |
| Customer Priority | 做 allocation |
| Location Type | 區分 foundry / OSAT / DC |
| Lead Time | 計算供應提前期 |
| Cost | 做成本比較 |

---

# 5. Planning Levels：資料儲存與分析的粒度

**Planning Level** 是一組 attributes，用來決定 key figure 要存在哪個顆粒度。

也就是說，它決定：

```text
這個數值要用什麼維度來看？
```

---

## 例子 1：需求規劃 Planning Level

```text
MONTH + PRODUCT + CUSTOMER
```

代表需求是用「月 + 產品 + 客戶」來看。

| Month | Product | Customer | Consensus Demand |
|---|---|---|---:|
| 2026-08 | PMIC_A | ASUS | 50,000 |
| 2026-08 | PMIC_A | Dell | 70,000 |

---

## 例子 2：庫存 Planning Level

```text
WEEK + PRODUCT + LOCATION
```

代表庫存是用「週 + 產品 + 地點」來看。

| Week | Product | Location | Projected Inventory |
|---|---|---|---:|
| 2026-W32 | PMIC_A | DC_TW | 30,000 |
| 2026-W33 | PMIC_A | DC_TW | 20,000 |

---

## 例子 3：產能 Planning Level

```text
MONTH + RESOURCE + LOCATION
```

代表產能是用「月 + 資源 + 地點」來看。

| Month | Resource | Location | Available Capacity |
|---|---|---|---:|
| 2026-08 | FT_TESTER_A | OSAT_TW_A | 600,000 |
| 2026-08 | OSAT_QFN_LINE_A | OSAT_TW_A | 800,000 |

---

# 6. Key Figures：供應鏈指標

**Key Figure** 是 Planning View 裡真正被拿來分析、計算、模擬的數值指標。

## 常見 Key Figures

| Key Figure | 中文理解 | 範例 |
|---|---|---|
| Sales Forecast | 銷售預測 | 業務預估需求 |
| Consensus Demand | 共識需求 | 業務、供應鏈、財務共識後的需求 |
| Supply Receipts | 供應收貨 | 預計進貨或生產完成量 |
| Production Receipts | 生產收貨 | 生產完成數量 |
| Component Usage | 元件使用量 | 生產 PMIC_A 需要多少 Lead Frame |
| Capacity Usage | 產能使用量 | 使用多少 test slot |
| Available Capacity | 可用產能 | 測試機台可用時數或數量 |
| Projected Inventory | 預估庫存 | 未來庫存水位 |
| Shortage / Gap | 缺口 | 需求 - 可供應量 |
| Revenue | 營收 | 需求量 × ASP |
| Cost | 成本 | 生產、運輸、庫存成本 |

---

## Key Figure 範例

| Month | Product | Customer | Consensus Demand |
|---|---|---|---:|
| 2026-08 | PMIC_A | ASUS | 50,000 |
| 2026-08 | PMIC_A | Dell | 70,000 |

| Month | Product | Location | Supply Receipts |
|---|---|---|---:|
| 2026-08 | PMIC_A | DC_TW | 100,000 |

| Month | Product | Location | Projected Inventory |
|---|---|---|---:|
| 2026-08 | PMIC_A | DC_TW | 20,000 |

## 簡單計算邏輯

```text
Projected Inventory
= Beginning Inventory
+ Supply Receipts
- Demand
```

例如：

```text
期初庫存 30,000
+ 供應收貨 100,000
- 共識需求 120,000
= 期末預估庫存 10,000
```

---

# 7. Versions / Scenarios：版本與情境模擬

**Versions / Scenarios** 用來做不同計畫假設的比較。

---

## 7.1 Version：正式版本或長期比較版本

Version 比較像「獨立版本」，常用於保存不同計畫基準。

| Version | 說明 |
|---|---|
| Baseline | 目前正式計畫 |
| Upside | 樂觀需求版本 |
| Downside | 保守需求版本 |
| Budget | 財務預算版 |
| Executive Approved | 高層核准版 |

---

## 7.2 Scenario：短期假設模擬

Scenario 比較像在 Excel Add-in 或 Planning View 裡快速建立的模擬情境。

| Scenario | 假設 |
|---|---|
| Demand +20% | 客戶需求增加 20% |
| Foundry Capacity -10% | 晶圓產能下降 10% |
| OSAT Delay 2 Weeks | 封測交期延後兩週 |
| Priority Customer Allocation | 優先供應高 priority 客戶 |
| Build Ahead Inventory | 提前建立安全庫存 |

---

# 8. 完整範例：PMIC_A 未來三個月供需規劃

假設公司要規劃 PMIC_A 未來 3 個月供需。

---

## Step 1：Time Profile

```text
Month：2026-08、2026-09、2026-10
```

---

## Step 2：Master Data Types

```text
Product：PMIC_A
Customer：ASUS、Dell
Location：FOUNDRY_TW_A、OSAT_TW_A、DC_TW
Resource：FOUNDRY_8INCH_A、FT_TESTER_A
Source：OSAT_TW_A → DC_TW → Customer
```

---

## Step 3：Attributes

```text
Product Family = PMIC
Package Type = QFN
Customer Priority = High
Location Type = OSAT / DC
Resource Type = Testing Capacity
```

---

## Step 4：Planning Levels

```text
Demand Level：
Month + Product + Customer

Supply Level：
Month + Product + Location

Capacity Level：
Month + Resource + Location

Inventory Level：
Month + Product + Location
```

---

## Step 5：Key Figures

| Month | Product | Customer | Consensus Demand |
|---|---|---|---:|
| 2026-08 | PMIC_A | ASUS | 50,000 |
| 2026-08 | PMIC_A | Dell | 70,000 |

| Month | Product | Location | Supply Receipts |
|---|---|---|---:|
| 2026-08 | PMIC_A | DC_TW | 100,000 |

| Month | Resource | Location | Available Capacity | Capacity Usage |
|---|---|---|---:|---:|
| 2026-08 | FT_TESTER_A | OSAT_TW_A | 110,000 | 120,000 |

系統可以看出：

```text
Demand = 120,000
Supply Receipts = 100,000
Shortage = 20,000

Available Capacity = 110,000
Capacity Usage = 120,000
Capacity Gap = 10,000
```

---

## Step 6：Scenario 模擬

### Scenario A：Baseline

```text
Demand = 120,000
Supply = 100,000
Shortage = 20,000
```

### Scenario B：Demand +20%

```text
Demand = 144,000
Supply = 100,000
Shortage = 44,000
```

### Scenario C：加開 OSAT 產能

```text
Demand = 144,000
Supply = 130,000
Shortage = 14,000
Cost Increase = +15%
```

### Scenario D：優先分配高價值客戶

```text
ASUS：fully allocated
Dell：partial allocation
Distributor：delayed

結果：
Revenue Loss 降低，但 Service Level 不平均
```

---

# 9. 最終關係整理

```text
Planning Area
= 一個供應鏈計畫模型

Time Profile
= 用什麼時間粒度看資料

Master Data Types
= 供應鏈裡有哪些物件，例如產品、客戶、地點、資源

Attributes
= 這些物件有哪些欄位，例如產品線、封裝型態、客戶優先級

Planning Levels
= 我要用哪些維度組合來存資料與看資料

Key Figures
= 我要分析與計算的數值，例如需求、供應、庫存、產能、缺口、成本

Versions / Scenarios
= 用不同假設比較不同計畫結果
```

---

# 10. 一句話總結

SAP IBP 的系統架構不是單純建幾張表，而是先建立一個 **Planning Area**，再定義：

```text
什麼時間粒度
+ 哪些主資料
+ 哪些分析維度
+ 哪些供應鏈指標
+ 哪些版本與情境
```

最後讓使用者可以在 Planning View / Excel Add-in / IBP Apps 裡做：

```text
需求預測
供需平衡
庫存分析
產能檢查
缺口分析
成本比較
情境模擬
高層決策
```
