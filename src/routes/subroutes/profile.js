module.exports = function(app) {

    const multer = require('../../../middlewares/multer-img');
    const controller = require('../../controllers/profile');
    const user = require('../../controllers/users');
    const auth = require('../../../middlewares/authentication');
    const response = require('../../../helpers/response');
    const VERSION = '/api/v1/';

    app.route(`${VERSION}user/:userId/profile`)
    .get(auth, user.show, controller.show, response.toJSON('profile'))

    app.route(`${VERSION}user/new/:userId/create-profile`)
    .post(auth, user.show, controller.create, response.toJSON('profile'))
    
    app.route(`${VERSION}user/:userId/update-profile`)
    .patch(auth, user.show, controller.show, controller.updateProfile, response.toJSON('profile'))

};