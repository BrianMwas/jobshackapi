module.exports = function(app) {

    const VERSION = "/api/v1/"
    const controller = require("../../controllers/auth");
    const userController = require("../../controllers/users")
    
    app.route(`${VERSION}auth/register`)
    .post(controller.signup)

    app.route(`${VERSION}auth/login`)
    .post(controller.signin);


    app.route(`${VERSION}auth/request-password-change`)
    .post(userController.showByEmail, controller.sendChangePassLink)
}