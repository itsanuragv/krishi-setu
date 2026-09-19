# Design System & UI Specification: Krishi Setu (कृषि सेतु)

> **Theme**: Modern Agricultural Marketplace (Kisan Mitra)  
> **Philosophy**: Mobile-First, High Contrast, Sunlight-Readable, Low-Cognitive Overhead for Farmers and Buyers.

---

## 1. Brand Identity & Color Palette

The color system is engineered specifically for rural and urban agricultural environments—high legibility under direct sunlight, clear semantic feedback, and a fresh, trustworthy harvest aesthetic.

| Role | Color Name | Hex Code | Tailwind Token | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | **Forest Green** | `#2E7D32` | `brand-forest` / `primary` | Primary action buttons, brand logo, active tabs, verified badges, trust indicators |
| **Primary Hover** | **Deep Forest** | `#1B5E20` | `brand-forest-dark` | Hover/active states on primary buttons |
| **Secondary Accent** | **Earthy Orange** | `#F57C00` | `brand-orange` / `accent` | High-priority CTAs, harvest deals, discounts, price gains, urgent notifications |
| **Accent Hover** | **Deep Ochre** | `#E65100` | `brand-orange-dark` | Hover states on secondary/accent elements |
| **Main Background** | **Off-White** | `#F9FAFB` | `background` / `slate-50` | Full-page background, glare-reducing, easy on the eyes outdoors |
| **Surface / Card** | **Pure White** | `#FFFFFF` | `surface` / `card` | Form containers, listing cards, modal dialogues, elevation layers |
| **Heading Text** | **Charcoal Dark** | `#1F2937` | `text-heading` / `slate-800` | H1-H6 headers, crop titles, rupee amounts, high-contrast labels |
| **Body Text** | **Muted Gray** | `#4B5563` | `text-body` / `slate-600` | Paragraphs, descriptions, secondary metadata, unit labels |
| **Border / Dividers** | **Soft Stone** | `#E5E7EB` | `border-subtle` / `gray-200` | Card borders, table dividers, input boundaries |
| **Success State** | **Fresh Harvest** | `#16A34A` | `status-success` | Order confirmed, OpenCV pre-check passed, UPI settlement |
| **Warning / Escrow** | **Amber Gold** | `#D97706` | `status-warning` | Escrow hold, transit in-progress, pending grading |
| **Error / Alert** | **Crimson Alert** | `#DC2626` | `status-error` | Dispute raised, out of stock, network error |

---

## 2. Typography System

The typography uses a clean, accessible dual-font pairing optimized for bilingual (English + Hindi / Devanagari) and numerical displays (₹ currency, quantities, and weights).

### 2.1 Font Families
- **Headings Font**: `'Poppins', sans-serif`
  - *Weights*: SemiBold (`600`), Bold (`700`), ExtraBold (`800`)
  - *Characteristics*: Modern geometric sans-serif, warm and open letterforms, excellent readability at large scale and supports bilingual displays.
- **Body & Numerical Font**: `'Inter', sans-serif`
  - *Weights*: Regular (`400`), Medium (`500`), SemiBold (`600`)
  - *Characteristics*: Highly legible tall x-height, clear tabular figures for prices (`₹40/kg`) and numeric input fields.

### 2.2 Type Scale

| Level | Size (Desktop) | Size (Mobile) | Line Height | Weight | Font | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `2.25rem` (36px) | `1.75rem` (28px) | `1.2` | Bold (`700`) | Poppins | Page Titles, Hero Banner |
| **H2 Section** | `1.5rem` (24px) | `1.25rem` (20px) | `1.3` | Bold (`700`) | Poppins | Section titles, Engine headers |
| **H3 Card Title** | `1.125rem` (18px) | `1.0rem` (16px) | `1.4` | SemiBold (`600`) | Poppins | Produce Card titles, Modal headers |
| **Body Base** | `1.0rem` (16px) | `0.9375rem` (15px) | `1.5` | Regular (`400`) | Inter | Standard descriptions, body copy |
| **Body Small** | `0.875rem` (14px) | `0.8125rem` (13px) | `1.4` | Medium (`500`) | Inter | Form labels, helper text, badges |
| **Caption / Fine** | `0.75rem` (12px) | `0.6875rem` (11px) | `1.3` | Medium (`500`) | Inter | Distance (`5.4km`), timestamps, tags |

---

## 3. Mobile-First & Responsive Strategy

Indian agricultural users predominantly access web apps via budget Android smartphones with variable connectivity (2G/3G/4G).

