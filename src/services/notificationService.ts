import { supabase, type Notification } from '@/lib/supabase'

export interface CreateNotificationParams {
  email?: string
  phone?: string
  zipCode: string
  productId: string
  color?: string
  storage?: string
  notificationTypes: ('email' | 'sms')[]
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
}

// Create a new notification subscription
export async function createNotification(params: CreateNotificationParams): Promise<Notification> {
  const { email, phone, zipCode, productId, color, storage, notificationTypes } = params
  
  // Validate that at least one contact method is provided
  if (!email && !phone) {
    throw new Error('Either email or phone number must be provided')
  }
  
  // Validate that at least one notification type is selected
  if (notificationTypes.length === 0) {
    throw new Error('At least one notification type must be selected')
  }
  
  // Check if a similar notification already exists
  let existingQuery = supabase
    .from('notifications')
    .select('*')
    .eq('zip_code', zipCode)
    .eq('product_id', productId)
    .eq('active', true)
  
  if (email) {
    existingQuery = existingQuery.eq('email', email)
  }
  if (phone) {
    existingQuery = existingQuery.eq('phone', phone)
  }
  if (color) {
    existingQuery = existingQuery.eq('color', color)
  }
  if (storage) {
    existingQuery = existingQuery.eq('storage', storage)
  }
  
  const { data: existing, error: checkError } = await existingQuery
  
  if (checkError) {
    console.error('Error checking existing notifications:', checkError)
    throw checkError
  }
  
  if (existing && existing.length > 0) {
    throw new Error('A similar notification subscription already exists')
  }
  
  // Create the notification
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      email,
      phone,
      zip_code: zipCode,
      product_id: productId,
      color: color?.toLowerCase().replace(' ', '-'),
      storage,
      notification_types: notificationTypes,
      active: true
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating notification:', error)
    throw error
  }
  
  return data
}

// Get notifications for a specific product and ZIP code (for checking availability)
export async function getActiveNotificationsForProduct(
  zipCode: string,
  productId: string,
  color?: string
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('zip_code', zipCode)
    .eq('product_id', productId)
    .eq('active', true)
  
  if (color) {
    query = query.eq('color', color.toLowerCase().replace(' ', '-'))
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
  
  return data || []
}

// Get all active notifications (for processing)
export async function getAllActiveNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching all notifications:', error)
    throw error
  }
  
  return data || []
}

// Update notification status
export async function updateNotification(
  id: string,
  updates: Partial<Notification>
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating notification:', error)
    throw error
  }
  
  return data
}

// Deactivate a notification
export async function deactivateNotification(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ active: false })
    .eq('id', id)
  
  if (error) {
    console.error('Error deactivating notification:', error)
    throw error
  }
}

// Get notification statistics
export async function getNotificationStats(): Promise<{
  total: number
  active: number
  byType: { email: number; sms: number }
}> {
  const { data: allNotifications, error } = await supabase
    .from('notifications')
    .select('active, notification_types')
  
  if (error) {
    console.error('Error fetching notification stats:', error)
    throw error
  }
  
  const total = allNotifications?.length || 0
  const active = allNotifications?.filter(n => n.active).length || 0
  
  let emailCount = 0
  let smsCount = 0
  
  allNotifications?.forEach(notification => {
    if (notification.active) {
      if (notification.notification_types.includes('email')) emailCount++
      if (notification.notification_types.includes('sms')) smsCount++
    }
  })
  
  return {
    total,
    active,
    byType: { email: emailCount, sms: smsCount }
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format (US format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/
  return phoneRegex.test(phone)
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}
