'use strict';


require('dotenv').config();
const ENV = process.env.NODE_ENV || 'development';
const DEFAULT_PORT = 9000;
const DEFAULT_HOSTNAME = '127.0.0.1';

const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./config/index');
const helmet = require("helmet")
const compression = require("compression")

const cors = require('./src/cors')
const routes = require('./src/routes')
const error= require('./src/routes/subroutes/errors')
const PORT = config.port;

if(ENV === 'production') {
    const winston = require('winston');

    let logger = new winston.createLogger({
        transports : [
            new winston.transports.File({
                level: 'info',
                filename : './logs/all-logs.log',
                handleExceptions: true,
                format: winston.format.json(),
                defaultMeta: { service: 'user-service' },
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: true
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                format: winston.format.json(),
                colorize: true
            })
        ],
        exitOnError: false
    });

    logger.stream = {
        write: function(message, encoding) {
            logger.info(message);
        }
    };
}







//constants in the environment.
const db = config.mongodb.uri
console.log("db", db)
mongoose.Promise = global.Promise

mongoose.connect(db, {
    useNewUrlParser : true
}).then(()=> {
    console.log("DB connected")
}).catch((err)=> {
    console.log(err)
})
mongoose.set('useCreateIndex', true)


//Global variables
app.use(function (req, res, next) {
    req.resources = req.resources || {};
    res.locals.app = config.app;
    next();
});

app.use(helmet())
app.use(compression())


//initializes the passport configuration
app.use(bodyparser.urlencoded({ extended : true }))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, '..', 'public')))



if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev", {
        skip: function(req, res) { return res.statusCode < 400;}
    }));

    app.use(morgan('combined', {
        "stream": logger.stream
        }
    ));
}

app.set('env', ENV);


//cors app
cors(app);
// Applies the express app tool to all routes
routes(app);
error(app);

app.listen(PORT || DEFAULT_PORT,
    config.hostname || DEFAULT_HOSTNAME,  () => {
        console.log(`${config.app.name} is running`);
        console.log(`   listening on port: ${config.port}`)
        console.log(`   environment : ${ENV.toLowerCase()}`);
    });

// module.exports = app;