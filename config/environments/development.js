
const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    port: process.env.PORT,
    hostname: process.env.HOST_NAME,
    baseUrl: process.env.BASE_URL,
    mongodb: {
        uri: process.env.MONGO_URI
    },
    app: {
        name: process.env.AppName
    },
    serveStatic: true
}
