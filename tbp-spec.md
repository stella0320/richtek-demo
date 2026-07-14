# SAP IBP S&OP 流程重點整理

> 依照圖中灰色區塊整理：Demand Planning、Demand Sensing、Demand Review、Inventory Optimization、Supply Review、Reconciliation Review、Management Business Review。

---

## 整體流程

```text
1. Data Preparation
   資料準備
        ↓
2. Demand Planning
   需求規劃
        ↓
3. Demand Sensing
   短期需求感知
        ↓
4. Demand Review
   需求審查 / 共識需求
        ↓
5. Inventory Optimization
   庫存最佳化
        ↓
6. Supply Review
   供應審查 / 受限需求計畫
        ↓
7. Reconciliation Review
   供需與財務調和審查
        ↓
8. Management Business Review
   管理層業務審查 / 最終決策
```

---

# 1. Data Preparation｜資料準備

這是 S&OP 的起點。

主要是準備後續規劃會用到的資料，例如：

| 類型 | 例子 |
|---|---|
| Sales History | 歷史銷售 / 出貨資料 |
| Financial Plan | 財務計畫 |
| Marketing Plan | 行銷計畫 |
| Sales Plan | 業務計畫 |
| Master Data | product、customer、location、resource |
| Supply Data | 產能、庫存、供應來源、lead time |
| Cost / Revenue Data | 成本、售價、毛利、營收 |

這一步回答的是：

> 規劃需要的資料是否完整、正確、可用？

半導體例子：

```text
準備 PMIC_A 的歷史銷售、客戶 forecast、目前庫存、foundry capacity、OSAT capacity、lead frame 供應量、成本與毛利資料。
```

---

# 2. Demand Planning｜需求規劃

Demand Planning 是建立初版需求計畫。

圖中 Demand Planning 內包含：

| 項目 | 說明 |
|---|---|
| Statistical Forecast | 系統根據歷史銷售推估的統計預測 |
| Local Demand | 區域 / 業務單位輸入的需求 |
| Global Demand | 全球彙總後的需求 |
| Global Demand Plan | 整合後的全球需求計畫 |

這一步回答的是：

> 未來可能需要多少？需求趨勢是什麼？

主要輸出：

> **Global Demand Plan｜全球需求計畫**

半導體例子：

```text
根據歷史銷售與客戶 forecast，PMIC_A 未來 6 個月需求預估為每月 120K。
```

---

# 3. Demand Sensing｜短期需求感知

Demand Sensing 是用更短期、更接近實際市場的訊號修正需求。

圖中 Demand Sensing 的輸入包含：

| 輸入 | 說明 |
|---|---|
| Global Demand Plan | 原本的需求計畫 |
| Open Orders | 尚未完成的客戶訂單 |

輸出是：

> **Sensed Demand｜感知需求**

這一步回答的是：

> 根據短期訂單與市場訊號，原本的需求計畫是否需要修正？

半導體例子：

```text
原本 PMIC_A 下月需求預估 120K，
但 open orders 已經快速增加，
Demand Sensing 修正短期 sensed demand 為 135K。
```

---

# 4. Demand Review｜需求審查 / Consensus Demand

Demand Review 是把 Demand Planning 和 Demand Sensing 的結果拿來審查，形成公司認可的需求數字。

圖中 Demand Review 的輸出是：

> **Consensus Demand Plan｜共識需求計畫**

這一步通常會由以下角色一起討論：

- Sales
- Marketing
- Demand Planner
- Product Manager
- Supply Chain Planner
- Finance

主要審查項目：

| 項目 | 說明 |
|---|---|
| Forecast Accuracy | 預測準確度 |
| Demand Outlier | 是否有異常需求 |
| Customer Forecast Reliability | 客戶 forecast 是否可靠 |
| NPI / EOL | 新產品導入 / 舊產品退場 |
| Upside / Downside | 需求上修或下修風險 |
| Sales / Marketing Input | 業務與行銷活動是否合理 |

