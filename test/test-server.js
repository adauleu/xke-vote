var expect = require('chai').expect;
var sinon = require('sinon');

describe('Test application server', function() {

  var app;

  beforeEach(function() {
    app = require('./main/app');
  });

  it('expect start server', function() {
    app.listen = sinon.spy();

    app.start();

    expect(app.listen.calledWith(8082)).to.be.true;
  });
});
