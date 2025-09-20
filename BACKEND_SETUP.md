# Backend Setup Guide

This guide will help you set up the backend infrastructure for the Apple Product Notifier.

## Prerequisites

- Node.js 20.19+ or 22.12+
- A Supabase account
- (Optional) Google Maps API key for geocoding
- (Optional) Twilio account for SMS notifications
- (Optional) SendGrid account for email notifications

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the Settings > API section

### Set up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL to create all tables, functions, and sample data

### Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Schema Overview

The database includes the following tables:

### `apple_stores`
- Stores Apple store locations with coordinates
- Includes sample data for San Francisco Bay Area stores
- Has PostGIS extension for geographic queries

### `product_availability`
- Tracks availability of specific products at each store
- Links to apple_stores table
- Includes last_checked timestamp for data freshness

### `notifications`
- Stores user notification preferences
- Supports email and SMS notifications
- Links to specific products and ZIP codes

### Key Functions

- `calculate_distance_miles()` - Calculates distance between coordinates
- `find_stores_within_radius()` - Finds stores within specified radius
- `update_updated_at_column()` - Auto-updates timestamps

## 3. API Services

### Store Service (`src/services/storeService.ts`)
- `searchStoresNearZipCode()` - Main search function
- `zipCodeToCoordinates()` - Converts ZIP to coordinates (needs geocoding service)
- `updateProductAvailability()` - Updates store inventory

### Notification Service (`src/services/notificationService.ts`)
- `createNotification()` - Creates notification subscriptions
- `getActiveNotificationsForProduct()` - Gets notifications for a product
- Validation functions for email and phone

## 4. Composables

### `useStoreSearch` (`src/composables/useStoreSearch.ts`)
- Manages search state and results
- Integrates with store service
- Handles loading and error states

### `useNotifications` (`src/composables/useNotifications.ts`)
- Manages notification form state
- Validates form data
- Handles notification creation

## 5. Current Limitations

### ZIP Code Geocoding
The current implementation uses hardcoded coordinates for testing. For production:

1. Get a Google Maps API key
2. Implement proper geocoding service
3. Add error handling for invalid ZIP codes

### Apple Store Data
Currently uses sample data. For production:

1. Research Apple's official store data source
2. Implement data fetching and parsing
3. Set up automated data refresh

### Notification Delivery
The notification system is set up but not yet integrated with SMS/Email services.

## 6. Next Steps

1. **Set up Supabase** following the steps above
2. **Test the search functionality** with the sample data
3. **Implement geocoding service** for real ZIP code support
4. **Add Apple store data integration**
5. **Set up notification delivery** (SMS/Email)
6. **Deploy to Vercel** with environment variables

## 7. Testing

After setup, you can test the application by:

1. Entering a ZIP code from the sample data:
   - **San Francisco Bay Area**: 94108, 94132, 94301, 95128, 94304
   - **Seattle Area**: 98121
2. Selecting an iPhone 17 Pro Max configuration
3. Clicking "Search Stores" to see results
4. Setting up notifications

The search should return stores within 25 miles of the ZIP code with availability information.

## 8. Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` exists with correct values
   - Restart the development server after adding env vars

2. **"Coordinates not found for ZIP code"**
   - The ZIP code isn't in the hardcoded list
   - Implement a proper geocoding service

3. **Database connection errors**
   - Check Supabase URL and anon key
   - Verify the database schema was created successfully
   - Check Row Level Security policies

### Debug Mode

The application includes console logging for debugging. Check the browser console for detailed error messages.
