/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ===== 色彩系統 ===== */
      colors: {
        /* 主色 cyan */
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        /* 強調色 violet */
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        /* 輔助色 emerald */
        emerald: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        /* 暗色背景層級 */
        dark: {
          50: '#f8f8fb',
          100: '#f0f0f5',
          200: '#e0e0ea',
          300: '#c2cfdf',
          400: '#8b9ab0',
          500: '#8888a5',
          600: '#63638a',
          700: '#4f4f6e',
          800: '#1e1e2e',
          850: '#12121e',
          900: '#0a0a0f',
          950: '#06060a',
        },
        /* 語意色 */
        surface: {
          DEFAULT: 'rgba(255,255,255,0.035)',
          hover: 'rgba(255,255,255,0.07)',
          elevated: 'rgba(255,255,255,0.06)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          hover: 'rgba(255,255,255,0.16)',
          active: 'rgba(6,182,212,0.35)',
        },
        text: {
          DEFAULT: '#e8edf5',
          dim: '#b8c5d8',
          muted: '#7d8fa3',
        },
        /* 產品/模組品牌色 */
        forge: { DEFAULT: '#22d3ee', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.38)' },
        script: { DEFAULT: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.38)' },
        track: { DEFAULT: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.38)' },
        tune: { DEFAULT: '#a78bfa', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.4)' },
        /* 供應商色 */
        volcano: { DEFAULT: '#63c4dc', border: 'rgba(99,196,220,0.45)' },
        qwencloud: { DEFAULT: '#f59e0b', border: 'rgba(245,158,11,0.45)' },
        bedrock: { DEFAULT: '#ff9900', border: 'rgba(255,153,0,0.5)' },
        openrouter: { DEFAULT: '#818cf8', border: 'rgba(129,140,248,0.48)' },
      },

      /* ===== 字型 ===== */
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans TC', 'Noto Sans SC', 'PingFang TC', 'PingFang SC', 'Microsoft JhengHei', 'Microsoft YaHei', 'SimHei', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      /* ===== 間距與圓角 ===== */
      spacing: {
        'nav-safe-top': 'env(safe-area-inset-top, 0px)',
        'nav-safe-left': 'env(safe-area-inset-left, 0px)',
        'nav-safe-right': 'env(safe-area-inset-right, 0px)',
        'layout-x': 'clamp(18px, 4.5vw, 48px)',
        'layout-y': 'clamp(40px, 7vh, 96px)',
      },
      borderRadius: {
        'panel': '18px',
        'panel-lg': '22px',
        'panel-sm': '14px',
      },

      /* ===== 動畫 ===== */
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'bolt-flash': 'boltFlash 14s ease-in-out infinite',
        'orb-float': 'orbFloat 20s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'progress-pulse': 'progressPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        boltFlash: {
          '0%, 100%': { opacity: '0' },
          '8%': { opacity: '1' },
          '14%': { opacity: '0.2' },
          '20%': { opacity: '0.9' },
          '28%': { opacity: '0' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(15px, -10px)' },
          '50%': { transform: 'translate(-10px, 15px)' },
          '75%': { transform: 'translate(10px, 10px)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
          '50%': { transform: 'translateX(-50%) translateY(12px)', opacity: '0.3' },
        },
        progressPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      /* ===== 背景圖案 ===== */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-fine': "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        'grid-fine-subtle': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-32': '32px 32px',
        'grid-22': '22px 22px',
      },

      /* ===== 陰影 ===== */
      boxShadow: {
        'glow': '0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.35)',
        'glow-cyan': '0 0 0 1px rgba(6,182,212,0.08), 0 24px 48px rgba(0,0,0,0.35)',
        'glow-cyan-strong': '0 0 0 1px rgba(6,182,212,0.1), 0 0 40px rgba(6,182,212,0.06), 0 24px 48px rgba(0,0,0,0.35)',
        'card': '0 0 0 1px rgba(6,182,212,0.15), 0 20px 40px rgba(0,0,0,0.4)',
        'panel': '0 28px 80px rgba(0,0,0,0.38)',
        'panel-elevated': '0 28px 56px rgba(0,0,0,0.38)',
        'mockup': '0 24px 56px rgba(0,0,0,0.45)',
      },

      /* ===== 玻璃效果 ===== */
      backdropBlur: {
        'glass-soft': '10px',
        'glass': '14px',
        'glass-strong': '20px',
      },
      backdropSaturate: {
        'glass-soft': '1.05',
        'glass': '1.1',
        'glass-strong': '1.15',
      },

      /* ===== 過渡 ===== */
      transitionDuration: {
        'fast': '0.16s',
        'normal': '0.22s',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      /* ===== 排版 ===== */
      fontSize: {
        'meta': '0.6875rem',
        'caption': '0.8125rem',
        'ui': '0.875rem',
        'body': '1rem',
        'body-lg': 'clamp(1rem, 0.35vw + 0.94rem, 1.125rem)',
      },
      maxWidth: {
        'prose': 'min(56rem, 100%)',
        'content': '72rem',
      },
      lineHeight: {
        'cjk': '1.72',
      },
    },
  },
  plugins: [],
}
