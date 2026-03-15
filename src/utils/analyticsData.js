// ─── GREENIE Marketplace Analytics Mock Data ─────────────────────────────────
// Source: PRD v1.0 §5 (material prices), §9 (revenue model), §3 (success metrics)

// ── Revenue by Material (last 6 months) ──────────────────────────────────────
export const revenueByMaterial = [
    { month: 'Oct', 'Concrete Rubble': 48000,  Steel: 132000, Brick: 18600, Timber: 9200,  Plastic: 4100,  Glass: 2800  },
    { month: 'Nov', 'Concrete Rubble': 62000,  Steel: 176000, Brick: 24000, Timber: 11000, Plastic: 5200,  Glass: 3400  },
    { month: 'Dec', 'Concrete Rubble': 54000,  Steel: 154000, Brick: 20000, Timber: 8800,  Plastic: 4800,  Glass: 3100  },
    { month: 'Jan', 'Concrete Rubble': 75000,  Steel: 198000, Brick: 31000, Timber: 13500, Plastic: 6300,  Glass: 4200  },
    { month: 'Feb', 'Concrete Rubble': 88000,  Steel: 242000, Brick: 36000, Timber: 16200, Plastic: 7800,  Glass: 5100  },
    { month: 'Mar', 'Concrete Rubble': 97000,  Steel: 286000, Brick: 41000, Timber: 18800, Plastic: 9200,  Glass: 6400  },
]

// ── Revenue by Transfer Station Zone ─────────────────────────────────────────
export const revenueByZone = [
    { zone: 'North TS — Thudiyalur',   value: 184000, color: '#1a3263' },
    { zone: 'South TS — Singanallur',  value: 236000, color: '#0f766e' },
    { zone: 'East TS — Irugur',        value: 158000, color: '#c8a951' },
    { zone: 'West TS — Kuniyamuthur',  value: 127000, color: '#6b7280' },
]

// ── Monthly GMV Trend ─────────────────────────────────────────────────────────
// Year 1 target: INR 2.5 Cr — monthly target ~₹20.8 L
export const gmvTrend = [
    { month: 'Sep', gmv: 112000  },
    { month: 'Oct', gmv: 214700  },
    { month: 'Nov', gmv: 281600  },
    { month: 'Dec', gmv: 244700  },
    { month: 'Jan', gmv: 328300  },
    { month: 'Feb', gmv: 395100  },
    { month: 'Mar', gmv: 458400  },
]
export const GMV_MONTHLY_TARGET = 208333   // ₹2.5 Cr / 12

// ── Inventory Turnover (avg days before sale per material) ────────────────────
// Target: <4 days   |   Old baseline: 14 days
export const turnoverData = [
    { material: 'Steel',           avgDays: 2.1 },
    { material: 'Plastic',         avgDays: 3.4 },
    { material: 'Concrete Rubble', avgDays: 4.8 },
    { material: 'Glass',           avgDays: 5.2 },
    { material: 'Brick',           avgDays: 6.1 },
    { material: 'Timber',          avgDays: 8.7 },
    { material: 'Sand & Aggregate',avgDays: 3.9 },
    { material: 'Mixed Debris',    avgDays: 11.3},
]

// ── Top Buyers ────────────────────────────────────────────────────────────────
export const topBuyers = [
    { rank: 1, company: 'Coimbatore City Municipal Corporation',   orders: 14, totalSpend: 328400, lastOrder: '2026-03-10' },
    { rank: 2, company: 'R&D Recycling Plant Pvt Ltd',             orders: 22, totalSpend: 276200, lastOrder: '2026-03-12' },
    { rank: 3, company: 'Coimbatore Road Works Ltd',               orders: 9,  totalSpend: 198600, lastOrder: '2026-03-08' },
    { rank: 4, company: 'SRM Infra Projects',                      orders: 11, totalSpend: 154300, lastOrder: '2026-03-09' },
    { rank: 5, company: 'Lakshmi Construction Materials',          orders: 7,  totalSpend: 98700,  lastOrder: '2026-03-05' },
]

// ── Sold This Month Per Material (tonnes) ─────────────────────────────────────
export const soldVsAvailable = [
    { material: 'Concrete Rubble', sold: 111, available: 111  },
    { material: 'Steel',           sold: 21,  available: 18   },
    { material: 'Brick',           sold: 44,  available: 43   },
    { material: 'Timber',          sold: 8,   available: 8    },
    { material: 'Plastic',         sold: 11,  available: 11   },
    { material: 'Glass',           sold: 5,   available: 5    },
    { material: 'Sand & Aggregate',sold: 35,  available: 35   },
    { material: 'Mixed Debris',    sold: 20,  available: 20   },
]

