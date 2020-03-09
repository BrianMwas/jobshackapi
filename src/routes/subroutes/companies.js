module.exports = function(app) {
    const VERSION = "/api/v1/"

    const controller = require('../../controllers/company');
    const auth = require("../../../middlewares/authentication");
    const authorize = require("../../../middlewares/authorization")
    const response = require("../../../helpers/response")

    app.route(`${VERSION}companies`)
    .get(
        controller.index,
        response.toJSON('companies')
    );

    app.route(`${VERSION}company/new`)
    .post(
        auth,
        controller.checkUserCompany,
        controller.create,
        response.toJSON('company')
    )

    app.route(`${VERSION}owner/company`)
    .get(
        auth,
        controller.companyByOwnerId,
        response.toJSON('company')
    )

    app.route(`${VERSION}company/:slug`)
    .get(controller.bySlug, response.toJSON('company'))


    app.route(`${VERSION}companies/:companyId`)
    .get(
        auth,
        controller.show,
        response.toJSON('company')
    )  

    app.route(`${VERSION}company/:companyId/update`)
    .put(
        auth,
        controller.show,
        authorize.authorizeOnlyToCompanyOwner,
        controller.update,
        response.toJSON('company')
    )

    app.route(`${VERSION}companies/:companyId/members`)
    .post(
        auth, 
        controller.show,
        authorize.authorizeOnlyToCompanyOwner,
        controller.addMember,
        response.toJSON('company')
    )
    .delete(
        auth,
        controller.show,
        authorize.authorizeOnlyToCompanyOwner,
        controller.removeMember,
        response.toJSON('company')
    )
} 