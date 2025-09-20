<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import ZipCodeInput from '../components/ZipCodeInput.vue'
import ProductSelector from '../components/ProductSelector.vue'
import SearchResults from '../components/SearchResults.vue'
import NotificationModal from '../components/NotificationModal.vue'

interface Store {
  id: string
  name: string
  address: string
  distance: number
  pickupAvailable: boolean
  pickupTime?: string
  phone: string
}

const searchState = reactive({
  zipCode: '',
  product: '',
  isSearching: false,
  results: [] as Store[],
  hasSearched: false
})

// Debug: Watch for changes to see what's happening
watch(() => searchState.zipCode, (newValue) => {
  console.log('ZIP Code changed:', newValue)
})

watch(() => searchState.product, (newValue) => {
  console.log('Product changed:', newValue)
})

const showNotificationModal = ref(false)

const handleSearch = async () => {
  if (!searchState.zipCode || !searchState.product) {
    return
  }

  searchState.isSearching = true
  searchState.hasSearched = true

  // Simulate API call - replace with actual API call later
  setTimeout(() => {
    searchState.results = [
      {
        id: '1',
        name: 'Apple Store - Union Square',
        address: '300 Post St, San Francisco, CA 94108',
        distance: 2.3,
        pickupAvailable: true,
        pickupTime: 'Available today after 3:00 PM',
        phone: '(415) 392-0202'
      },
      {
        id: '2',
        name: 'Apple Store - Stonestown Galleria',
        address: '3251 20th Ave, San Francisco, CA 94132',
        distance: 8.7,
        pickupAvailable: false,
        phone: '(415) 759-2220'
      },
      {
        id: '3',
        name: 'Apple Store - Palo Alto',
        address: '340 University Ave, Palo Alto, CA 94301',
        distance: 22.1,
        pickupAvailable: true,
        pickupTime: 'Available tomorrow after 10:00 AM',
        phone: '(650) 330-0100'
      }
    ]
    searchState.isSearching = false
  }, 2000)
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
      <!-- Debug info (remove in production) -->
      <div class="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
        <strong>Debug:</strong> ZIP: "{{ searchState.zipCode }}" | Product: "{{ searchState.product }}"
      </div>
      
      <form @submit.prevent="handleSearch" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <ZipCodeInput v-model="searchState.zipCode" />
          <ProductSelector v-model="searchState.product" />
        </div>
        
        <button
          type="submit"
          :disabled="!searchState.zipCode || !searchState.product || searchState.isSearching"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="searchState.isSearching" class="flex items-center justify-center">
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
      :results="searchState.results" 
      :is-searching="searchState.isSearching"
      :has-searched="searchState.hasSearched"
    />

    <!-- Notification Setup -->
    <div v-if="searchState.hasSearched && !searchState.isSearching" class="text-center mt-8">
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
