const { Router } = require('express');
const { signIn, signUp } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authJwt');

const router = Router();

router.post('/signin',verifyToken, signIn)
router.post('/signup', signUp)


module.exports = router;