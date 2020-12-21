module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/webchat/'
        : '/',
    outputDir: '../kayako_snap/webchat'
}