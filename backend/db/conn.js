const mongoose = require('mongoose')

async function main() {
     await mongoose.connect('mongodb://127.0.0.1:27017/mypet')
     console.log('Conectou ao MOngoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose