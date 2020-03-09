
"use strict";

process.env.NODE_ENV = 'test';

const bcrypt = require('bcryptjs');
const User = require('../../src/models/users');
let mongoose = require('mongoose');
let { describe } = require('mocha');
let chai = require('chai');
let should = require('chai').should;
let app = require('../../src/app');
let chaiHttp = require('chai-http');
let factory = require('../fixtures/user_fixtures').factory;

chai.use(chaiHttp);


describe('Users', function() {
    beforeEach(function(done) {
        User.remove({}, function(err) {
            done();
        });
    });
});

describe('/post users', function() {
    it('should not create user without email', function(done) {
        let user = factory.create('User');
        chai.request(app)
            .post("/api/v1/users/")
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.email.should.have.property('kind').eql('required');
                done();
            })
    })
})