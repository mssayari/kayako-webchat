module.exports = {
    purge: {content: ["./public/**/*.html", "./src/**/*.vue"]},
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                'sans': ['IRANSans', 'Helvetica', 'Arial', 'sans-serif']
            },
            colors: {
                kayako: {
                    purple: '#40364D',
                    'green-500':'#06df70',
                    'green-700':'#00b36e',
                },
                green:{
                    '550':'#00d170',
                }
            }
        },
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
};
