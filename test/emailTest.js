const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); 
const jwt = require('jsonwebtoken');
const { User } = require('../src/models/User'); 
const { SECRET } = require('../src/config');


chai.use(chaiHttp);
const expect = chai.expect;

describe('Email API', () => {
  let tokenAdmin;
  let tokenNonAdmin;
  let adminUser;
  let nonAdminUser;


  beforeEach(async () => {
    
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword',
      isAdmin: true,
      mailPerDay: 0, 
    });

    // Crea un usuario no administrador
    nonAdminUser = await User.create({
      name: 'Non-Admin User',
      email: 'nonadmin@example.com',
      password: 'nonadminpassword',
      isAdmin: false,
      mailPerDay: 0, 
    });

    tokenAdmin = jwt.sign({ id: adminUser.id }, SECRET, {
      expiresIn: '1h',
    });
    tokenNonAdmin = jwt.sign({ id: nonAdminUser.id }, SECRET, {
      expiresIn: '1h',
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: 'admin@example.com'}});
    await User.destroy({ where: { email: 'nonadmin@example.com'}});
  });

  it('should create an email when authenticated', (done) => {
    chai
      .request(app)
      .post('/email/new')
      .set('x-access-token', tokenNonAdmin)
      .send({ to: 'recipient@example.com', subject: 'Test Subject', message: 'Test Message' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Tuvimos problemas para enviar el correo, gracias por esperar mientras cambiábamos de sistema. El correo ya se envió exitosamente!') || expect(res.body).to.have.property('message', 'Correo enviado correctamente!');

        done();
      });
  });



  it('should get email statistics when authenticated as admin', (done) => {
    chai
      .request(app)
      .get('/email')
      .set('x-access-token', tokenAdmin)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        done();
      });
  });

  it('should not get email statistics when authenticated as non-admin', (done) => {
    chai
      .request(app)
      .get('/email')
      .set('x-access-token', tokenNonAdmin)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message', 'Acceso prohibido.');

        done();
      });
  });
});
