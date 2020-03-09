
module.exports = function(app) {
	const users = require("./subroutes/users");
	const auth = require("./subroutes/auth");
	const company = require('./subroutes/companies');
	const jobs = require('./subroutes/jobs');
	const profile  = require('./subroutes/profile');
	const application = require('./subroutes/applications');
	const qualification = require("./subroutes/qualifications");
	const review = require('./subroutes/review');
	const email = require('./subroutes/email');

	auth(app);
	jobs(app);
	profile(app);
	company(app);
	users(app);
	application(app);
	qualification(app);
	review(app);
	email(app);
};
