import { supabase, type AppleStore, type ProductAvailability, type SearchResult } from '@/lib/supabase'

export interface SearchParams {
  zipCode: string
  productId: string
  color?: string
  storage?: string
  radiusMiles?: number
}

export interface StoreSearchResult {
  store: AppleStore
  distance: number
  availability: ProductAvailability | null
}

// Convert ZIP code to coordinates (you'll need to implement this or use a service)
export async function zipCodeToCoordinates(zipCode: string): Promise<{ latitude: number; longitude: number }> {
  // For now, using hardcoded coordinates for testing
  // In production, you'd use a geocoding service like Google Maps API or US Census API
  const zipCoordinates: Record<string, { latitude: number; longitude: number }> = {
    '94108': { latitude: 37.7880, longitude: -122.4074 }, // San Francisco
    '94132': { latitude: 37.7318, longitude: -122.4667 }, // San Francisco
    '94301': { latitude: 37.4419, longitude: -122.1430 }, // Palo Alto
    '95128': { latitude: 37.3230, longitude: -121.9469 }, // San Jose
    '94304': { latitude: 37.4419, longitude: -122.1616 }, // Palo Alto
    '98121': { latitude: 47.6137, longitude: -122.3379 }, // Seattle, WA
  }
  
  const coords = zipCoordinates[zipCode]
  if (!coords) {
    throw new Error(`Coordinates not found for ZIP code: ${zipCode}`)
  }
  
  return coords
}

// Search for stores near a ZIP code
export async function searchStoresNearZipCode(params: SearchParams): Promise<StoreSearchResult[]> {
  try {
    const { zipCode, productId, color, storage, radiusMiles = 25 } = params
    
    // Get coordinates for the ZIP code
    const { latitude, longitude } = await zipCodeToCoordinates(zipCode)
    
    // Call the database function to find stores within radius
    const { data: storeDistances, error: storeError } = await supabase.rpc(
      'find_stores_within_radius',
      {
        search_lat: latitude,
        search_lon: longitude,
        radius_miles: radiusMiles
      }
    )
    
    if (storeError) {
      console.error('Error finding stores:', storeError)
      throw storeError
    }
    
    if (!storeDistances || storeDistances.length === 0) {
      return []
    }
    
    // Get store details and availability for each store
    const results: StoreSearchResult[] = []
    
    for (const storeDistance of storeDistances) {
      // Get store details
      const { data: store, error: storeError } = await supabase
        .from('apple_stores')
        .select('*')
        .eq('id', storeDistance.store_id)
        .single()
      
      if (storeError) {
        console.error(`Error fetching store ${storeDistance.store_id}:`, storeError)
        continue
      }
      
      // Get product availability
      let availability = null
      if (color && storage) {
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('product_availability')
          .select('*')
          .eq('store_id', store.id)
          .eq('product_id', productId)
          .eq('color', color.toLowerCase().replace(' ', '-'))
          .single()
        
        if (!availabilityError && availabilityData) {
          availability = availabilityData
        }
      }
      
      results.push({
        store,
        distance: parseFloat(storeDistance.distance.toFixed(1)),
        availability
      })
    }
    
    return results.sort((a, b) => a.distance - b.distance)
    
  } catch (error) {
    console.error('Error searching stores:', error)
    throw error
  }
}

// Get all Apple stores (for admin/testing purposes)
export async function getAllStores(): Promise<AppleStore[]> {
  const { data, error } = await supabase
    .from('apple_stores')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching stores:', error)
    throw error
  }
  
  return data || []
}

// Update product availability (for data refresh)
export async function updateProductAvailability(
  storeId: string,
  productId: string,
  color: string,
  availability: boolean,
  pickupAvailableAt?: string
): Promise<void> {
  const { error } = await supabase
    .from('product_availability')
    .upsert({
      store_id: storeId,
      product_id: productId,
      color: color.toLowerCase().replace(' ', '-'),
      storage: productId.split('-').pop() || '',
      available: availability,
      pickup_available_at: pickupAvailableAt,
      last_checked: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error updating product availability:', error)
    throw error
  }
}

// Get product availability for a specific store and product
export async function getProductAvailability(
  storeId: string,
  productId: string,
  color?: string
): Promise<ProductAvailability[]> {
  let query = supabase
    .from('product_availability')
    .select('*')
    .eq('store_id', storeId)
    .eq('product_id', productId)
  
  if (color) {
    query = query.eq('color', color.toLowerCase().replace(' ', '-'))
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching product availability:', error)
    throw error
  }
  
  return data || []
}