這一步回答的是：

> 公司正式認可的需求數字是多少？

半導體例子：

```text
業務預估 PMIC_A 每月 130K，
Demand Sensing 顯示短期需求 135K，
但供應鏈根據客戶過去 pull-in / push-out 行為，建議調整為 125K。
最後 Consensus Demand Plan 設為 125K。
```

---

# 5. Inventory Optimization｜庫存最佳化

Inventory Optimization 是在需求與供應不確定的情況下，決定合理的庫存水位。

圖中 Inventory Optimization 的輸出是：

> **Inventory Plan｜庫存計畫**

這一步回答的是：

> 為了達成服務水準，又不要庫存過高，安全庫存與目標庫存應該設多少？

常看項目：

| 項目 | 說明 |
|---|---|
| Safety Stock | 安全庫存 |
| Target Inventory | 目標庫存 |
| Service Level | 服務水準 |
| Demand Variability | 需求波動 |
| Supply Variability | 供應波動 |
| Lead Time | 補貨 / 生產 / 運輸前置時間 |
| Inventory Holding Cost | 庫存持有成本 |

半導體例子：

```text
PMIC_A 是高毛利、客戶要求高服務水準的產品，
因此系統建議提高安全庫存。
PMIC_C 是低毛利且需求不穩定產品，
因此降低庫存水位，避免呆滯風險。
```

---

# 6. Supply Review｜供應審查 / 受限需求計畫

Supply Review 是根據 Consensus Demand Plan 和 Inventory Plan，檢查供應鏈是否能滿足需求。

圖中 Supply Review 的輸出是：

> **Constrained Demand Plan｜受限需求計畫**

這一步會看：

| 供應面項目 | 例子 |
|---|---|
| Inventory | 成品庫存、半成品庫存、原物料庫存 |
| Capacity | foundry capacity、OSAT capacity、testing capacity |
| Material | wafer、substrate、lead frame、bonding wire、mold compound |
| Production Lead Time | wafer cycle time、assembly cycle time、test cycle time |
| Transportation Lead Time | 工廠到倉庫、倉庫到客戶 |
| Source of Supply | foundry、OSAT、工廠、倉庫 |
| Safety Stock | 安全庫存水位 |

這一步回答的是：

> 這個共識需求，供應鏈做不做得出來？如果做不出來，能滿足多少？

半導體例子：

```text
Consensus Demand：125K
Foundry capacity：120K
OSAT capacity：100K
Lead frame availability：90K

所以實際可滿足量可能只有 90K，
形成 Constrained Demand Plan。
```

---

# 7. Reconciliation Review｜調和審查 / 供需整合審查

Reconciliation Review 是把需求、供應、庫存與財務結果放在一起檢查。

圖中這一步同時看：

- **Constrained Demand Plan**
- **Consensus Demand Plan**

也就是比較：

> 原本公司想要的需求是多少？  
> 受限後實際能滿足的需求是多少？  
> 中間差距要怎麼處理？

這一步回答的是：

> 供需缺口、庫存影響、財務影響是否能被管理層接受？

常見審查項目：

| 項目 | 說明 |
|---|---|
| Demand Gap | 共識需求與受限需求的差距 |
| Supply Gap | 供應能力不足的地方 |
| Revenue Impact | 營收影響 |
| Margin Impact | 毛利影響 |
| Inventory Impact | 庫存水位影響 |
| Service Level Impact | 客戶服務水準影響 |
| Risk | 供應風險、需求風險、庫存風險 |

半導體例子：

```text
Consensus Demand 是 125K，
但 Constrained Demand Plan 只能支援 90K。

缺口 35K 會造成營收下降。
Planner 需要提出幾種方案：
1. 加價取得 lead frame
2. 改用第二供應商
3. 優先供應高毛利客戶
4. 延後低優先客戶需求
```

---

# 8. Management Business Review｜管理層業務審查 / 最終決策

