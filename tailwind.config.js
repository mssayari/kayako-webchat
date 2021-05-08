const colors = require('tailwindcss/colors')
module.exports = {
    purge: {content: ["./public/**/*.html", "./src/**/*.vue"]},
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                'sans': ['IRANSans', 'Helvetica', 'Arial', 'sans-serif']
            },
            colors: {
                gray: colors.gray,
                kayako: {
                    purple: '#40364D',
                },
                kblue: {
                    100: '#85b8c1',
                    200: '#69aab5',
                    300: '#4eafcb',
                    400: '#339bba',
                },
                orange: {
                    500: '#f37036',
                    600: '#f15713',
                    700: '#e05720',
                },
                green: {
                    '550': '#00d170',
                    '650': '#02bb65',
                }
            },
            minWidth: {
                '1/4': '25%',
                '1/3': '33%',
                '1/2': '50%',
                '3/4': '75%',
            },
            maxWidth: {
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['disabled'],
            opacity: ['disabled'],
            cursor: ['disabled'],
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
};
