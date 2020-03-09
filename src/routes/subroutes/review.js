module.exports = function(app) {
    const controller = require('../../controllers/review');
    const userCtlr = require('../../controllers/users');
    const companyCtlr = require('../../controllers/company');
    const auth = require('../../../middlewares/authentication');
    const response = require("../../../helpers/response")
    const VERSION = "/api/v1/";

    app.route(`${VERSION}users/:userId/companies/:slug/reviews`)
    .post(auth, userCtlr.show, companyCtlr.bySlug, controller.addReview, response.toJSON('review'))
    .get(auth, userCtlr.show, companyCtlr.bySlug, controller.show, response.toJSON('reviews'))

}