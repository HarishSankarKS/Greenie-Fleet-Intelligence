# GREENIE — Admin Analytics & Pricing Dashboard
# Todo List — Derived from Marketplace PRD v1.0 & Design Doc v1.0
# Scope: Build or extend the existing Analytics tab in the admin portal to serve as a
# full Analytics & Pricing Dashboard for the Marketplace module.
#
# DECISION: Extend the existing /analytics page with tabs, OR create a new /marketplace-analytics
# route under the Commerce sidebar group (alongside the Waste Marketplace).
# Recommended: Create a NEW page — "Analytics & Pricing" — under Commerce.
# Reason: Analytics.jsx is fleet-focused (collections, drivers, sites). This dashboard is
# marketplace-focused (sales, revenue, material pricing, buyer data). Separate concerns.
# ─────────────────────────────────────────────────────────────────────────────────────────

## PHASE 1 — Data Foundation
# All chart data will be hardcoded (realistic mock data) using the same pattern as other pages.
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 1 — Create mock data file: src/utils/analyticsData.js
  [ ] 1.1  Revenue by material (last 6 months) — array of { month, 'Concrete Rubble', 'Steel', 'Brick', 'Timber', 'Plastic', 'Glass' }
  [ ] 1.2  Revenue by zone (N/S/E/W Transfer Stations) — pie/bar chart data
  [ ] 1.3  Monthly GMV total (Gross Merchandise Value) — line chart
  [ ] 1.4  Inventory turnover per material — avg days material sits before sale (target: 14→4 days)
  [ ] 1.5  Price trend data per material (last 6 months) — { month, material, pricePerTonne, informalMarketBaseline }
  [ ] 1.6  Order counts by status (Paid / Pending / Draft / Delivered) — donut chart
  [ ] 1.7  Top 5 buyers by revenue (company name + total spend)
  [ ] 1.8  EPR certificate count this month / total issued
  [ ] 1.9  WTN (Waste Transfer Note) count this month / total issued
  [ ] 1.10 Informal market price baseline data (concrete: ₹150–400/t, steel: ₹18,000–28,000/t etc.)

## PHASE 2 — Page Skeleton & Navigation
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 2 — Create page file: src/pages/MarketplaceAnalytics.jsx
  [ ] 2.1  Create the file with a basic export default function MarketplaceAnalytics()
  [ ] 2.2  Add page header: title "Analytics & Pricing Dashboard", subtitle with live date
  [ ] 2.3  Add tab navigation bar with 3 tabs:
             — "Revenue & Sales" (default active)
             — "Inventory & Turnover"
             — "Pricing Control"
  [ ] 2.4  Implement tab state using useState; conditionally render section per active tab

### Step 3 — Wire up Sidebar & Route
  [ ] 3.1  In Sidebar.jsx → Commerce group: add second item
             icon: BarChart2, to: '/marketplace-analytics', label: 'Analytics & Pricing'
  [ ] 3.2  In App.jsx: import MarketplaceAnalytics and add Route path="/marketplace-analytics"

## PHASE 3 — Tab 1: Revenue & Sales
# Source: PRD §6.7 "Analytics: revenue by material, by zone, by buyer category"
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 4 — KPI Strip (4 cards, top of page — always visible regardless of tab)
  [ ] 4.1  Card 1 — "Total Revenue This Month" (₹ formatted, incl. GST) + % change vs last month (green ↑)
  [ ] 4.2  Card 2 — "GMV All Time" — total gross merchandise value across all invoices
  [ ] 4.3  Card 3 — "Orders This Month" — count with Paid / Pending breakdown
  [ ] 4.4  Card 4 — "EPR Certs Issued" — count this month + total all time

### Step 5 — Revenue by Material Chart (Stacked Bar Chart)
  [ ] 5.1  Use Recharts BarChart with stacked bars — one color per material category
  [ ]      Colors must match CATEGORY_COLORS from siteInventory.js
  [ ] 5.2  X-axis: months (Sep → Mar), Y-axis: ₹ revenue
  [ ] 5.3  Legend below chart showing each material color
  [ ] 5.4  Tooltip showing per-material revenue breakdown on hover
  [ ] 5.5  Card header: "Revenue by Material" + date range selector (dropdown: Last 3M / 6M)

### Step 6 — Revenue by Zone (Donut / Pie Chart)
  [ ] 6.1  PieChart with 4 slices: North / South / East / West Transfer Stations
  [ ] 6.2  Right side legend with zone name, ₹ revenue, and % share
  [ ] 6.3  Center label showing total (innerRadius > 0 for donut look)
  [ ] 6.4  Card header: "Revenue by Zone"

