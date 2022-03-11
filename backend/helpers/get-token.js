const getToken = (req) => {
    const autHeader = req.headers.authorization
    const token = autHeader.split(" ")[1]
    
    return token
}

module.exports = getToken