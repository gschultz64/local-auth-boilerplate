var expect = require('chai').expect;
var request = require('supertest');
var app = require('../index');

describe('App', function() {
  it('should return a 200 response', function(done) {
    request(app).get('/').expect(200, done);
  });
  it('should return a 404 response for a bad route', function(done) {
    request(app).get('/gibberish').expect(404, done);
  });
});
