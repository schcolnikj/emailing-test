const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Campos name, email y password son requeridos" });
        return;
    }

    try {
        const emailAlreadyExists = await User.findOne({
            where: {
                email: email,
            },
        });

        if (emailAlreadyExists !== null) {
            console.log(`Hay una cuenta existente con el mail: ${email}.`);
            res.status(400).json({ message: "Ya existe una cuenta con este correo electrónico" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name: name,
            email: email,
            password: encryptedPassword,
        });

        const token = jwt.sign({id: newUser.id, name, email}, SECRET, {
            expiresIn: '1h'
        })


        console.log(token);
        res.status(201).json({token}); 
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
    
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findByPk(userId)

        if(!user) res.status(404).send('No existe un usuario con ese ID')

       user.isAdmin = true;

       await user.save();

       res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(404).send('Ha ocurrido algun problema en la actualización de usuarios')
    }
}

const getUsers = async (req, res) => {
    try {

        const user = req.user

        if(!user.isAdmin) {
            res.status(403).json({ message: 'Acceso prohibido!' })
            return;
        }
        //la idea es traer todos los productos desde la base de datos, junto con sus imagenes, se hara un borrado del endpoint de imagenes y se agregara a cada producto la imagen
        const users = await User.findAll({
        });
    
        res.status(200).json(users);
    
      } catch (error) {
        res.status(500).json({message:error.message})
      }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = (req, res) => {

}

module.exports = {
    createUser, 
    updateUser, 
    getUsers, 
    getUserById,
    deleteUser,
};