import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface AppleStore {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude: number
  longitude: number
  phone: string
  created_at: string
  updated_at: string
}

export interface ProductAvailability {
  id: string
  store_id: string
  product_id: string
  color: string
  storage: string
  available: boolean
  pickup_available_at?: string
  last_checked: string
  created_at: string
}

export interface Notification {
  id: string
  email?: string
  phone?: string
  zip_code: string
  product_id: string
  color?: string
  storage?: string
  notification_types: string[] // ['email', 'sms']
  active: boolean
  created_at: string
  updated_at: string
}

export interface SearchResult {
  store: AppleStore
  distance: number
  availability: ProductAvailability
}
