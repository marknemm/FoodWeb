var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../dist/server');
var should = chai.should();

chai.use(chaiHttp);


/**
 * The describe function takes as its first argument the description of a testing suite. This can be an arbitrary value.
 * The second argument is a function that contains the actual test suite.
 * Each it function call within the testing suite should contain an individual test. Each individual test consists of sending a request to the server.
 * You can add tests to this suite and add other testing suites.
 */
describe('Authentication', function() {
   /*
        chai.request(server)
            .post('/authentication/signup')
            .send({ email: 'lucifer55@hotMail.edu', username: 'whoGivesAFauq55', password: 'MyPassword1', firstName: 'Fauq', lastName: 'Yu',
                    isReceiver: true, isDonor: false, orgName: 'allHailSatan', address: '666 HellRoad', city: 'CityOfSins', 
                    state: 'FU', zip: '66666', phone: '6666666666' })
            .end(function(err, res) {
                console.log('Result of /authentication/signup');
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.should.have.property('appUserKey');
                if (res.body.success)
                    res.body.appUserKey.should.be.a('number');
                res.body.should.have.property('username');
                if (res.body.success)
                    res.body.username.should.be.a('string');
                res.body.should.have.property('email');
                if (res.body.success)
                    res.body.email.should.be.a('string');
                done();
            });
    });*/

    it('should login', function(done) {
        chai.request(server)
            .post('/authentication/login')
            .send({ username: 'whoGivesAFauq55', password: 'MyPassword1' })
            .end(function(err, res) {
                console.log('Result of /authentication/login');
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.should.have.property('appUserKey');
                if (res.body.success)
                    res.body.appUserKey.should.be.a('number');
                res.body.should.have.property('username');
                if (res.body.success)
                    res.body.username.should.be.a('string');
                res.body.should.have.property('email');
                if (res.body.success)
                    res.body.email.should.be.a('string');
                done();
            });
    });
});

describe('Food-Listing',function(){
    it('should work?', function(done){
        chai.request(server)
            .post('/receiver/claimFoodListing')
            .send({foodListingKey: 1, requestedByAppUserKey: 1})
            .end(function(err, res){
                console.log('Result of /authentication/login');
                console.log(res.body);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success ==true; 
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                done();
            });
    });
});



