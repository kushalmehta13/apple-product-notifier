<script setup lang="ts">
import { ref, reactive } from 'vue'
import ZipCodeInput from '../components/ZipCodeInput.vue'
import ProductSelector from '../components/ProductSelector.vue'
import SearchResults from '../components/SearchResults.vue'
import NotificationModal from '../components/NotificationModal.vue'
import { useStoreSearch } from '@/composables/useStoreSearch'

const searchState = reactive({
  zipCode: '',
  product: ''
})

const showNotificationModal = ref(false)

// Use the store search composable
const { state: searchState_composable, searchStores, clearResults } = useStoreSearch()

const handleSearch = async () => {
  if (!searchState.zipCode || !searchState.product) {
    return
  }

  // Parse the product selection to extract storage and color
  const [productId, color] = searchState.product.split('-')
  
  await searchStores({
    zipCode: searchState.zipCode,
    productId: productId,
    color: color,
    storage: productId.split('-').pop(),
    radiusMiles: 25
  })
}

const openNotificationModal = () => {
  showNotificationModal.value = true
}

const closeNotificationModal = () => {
  showNotificationModal.value = false
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Find iPhone 17 Pro Max
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Check availability for in-store pickup near your location
      </p>
    </div>

    <!-- Search Form -->
    <div class="card mb-8">
      
      <form @submit.prevent="handleSearch" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <ZipCodeInput v-model="searchState.zipCode" />
          <ProductSelector v-model="searchState.product" />
        </div>
        
        <button
          type="submit"
          :disabled="!searchState.zipCode || !searchState.product || searchState_composable.isSearching"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="searchState_composable.isSearching" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </span>
          <span v-else>Search Stores</span>
        </button>
      </form>
    </div>

    <!-- Search Results -->
    <SearchResults 
      :results="searchState_composable.results" 
      :is-searching="searchState_composable.isSearching"
      :has-searched="searchState_composable.hasSearched"
    />

    <!-- Notification Setup -->
    <div v-if="searchState_composable.hasSearched && !searchState_composable.isSearching" class="text-center mt-8">
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Want to be notified when availability changes?
      </p>
      <button @click="openNotificationModal" class="btn-secondary">
        Set Up Notifications
      </button>
    </div>

    <!-- Notification Modal -->
    <NotificationModal 
      v-if="showNotificationModal"
      @close="closeNotificationModal"
      :zip-code="searchState.zipCode"
      :product="searchState.product"
    />
  </div>
</template>
