/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./components/**/*.js",
    "./blog/**/*.md",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      borderRadius: {
        'none': '0',
        DEFAULT: '0',
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
        'brutal-xl': '16px 16px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#333',
            '[class~="lead"]': {
              fontSize: '1.25rem',
              lineHeight: '1.6',
            },
            a: {
              color: '#0ea5e9',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'a:hover': {
              color: '#0284c7',
            },
            'strong': {
              color: '#111',
              fontWeight: '600',
            },
            'ol > li::marker': {
              fontWeight: '400',
            },
            'ul > li::marker': {
              color: '#94a3b8',
            },
            'blockquote': {
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#e2e8f0',
              fontWeight: '500',
              fontStyle: 'italic',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            'code': {
              color: '#0ea5e9',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: '#f1f5f9',
              padding: '0.125rem 0.25rem',
              borderRadius: '0',
              border: '2px solid #000',
            },
            'pre': {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              overflowX: 'auto',
              fontWeight: '400',
              border: '3px solid #000',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
              border: 'none',
              color: 'inherit',
              fontWeight: 'inherit',
            },
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#38bdf8',
            },
            'a:hover': {
              color: '#7dd3fc',
            },
            'strong': {
              color: '#f1f5f9',
            },
            'blockquote': {
              borderLeftColor: '#334155',
            },
            'code': {
              color: '#38bdf8',
              backgroundColor: '#1e293b',
              border: '2px solid #475569',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}