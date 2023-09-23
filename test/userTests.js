const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); 
const jwt = require('jsonwebtoken');
const { SECRET } = require('../src/config');
const { User } = require('../src/models/User')

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
  let token; 
  let testUser; 

  
  beforeEach(async () => {
    
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword',
      isAdmin: true 
    });

    
    token = jwt.sign({ id: testUser.id, isAdmin: true }, SECRET, {
      expiresIn: '1h'
    });
  });


  afterEach(async () => {
    
    await User.destroy({ where: { email: testUser.email } });
    await User.destroy({ where: { email: 'test1@example.com' } });
  });

  it('should get a list of users when authenticated and isAdmin is true', (done) => {
    chai
      .request(app)
      .get('/users')
      .set('x-access-token', token) 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new user', (done) => {
    chai
      .request(app)
      .post('/users') 
      .send({ name: 'Test User', email: 'test1@example.com', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        done();
      });
  });


});
