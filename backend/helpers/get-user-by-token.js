const jwt = require('jsonwebtoken')

const User = require("../models/User")

// get user by jwt token

const getUserByToken = async (token) => {
    //iqual verify token but i've changed to decoded

    if(!token) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    const decoded = jwt.verify(token, 'oursecret')

    const userid = decoded.id

    const user = await User.findOne({ _id:userid })

    return user
}

module.exports = getUserByToken