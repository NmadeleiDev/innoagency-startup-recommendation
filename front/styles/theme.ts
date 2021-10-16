const light = {
  colors: {
    white: '#FFFFFF',
    black: '#000000',
    primary: '#0458FE',
    secondary: '#FF1F55',
    text: {
      dark: '#24314A',
      gray: '#6E7A99',
      light: '#435371',
      lighter: '#FFFFFF',
    },
    base: {
      lightBG: '#F2F3F6',
      darkBG: '#24314A',
      border: '#CCCCCC',
    },
  },
};

export type Theme = typeof light;
const theme: Theme = light;
export type AccentType = keyof typeof theme.colors.primary;
export default theme;
