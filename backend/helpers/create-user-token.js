const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createUserToken = async(user, req, res) => {

    // creating a token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "oursecret")

    // return token
    res.status(200).json({
        message: 'Você está autenticado.',
        token: token,
        userId: user._id,
    })
}

module.exports = createUserToken