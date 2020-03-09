module.exports = function(app) {
    const logErrors = require('../../../middlewares/Errors').logErrors
    const clientErrorHandler = require('../../../middlewares/Errors').clientErrorHandler;
    const errorHandler = require('../../../middlewares/Errors').errorHandler 
    app.use(logErrors);
    app.use(clientErrorHandler)
    app.use(errorHandler)
}