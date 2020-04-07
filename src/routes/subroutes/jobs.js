module.exports = function(app) {
    const controller = require('../../controllers/job');
    const companyCtlr = require('../../controllers/company')
    const response = require('../../../helpers/response')
    const auth = require('../../../middlewares/authentication')
    const authorize = require('../../../middlewares/authorization')


    app.route('/api/v1/jobs')
    .get(
        controller.index,
        response.toJSON('jobs')
        )

    app.route('/api/v1/jobs/:jobId')
    .get(
        controller.show,
        response.toJSON('job')
    )


    app.route('/api/v1/category')
    .get(
        controller.category,
        response.toJSON('jobListing')
     )

    app.route('/api/v1/search')
    .get(
        controller.search,
        response.toJSON('jobs')
        )
    

    app.route('/api/v1/companies/:companyId/jobs')
    .get(
        controller.index,
        response.toJSON('jobs')
    )

    app.route('/api/v1/company/:companyId/new-job')
    .post(
        auth,
        companyCtlr.show,
        controller.create,
        response.toJSON('newJob')
    )

    app.route('/api/v1/companies/:companyId/jobs/:jobId/update')
    .put(
        auth,
        companyCtlr.show,
        controller.show,
        controller.update,
        response.toJSON('updatedJob')
    )
    .delete(
        auth,
        companyCtlr.show,
        authorize.authorizeOnlyToCompanyMembers,
        controller.show,
        controller.destroy
    )
}
