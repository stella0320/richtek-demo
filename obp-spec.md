# SAP IBP R&S / OBP 流程順序大綱

## 整體流程

```text
1. Demand Input
   需求輸入
        ↓
2. Forecast Consumption
   預測消耗
        ↓
3. Supply Planning Run
   供應規劃執行
        ↓
4. Review & Refining Plan
   檢查與修正計畫
        ↓
5. Allocation Planning
   有限供給分配
        ↓
6. Response Planning
   訂單與供應變動回應
        ↓
7. Deployment Planning
   短期供給部署 / 調撥規劃
        ↓
8. ERP Execution
   實際執行
```

---

# 1. Demand Input｜需求輸入

這是 R&S / OBP 的起點。

需求來源主要有兩種：

| Demand Type | 說明 |
|---|---|
| Forecast | 預測需求，通常來自 Demand Planning / S&OP |
| Sales Order | 實際客戶訂單 |

這個階段回答的是：

> 未來需要多少？哪些需求已經變成實際訂單？

例如：

```text
Forecast：PMIC_A 100,000 顆
Sales Order：PMIC_A 30,000 顆
```

---

# 2. Forecast Consumption｜預測消耗

這一步是避免 forecast 和 sales order 重複計算。

因為 sales order 通常代表 forecast 的一部分已經實現。

例如：

```text
原 Forecast：100,000
Sales Order：30,000
Open Forecast：70,000
總需求仍是 100,000，不是 130,000
```

這個階段回答的是：

> 實際訂單進來後，還剩多少 forecast 需要保留？

---

# 3. Supply Planning Run｜供應規劃執行

這是 OBP 的核心計算階段。

系統會把需求、供給、庫存、產能、物料、物流 lead time、成本與限制一起納入計算。

主要輸入包括：

| 類型 | 例子 |
|---|---|
| Demand | forecast、sales order |
| Supply | stock、planned order、purchase requisition、production order |
| Master Data | product、location、resource、transportation lane、source of supply |
| Constraints | 產能限制、物料限制、allocation constraint、物流限制 |
| Lead Time | production lead time、transportation lead time、component lead-time offset |

主要輸出包括：

| 輸出 | 說明 |
|---|---|
| Planned Order | 計畫生產訂單 |
| Purchase Requisition | 採購請購 |
| Stock Transfer Requisition，STR | 庫存調撥需求 |
| Projected Stock | 預計庫存 |
| Capacity Usage | 產能使用量 |
| Supply Shortage | 供應缺口 |
| Gating Factor | 卡住供應的主要限制 |
| Demand Fulfillment | 需求滿足狀況 |

這個階段回答的是：

> 目前供應鏈做不做得出來？如果做不出來，缺在哪裡？

---

# 4. Review & Refining Plan｜檢查與修正計畫

Supply Planning Run 跑完後，系統會產生一版供應計畫，但這版不一定可以直接執行。

所以 planner 要開始檢查與修正。

常見檢查項目：

| 項目 | 目的 |
|---|---|
| Planning results | 看供應計畫結果是否合理 |
| Shortages | 分析缺口 |
| Pegging | 看需求被哪個供給滿足 |
| Gating factors | 找出真正卡住的限制 |
| Projected stock | 看未來庫存是否不足或過高 |
| Capacity usage | 看產能是否超載 |
| Order changes | 看是否需要調整訂單、來源或日期 |

可能的修正動作：

- 調整需求優先順序
- 調整 allocation
- 改 source of supply
- 改 transportation lane
- fix / unfix orders
- interactive planning
- 跑 simulation
- 重新執行 planning run

這個階段回答的是：

> 這版計畫哪裡不合理？要怎麼修到可用、可解釋、可執行？

---

# 5. Allocation Planning｜有限供給分配

當供給不足時，就需要 Allocation Planning。

它會根據 forecast、constraints、供應能力，建立 constrained supply plan 和 product allocation quantity。

這個階段回答的是：

> 如果供給不夠，有限供給要先分給誰？每個客戶、產品、市場最多可以拿多少？

例如：

| 客戶 | 需求 | Allocation |
|---|---:|---:|
| 車用客戶 A | 40,000 | 35,000 |
| 工控客戶 B | 30,000 | 25,000 |
| 消費性客戶 C | 30,000 | 10,000 |

重點是：

> Allocation Planning 是缺貨時的分配規則與分配上限。

---

# 6. Response Planning｜訂單與供應變動回應

Response Planning 是在實際訂單或供應變動發生後，重新確認能不能承諾。

觸發情境不只有需求變動，也包含供給變動。

常見情境：

| 變動 | 例子 |
|---|---|
| 需求變動 | 客戶追加訂單、提前交期、取消訂單 |
| 供給變動 | foundry delay、OSAT 產能下降、yield 變差 |
| 庫存變動 | 品檢失敗、庫存被保留、庫存短缺 |
| 物流變動 | transportation lead time 變長、路線延遲 |
| 規則變動 | allocation rule、customer priority 改變 |

Response Planning 會回答：

> 這張 sales order 能不能滿足？能滿足多少？什麼時候能交？如果不能，要怎麼調整？

例如客戶 A 追加急單：

```text
原本 allocation：35,000
已下單：35,000
追加需求：10,000
```

系統要判斷：

- 能不能多給？
- 是否違反 allocation？
- 是否影響其他客戶？
- 是否要改交期？
- 是否要換 source location？
- 是否要改 transportation lane？

---

