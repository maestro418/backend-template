//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/server');

chai.use(chaiHttp);

describe('api-test', () => {
    describe('/first api', () => {
        it('it show return message ==> ', (done) => {
            chai.request(server)
                .get('/api')
                .end((err, res) => {
                    console.log(res.body)
                    // res.should.have.status(200);
                    // res.body.should.be.a('array');
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
})