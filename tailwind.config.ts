import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── MQ / WhatsApp-inspired SaaS tokens ─────────
        mq: {
          green:        '#25D366',
          'green-hover':'#1EBE5A',
          /** كان أزرق — الآن أخضر داكن للحدود/ثانوي */
          blue:         '#15803D',
          orange:       '#F59E0B',
          'orange-hover':'#D97706',
          main:         '#F1F5F9',
          card:         '#FFFFFF',
          hover:        '#E2E8F0',
        },
        // ─── Brand: Masar AlAqar ─────────────────────────
        // Primary: أخضر (واتساب / MQ)
        primary: {
          DEFAULT: '#25D366',
          dark:    '#16A34A',
          light:   '#4ADE80',
        },
        // Accent: Golden Orange
        accent: {
          DEFAULT: '#F59E0B',
          dark:    '#D97706',
          light:   '#FBBF24',
        },
        // Brand neutrals (marketing / light sections)
        brand: {
          dark:      '#111827',
          muted:     '#6B7280',
          background: '#F9FAFB',
        },
        // Secondary (alias for accent — used by product pages)
        secondary: {
          DEFAULT: '#F59E0B',
          dark:    '#D97706',
          light:   '#FBBF24',
        },
        // Legacy gold (alias for accent where used)
        gold: {
          DEFAULT: '#F59E0B',
          dark:    '#D97706',
          light:   '#FBBF24',
        },
        // ─── Backgrounds (light theme) ────────────────────
        background:     '#F1F5F9',
        surface:        '#FFFFFF',
        card:           '#FFFFFF',
        'card-hover':   '#F8FAFC',
        // ─── Borders ──────────────────────────────────────
        border:         'rgba(15, 23, 42, 0.08)',
        'border-subtle':'rgba(15, 23, 42, 0.06)',
        'border-gold':  'rgba(245, 158, 11, 0.25)',
        // ─── Text ─────────────────────────────────────────
        'text-primary':   '#0F172A',
        'text-secondary': '#475569',
        'text-muted':     '#64748B',
        // ─── States ───────────────────────────────────────
        success:  '#34D399',
        warning:  '#FBBF24',
        error:    '#F87171',
      },
      fontFamily: {
        cairo:        ['Cairo', 'sans-serif'],
        sora:         ['Sora', 'sans-serif'],
        'ibm-arabic': ['IBM Plex Sans Arabic', 'sans-serif'],
        ibm:          ['IBM Plex Sans', 'sans-serif'],
        jetbrains:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-in-out',
        'fade-up':     'fadeUp 0.6s ease-out',
        'glow-blue':   'glowBlue 3s ease-in-out infinite alternate',
        'glow-gold':   'glowGold 3s ease-in-out infinite alternate',
        'float':       'float 7s ease-in-out infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'orbit':       'orbit 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowBlue: {
          '0%':   { boxShadow: '0 0 20px rgba(37,211,102,0.25)' },
          '100%': { boxShadow: '0 0 50px rgba(37,211,102,0.45), 0 0 80px rgba(37,211,102,0.18)' },
        },
        glowGold: {
          '0%':   { boxShadow: '0 0 20px rgba(229,184,74,0.2)' },
          '100%': { boxShadow: '0 0 50px rgba(229,184,74,0.45), 0 0 80px rgba(229,184,74,0.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern':      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2325D366' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':       "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2325D366' fill-opacity='0.07'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
        'shimmer-gradient':  'linear-gradient(90deg, transparent 0%, rgba(37,211,102,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-blue':   '0 0 30px rgba(37,211,102,0.35)',
        'glow-gold':   '0 0 30px rgba(245,158,11,0.25)',
        'card':        '0 1px 3px rgba(15,23,42,0.06), 0 4px 20px rgba(15,23,42,0.06)',
        'card-hover':  '0 8px 30px rgba(15,23,42,0.1), 0 0 0 1px rgba(37,211,102,0.15)',
        'mq-card':     '0 4px 24px rgba(15,23,42,0.07), 0 0 0 1px rgba(15,23,42,0.06)',
        'button-blue': '0 4px 20px rgba(37,211,102,0.35)',
        'button-gold': '0 4px 20px rgba(245,158,11,0.3)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
