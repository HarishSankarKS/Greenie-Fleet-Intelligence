// ─── GREENIE Supabase Helpers ─────────────────────────────────────────────────
// Central CRUD + realtime subscription functions for all admin portal tables.

import { supabase } from './supabaseClient'

// ── VEHICLES ─────────────────────────────────────────────────────────────────
export async function getVehicles() {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*, drivers(name)')
        .order('id')
    if (error) { console.error('getVehicles:', error); return [] }
    return data
}

export async function upsertVehicle(vehicle) {
    const { error } = await supabase.from('vehicles').upsert(vehicle, { onConflict: 'id' })
    if (error) console.error('upsertVehicle:', error)
    return !error
}

export async function deleteVehicle(id) {
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) console.error('deleteVehicle:', error)
    return !error
}

export async function updateVehicleStatus(id, status) {
    const { error } = await supabase.from('vehicles').update({ status }).eq('id', id)
    if (error) console.error('updateVehicleStatus:', error)
    return !error
}

export function subscribeToVehicles(callback) {
    return supabase
        .channel('vehicles_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, callback)
        .subscribe()
}

// ── DRIVERS ──────────────────────────────────────────────────────────────────
export async function getDrivers() {
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('id')
    if (error) { console.error('getDrivers:', error); return [] }
    return data
}

export async function upsertDriver(driver) {
    const { error } = await supabase.from('drivers').upsert(driver, { onConflict: 'id' })
    if (error) console.error('upsertDriver:', error)
    return !error
}

export async function deleteDriver(id) {
    const { error } = await supabase.from('drivers').delete().eq('id', id)
    if (error) console.error('deleteDriver:', error)
    return !error
}

// ── MAINTENANCE ───────────────────────────────────────────────────────────────
export async function getMaintenanceRecords() {
    const { data, error } = await supabase
        .from('maintenance_records')
        .select('*, vehicles(plate_number, model)')
        .order('date', { ascending: false })
    if (error) { console.error('getMaintenanceRecords:', error); return [] }
    return data
}

export async function insertMaintenanceRecord(record) {
    const { data, error } = await supabase
        .from('maintenance_records')
        .insert([record])
        .select()
        .single()
    if (error) console.error('insertMaintenanceRecord:', error)
    return data
}

export async function updateMaintenanceStatus(id, status, vehicleId) {
    const { error } = await supabase
        .from('maintenance_records')
        .update({ status })
        .eq('id', id)
    if (error) { console.error('updateMaintenanceStatus:', error); return false }
    // Sync vehicle status
    if (vehicleId) {
        const vStatus = status === 'active' ? 'maintenance' : status === 'completed' ? 'idle' : null
        if (vStatus) await updateVehicleStatus(vehicleId, vStatus)
    }
    return true
}

// ── COLLECTION SITES ──────────────────────────────────────────────────────────
export async function getCollectionSites() {
    const { data, error } = await supabase
        .from('collection_sites')
        .select('*, vehicles(plate_number), drivers(name)')
        .order('id')
    if (error) { console.error('getCollectionSites:', error); return [] }
    return data
}

export async function upsertCollectionSite(site) {
    const { error } = await supabase.from('collection_sites').upsert(site, { onConflict: 'id' })
    if (error) console.error('upsertCollectionSite:', error)
    return !error
}

export async function deleteCollectionSite(id) {
    const { error } = await supabase.from('collection_sites').delete().eq('id', id)
    if (error) console.error('deleteCollectionSite:', error)
    return !error
}

export async function updateSiteStatus(id, status) {
    const { error } = await supabase.from('collection_sites').update({ status }).eq('id', id)
    if (error) console.error('updateSiteStatus:', error)
    return !error
}

// ── DISPATCH ASSIGNMENTS ──────────────────────────────────────────────────────
export async function dispatchVehicle({ type, ref_id, vehicle_id, driver_id }) {
    // 1. Create dispatch assignment
    const { error: dispErr } = await supabase.from('dispatch_assignments').insert([{
        type, ref_id, vehicle_id, driver_id, status: 'dispatched'
    }])
    if (dispErr) { console.error('dispatchVehicle:', dispErr); return false }

    // 2. Mark vehicle as active
    await updateVehicleStatus(vehicle_id, 'active')

    // 3. If dispatching to a collection site, update its status and assigned IDs
    if (type === 'site_collection') {
        await supabase.from('collection_sites')
            .update({ status: 'dispatched', assigned_vehicle_id: vehicle_id, assigned_driver_id: driver_id })
            .eq('id', ref_id)
    }
    // 4. If dispatching for a client_request, update collection_requests status
    if (type === 'client_request') {
        await supabase.from('collection_requests')
            .update({ status: 'dispatched' })
            .eq('id', ref_id)
    }
    return true
}

export async function getDispatchAssignments() {
    const { data, error } = await supabase
        .from('dispatch_assignments')
        .select('*, vehicles(plate_number, model), drivers(name)')
        .order('assigned_at', { ascending: false })
    if (error) { console.error('getDispatchAssignments:', error); return [] }
    return data
}

export function subscribeToDispatch(callback) {
    return supabase
        .channel('dispatch_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dispatch_assignments' }, (p) => callback(p.new))
        .subscribe()
}

export function subscribeToCollectionSites(callback) {
    return supabase
        .channel('sites_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'collection_sites' }, callback)
        .subscribe()
}
