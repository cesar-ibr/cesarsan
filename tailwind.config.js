const colors = require('tailwindcss/colors')

module.exports = {
    future: {},
    purge: ['./index.html'],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: {
                DEFAULT: '#2D3043',
                dark: '#222433',
            },
            blue: {
                DEFAULT: '#2B98E1',
                dark: '#000624',
            },
            indigo: colors.indigo,
            purple: colors.purple,
            pink: colors.pink,
            red: colors.rose,
            yellow: colors.amber,
            green: '#519F20',
        },
    },
    variants: {},
    plugins: [],
}
