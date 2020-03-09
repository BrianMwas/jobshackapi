const factory = require('autofixture');
const jobtypes = require('../../config/variables/jobtypes');
const countries = require('../../config/variables/countries');
const industries = require('../../config/variables/industries');
const typesArray = jobtypes.reduce((obj, current) => ({ ...obj, [current.key]: current.value }), {});
const countriesArr = countries.reduce((obj, current) => ({ ...obj, [current.key]: current.value }), {});
const industriesArr = industries.reduce((obj, current) => ({ ...obj, [current.key]: current.value }), {});





    factory.define('User', [
        'name',
        'email'.as(function (i) { return 'person' + i + '@gmail.com'; }),
        'id'.asNumber(),
        'password',
        'passwordSalt'.asNumber()
        'createdAt'.asDate()
    ]);

    factory.define('ProfileBlock', [
        'id'.asNumber(),
        'user'.fromFixture('User')
    ]);

    factory.define('Image', [
        'id'.asNumber(),
        'path',
        'status',
        'createdAt'.asDate()
    ]);


    factory.define('Job', [
        'title',
        'slug',
        'summary',
        'description',
        'type'.pickFrom(Array.from(typesArray)),
        'country'.pickFrom(Array.from(countriesArr))
    ]);


    factory.define('Application', [
        'user'.fromFixture('User'),
        'status'.pickFrom(['pending', 'accepted', 'processed']),
        'job'.fromFixture('Job')
    ]);

    exports.factory = factory;
