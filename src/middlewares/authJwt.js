const jwt = require('jsonwebtoken')

const { User } = require('../models/User')
const { SECRET } = require('../config');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']

        if(!token) return res.status(403).json({message: 'No token provided!'});

        const decoded = jwt.verify(token, SECRET)

        const user = await User.findByPk(decoded.id)

        if(!user) return res.status(404).json({message: 'No user found!'})

        req.user = user

        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized token!'})
    }
    
}

module.exports = {
    verifyToken,
}