// Shared C&D Waste Inventory — Source of Truth for Marketplace Billing
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

export const initialInventory = [
    {
        siteId: 'CBE-01',
        siteName: 'RS Puram C&D Site',
        location: 'RS Puram, Coimbatore',
        capacity: 50,
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 18, maxTonnes: 30 },
            { category: 'Steel',           availableTonnes: 4,  maxTonnes: 10 },
            { category: 'Brick',           availableTonnes: 0,  maxTonnes: 15 },
            { category: 'Mixed Debris',    availableTonnes: 6,  maxTonnes: 20 },
        ],
    },
    {
        siteId: 'CBE-02',
        siteName: 'Gandhipuram Collection Pt',
        location: 'Gandhipuram, Coimbatore',
        capacity: 80,
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 32, maxTonnes: 40 },
            { category: 'Brick',           availableTonnes: 12, maxTonnes: 20 },
            { category: 'Timber',          availableTonnes: 0,  maxTonnes: 10 },
            { category: 'Sand & Aggregate',availableTonnes: 9,  maxTonnes: 25 },
        ],
    },
    {
        siteId: 'CBE-03',
        siteName: 'Ukkadam Sorting Yard',
        location: 'Ukkadam, Coimbatore',
        capacity: 100,
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 44, maxTonnes: 50 },
            { category: 'Steel',           availableTonnes: 11, maxTonnes: 20 },
            { category: 'Glass',           availableTonnes: 0,  maxTonnes: 10 },
            { category: 'Plastic',         availableTonnes: 7,  maxTonnes: 15 },
            { category: 'Mixed Debris',    availableTonnes: 14, maxTonnes: 25 },
        ],
    },
    {
        siteId: 'CBE-04',
        siteName: 'Saravanampatti IT Zone',
        location: 'Saravanampatti, Coimbatore',
        capacity: 60,
        materials: [
            { category: 'Brick',           availableTonnes: 22, maxTonnes: 30 },
            { category: 'Timber',          availableTonnes: 8,  maxTonnes: 15 },
            { category: 'Plastic',         availableTonnes: 0,  maxTonnes: 10 },
            { category: 'Steel',           availableTonnes: 3,  maxTonnes: 10 },
        ],
    },
    {
        siteId: 'CBE-05',
        siteName: 'Singanallur Depot',
        location: 'Singanallur, Coimbatore',
        capacity: 70,
        materials: [
            { category: 'Concrete Rubble', availableTonnes: 17, maxTonnes: 35 },
            { category: 'Sand & Aggregate',availableTonnes: 26, maxTonnes: 30 },
            { category: 'Glass',           availableTonnes: 5,  maxTonnes: 10 },
            { category: 'Mixed Debris',    availableTonnes: 0,  maxTonnes: 20 },
        ],
    },
    {
        siteId: 'CBE-07',
        siteName: 'Kuniyamuthur Hub',
        location: 'Kuniyamuthur, Coimbatore',
        capacity: 40,
        materials: [
            { category: 'Brick',           availableTonnes: 9,  maxTonnes: 15 },
            { category: 'Timber',          availableTonnes: 0,  maxTonnes: 10 },
            { category: 'Plastic',         availableTonnes: 4,  maxTonnes: 10 },
            { category: 'Concrete Rubble', availableTonnes: 0,  maxTonnes: 20 },
        ],
    },
]
