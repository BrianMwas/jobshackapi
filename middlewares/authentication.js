const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    try {
        // console.log("Auth", req.headers.authorization)
        let token = req.headers.authorization;
        if (!token) return res.status(401).json({
            message: "Access Denied"
        });
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded
        next();
    } catch (error) {
        res.status(400).json({
            message: "Sorry you must login first.."
        })
    }
}