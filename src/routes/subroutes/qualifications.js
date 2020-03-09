module.exports = function (app) {
    const controller = require("../../controllers/qualification");
    const upload = require("../../../middlewares/multer-docs");
    const response = require("../../../helpers/response");
    const auth = require("../../../middlewares/authentication");
    const userCtlr = require("../../controllers/users");
    const multer = require("../../../middlewares/multer-docs");
    const API_VERSION = "/api/v1";

    app.route(`${API_VERSION}/user/:userId/qualifications`)
    .get(
        auth,
        userCtlr.show,
        controller.show,
        response.toJSON('qualifications')
    )


    app.route(`${API_VERSION}/user/:userId/qualifications/new`)
    .post(
        auth,
        userCtlr.show,
        multer,
        controller.create,
        response.toJSON("qualifications")
    );


    app.route(`${API_VERSION}/user/:userId/qualifications/:qualificationId`)
    .get(
        auth,
        userCtlr.show,
        controller.show,
        controller.showById,
        response.toJSON('qualification')
    )
    .patch(
        auth,
        userCtlr.show,
        controller.show,
        controller.showById,
        controller.patcher,
        response.toJSON('qualification')
     )
};