// ─── GREENIE Site Inventory — Supabase-backed ────────────────────────────────
// Inventory lives at the 4 Greenie Transfer Stations ONLY.
// C&D collection sites are pickup points — they do NOT hold processed inventory.

import { supabase } from './supabaseClient'

export const WASTE_CATEGORIES = [
    'Concrete Rubble',
    'Steel',
    'Brick',
    'Timber',
    'Plastic',
    'Glass',
    'Mixed Debris',
    'Sand & Aggregate',
]

export const CATEGORY_COLORS = {
    'Concrete Rubble': '#6b7280',
    'Steel':           '#3b82f6',
    'Brick':           '#ef4444',
    'Timber':          '#92400e',
    'Plastic':         '#8b5cf6',
    'Glass':           '#06b6d4',
    'Mixed Debris':    '#f59e0b',
    'Sand & Aggregate':'#d97706',
}

export const CATEGORY_HSN = {
    'Concrete Rubble': '2517',
    'Steel':           '7204',
    'Brick':           '6901',
    'Timber':          '4401',
    'Plastic':         '3915',
    'Glass':           '7001',
    'Mixed Debris':    '3825',
    'Sand & Aggregate':'2505',
}

export const ACTIVITY_COLORS = {
    'Demolition':   { bg: '#fef2f2', color: '#ef4444' },
    'Construction': { bg: '#eff6ff', color: '#1d4ed8' },
    'Road Works':   { bg: '#fffbeb', color: '#d97706' },
    'Excavation':   { bg: '#f0fdf4', color: '#15803d' },
}

// ── Fetch all inventory grouped by Transfer Station from Supabase ─────────────
export async function getSiteInventory() {
    const { data: stations, error: sErr } = await supabase
        .from('transfer_stations')
        .select('*')
        .order('id')

    const { data: inventory, error: iErr } = await supabase
        .from('site_inventory')
        .select('*')

    if (sErr || iErr) {
        console.error('getSiteInventory:', sErr || iErr)
        return []
    }

    // Group inventory rows under each station
    return stations.map(station => ({
        siteId:   station.id,
        siteName: station.name,
        location: `${station.area}, Coimbatore`,
        zone:     station.zone,
        capacity: station.capacity,
        materials: inventory
            .filter(row => row.site_id === station.id)
            .map(row => ({
                category:        row.category,
                availableTonnes: row.available_tonnes,
                maxTonnes:       row.max_tonnes,
            })),
    }))
}

// ── Update available inventory after an order is fulfilled ───────────────────
export async function decrementInventory(siteId, category, tonnes) {
    // First get current value
    const { data, error: fetchErr } = await supabase
        .from('site_inventory')
        .select('available_tonnes')
        .eq('site_id', siteId)
        .eq('category', category)
        .single()

    if (fetchErr || !data) { console.error('decrementInventory fetch:', fetchErr); return false }

    const newVal = Math.max(0, data.available_tonnes - tonnes)
    const { error } = await supabase
        .from('site_inventory')
        .update({ available_tonnes: newVal, updated_at: new Date().toISOString() })
        .eq('site_id', siteId)
        .eq('category', category)

    if (error) console.error('decrementInventory update:', error)
    return !error
}
