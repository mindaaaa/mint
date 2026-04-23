/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/transport/web/index.html',
    './src/app/transport/web/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // workbench 팔레트 (proposal D) — quiet, desaturated earth tones
        workbench: {
          bg: '#F5F4EE',
          panel: '#FBFAF3',
          soft: '#EFEDE2',
          ink: '#1C1E1A',
          'ink-soft': '#404540',
          'ink-mute': '#7E8279',
          'ink-faint': '#A9AC9F',
          rule: '#D8D4C4',
          'rule-soft': '#E6E2D2',
          green: '#4E7A58',
          'green-deep': '#315E3D',
          moss: '#899472',
          amber: '#B58540',
          clay: '#A26449',
          plum: '#79526A',
        },
        // 기존 garden 팔레트 — 점진 제거 예정이나 현재 살아있는 파일을 위해 당분간 유지
        garden: {
          bg: {
            1: '#D4E8D2',
            2: '#C5DFCA',
            3: '#B8D3BE',
          },
          card: '#F7FBF5',
          cardSoft: '#FDFEFC',
          primary: '#5B9A6B',
          accent: '#8FC99E',
          text: '#3E5E43',
          sub: '#7A9B80',
          muted: '#A8BFAD',
          border: '#DCEADE',
          borderSoft: '#E5EFE5',
          divider: '#D5E5D3',
        },
        // 키워드 syntax colors — workbench 팔레트 관점으로 리매핑
        keyword: {
          plant: '#315E3D',
          sparkle: '#B58540',
          breeze: '#79526A',
          bloom: '#A26449',
          petal: '#A26449',
          gift: '#315E3D',
          softly: '#899472',
          string: '#735B3E',
          number: '#735B3E',
          comment: '#8D9686',
        },
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'Georgia', 'ui-serif', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        workbench: '0 14px 30px rgba(50, 70, 45, 0.08)',
        'workbench-sm': '0 2px 6px rgba(50, 70, 45, 0.05)',
        garden: '0 20px 50px rgba(60, 95, 75, 0.18), 0 4px 14px rgba(60, 95, 75, 0.1)',
        'garden-sm': '0 2px 6px rgba(60, 95, 75, 0.05)',
        'garden-btn': '0 2px 6px rgba(111, 180, 133, 0.35)',
      },
      backgroundImage: {
        'garden-radial':
          'radial-gradient(ellipse at top left, #D4E8D2 0%, #C5DFCA 40%, #B8D3BE 100%)',
      },
      keyframes: {
        'garden-enter': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'garden-enter':
          'garden-enter 420ms cubic-bezier(0.22, 0.68, 0.33, 0.99) both',
      },
    },
  },
  plugins: [],
};