// ── Pricing Table ─────────────────────────────────────────────────────────────
// PRD §5 price ranges and recommended levels
export const initialPricing = [
    { id: 1, material: 'Concrete Rubble', grade: 'Crushed 20mm',     unit: 'Tonne', price: 280,    informalBaseline: 180,  hsn: '2517', lastUpdated: '2026-03-01' },
    { id: 2, material: 'Concrete Rubble', grade: 'Chunked / Rubble', unit: 'Tonne', price: 195,    informalBaseline: 150,  hsn: '2517', lastUpdated: '2026-03-01' },
    { id: 3, material: 'Steel',           grade: 'Structural Grade A',unit: 'Tonne', price: 24000,  informalBaseline: 19000,hsn: '7204', lastUpdated: '2026-02-20' },
    { id: 4, material: 'Steel',           grade: 'Scrap / Sheet',     unit: 'Tonne', price: 18500,  informalBaseline: 15000,hsn: '7204', lastUpdated: '2026-02-20' },
    { id: 5, material: 'Brick',           grade: 'Whole / Fired',     unit: 'Tonne', price: 320,    informalBaseline: 250,  hsn: '6901', lastUpdated: '2026-03-05' },
    { id: 6, material: 'Timber',          grade: 'Structural Timber', unit: 'Cu.Ft', price: 420,    informalBaseline: 350,  hsn: '4401', lastUpdated: '2026-02-15' },
    { id: 7, material: 'Plastic',         grade: 'HDPE',              unit: 'Kg',    price: 18,     informalBaseline: 12,   hsn: '3915', lastUpdated: '2026-03-08' },
    { id: 8, material: 'Plastic',         grade: 'PVC / Mixed',       unit: 'Kg',    price: 11,     informalBaseline: 8,    hsn: '3915', lastUpdated: '2026-03-08' },
    { id: 9, material: 'Glass',           grade: 'Float / Tempered',  unit: 'Kg',    price: 14,     informalBaseline: 9,    hsn: '7001', lastUpdated: '2026-02-28' },
    { id: 10,material: 'Sand & Aggregate',grade: 'Washed M-Sand',     unit: 'Tonne', price: 640,    informalBaseline: 520,  hsn: '2505', lastUpdated: '2026-03-03' },
]

// ── Price Trend per Material (last 6 months) ──────────────────────────────────
export const priceTrend = [
    { month: 'Oct', 'Concrete Rubble': 240, Steel: 21000, Brick: 290, Timber: 380, Plastic: 15, Glass: 11 },
    { month: 'Nov', 'Concrete Rubble': 250, Steel: 21500, Brick: 295, Timber: 390, Plastic: 15, Glass: 12 },
    { month: 'Dec', 'Concrete Rubble': 255, Steel: 22000, Brick: 300, Timber: 400, Plastic: 16, Glass: 12 },
    { month: 'Jan', 'Concrete Rubble': 260, Steel: 23000, Brick: 310, Timber: 410, Plastic: 17, Glass: 13 },
    { month: 'Feb', 'Concrete Rubble': 268, Steel: 23500, Brick: 315, Timber: 415, Plastic: 17, Glass: 13 },
    { month: 'Mar', 'Concrete Rubble': 280, Steel: 24000, Brick: 320, Timber: 420, Plastic: 18, Glass: 14 },
]

// Informal market baseline (static reference lines)
export const informalBaseline = {
    'Concrete Rubble': 180,
    Steel:             19000,
    Brick:             250,
    Timber:            350,
    Plastic:           12,
    Glass:             9,
}

// ── EPR / Compliance ──────────────────────────────────────────────────────────
export const complianceData = {
    wtnThisMonth:  18,
    wtnAllTime:    76,
    eprThisMonth:  14,
    eprAllTime:    58,
    cpcbReportDue: '2026-04-01',
    recentCerts: [
        { certNo: 'EPR-GRN-0058', buyer: 'R&D Recycling Plant Pvt Ltd',        material: 'Concrete Rubble', qty: 20,  issued: '2026-03-12' },
        { certNo: 'EPR-GRN-0057', buyer: 'Coimbatore City Municipal Corporation',material: 'Steel',         qty: 8,   issued: '2026-03-10' },
        { certNo: 'EPR-GRN-0056', buyer: 'Coimbatore Road Works Ltd',           material: 'Brick',          qty: 15,  issued: '2026-03-08' },
        { certNo: 'EPR-GRN-0055', buyer: 'SRM Infra Projects',                  material: 'Sand & Aggregate',qty: 30, issued: '2026-03-05' },
        { certNo: 'EPR-GRN-0054', buyer: 'Lakshmi Construction Materials',      material: 'Timber',         qty: 5,   issued: '2026-03-03' },
    ],
}

// ── Summary KPIs ──────────────────────────────────────────────────────────────
export const summaryKPIs = {
    revenueThisMonth:     458400,
    revenueLastMonth:     395100,
    gmvAllTime:           2034800,
    ordersThisMonth:      31,
    ordersPaid:           22,
    ordersPending:        9,
    eprThisMonth:         14,
    eprAllTime:           58,
    pendingBatches:       7,
    soldTonnesThisMonth:  255,
    avgDaysBeforeSale:    5.6,
}
