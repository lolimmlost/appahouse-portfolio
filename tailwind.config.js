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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
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
              borderRadius: '0.25rem',
            },
            'pre': {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              overflowX: 'auto',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
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