<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isValidZipCode = (zip: string): boolean => {
  // US ZIP code validation (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '') // Remove non-digits
  
  // Format as 5 digits or 5-4 format
  if (value.length > 5) {
    value = value.substring(0, 5) + '-' + value.substring(5, 9)
  }
  
  emit('update:modelValue', value)
}

const isInvalid = props.modelValue.length > 0 && !isValidZipCode(props.modelValue)
</script>

<template>
  <div>
    <label for="zipcode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      ZIP Code
    </label>
    <input
      id="zipcode"
      type="text"
      :value="modelValue"
      @input="handleInput"
      placeholder="12345 or 12345-6789"
      maxlength="10"
      class="input-field"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': isInvalid }"
    />
    <p v-if="isInvalid" class="mt-1 text-sm text-red-600 dark:text-red-400">
      Please enter a valid ZIP code
    </p>
    <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Enter your ZIP code to find nearby stores
    </p>
  </div>
</template>
