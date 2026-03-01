# CLAUDE.md — Masaralaqar Codebase Guide

## Project Overview

**Masaralaqar** (مسارالعقار) is a Next.js 15 SaaS platform for AI-powered real estate management in Saudi Arabia. It provides real estate agents with tools to manage property listings, client leads, subscriptions, and an AI assistant (Saqr system integration).

The UI is entirely in **Arabic (RTL)**, with a dark-themed design using orange/gold brand colors.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.1.0 (App Router) |
| Language | TypeScript 5.x (strict mode) |
| UI Components | Shadcn/ui + Radix UI primitives |
| Styling | Tailwind CSS 3.4.1 (RTL, dark mode) |
| Animations | Framer Motion 11.x |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage + Cloudinary (optional) |
| Content | MDX (@next/mdx) for blog posts |
| Deployment | Vercel |
| Package Manager | npm |
| Node | >= 20.0.0 |

---

## Repository Structure

```
masaralaqar/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin panel (15+ pages)
│   │   │   ├── blog/           # Blog management
│   │   │   ├── library/        # Library management
│   │   │   ├── leads/          # Lead management
│   │   │   ├── payments/       # Payment verification
│   │   │   └── invoices/       # Invoice management
│   │   ├── auth/               # Auth pages (signup, verify, reset-password)
│   │   ├── blog/               # Public blog
│   │   ├── dashboard/          # User dashboard
│   │   ├── products/           # Product/subscription pages
│   │   ├── library/            # Resource library
│   │   ├── contact/            # Contact form
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout (dir="rtl", lang="ar")
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── admin/              # Admin sidebar, auth guard
│   │   ├── ui/                 # Shadcn/ui components (button, card, etc.)
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── root-layout-guard.tsx
│   ├── hooks/
│   │   └── useAuth.ts          # Authentication hooks
│   └── lib/
│       ├── auth.ts             # Supabase auth functions (163 lines)
│       ├── supabase.ts         # DB client + blog/library CRUD (213 lines)
│       ├── payments.ts         # Subscription & payment logic (332 lines)
│       ├── agents.ts           # Agent onboarding functions (200 lines)
│       ├── leads.ts            # Lead management (85 lines)
│       ├── cloudinary.ts       # Image upload helpers (157 lines)
│       └── utils.ts            # Shared utilities
├── supabase/
│   ├── auth-schema.sql         # Users table
│   ├── schema.sql              # Blog & library tables
│   ├── payment-schema.sql      # Subscription tables
│   └── migrations/             # Numbered migration files (003–009)
├── public/                     # Static assets (logo.svg, robots.txt, sitemap.xml)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # Shadcn/ui config
├── vercel.json
└── .eslintrc.json
```

---

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional — for image uploads via Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

> All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. **Never store secrets in `NEXT_PUBLIC_` vars.**

---

## Authentication System

### Core Functions (`src/lib/auth.ts`)

```typescript
signUp(email, password, name, company)  // Creates auth user + profile row
signIn(email, password)                 // Returns session
signOut()                               // Clears session
getCurrentUser()                        // Returns current auth user
getUserProfile(userId)                  // Returns users table row
updateUserProfile(userId, updates)      // Updates users table row
```

### React Hooks (`src/hooks/useAuth.ts`)

```typescript
useAuth()           // { user, profile, loading } — current session
useRequireAuth()    // Redirects to /login if unauthenticated
useRequireAdmin()   // Redirects to /dashboard if not admin role
```

### User Roles

- `user` — default role, accesses `/dashboard`
- `admin` — accesses `/admin` panel, can verify payments

### Route Protection Pattern

Use hooks in page components, not middleware:
```typescript
// In any protected page component
const { user, profile, loading } = useRequireAuth();
// or for admin pages:
const { user, profile, loading } = useRequireAdmin();
```

---

## Database Schema

### Key Tables

