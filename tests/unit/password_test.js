"use strict";

process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const describe = mocha.describe;
const chai = require('chai');
const should = chai.should();
const passwordHelper = require('../../helpers/passwordHelper');


describe('#Password hashing', function() {
   it('should return a hash password', function(done) {
     passwordHelper.hashit('person', 10, function(err, hash) {
         if(err) throw err;

         should.exist(hash);
         hash.should.be.a('string');
         hash.should.not.equal('person');
         done();
     });
   });
});

describe('#Password comparisons', function() {
   it('Should return true if the password matches the hash', function(done) {
      passwordHelper.hashit('p@assword', 10, function(err, hash) {
         if(err) throw err;

         passwordHelper.compareIt('p@assword', hash, function(err, result) {
            if(err) throw err;

            should.exist(result);
            result.should.be.a('boolean');
            result.should.equal(true);
            done();
         })
         
      });
   });
});