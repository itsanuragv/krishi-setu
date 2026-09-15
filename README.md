# Krishi Setu (Frontend)

Farm-to-buyer marketplace demo (SIH 26033). Next.js App Router, mocked API via MSW, five role dashboards.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts (OTP `123456`)

| Role | Phone |
|---|---|
| Farmer | 9876543210 |
| Consumer | 9876543211 |
| Delivery | 9876543212 |
| Admin | 9876543213 |
| FPO / Bulk buyer | 9876543214 |

## API mode

- `NEXT_PUBLIC_API_MODE=mock` — MSW intercepts `/api/*`
- `NEXT_PUBLIC_API_MODE=live` — requests go to `NEXT_PUBLIC_API_BASE_URL`

Components never call `fetch` directly; use `src/lib/api-client.ts` and `src/features/api.ts`.

## Key Features & Architecture (SIH 26033)

- **Vernacular Voice-First Assistant (`src/components/shared/voice-assistant.tsx`)**: AI-guided voice navigation and agricultural voice commands in Hindi (`hi-IN`) and English (`en-IN`) using Web Speech API.
- **Interactive PostGIS Map Tracking (`src/components/shared/map-view.tsx`)**: Real-time Leaflet & OpenStreetMap rendering with Farm origin, Consumer destination, Transit vehicle marker, and a `<25km` spatial proximity boundary circle.
- **5-Factor Matching UI (Modules 3, 4, 7)**: Transparent score breakdown (Quantity fit, Price fit, Distance, Quality Grade, and Trust Score) displayed to farmers and buyers.
- **Ledger-Based Escrow & Handover PIN (Module 9 & 11)**: Payments held securely in platform escrow until consumer enters their 4-digit handover PIN upon physical delivery.
- **Trust & Rating System (Module 15)**: Post-delivery rating modal and dedicated Farmer Ratings dashboard (`/farmer/ratings`) with transparent 4-pillar trust formula.
- **Client-Side Photo Compression**: Powered by `browser-image-compression` on the produce listing form (`/farmer/sell`) to support rural 2G/3G/4G connections.