**`users`** (extends `auth.users`)
```sql
id UUID PRIMARY KEY,
email TEXT UNIQUE,
name TEXT,
company TEXT,
phone TEXT,
role TEXT DEFAULT 'user',          -- 'user' | 'admin'
subscription TEXT DEFAULT 'free',  -- 'free' | 'pro' | 'enterprise'
created_at TIMESTAMP,
updated_at TIMESTAMP
```

**`agents`**
```sql
id UUID PRIMARY KEY,
user_id UUID UNIQUE,
office_name TEXT,
office_logo_url TEXT,
city TEXT,
whatsapp_number TEXT,
properties JSONB,                  -- Array of Property objects
agent_name TEXT,
response_style TEXT,               -- 'formal' | 'friendly'
welcome_message TEXT,
webhook_url TEXT,
webhook_secret TEXT,
onboarding_completed BOOLEAN
```

**`leads`**
```sql
id UUID PRIMARY KEY,
name TEXT, phone TEXT, email TEXT UNIQUE,
subject TEXT, message TEXT,
source TEXT DEFAULT 'website',
status TEXT DEFAULT 'new'  -- 'new' | 'contacted' | 'trial_started' | 'converted' | 'lost'
```

**`subscription_plans`** / **`user_subscriptions`** / **`bank_transfers`** / **`invoices`**
See `supabase/payment-schema.sql` for full definitions.

### RLS Policies

All tables use Row Level Security. Key rules:
- Users can only read/update their **own** profile row
- Admins can read **all** users
- Published blog posts and library resources are **public**
- Only admins can read leads and payment data
- Storage buckets have separate policies

### Running Migrations

Apply SQL files directly in Supabase Dashboard → SQL Editor, in numeric order (003 → 009).

---

## Payment System (`src/lib/payments.ts`)

### Subscription Plans

| Plan | Price (SAR) | Max Properties | Max Leads |
|------|------------|---------------|-----------|
| Free | 0 | 5 | 10 |
| Basic | TBD | 25 | 50 |
| Pro | TBD | Unlimited | Unlimited |

### Payment Flow

1. User selects plan → submits bank transfer details
2. Creates `bank_transfers` row (status: `pending`)
3. Admin reviews in `/admin/payments`
4. Admin verifies → updates status to `verified`, activates subscription
5. Invoice generated automatically

### Key Functions

```typescript
getSubscriptionPlans()             // List all plans
getUserSubscription(userId)        // Get active subscription
createBankTransfer(data)           // Submit payment proof
getUserBankTransfers(userId)       // List user payments
verifyBankTransfer(id, adminId)    // Admin verify (updates status)
getUserInvoices(userId)            // List invoices
```

---

## Content Management

### Blog Posts (`src/lib/supabase.ts`)

```typescript
getBlogPosts(publishedOnly?)       // List posts
getBlogPost(slug)                  // Single post by slug
createBlogPost(data)               // Admin: create
updateBlogPost(id, data)           // Admin: update
deleteBlogPost(id)                 // Admin: delete
```

Blog posts support MDX content stored in the `content` column.

### Library Resources

Similar CRUD pattern. Types: `'book' | 'course' | 'template' | 'tool'`

### Image Uploads

- **Blog images**: Supabase Storage bucket `blog-images`
- **Office logos**: Supabase Storage bucket (per-user)
- **Cloudinary**: Alternative for general image uploads via `src/lib/cloudinary.ts`

---

## Key Conventions

### TypeScript

- Strict mode is **enabled** — no `any` types unless absolutely necessary
- All database records have TypeScript interfaces (see `src/lib/supabase.ts` and `src/lib/payments.ts`)
- Path alias `@/*` maps to `src/*`

### Component Patterns

- Use Shadcn/ui components from `src/components/ui/` — don't reinvent buttons, cards, inputs
- Admin components live in `src/components/admin/`
- Page files are in `src/app/` following App Router conventions

### Styling