Management Business Review 是 S&OP 的決策點。

圖中輸出是：

> **Final Consensus Demand｜最終共識需求**

這一步由管理層決定最終方案。

可能決策包括：

- 最終需求採用多少
- 哪些需求要滿足
- 哪些缺口接受
- 哪些客戶優先
- 是否加產能
- 是否增加庫存
- 是否調整產品組合
- 是否接受較高成本
- 是否調整營收或毛利目標

這一步回答的是：

> 公司最後要採用哪個供需方案？

半導體例子：

```text
管理層決定：
1. PMIC_A 最終需求採用 115K
2. 保護車用與工控客戶
3. 消費性客戶需求延後
4. 加價取得部分 lead frame 供應
5. 接受短期毛利下降，但保護策略客戶關係
```

---

# S&OP 最終完整流程圖

```text
Data Preparation
資料準備
    ↓
Demand Planning
建立 Global Demand Plan
    ↓
Demand Sensing
修正短期 Sensed Demand
    ↓
Demand Review
形成 Consensus Demand Plan
    ↓
Inventory Optimization
形成 Inventory Plan
    ↓
Supply Review
形成 Constrained Demand Plan
    ↓
Reconciliation Review
比較 Consensus Demand Plan vs Constrained Demand Plan
    ↓
Management Business Review
決定 Final Consensus Demand
```

---

# S&OP 每階段一句話

| 順序 | 階段 | 一句話 |
|---:|---|---|
| 1 | Data Preparation | 規劃資料準備好了嗎？ |
| 2 | Demand Planning | 未來可能賣多少？ |
| 3 | Demand Sensing | 短期真實需求有沒有變？ |
| 4 | Demand Review | 公司認可的需求是多少？ |
| 5 | Inventory Optimization | 庫存水位要設多少才合理？ |
| 6 | Supply Review | 供應能力能支援多少需求？ |
| 7 | Reconciliation Review | 需求、供應、庫存、財務結果能否對齊？ |
| 8 | Management Business Review | 管理層最後決定採用哪個需求與供應方案？ |

---

# 半導體版總例子

## Step 1：Data Preparation

```text
準備 PMIC_A 的歷史銷售、客戶 forecast、open orders、成品庫存、foundry capacity、OSAT capacity、lead frame 供應量、成本與毛利資料。
```

## Step 2：Demand Planning

```text
統計預測 + 業務預測後，
Global Demand Plan = 每月 120K。
```

## Step 3：Demand Sensing

```text
根據 open orders，
短期需求上修，
Sensed Demand = 下月 135K。
```

## Step 4：Demand Review

```text
業務、產品、供應鏈討論後，
Consensus Demand Plan = 每月 125K。
```

## Step 5：Inventory Optimization

```text
因為 PMIC_A 是高優先產品，
設定較高 safety stock，
Inventory Plan 建議保留 20K 安全庫存。
```

## Step 6：Supply Review

```text
Consensus Demand：125K
Safety Stock Target：20K
Foundry capacity：120K
OSAT capacity：100K
Lead frame availability：90K

結果可滿足量只有 90K，
Constrained Demand Plan = 90K。
```

## Step 7：Reconciliation Review

```text
Consensus Demand：125K
Constrained Demand：90K
Gap：35K

需要評估：
營收損失、毛利影響、客戶優先順序、是否加價取得材料。
```

## Step 8：Management Business Review

```text
管理層最後決定：
Final Consensus Demand = 115K

其中：
高毛利客戶優先滿足，
部分低優先客戶延後，
並接受短期成本上升。
```

---

# 最短記憶版

```text
S&OP：
資料 → 需求 → 短期感知 → 共識 → 庫存 → 供應受限 → 調和審查 → 管理決策
```

更白話：

> **先估需求，再修正短期需求，形成共識需求；接著檢查庫存與供應能力，找出受限後能滿足多少；最後把供需缺口與財務影響交給管理層決策。**