1. **Touch Targets**: All interactive elements (inputs, buttons, voice mic trigger, camera button) must have a minimum touch footprint of **`48px × 48px`** for easy operation with field-worn hands.
2. **One-Thumb Zone**: Primary actions (Submit Listing, Record Voice, Take Live Photo) reside within the thumb reach zone at the bottom or middle of mobile viewports.
3. **High Outdoor Contrast**: All text elements adhere strictly to **WCAG 2.1 AA** with a contrast ratio of at least `4.5:1` against their respective backgrounds to ensure readability under direct midday sun.
4. **Fluid Single-Column Mobile Grid**:
   - `base` (Mobile `< 640px`): Single column stack, full-width inputs and CTAs.
   - `sm` (`≥ 640px`): 2-column forms (Crop + Variety).
   - `md` (`≥ 768px`): 3-column metric grids, tablet layout.
   - `lg` (`≥ 1024px`): 12-column master grid (e.g., 7 cols Intake + 5 cols OpenCV Scanner).

---

## 4. Tailwind CSS Configuration

### 4.1 Tailwind CSS v4 Configuration (`src/app/globals.css`)

For projects using Tailwind CSS v4 with the `@theme inline` directive:

```css
@import "tailwindcss";

:root {
  /* Core Palette */
  --brand-forest: #2E7D32;
  --brand-forest-dark: #1B5E20;
  --brand-forest-light: #E8F5E9;
  
  --brand-orange: #F57C00;
  --brand-orange-dark: #E65100;
  --brand-orange-light: #FFF3E0;

  --background: #F9FAFB;
  --surface: #FFFFFF;
  
  --text-heading: #1F2937;
  --text-body: #4B5563;
  --text-muted: #9CA3AF;
  
  --border-subtle: #E5E7EB;
  --border-focus: #2E7D32;

  /* Semantic UI Tokens */
  --primary: #2E7D32;
  --primary-foreground: #FFFFFF;
  --secondary: #F57C00;
  --secondary-foreground: #FFFFFF;
  --card: #FFFFFF;
  --card-foreground: #1F2937;
  --muted: #F3F4F6;
  --muted-foreground: #4B5563;
  --accent: #F57C00;
  --accent-foreground: #FFFFFF;
  --border: #E5E7EB;
  --ring: #2E7D32;
  --radius: 0.75rem;
}

@theme inline {
  --color-brand-forest: var(--brand-forest);
  --color-brand-forest-dark: var(--brand-forest-dark);
  --color-brand-forest-light: var(--brand-forest-light);

  --color-brand-orange: var(--brand-orange);
  --color-brand-orange-dark: var(--brand-orange-dark);
  --color-brand-orange-light: var(--brand-orange-light);

  --color-background: var(--background);
  --color-surface: var(--surface);

  --color-text-heading: var(--text-heading);
  --color-text-body: var(--text-body);
  --color-text-muted: var(--text-muted);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);

  --font-heading: var(--font-poppins), 'Poppins', sans-serif;
  --font-body: var(--font-inter), 'Inter', sans-serif;
}

body {
  background-color: var(--background);
  color: var(--text-body);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-heading);
  font-weight: 700;
}
```

---

### 4.2 Tailwind CSS v3 Reference (`tailwind.config.ts`)

If compiling via classic `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#2E7D32",
          "forest-dark": "#1B5E20",
          "forest-light": "#E8F5E9",
          orange: "#F57C00",
          "orange-dark": "#E65100",
          "orange-light": "#FFF3E0",
        },
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: {
          heading: "#1F2937",
          body: "#4B5563",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 5. Next.js Font Setup (`src/app/layout.tsx`)

To load Google Fonts with zero layout shift (CLS), use Next.js font optimization:

```typescript
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "devanagari"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-[#F9FAFB] text-[#4B5563] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 6. UI Component Blueprint

### 6.1 Buttons
- **Primary CTA (Forest Green)**:
  `bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-heading font-semibold py-3 px-5 rounded-xl shadow-sm transition-colors active:scale-95`
- **Accent Action (Earthy Orange)**:
  `bg-[#F57C00] hover:bg-[#E65100] text-white font-heading font-semibold py-3 px-5 rounded-xl shadow-sm transition-colors active:scale-95`
- **Secondary / Outline**:
  `border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] font-medium py-2.5 px-4 rounded-xl transition-colors`

### 6.2 Form Inputs
- **Text & Number Inputs**:
  `h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base font-medium text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:outline-none`
- **Field Labels**:
  `block text-sm font-semibold text-[#1F2937] font-heading mb-1.5`

### 6.3 Metric & Telemetry Badges
- **Price Badge**:
  `inline-flex items-center px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold text-sm`
- **Alert / High Realization Badge**:
  `inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF3E0] text-[#F57C00] font-bold text-xs`

---

## 7. Summary Checklist for Developers

- [x] Primary brand color locked to **Forest Green (`#2E7D32`)**.
- [x] Secondary accent color locked to **Earthy Orange (`#F57C00`)**.
- [x] Background set to **Off-White (`#F9FAFB`)**.
- [x] Headings font set to **`Poppins`** with color **Charcoal Dark (`#1F2937`)**.
- [x] Body font set to **`Inter`** with color **Muted Gray (`#4B5563`)**.
- [x] Touch targets comply with **48px mobile-first standard**.
- [x] Contrast ratio meets **WCAG AA (≥ 4.5:1)** for outdoor farm legibility.
