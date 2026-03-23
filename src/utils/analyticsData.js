// ─── GREENIE Marketplace Analytics — Supabase-backed ─────────────────────────
// All pricing data comes from the `materials` table in Supabase.
// Revenue / GMV data comes from the `marketplace_orders` table.
// Static chart data (weekly trend) remains hardcoded as it's derived from IoT.

import { supabase } from './supabaseClient'

// ── Fetch material pricing from Supabase ──────────────────────────────────────
export async function getMaterials() {
    const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('id')
    if (error) { console.error('getMaterials:', error); return [] }
    return data
}

// ── Update a single material price (Admin only) ───────────────────────────────
export async function updateMaterialPrice(id, newPrice) {
    const { error } = await supabase
        .from('materials')
        .update({ price: newPrice, updated_at: new Date().toISOString() })
        .eq('id', id)
    if (error) console.error('updateMaterialPrice:', error)
    return !error
}

// ── Fetch marketplace orders ──────────────────────────────────────────────────
export async function getMarketplaceOrders() {
    const { data, error } = await supabase
        .from('marketplace_orders')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) { console.error('getMarketplaceOrders:', error); return [] }
    return data
}

// ── Fetch collection requests ──────────────────────────────────────────────────
export async function getCollectionRequests() {
    const { data, error } = await supabase
        .from('collection_requests')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) { console.error('getCollectionRequests:', error); return [] }
    return data
}

// ── Update marketplace order status (Admin dispatch) ─────────────────────────
export async function updateOrderStatus(id, status) {
    const { error } = await supabase
        .from('marketplace_orders')
        .update({ status })
        .eq('id', id)
    if (error) console.error('updateOrderStatus:', error)
    return !error
}

// ── Realtime subscription helpers ────────────────────────────────────────────
export function subscribeToMarketplaceOrders(callback) {
    return supabase
        .channel('marketplace_orders_changes')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'marketplace_orders' },
            (payload) => callback(payload.new)
        )
        .subscribe()
}

export function subscribeToCollectionRequests(callback) {
    return supabase
        .channel('collection_requests_changes')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'collection_requests' },
            (payload) => callback(payload.new)
        )
        .subscribe()
}

// ── Revenue by Transfer Station Zone (computed from orders) ──────────────────
// Falls back to static data if Supabase data is empty
export const revenueByZone = [
    { zone: 'North TS — Thudiyalur',   value: 184000, color: '#1a3263' },
    { zone: 'South TS — Singanallur',  value: 236000, color: '#0f766e' },
    { zone: 'East TS — Irugur',        value: 158000, color: '#c8a951' },
    { zone: 'West TS — Kuniyamuthur',  value: 127000, color: '#6b7280' },
]

// ── Monthly GMV Trend ─────────────────────────────────────────────────────────
export const gmvTrend = [
    { month: 'Sep', gmv: 112000  },
    { month: 'Oct', gmv: 214700  },
    { month: 'Nov', gmv: 281600  },
    { month: 'Dec', gmv: 244700  },
    { month: 'Jan', gmv: 328300  },
    { month: 'Feb', gmv: 395100  },
    { month: 'Mar', gmv: 458400  },
]
export const GMV_MONTHLY_TARGET = 208333

// ── Inventory Turnover ────────────────────────────────────────────────────────
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

// ── Top Buyers (static — will move to DB in a later phase) ────────────────────
export const topBuyers = [
    { rank: 1, company: 'Coimbatore City Municipal Corporation',   orders: 14, totalSpend: 328400, lastOrder: '2026-03-10' },
    { rank: 2, company: 'R&D Recycling Plant Pvt Ltd',             orders: 22, totalSpend: 276200, lastOrder: '2026-03-12' },
    { rank: 3, company: 'Coimbatore Road Works Ltd',               orders: 9,  totalSpend: 198600, lastOrder: '2026-03-08' },
    { rank: 4, company: 'SRM Infra Projects',                      orders: 11, totalSpend: 154300, lastOrder: '2026-03-09' },
    { rank: 5, company: 'Lakshmi Construction Materials',          orders: 7,  totalSpend: 98700,  lastOrder: '2026-03-05' },
]

// ── Sold vs Available ─────────────────────────────────────────────────────────
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

// ── Price Trend ───────────────────────────────────────────────────────────────
export const priceTrend = [
    { month: 'Oct', 'Concrete Rubble': 240, Steel: 21000, Brick: 290, Timber: 380, Plastic: 15, Glass: 11 },
    { month: 'Nov', 'Concrete Rubble': 250, Steel: 21500, Brick: 295, Timber: 390, Plastic: 15, Glass: 12 },
    { month: 'Dec', 'Concrete Rubble': 255, Steel: 22000, Brick: 300, Timber: 400, Plastic: 16, Glass: 12 },
    { month: 'Jan', 'Concrete Rubble': 260, Steel: 23000, Brick: 310, Timber: 410, Plastic: 17, Glass: 13 },
    { month: 'Feb', 'Concrete Rubble': 268, Steel: 23500, Brick: 315, Timber: 415, Plastic: 17, Glass: 13 },
    { month: 'Mar', 'Concrete Rubble': 300, Steel: 25000, Brick: 320, Timber: 420, Plastic: 18, Glass: 14 },
]

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

// ── Revenue by material (static — for chart, will migrate later) ──────────────
export const revenueByMaterial = [
    { month: 'Oct', 'Concrete Rubble': 48000,  Steel: 132000, Brick: 18600, Timber: 9200,  Plastic: 4100,  Glass: 2800  },
    { month: 'Nov', 'Concrete Rubble': 62000,  Steel: 176000, Brick: 24000, Timber: 11000, Plastic: 5200,  Glass: 3400  },
    { month: 'Dec', 'Concrete Rubble': 54000,  Steel: 154000, Brick: 20000, Timber: 8800,  Plastic: 4800,  Glass: 3100  },
    { month: 'Jan', 'Concrete Rubble': 75000,  Steel: 198000, Brick: 31000, Timber: 13500, Plastic: 6300,  Glass: 4200  },
    { month: 'Feb', 'Concrete Rubble': 88000,  Steel: 242000, Brick: 36000, Timber: 16200, Plastic: 7800,  Glass: 5100  },
    { month: 'Mar', 'Concrete Rubble': 97000,  Steel: 286000, Brick: 41000, Timber: 18800, Plastic: 9200,  Glass: 6400  },
]

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
