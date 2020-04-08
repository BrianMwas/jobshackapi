module.exports = function(app) {
    const VERSION = "/api/v1/"
    const controller = require('../../controllers/application');
    const userController = require('../../controllers/users');
    const auth = require('../../../middlewares/authentication');
    const authorize = require('../../../middlewares/authorization');
    const response = require("../../../helpers/response");
    const jobController = require('../../controllers/job');
    const companyCtlr = require('../../controllers/company');

    app.route(`${VERSION}jobs/:jobId/applications`)
    .get(
        auth,
        controller.getAll,
        response.toJSON('applications')
    )

    app.route(`${VERSION}jobs/applicant/:userId/applications/:applicationId`)
    .get(
        auth,
        userController.show,
        controller.show,
        response.toJSON('application')
    )

    app.route(`${VERSION}jobs/:jobId/application/new`)
    .get(
        auth,
        jobController.show,
        controller.create
    )

    app.route(`${VERSION}jobs/:slug/:jobId/:applicationId`)
    .put(
        auth,
        companyCtlr.bySlug,
        jobController.show,
        controller.show,
        authorize.authorizeOnlyToCompanyMembers,
        controller.update
    )

    app.route(`${VERSION}jobs/:slug/:jobId/:applicationId/remove`)
    .get(
        auth,
        companyCtlr.bySlug,
        jobController.show,
        controller.show,
        authorize.authorizeOnlyToCompanyMembers,
        controller.destroy
    )


    app.route(`${VERSION}jobs/applications/:applicationId`)
    .get(controller.show, response.toJSON('application'))
}