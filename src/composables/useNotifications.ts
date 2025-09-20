import { ref } from 'vue'
import { 
  createNotification, 
  type CreateNotificationParams,
  isValidEmail,
  isValidPhone,
  formatPhoneNumber
} from '@/services/notificationService'

export interface NotificationForm {
  email: string
  phone: string
  notificationTypes: ('email' | 'sms')[]
  zipCode: string
  productId: string
  color?: string
  storage?: string
}

export function useNotifications() {
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  const validateForm = (form: NotificationForm): string | null => {
    // Check if at least one contact method is provided
    if (!form.email && !form.phone) {
      return 'Please provide either an email address or phone number'
    }

    // Check if at least one notification type is selected
    if (form.notificationTypes.length === 0) {
      return 'Please select at least one notification method'
    }

    // Validate email if provided
    if (form.email && !isValidEmail(form.email)) {
      return 'Please enter a valid email address'
    }

    // Validate phone if provided
    if (form.phone && !isValidPhone(form.phone)) {
      return 'Please enter a valid phone number in format (555) 123-4567'
    }

    // Check if selected notification types match provided contact methods
    if (form.notificationTypes.includes('email') && !form.email) {
      return 'Email notification selected but no email address provided'
    }

    if (form.notificationTypes.includes('sms') && !form.phone) {
      return 'SMS notification selected but no phone number provided'
    }

    return null
  }

  const submitNotification = async (form: NotificationForm): Promise<boolean> => {
    const validationError = validateForm(form)
    if (validationError) {
      submitError.value = validationError
      return false
    }

    isSubmitting.value = true
    submitError.value = null
    submitSuccess.value = false

    try {
      const params: CreateNotificationParams = {
        zipCode: form.zipCode,
        productId: form.productId,
        color: form.color,
        storage: form.storage,
        notificationTypes: form.notificationTypes
      }

      if (form.email) {
        params.email = form.email
      }

      if (form.phone) {
        params.phone = formatPhoneNumber(form.phone)
      }

      await createNotification(params)
      submitSuccess.value = true
      return true

    } catch (error) {
      console.error('Error creating notification:', error)
      submitError.value = error instanceof Error ? error.message : 'Failed to set up notifications'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resetForm = () => {
    submitError.value = null
    submitSuccess.value = false
  }

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitNotification,
    resetForm,
    validateForm,
    isValidEmail,
    isValidPhone,
    formatPhoneNumber
  }
}
