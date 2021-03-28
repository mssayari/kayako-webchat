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
                    'green-500': '#06df70',
                    'green-700': '#00b36e',
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
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
};
