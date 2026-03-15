// Shared C&D Processed Inventory — Source of Truth for Marketplace Billing
// Inventory lives at the 4 Greenie Transfer Stations ONLY.
// C&D collection sites are pickup points — they do NOT hold processed inventory.
// availableTonnes: 0 = Out of Stock (billing blocked)

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

// Activity badge colors (for CollectionSites page)
export const ACTIVITY_COLORS = {
    'Demolition':   { bg: '#fef2f2', color: '#ef4444' },
    'Construction': { bg: '#eff6ff', color: '#1d4ed8' },
    'Road Works':   { bg: '#fffbeb', color: '#d97706' },
    'Excavation':   { bg: '#f0fdf4', color: '#15803d' },
}

// ── Inventory at Transfer Stations ────────────────────────────────────────────
// Feed: trucks collect from 12 C&D sites → deliver + sort at the relevant TS
// Stock here is the processed/sorted output available for marketplace sale.
export const initialInventory = [
    {
        siteId: 'TS-N',
        siteName: 'Greenie North Transfer Station',
        location: 'Thudiyalur, Coimbatore',
        zone: 'North',
        capacity: 150,
        // Feeds from: CBE-S02 (Gandhipuram), CBE-S06 (Ganapathy), CBE-S08 (Saibaba Colony), CBE-S12 (Flyover)
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 62, maxTonnes: 80  },
            { category: 'Steel',           availableTonnes: 18, maxTonnes: 30  },
            { category: 'Brick',           availableTonnes: 24, maxTonnes: 35  },
            { category: 'Sand & Aggregate',availableTonnes: 28, maxTonnes: 40  },
            { category: 'Mixed Debris',    availableTonnes: 11, maxTonnes: 20  },
        ],
    },
    {
        siteId: 'TS-S',
        siteName: 'Greenie South Transfer Station',
        location: 'Singanallur, Coimbatore',
        zone: 'South',
        capacity: 200,
        // Feeds from: CBE-S01 (RS Puram), CBE-S04 (Ramanathapuram), CBE-S10 (Podanur), CBE-S11 (Sowripalayam)
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 55, maxTonnes: 75  },
            { category: 'Steel',           availableTonnes: 47, maxTonnes: 70  },
            { category: 'Brick',           availableTonnes: 38, maxTonnes: 55  },
            { category: 'Timber',          availableTonnes: 14, maxTonnes: 20  },
            { category: 'Plastic',         availableTonnes: 11, maxTonnes: 18  },
            { category: 'Mixed Debris',    availableTonnes: 0,  maxTonnes: 25  },
        ],
    },
    {
        siteId: 'TS-E',
        siteName: 'Greenie East Transfer Station',
        location: 'Irugur / Avinashi Rd, Coimbatore',
        zone: 'East',
        capacity: 180,
        // Feeds from: CBE-S03 (Peelamedu), CBE-S05 (Ondipudur), CBE-S09 (Kalapatti)
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 73, maxTonnes: 90  },
            { category: 'Steel',           availableTonnes: 34, maxTonnes: 50  },
            { category: 'Sand & Aggregate',availableTonnes: 41, maxTonnes: 55  },
            { category: 'Glass',           availableTonnes: 4,  maxTonnes: 10  },
            { category: 'Mixed Debris',    availableTonnes: 8,  maxTonnes: 20  },
        ],
    },
    {
        siteId: 'TS-W',
        siteName: 'Greenie West Transfer Station',
        location: 'Kuniyamuthur, Coimbatore',
        zone: 'West',
        capacity: 120,
        // Feeds from: CBE-S07 (Kovaipudur)
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 16, maxTonnes: 30  },
            { category: 'Sand & Aggregate',availableTonnes: 14, maxTonnes: 25  },
            { category: 'Brick',           availableTonnes: 0,  maxTonnes: 15  },
            { category: 'Mixed Debris',    availableTonnes: 0,  maxTonnes: 10  },
        ],
    },
]
