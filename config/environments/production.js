module.exports = {
    port: 9000,
    hostname: process.env.PROD_HOST_NAME,
    baseUrl: process.env.PROD_BASE_URL,
    mongodb: {
        uri: process.env.PROD_MONGO_URI
    },
    app: {
        name: process.env.AppName
    },
    serveStatic: true
}
