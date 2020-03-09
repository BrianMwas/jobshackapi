module.exports = function(app) {

  const controller = require("../../controllers/users");
  const auth = require("../../../middlewares/authentication")
   const response = require("../../../helpers/response");
  const authorize = require('../../../middlewares/authorization')

  
  app.route("/api/v1/users/")
    .get(auth, controller.index, response.toJSON('users'))
    
  app.route("/api/v1/users/:userId")
  .get(auth, controller.show, response.toJSON('user'))
  .put(auth,  authorize.authorizeOnlySelf,  controller.update, response.toJSON('user'))
  // .delete(auth, controller.destroy)

  // app.route("/api/v1/users/:userId/profile")
  // .get(auth,  controller.showProfile, mainCtlr.toJson('user'));

  // app.route("/api/v1/users/:userId/companies")
  // .get(auth, controller.getUserCompanies, mainCtlr.toJson('companies'));
};