- **Tailwind only** — no CSS modules or styled-components
- Dark mode is class-based (`dark:` prefix) — root element has `dark` class applied
- RTL layout: root `<html>` has `dir="rtl"` and `lang="ar"`
- Brand colors: `primary` = `#F97316` (orange), `secondary` = `#D4A017` (gold)
- Custom fonts: Cairo (primary Arabic), Sora, IBM Plex Sans Arabic, JetBrains Mono

### Error Handling

- Wrap Supabase calls in try-catch
- Return `{ data, error }` pattern consistent with Supabase SDK
- User-facing error messages are in **Arabic**

### Security

- **Never** expose Supabase service role key to the browser
- Use RLS policies — don't bypass them with service role unless in server-side only code
- Sanitize markdown/HTML with DOMPurify before rendering
- Security headers are configured in `next.config.ts` (X-Frame-Options, XSS protection, etc.)

### State Management

- No Redux or Zustand — use React hooks + Supabase real-time subscriptions
- Auth state managed through `useAuth()` hook

---

## Admin Panel

Located at `/admin`. Protected by `useRequireAdmin()` hook.

### Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/blog` | Create/edit/delete blog posts |
| `/admin/library` | Manage resource library |
| `/admin/leads` | View and manage leads |
| `/admin/payments` | Verify bank transfers |
| `/admin/invoices` | Manage invoices |

**To create an admin user**: Set `role = 'admin'` in the `users` table via Supabase Dashboard for the target user's row.

---

## Agent Onboarding (`src/lib/agents.ts`)

The Saqr AI assistant integration allows agents to configure:
- Office info (name, logo, city, WhatsApp)
- Property listings (stored as JSONB array)
- AI personality (formal/friendly, welcome message)
- Webhook URL + secret for AI assistant callbacks

---

## Linting & Code Quality

```bash
npm run lint    # ESLint with next/core-web-vitals
```

ESLint config extends `next/core-web-vitals`. No additional plugins configured.

**Note**: `next.config.ts` has `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` — builds succeed even with lint/type errors. Fix errors locally before committing.

---

## Testing

No test framework is currently configured. When adding tests:
- Use **Vitest** (compatible with Next.js App Router)
- Use **React Testing Library** for component tests
- Use **MSW** (Mock Service Worker) for mocking Supabase API calls
- Place test files as `*.test.ts` or `*.spec.ts` co-located with source files

---

## Deployment

### Vercel (Primary)

```bash
# Deploy via Vercel CLI or GitHub integration
vercel --prod
```

Set environment variables in Vercel Dashboard → Project Settings → Environment Variables.

### Build Notes

- Build command: `npm run build`
- Output: `.next/` (standard Next.js output)
- Images from any HTTPS source are allowed (configured in `next.config.ts`)

---

## Documentation Files

| File | Contents |
|------|---------|
| `README.md` | Arabic quickstart guide |
| `AUTH_SETUP_GUIDE.md` | Full auth system setup (Arabic) |
| `PAYMENT_SYSTEM_GUIDE.md` | Payment flow and API docs (Arabic) |
| `CLEAR_DATA_GUIDE.md` | How to reset/clear database |
| `PROJECT_COMPLETION_GUIDE.md` | Feature checklist and schema overview |

---

## Common Tasks

### Add a New Page

1. Create `src/app/[route]/page.tsx`
2. If protected, add `useRequireAuth()` or `useRequireAdmin()` at top
3. Use Shadcn/ui components from `src/components/ui/`
4. Follow RTL layout conventions

### Add a New Database Table

1. Write SQL in `supabase/migrations/0XX_description.sql`
2. Include RLS policies in the migration file
3. Add TypeScript interface in the relevant `src/lib/*.ts` file
4. Run migration in Supabase Dashboard → SQL Editor

### Add a New Shadcn/ui Component

```bash
npx shadcn@latest add [component-name]
```

Components are added to `src/components/ui/`.

### Update Subscription Plans

Edit the `subscription_plans` table directly in Supabase Dashboard, or create a migration. Update the TypeScript interfaces in `src/lib/payments.ts` if structure changes.
