const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { createUser } = require('./userController');
const { SECRET } = require('../config');

const signUp = async (req, res) => {
    return res.json(await createUser(req, res));
}

const signIn = async (req, res) => {

    const{ email, name, password } = req.body;

    const userMatch = await User.findOne({
        where: {email: email}
    }) ;

    if(!userMatch) return res.status(400).json({message: 'User not found! Check your email.'});

    const token = jwt.sign({id: userMatch.id, name: userMatch.name, email: userMatch.email, role: userMatch.role}, SECRET, {expiresIn: '1h'});

    const passwordCheck = await bcrypt.compare(password, userMatch.password);

    if(!passwordCheck) return res.status(401).json({message: 'Invalid credentials. Please try again.'});

    return res.status(200).json({
        User: {
            name: userMatch.name,
            email: userMatch.email,
            id: userMatch.id,
            role: userMatch.role,
            token: userMatch.token
        },
        message: 'Login Successful'
    });

}

module.exports= {
    signUp,
    signIn,
}    
