const { Router } = require('express');
const { verifyToken } = require('../middlewares/authJwt')

const { createEmail, getEmails } = require('../controllers/emailController');

const router = Router();

router.get('/', verifyToken, getEmails)

router.post('/new', verifyToken, createEmail)

module.exports = router 