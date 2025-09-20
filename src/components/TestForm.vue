<template>
  <div class="p-4 border rounded-lg">
    <h3 class="text-lg font-bold mb-4">Form Test</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">ZIP Code:</label>
        <input 
          v-model="zipCode"
          type="text"
          placeholder="Enter ZIP code"
          class="w-full p-2 border rounded"
        />
        <p class="text-sm text-gray-500 mt-1">Current: "{{ zipCode }}"</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Storage:</label>
        <select v-model="storage" class="w-full p-2 border rounded">
          <option value="">Select storage</option>
          <option value="256gb">256GB</option>
          <option value="512gb">512GB</option>
          <option value="1tb">1TB</option>
        </select>
        <p class="text-sm text-gray-500 mt-1">Current: "{{ storage }}"</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Color:</label>
        <select v-model="color" :disabled="!storage" class="w-full p-2 border rounded">
          <option value="">Select color</option>
          <option value="natural">Natural Titanium</option>
          <option value="blue">Blue Titanium</option>
          <option value="white">White Titanium</option>
          <option value="black">Black Titanium</option>
        </select>
        <p class="text-sm text-gray-500 mt-1">Current: "{{ color }}"</p>
      </div>
    </div>
    
    <div class="mt-4 p-2 bg-gray-100 rounded text-sm">
      <strong>Debug:</strong><br>
      ZIP: "{{ zipCode }}"<br>
      Storage: "{{ storage }}"<br>
      Color: "{{ color }}"<br>
      Combined: "{{ combined }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const zipCode = ref('')
const storage = ref('')
const color = ref('')

const combined = computed(() => {
  if (storage.value && color.value) {
    return `${storage.value}-${color.value}`
  } else if (storage.value) {
    return storage.value
  }
  return ''
})
</script>
