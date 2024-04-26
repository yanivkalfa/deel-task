const request = require('supertest');
//const should = require('should');
const app = require('../../../server');
//const { Profile, Job, Contract } = app.get('models');

//  using timeout because next.tick seems too fast;
setTimeout(() => {
  run();
}, 1000);

//const apiPath = '/contracts/:id';
let agent;
describe('Contracts get contract by id Controller Unit Tests:', function () {
  beforeEach(function (done) {
    agent = request.agent(app);
    done();
  }); // End Before Each
  describe(`Testing check if a profile can get contracts that doesnt belong to them.`, function () {

  }); // End Describe
}); // End Describe
