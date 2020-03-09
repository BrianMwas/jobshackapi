

exports.logErrors = function(err, req, res, next) 
{
    console.error(err.stack);
    next();
}

exports.clientErrorHandler = function(err, req, res, next) {
    if(req.xhr) {
        res.status(500).json({
            error: "Something went wrong..."
        })
    } else {
        next(err);
    }
}

exports.errorHandler = function(err, req, res, next) {
    res.status(500);
    res.render('error', {error: err})
}