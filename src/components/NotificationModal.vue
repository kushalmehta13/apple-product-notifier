<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  zipCode: string
  product: string
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationForm = reactive({
  email: '',
  phone: '',
  notificationTypes: {
    email: false,
    sms: false
  }
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

const handleSubmit = async () => {
  if (!notificationForm.email && !notificationForm.phone) {
    return
  }

  if (notificationForm.notificationTypes.email && !isValidEmail(notificationForm.email)) {
    return
  }

  if (notificationForm.notificationTypes.sms && !isValidPhone(notificationForm.phone)) {
    return
  }

  isSubmitting.value = true

  // Simulate API call - replace with actual API call later
  setTimeout(() => {
    isSubmitting.value = false
    submitSuccess.value = true
    
    // Close modal after 2 seconds
    setTimeout(() => {
      emit('close')
    }, 2000)
  }, 1500)
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            Set Up Notifications
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Success State -->
        <div v-if="submitSuccess" class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Notifications Set Up!
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            You'll be notified when {{ props.product }} becomes available near {{ props.zipCode }}
          </p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Search Details
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ props.product }}</span> near ZIP code <span class="font-medium">{{ props.zipCode }}</span>
            </p>
          </div>

          <!-- Notification Types -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Notification Methods
            </label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="notificationForm.notificationTypes.email"
                  type="checkbox"
                  class="rounded border-gray-300 text-apple-600 focus:ring-apple-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="notificationForm.notificationTypes.sms"
                  type="checkbox"
                  class="rounded border-gray-300 text-apple-600 focus:ring-apple-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
              </label>
            </div>
          </div>

          <!-- Email Input -->
          <div v-if="notificationForm.notificationTypes.email">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="notificationForm.email"
              type="email"
              placeholder="your@email.com"
              class="input-field"
              required
            />
          </div>

          <!-- Phone Input -->
          <div v-if="notificationForm.notificationTypes.sms">
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="notificationForm.phone"
              type="tel"
              placeholder="(555) 123-4567"
              class="input-field"
              required
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              US phone numbers only. Standard message rates may apply.
            </p>
          </div>

          <!-- Submit Button -->
          <div class="flex space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || (!notificationForm.email && !notificationForm.phone) || (!notificationForm.notificationTypes.email && !notificationForm.notificationTypes.sms)"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up...
              </span>
              <span v-else>Set Up Notifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
