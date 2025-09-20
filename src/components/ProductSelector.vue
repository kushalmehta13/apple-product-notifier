<script setup lang="ts">
import { ref, watch } from 'vue'

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

const selectedProduct = ref('')
const selectedColor = ref('')

const handleProductChange = () => {
  emit('update:modelValue', `${selectedProduct.value}-${selectedColor.value}`)
}

const handleColorChange = () => {
  if (selectedProduct.value) {
    emit('update:modelValue', `${selectedProduct.value}-${selectedColor.value}`)
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const [product, color] = newValue.split('-').slice(-2)
    selectedProduct.value = newValue.replace(`-${color}`, '')
    selectedColor.value = color
  }
}, { immediate: true })
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
        v-model="selectedProduct"
        @change="handleProductChange"
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
    <div v-if="selectedProduct">
      <label for="color" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        Color
      </label>
      <select
        id="color"
        v-model="selectedColor"
        @change="handleColorChange"
        class="input-field"
      >
        <option value="">Select color</option>
        <option 
          v-for="color in products.find(p => p.id === selectedProduct)?.colors || []" 
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