# 7. Deployment Planning｜短期供給部署 / 調撥規劃

Deployment Planning 是更靠近執行端的短期流程。

它不是第一次開始看物流，而是把前面規劃好的供應進一步確認：

> 哪些供給是真的可靠、可以部署、可以進入實際調撥？

Deployment Planning 會用 **Available-to-Deploy Profile，ATD Profile** 判斷哪些 supply 可以用。

例如：

| Supply Type | 是否通常可部署 |
|---|---|
| 成品庫存 | 是 |
| 已確認 production order | 可能是 |
| purchase order | 可能是 |
| planned order | 通常否 |
| quality inspection stock | 通常否 |
| blocked stock | 否 |

Deployment Planning 有兩種：

| 類型 | 作用 |
|---|---|
| Deployment Run | 建立新的 STR，並把符合 ATD 條件的 STR 轉成 Deployment Requisition |
| Deployment Conversion Run | 不建立新 STR，只把既有 STR 轉成 Deployment Requisition |

這個階段回答的是：

> 短期內可靠的供給，現在要實際送去哪裡？

---

# 8. ERP Execution｜實際執行

當 Deployment Requisition 確認後，就可以傳到 SAP S/4HANA 或 ECC 進入執行。

可能後續產生：

| ERP Object | 中文 |
|---|---|
| Stock Transfer Order，STO | 庫存調撥單 |
| Delivery | 出貨單 |
| Goods Issue | 發貨 |
| Goods Receipt | 收貨 |
| Purchase Order | 採購單 |
| Production Order | 生產訂單 |

這個階段回答的是：

> 計畫確認後，實際怎麼下單、調撥、出貨、入庫？

---

# 最終完整流程圖

```text
Forecast / Sales Orders
        ↓
Forecast Consumption
        ↓
OBP Supply Planning Run
        ↓
產生 Planned Orders / PR / STR / Shortage / Projected Stock
        ↓
Review & Refining Plan
        ↓
修正 priority / allocation / source / order / constraint
        ↓
Allocation Planning
        ↓
決定有限供給分配給誰
        ↓
Response Planning
        ↓
確認實際訂單與供應變動後的承諾
        ↓
Deployment Planning
        ↓
確認哪些 supply 是 Available to Deploy
        ↓
Deployment Requisition
        ↓
SAP S/4HANA / ECC Execution
        ↓
STO / Delivery / Goods Movement
```

---

# 半導體版流程範例

假設 PMIC_A 未來 4 週需求 100,000 顆。

## Step 1：Demand Input

```text
Forecast：100,000
Sales Order：30,000
```

## Step 2：Forecast Consumption

```text
Sales Order 30,000 消耗 Forecast
Open Forecast：70,000
總需求：100,000
```

## Step 3：Supply Planning Run

系統檢查：

```text
成品庫存：20,000
Foundry supply：50,000
OSAT capacity：80,000
Lead frame availability：70,000
可滿足量：70,000
缺口：30,000
```

## Step 4：Review & Refining Plan

Planner 發現：

```text
Gating factor：Lead Frame shortage
受影響期間：Week 3-4
受影響客戶：Customer A / B / C
```

可能調整：

- 找替代 supplier
- 調整客戶優先順序
- 修改 allocation
- 改 source of supply
- 重新跑 planning run

## Step 5：Allocation Planning

因為只能供應 70,000，所以分配：

| 客戶 | 需求 | Allocation |
|---|---:|---:|
| 車用客戶 A | 40,000 | 35,000 |
| 工控客戶 B | 30,000 | 25,000 |
| 消費性客戶 C | 30,000 | 10,000 |

## Step 6：Response Planning

客戶 A 追加 10,000。

系統重新判斷：

```text
是否可以多給 A？
是否會影響 B / C？
是否違反 allocation？
是否可以改交期？
是否可以改供應來源？
```

## Step 7：Deployment Planning

確認短期可部署供給：

| Supply | Quantity | Status | ATD |
|---|---:|---|---|
| 成品庫存 | 20,000 | 已入庫 | 是 |
| 已確認 production order | 30,000 | 可靠 | 是 / 可能是 |
| planned order | 20,000 | 尚未確認 | 否 |
| 品檢中庫存 | 10,000 | QC | 否 |

只有 ATD supply 支援的 STR 會轉成 Deployment Requisition。

## Step 8：ERP Execution

Deployment Requisition 傳到 ERP 後，進入：

```text
Stock Transfer Order
        ↓
Delivery
        ↓
Goods Issue
        ↓
Goods Receipt
```

---

# 最短記憶版

| 順序 | 階段 | 一句話 |
|---:|---|---|
| 1 | Demand Input | 需求從哪裡來？ |
| 2 | Forecast Consumption | 實際訂單要消耗多少 forecast？ |
| 3 | Supply Planning Run | 供應鏈做不做得出來？ |
| 4 | Review & Refining Plan | 計畫哪裡不合理，要怎麼修？ |
| 5 | Allocation Planning | 供給不足時，先分給誰？ |
| 6 | Response Planning | 訂單或供應變動後，能不能承諾？ |
| 7 | Deployment Planning | 可靠供給現在要送去哪裡？ |
| 8 | ERP Execution | 實際調撥、出貨、入庫。 |

---

# 一句話總結

**先有需求 → 消耗 forecast → 跑供應 → 修計畫 → 分配有限供給 → 回應訂單變動 → 部署可靠供給 → ERP 執行。**
