# Nedaxer Trading Platform

## Overview

Nedaxer is a comprehensive cryptocurrency trading platform designed for regulated, limited-risk trading. It offers spot trading, futures trading, staking, and administrative tools. The platform's vision is to provide a full-featured trading experience with a focus on modern web technologies and a professional aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 18, 2025)

### Navigation Link Fixes ✅ COMPLETED
- **Fixed Incorrect Navigation Links**: Updated "Open Account" and "Sign In" buttons to use correct routing paths
- **Files Modified**:
  - `client/src/components/hero-slider.tsx` - Fixed `/register` and `/login` to `/account/register` and `/account/login`
  - `client/src/pages/company/about.tsx` - Fixed `/register` to `/account/register` in call-to-action section
- **Issue Resolution**: Landing page buttons now correctly navigate to registration and login pages instead of 404 errors

### Navigation Transition Update ✅ COMPLETED
- **Changed Page Transitions**: Updated navigation transitions from sliding glass effect to smooth fade-in animation
- **Files Modified**: 
  - `client/src/components/page-transition.tsx` - Changed from sliding x-transform to opacity-only fade
- **Performance Improvement**: Simpler fade transition is more performant and provides cleaner visual experience
- **Duration**: 0.2s on mobile, 0.3s on desktop with smooth easeInOut timing

### Desktop View Detection Improvements ✅ COMPLETED
- **Enhanced Desktop Detection Logic**: Improved screen size threshold from 1200px to 1024px with touch device detection
- **Manual Layout Toggle**: Added layout mode toggle component in profile settings for user control
- **Files Modified**:
  - `client/src/components/adaptive-layout.tsx` - Updated detection logic with proper aspect ratio and touch checks
  - `client/src/components/layout-mode-toggle.tsx` - New component for manual layout switching
  - `client/src/pages/mobile/profile-settings.tsx` - Added layout toggle to settings
- **User Experience**: Users can now manually switch between mobile and desktop modes with persistent localStorage

### Ethereum Deposit Address Update ✅ COMPLETED
- **Updated ETH Chain Address**: Changed Ethereum deposit address from `0x126975caaf44D603307a95E2d2670F6Ef46e563C` to `0xDD843A736960D0dd2508c02389AF61970D2a6185`
- **Files Modified**: Updated deposit addresses in all relevant files:
  - `server/routes.mongo.ts` - Backend deposit address lookup
  - `client/src/components/desktop-pages/desktop-deposit-details.tsx` - Desktop deposit interface
  - `client/src/pages/mobile/deposit-details.tsx` - Mobile deposit interface
  - `client/src/components/address-display.tsx` - Address display component
  - `client/src/components/desktop-pages/desktop-deposit-banner.tsx` - Desktop deposit banner
  - `client/src/pages/mobile/address-display.tsx` - Mobile address display
  - `client/src/pages/mobile/deposit-address-page.tsx` - Mobile deposit address page
- **QR Code Integration**: All QR codes automatically generate with the new address
- **Chain Specificity**: Only ETH chain address updated; ETH (BEP-20) address remains unchanged

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing (hash-based navigation)
- **State Management**: TanStack Query (React Query)
- **UI Framework**: Tailwind CSS with shadcn/ui
- **Build Tool**: Vite
- **Charts**: Recharts
- **UI/UX Decisions**:
    - Modern fintech-style navigation with glass slide transitions (`backdrop-filter: blur(10px)`).
    - Hardware-accelerated animations (`transform: translateX()`, `opacity`) with custom cubic-bezier easing.
    - Responsive design with mobile-specific optimizations (reduced blur, faster transitions).
    - Consistent deep navy blue (`#0a0e1a`, `#000d2e`) and orange (`#ff8c00`) color scheme across the platform.
    - Professional email templates redesigned with brand colors, bold amount displays, and Trustpilot integration.
    - Automated unique "smile face" profile picture generation for new and existing users.
    - Enhanced password reset UI with prominent input fields and clear instructions.
    - Prominent, animated success banners for user feedback.
    - Professional executive team profile images on the About page.
    - Refined typography with optimized font sizes across landing pages.
    - Simplified mobile UI by removing redundant elements like search bars, quick actions grids, and currency dropdowns.
    - User-controlled layout mode persistence (mobile/desktop) and complete prevention of mobile zoom.
    - Interactive video chatbot with side-mounted position and message history.
    - Real-time desktop notifications with WebSocket integration and animated badges.
    - Professional sidebar redesign for desktop with user profile pictures and comprehensive navigation.
    - Seamless dark theme (`#0a0a2e`, `#1a1a40`) across the mobile app, eliminating visible headers.

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ES modules)
- **Framework**: Express.js for REST API
- **Database**: MongoDB Atlas using Mongoose ODM
- **Session Management**: Express-session
- **Authentication**: Session-based with bcrypt password hashing, supports Google OAuth.
- **Email**: Nodemailer with Zoho Mail SMTP for transactional emails, including comprehensive email verification.
- **Admin Panel**: Comprehensive dashboard for platform management (user, market, financial control, KYC).
- **Hardcoded Admin Credentials**: Multiple hardcoded admin accounts for system resilience.
- **Real-time Data**: WebSocket integration for live price updates, notifications, and administrative actions.
- **Comprehensive Caching**: 10-minute localStorage caching for CoinGecko API data across all client-side pages and file-based caching for server-side market data (106 cryptocurrencies).

### System Design Choices
- **Trading System**: Spot trading, futures trading, staking, order management.
- **User Management**: Authentication, role-based authorization (user/admin), KYC, profile management.
- **Financial Operations**: Multi-currency wallet system, cryptocurrency deposits/withdrawals, balance management.
- **Data Flow**: Defined processes for user registration, trading, and administrative actions.
- **Pending Registration System**: Users are not created in the database until email verification is completed, with a 10-minute timeout for unverified registrations.
- **Admin Deposit Approval**: Admin dashboard for approving user deposit requests with email notifications.
- **Refined Connection Request System**: Automated connection request processing with animated borders and enhanced visual design.
- **Transaction Details**: Dedicated pages for deposit, withdrawal, and transfer details with consistent layouts.
- **Multi-source Real-time Currency Exchange**: Integration with multiple APIs for 163+ world currencies with failover and caching.
- **PWA Installation**: Supports PWA installation.

## External Dependencies

- **CoinGecko API**: Real-time market data, price feeds, and news.
- **Zoho Mail SMTP**: Primary email service for transactional emails (verification, confirmations, resets).
- **GitHub Models API**: AI chatbot integration (`gpt-4o-mini` model) for customer support.
- **MongoDB Atlas**: Primary database for all application data.
- **Google OAuth**: User authentication and registration.
- **DiceBear**: Automated generation of user profile pictures ("smile face" and "bottts" styles).
- **Framer Motion**: Frontend animation library for smooth UI transitions.
- **Recharts**: Charting library for data visualization.
- **Sharp**: Image processing.
- **QRCode**: QR code generation.
- **Axios**: HTTP client for API communication.
- **TradingView**: Charting library for cryptocurrency trading charts (with caching optimization).
- **ExchangeRate-API**: Real-time currency exchange rates.
- **Unsplash/Pexels**: Image sources for news and general UI elements.