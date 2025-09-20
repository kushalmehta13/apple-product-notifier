<script setup lang="ts">
interface Store {
  id: string
  name: string
  address: string
  distance: number
  pickupAvailable: boolean
  pickupTime?: string
  phone: string
}

interface Props {
  results: Store[]
  isSearching: boolean
  hasSearched: boolean
}

const props = defineProps<Props>()

const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} miles away`
}

const formatPhone = (phone: string): string => {
  return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isSearching" class="card">
      <div class="flex items-center justify-center py-8">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-apple-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-400">Searching for stores...</p>
        </div>
      </div>
    </div>

    <!-- No Search Yet -->
    <div v-else-if="!hasSearched" class="card">
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-apple-100 dark:bg-apple-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-apple-600 dark:text-apple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Ready to search
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Enter your ZIP code and select a product to find nearby Apple stores
        </p>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="results.length === 0" class="card">
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No stores found
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          No Apple stores found within 25 miles of your ZIP code
        </p>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Store Results
        </h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ results.length }} store{{ results.length !== 1 ? 's' : '' }} found
        </span>
      </div>

      <div class="grid gap-4">
        <div
          v-for="store in results"
          :key="store.id"
          class="card hover:shadow-xl transition-shadow duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ store.name }}
                </h3>
                <span
                  v-if="store.pickupAvailable"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Available
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  Out of Stock
                </span>
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 mb-2">
                {{ store.address }}
              </p>
              
              <p class="text-sm text-gray-500 dark:text-gray-500 mb-3">
                {{ formatDistance(store.distance) }} • {{ formatPhone(store.phone) }}
              </p>
              
              <p
                v-if="store.pickupAvailable && store.pickupTime"
                class="text-sm font-medium text-apple-600 dark:text-apple-400"
              >
                {{ store.pickupTime }}
              </p>
            </div>
            
            <div class="flex flex-col space-y-2 ml-4">
              <a
                :href="`tel:${store.phone}`"
                class="btn-secondary text-sm py-2 px-3"
              >
                Call Store
              </a>
              <a
                href="https://www.apple.com/retail/"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary text-sm py-2 px-3"
              >
                Visit Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