### Step 7 — GMV Trend Line Chart
  [ ] 7.1  AreaChart showing GMV per month for last 6 months
  [ ] 7.2  Gradient fill (same pattern as Dashboard.jsx collectionTrend chart)
  [ ] 7.3  Add a reference line or annotation for Year 1 target: ₹2.5 Cr / 12 months
  [ ] 7.4  Card header: "Monthly GMV Trend" + "Year 1 Target: ₹2.5 Cr" badge

### Step 8 — Top Buyers Table
  [ ] 8.1  Table with columns: Rank, Buyer Company, Total Orders, Total Spend (₹), Last Order Date
  [ ] 8.2  Rank 1 row highlighted with gold left border (same kpi-card pattern)
  [ ] 8.3  Show top 5 buyers only; "View All" button (no-op for now)
  [ ] 8.4  Card header: "Top Buyers by Revenue"

## PHASE 4 — Tab 2: Inventory & Turnover
# Source: PRD §6.7 "Inventory dashboard: material stock per zone, pending batches,
#         sold this week/month"; Design Doc §7.4 Admin Dashboard specs
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 9 — Inventory KPI Sub-strip (shown when Inventory tab is active)
  [ ] 9.1  "Total Stock Available" — across all sites from siteInventory.js (live state)
  [ ] 9.2  "Pending Batches at Station" — awaiting admin publish
  [ ] 9.3  "Sold This Month (Tonnes)" — derived from invoices
  [ ] 9.4  "Avg. Days Before Sale" — target <4 days; display vs 14-day baseline
            — Color red if >7 days, amber if 4–7, green if <4

### Step 10 — Inventory Turnover Bar Chart per Material
  [ ] 10.1 Horizontal BarChart: X = avg days to sell, Y = material category
  [ ] 10.2 Color bars: green if <4 days, amber if 4–7, red if >7
  [ ] 10.3 Reference line at x=4 (target) and x=14 (old baseline)
  [ ] 10.4 Card header: "Inventory Turnover by Material" + subtitle "Target: <4 days"

### Step 11 — Stock Level Per Site Table
  [ ] 11.1 Table: Site Name | Material | Available (T) | Capacity (T) | % Used | Status
  [ ] 11.2 Status column: "In Stock" (green) / "Low Stock" (<5T, amber) / "Out of Stock" (red)
  [ ] 11.3 Flatten data from siteInventory.js (one row per site × material combination)
  [ ] 11.4 Add filter dropdown: by site, by material category
  [ ] 11.5 "Low Stock" rows should be highlighted with amber background (rgba warning)
  [ ] 11.6 Card header: "Live Stock Levels" + "Sync from Fleet Intel  Live" badge (green dot)

### Step 12 — Sold vs Available Donut per Material
  [ ] 12.1 Grid of 4–6 small donut charts (one per major material)
  [ ] 12.2 Each donut: inner = sold this month, outer = still available
  [ ] 12.3 Label in center: material name + sold % this month
  [ ] 12.4 Card header: "Sold vs Available — This Month"

## PHASE 5 — Tab 3: Pricing Control
# Source: PRD §6.7 "Pricing control: GREENIE admin sets and updates price per
#         material/grade — no buyer can modify price (single seller)"
#         Design Doc §7.4: pricing control panel
#         PRD §5: Typical Price Ranges per material
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 13 — Pricing Table (Admin editable)
  [ ] 13.1 Table with columns:
             Material | Grade | Current Price (₹/T) | Informal Market Baseline | Premium % | Last Updated | Actions
  [ ] 13.2 "Premium %" = ((ourPrice - baseline) / baseline) × 100
             — Green if ≥10% (target range), amber if 5–10%, red if <5%
  [ ] 13.3 "Edit Price" button per row — opens an inline edit modal
  [ ] 13.4 Pre-populate with realistic prices from PRD §5:
             Concrete Rubble: ₹250/T (informal: ₹180)
             Steel: ₹22,000/T (informal: ₹19,000)
             Brick: ₹300/T (informal: ₹250)
             Timber: ₹400/T (informal: ₹350)
             Plastic: ₹15/KG (informal: ₹12)
             Glass: ₹12/KG (informal: ₹9)
  [ ] 13.5 Card header: "Pricing Control Panel" + "Admin Only" lock badge

### Step 14 — Edit Price Modal
  [ ] 14.1 Modal opens when "Edit Price" is clicked on a row
  [ ] 14.2 Fields: Material (read-only), Grade (read-only), New Price (number input), Effective From (date)
  [ ] 14.3 Live preview: shows new Premium % as price is typed
  [ ] 14.4 Warning banner if price is below informal market baseline:
             "⚠ Price is below informal market rate — this may undermine GREENIE's price premium strategy."
  [ ] 14.5 On save: update price in local state; table Premium % re-calculates
  [ ] 14.6 Close modal on cancel; no change made

