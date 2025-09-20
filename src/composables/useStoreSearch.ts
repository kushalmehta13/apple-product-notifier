import { ref, computed } from 'vue'
import { searchStoresNearZipCode, type SearchParams } from '@/services/storeService'

export interface StoreSearchState {
  isSearching: boolean
  results: any[]
  error: string | null
  hasSearched: boolean
}

export function useStoreSearch() {
  const state = ref<StoreSearchState>({
    isSearching: false,
    results: [],
    error: null,
    hasSearched: false
  })

  const searchStores = async (params: SearchParams) => {
    state.value.isSearching = true
    state.value.error = null
    state.value.hasSearched = true

    try {
      const results = await searchStoresNearZipCode(params)
      
      // Transform results to match our frontend interface
      state.value.results = results.map(result => ({
        id: result.store.id,
        name: result.store.name,
        address: `${result.store.address}, ${result.store.city}, ${result.store.state} ${result.store.zip_code}`,
        distance: result.distance,
        pickupAvailable: result.availability?.available || false,
        pickupTime: result.availability?.pickup_available_at 
          ? new Date(result.availability.pickup_available_at).toLocaleString()
          : undefined,
        phone: result.store.phone
      }))
      
    } catch (error) {
      console.error('Error searching stores:', error)
      state.value.error = error instanceof Error ? error.message : 'An error occurred while searching'
      state.value.results = []
    } finally {
      state.value.isSearching = false
    }
  }

  const clearResults = () => {
    state.value.results = []
    state.value.error = null
    state.value.hasSearched = false
  }

  const hasResults = computed(() => state.value.results.length > 0)
  const noResults = computed(() => state.value.hasSearched && !state.value.isSearching && state.value.results.length === 0)

  return {
    state: state.value,
    searchStores,
    clearResults,
    hasResults,
    noResults
  }
}
