const { Router } = require('express');

const {  createUser, updateUser, getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');

const router = Router();

router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);


module.exports = router;