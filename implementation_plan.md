# Krishi Setu (Frontend) — Setup & Initial Architecture Plan

Setup of the complete frontend development environment for **Krishi Setu / Kisan Direct (SIH26033)** inside `C:\Users\anura\OneDrive\Desktop\krishi-setu` (GitHub: `https://github.com/itsanuragv/krishi-setu`).

## Target Tech Stack (Frontend-Only Architecture)

Based on the official SIH system architecture document:
- **Framework**: Next.js 15 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **UI Components & Icons**: `lucide-react`, Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, etc.), `clsx`, `tailwind-merge`, `class-variance-authority`
- **Data Fetching & Server State**: `@tanstack/react-query`
- **Client State**: `zustand` (Auth/Role session, Cart, Voice UI state, Offline queue)
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Charts & Data Visualization**: `recharts` (Farmer earnings, Mandi price trends, Admin analytics)
- **Mobile / Rural UX Enhancements**:
  - `browser-image-compression` (client-side image compression for low-bandwidth rural networks)
  - Web Speech API integration (Hindi & regional vernacular voice navigation & listing)
- **Maps & Logistics Visualization**: Leaflet / React-Leaflet (OpenStreetMap with Google Maps fallback configuration)
- **Notifications & Feedback**: `sonner` / Toaster

---

## User Review Required

> [!IMPORTANT]
> **Directory & Repo**:
> We are setting up Next.js directly inside `C:\Users\anura\OneDrive\Desktop\krishi-setu` which is linked to `https://github.com/itsanuragv/krishi-setu` (branch `main`).
> This ensures simple single-click deployment to Vercel/Netlify without root folder overrides.

---

## Proposed Changes & Scaffolding

### 1. Next.js App Scaffolding
Inside `C:\Users\anura\OneDrive\Desktop\krishi-setu`:
- Initialize Next.js with TypeScript, Tailwind CSS, ESLint, App Router, and `@/*` path aliases.
- Install all specified frontend dependencies:
  - `@tanstack/react-query`, `zustand`, `lucide-react`, `recharts`
  - `react-hook-form`, `@hookform/resolvers`, `zod`
  - `browser-image-compression`
  - `leaflet`, `react-leaflet`, `@types/leaflet`
  - `sonner`, `clsx`, `tailwind-merge`, `class-variance-authority`

### 2. Project Architecture & Directory Layout
```
krishi-setu/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/                  # Phone OTP login
│   │   ├── (farmer)/
│   │   │   ├── farmer/dashboard/       # Produce listings, incoming offers
│   │   │   ├── farmer/add-crop/        # Voice/Form crop listing + image compression
│   │   │   ├── farmer/orders/          # Active orders & delivery status
│   │   │   └── farmer/earnings/        # Settlement ledger & bank credit stats (Module 14)
│   │   ├── (consumer)/
│   │   │   ├── consumer/marketplace/   # Hyperlocal (<25km) discovery & search
│   │   │   ├── consumer/orders/        # Order status & UPI escrow tracking
│   │   │   └── consumer/track/         # Real-time delivery tracking
│   │   ├── (bulk-buyer)/
│   │   │   └── buyer/dashboard/        # FPO / Bulk contract ordering
│   │   ├── (delivery)/
│   │   │   └── delivery/dashboard/     # Route optimization & PIN delivery release
│   │   ├── (admin)/
│   │   │   └── admin/dashboard/        # Quality dispute review & governance
│   │   ├── layout.tsx                  # Root layout with QueryProvider & Toaster
│   │   ├── page.tsx                    # Landing page & Persona selector
│   │   └── globals.css                 # Tailwind base styles & theme tokens
│   ├── components/
│   │   ├── ui/                         # Base button, card, modal, badge, input
│   │   ├── shared/                     # Navbar, Footer, VoiceGuidanceButton, LanguageSelector
│   │   └── maps/                       # Hyperlocal radius & delivery route map component
│   ├── hooks/
│   │   ├── use-voice-input.ts          # Web Speech API hook for Hindi & English
│   │   └── use-image-compressor.ts     # Client-side photo compression utility
│   ├── lib/
│   │   ├── api.ts                      # Backend API client / mock data generator
│   │   ├── query-provider.tsx          # TanStack Query client wrapper
│   │   ├── store.ts                    # Zustand stores (user role, language, cart)
│   │   └── utils.ts                    # cn() and formatting helpers
│   └── types/
│       ├── crop.ts                     # Listing, grade, pricing interfaces
│       ├── order.ts                    # Order state machine & escrow types
│       └── user.ts                     # Role definitions (farmer, consumer, fpo, etc.)
├── .env.example
├── README.md
├── package.json
└── tailwind.config.ts
```

### 3. Environment & Git Integration
- Configure `.env.example` with placeholders for backend URL, Google Maps API key, Razorpay key ID.
- Create an initial clean git commit to verify the setup.

---

## Verification Plan

### Automated Checks
1. `npm run build` or `npm run type-check` to confirm zero TypeScript compilation errors.
2. Verify package dependencies resolve without conflicts.
3. Launch Next.js local dev server on port 3000 and verify the HTTP response.
