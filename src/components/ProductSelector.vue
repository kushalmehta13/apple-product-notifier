<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const products = [
  {
    id: 'iphone-17-pro-max-256gb',
    name: 'iPhone 17 Pro Max',
    storage: '256GB',
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
  },
  {
    id: 'iphone-17-pro-max-512gb',
    name: 'iPhone 17 Pro Max',
    storage: '512GB',
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
  },
  {
    id: 'iphone-17-pro-max-1tb',
    name: 'iPhone 17 Pro Max',
    storage: '1TB',
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
  }
]

// Parse the current modelValue to extract product and color
const currentValue = computed(() => props.modelValue || '')

const selectedStorage = ref('')
const selectedColor = ref('')

// Parse the modelValue when it changes
const parseModelValue = () => {
  const value = currentValue.value
  if (!value) {
    selectedStorage.value = ''
    selectedColor.value = ''
    return
  }
  
  // Check if it's a complete selection (product-color)
  if (value.includes('-') && value.split('-').length >= 2) {
    const parts = value.split('-')
    const colorPart = parts[parts.length - 1]
    const productPart = parts.slice(0, -1).join('-')
    
    // Find the matching product
    const product = products.find(p => p.id === productPart)
    if (product) {
      selectedStorage.value = product.id
      selectedColor.value = colorPart
    }
  } else {
    // It's just a product selection
    const product = products.find(p => p.id === value)
    if (product) {
      selectedStorage.value = product.id
      selectedColor.value = ''
    }
  }
}

// Initialize values
parseModelValue()

const updateValue = () => {
  if (selectedStorage.value && selectedColor.value) {
    emit('update:modelValue', `${selectedStorage.value}-${selectedColor.value}`)
  } else if (selectedStorage.value) {
    emit('update:modelValue', selectedStorage.value)
  } else {
    emit('update:modelValue', '')
  }
}

const handleStorageChange = () => {
  selectedColor.value = '' // Reset color when storage changes
  updateValue()
}

const handleColorChange = () => {
  updateValue()
}

// Watch for external changes to modelValue
watch(() => props.modelValue, () => {
  parseModelValue()
})
</script>

<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      iPhone 17 Pro Max
    </label>
    
    <!-- Storage Selection -->
    <div>
      <label for="storage" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        Storage
      </label>
      <select
        id="storage"
        v-model="selectedStorage"
        @change="handleStorageChange"
        class="input-field"
      >
        <option value="">Select storage capacity</option>
        <option 
          v-for="product in products" 
          :key="product.id" 
          :value="product.id"
        >
          {{ product.storage }}
        </option>
      </select>
    </div>

    <!-- Color Selection -->
    <div>
      <label for="color" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        Color
      </label>
      <select
        id="color"
        v-model="selectedColor"
        @change="handleColorChange"
        :disabled="!selectedStorage"
        class="input-field disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">
          {{ selectedStorage ? 'Select color' : 'Select storage first' }}
        </option>
        <option 
          v-for="color in products.find(p => p.id === selectedStorage)?.colors || []" 
          :key="color" 
          :value="color.toLowerCase().replace(' ', '-')"
        >
          {{ color }}
        </option>
      </select>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400">
      Choose your preferred storage and color
    </p>
  </div>
</template>
