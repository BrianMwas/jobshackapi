

function responseToJSON(prop) {
    return function (req, res, next) {
        
        res.json({
            message: "Success",
            data: req.resources[prop]
        });
    }
}

module.exports.toJson = responseToJSON