### Step 15 — Price Trend Chart
  [ ] 15.1 LineChart: X = months, Y = price per tonne
  [ ] 15.2 One line for each material (toggle via checkbox legend)
  [ ] 15.3 Dashed reference line per material = informal market baseline
  [ ] 15.4 Shaded region between GREENIE price and informal baseline = "Premium Zone" (green fill)
  [ ] 15.5 Tooltip shows: GREENIE Price, Informal Baseline, Premium Amount
  [ ] 15.6 Card header: "Price Trend vs Informal Market" + filter: select material

### Step 16 — Pricing Recommendation Hint (Phase 3 Preview)
  [ ] 16.1 Static info card with amber background:
             "AI Pricing Engine — Coming in Phase 3"
             "ML model trained on Fleet Intel sorting volumes and buyer demand will auto-suggest
              optimal prices. Rule-based median pricing active currently."
  [ ] 16.2 Show recommended price per material as a simple rule: median of (informalBaseline × 1.12)
  [ ] 16.3 "Apply Recommended Price" button updates the pricing table with recommendation values

## PHASE 6 — Compliance & EPR Report Section
# Source: PRD §6.7 "EPR & compliance reports: auto-generated monthly CPCB summary;
#         downloadable EPR certificate ledger"
# Note: This section appears at the bottom of the page, always visible (not tab-gated)
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 17 — EPR & Compliance Summary Panel
  [ ] 17.1 Two stat boxes side by side:
             "WTNs Issued This Month" (count) | "EPR Certs Issued This Month" (count)
  [ ] 17.2 "CPCB Report Due" countdown — static date: Apr 1, 2026 — show "X days remaining"
  [ ] 17.3 "Generate Monthly Report" button — no-op placeholder (Phase 2 feature label)
  [ ] 17.4 EPR cert ledger mini-table (last 5 certs): Cert No., Buyer, Material, Qty, Issued Date,
             Download (placeholder button)

## PHASE 7 — Polish & Final Integration
# ─────────────────────────────────────────────────────────────────────────────────────────

### Step 18 — Styling & Consistency
  [ ] 18.1 All charts use the app's existing color tokens (--color-primary, --color-accent etc.)
  [ ] 18.2 CATEGORY_COLORS from siteInventory.js used consistently across all material charts
  [ ] 18.3 Tabs use styled active/inactive state matching the app's btn / nav-item style
  [ ] 18.4 All cards use .card, .card-header, .card-body, .data-table classes
  [ ] 18.5 All ₹ values formatted with formatCurrency helper (same as Marketplace.jsx)
  [ ] 18.6 Page subtitle shows live date (from JS Date — matches Dashboard.jsx pattern)

### Step 19 — Responsive Layout
  [ ] 19.1 KPI strip: grid-template-columns: repeat(4,1fr) on desktop, repeat(2,1fr) on narrow
  [ ] 19.2 Charts side by side (grid-2) on desktop; stacked on narrow viewports
  [ ] 19.3 Pricing table: horizontal scroll (overflow-x: auto) on small screens

### Step 20 — Final Verification Checklist
  [ ] 20.1 `npm run dev` — no console errors on page load
  [ ] 20.2 All 3 tabs switch correctly without full page reload
  [ ] 20.3 Revenue charts render with correct labels and tooltips
  [ ] 20.4 Inventory table correctly reflects siteInventory.js state (live, not hardcoded)
  [ ] 20.5 Pricing table Edit modal opens, updates price, recalculates Premium %, closes cleanly
  [ ] 20.6 Sidebar shows "Analytics & Pricing" link under Commerce group, highlighted when active
  [ ] 20.7 Verify no regression on existing /marketplace page (stock overview, invoice table, PDF)
  [ ] 20.8 Push to GitHub: `git commit -m "feat: Add Marketplace Analytics & Pricing Dashboard"`

## REFERENCE — Key PRD Data Points for Mock Data
# ─────────────────────────────────────────────────────────────────────────────────────────
# Year 1 GMV Target:    INR 2.5 Crore (digital channel)
# Price Premium Target: 10–15% above informal market
# Inventory Turnover:   Reduce avg. 14 days → <4 days
# Buyer Target:         300+ registered buyers
# Active Zones:         North / South / East / West Transfer Stations, Coimbatore
# Material Price Ranges (PRD §5):
#   Concrete Rubble: INR 150–400/tonne   |  Steel: INR 18,000–28,000/tonne
#   Timber: INR 50–500/piece             |  Plastic: INR 8–25/kg
#   Glass: INR 5–20/kg
# EPR recycling mandate FY2026-27: 50% of waste must be recycled
# Fine for illegal dumping: INR 5,000–1,00,000
# GREENIE gross margin per tonne: ~55%
# Admin login: 123@greenie.ac.in (same SSO as Fleet Intel)
