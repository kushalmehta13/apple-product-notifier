# Apple Product Notifier - Requirements Document

## Project Overview
A web application that tracks iPhone 17 Pro Max availability for in-store pickup near a user's zip code.

## Core Features

### 1. Product Search Interface
- **Zip Code Input**: User enters their zip code
- **Product Selection**: User selects iPhone 17 Pro Max (specific variants TBD)
- **Search Results**: Display pickup availability within 25-mile radius

### 2. Store Information Display
- Store name
- Store address
- Distance from user's zip code
- Pickup availability timeframe

### 3. Notification System
- **SMS Notifications**: Alert users when product becomes available
- **Email Notifications**: Alternative notification method
- **No User Accounts Required**: Anonymous notifications via contact info

### 4. Data Management
- **Data Source**: URL-based data retrieval (implementation details TBD)
- **Check Frequency**: Every 5 minutes
- **Coverage**: Physical Apple stores only
- **Status Tracking**: Current availability status only

## Technical Requirements

### Frontend
- **Framework**: Vue.js
- **Design**: Modern, minimal, mobile-first
- **Theme Support**: Light and dark mode
- **Responsive**: Mobile-first design approach

### Backend
- **Database**: Supabase
- **Hosting**: Vercel
- **API**: RESTful endpoints for data retrieval
- **Scheduling**: Automated checks every 5 minutes

### Deployment
- **Repository**: GitHub
- **Hosting**: Vercel
- **CI/CD**: Automated deployment pipeline

## User Flow
1. User visits homepage
2. User enters zip code
3. User selects iPhone 17 Pro Max
4. System displays available stores with pickup times
5. User can optionally set up notifications (SMS/Email)
6. System monitors availability and sends notifications when available

## Future Considerations (Pinned for Later)
- Product specification details and filtering
- Out-of-stock scenario handling
- Historical availability tracking
- Additional Apple products beyond iPhone 17 Pro Max
- Price change tracking
- Online store availability

## Success Criteria
- Fast, responsive search results
- Accurate store availability data
- Reliable notification delivery
- Smooth mobile experience
- Clean, intuitive interface
